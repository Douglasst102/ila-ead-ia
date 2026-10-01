import { Injectable, Logger } from '@nestjs/common';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import * as amqp from 'amqplib';
import { PrismaService } from '../database/prisma.service';

export type ReadyChecks = {
  postgres: boolean;
  minio: boolean;
  rabbitmq: boolean;
};

export type ReadinessBody = {
  status: string;
  checks?: ReadyChecks;
};

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  getLiveness(): { status: string } {
    return { status: 'ok' };
  }

  async getReadiness(): Promise<ReadinessBody> {
    const [postgres, minio, rabbitmq] = await Promise.all([
      this.pingPostgres(),
      this.pingMinio(),
      this.pingRabbitmq(),
    ]);

    const checks: ReadyChecks = { postgres, minio, rabbitmq };
    const allOk = postgres && minio && rabbitmq;
    const includeChecks = process.env.NODE_ENV !== 'production';

    return {
      status: allOk ? 'ready' : 'not_ready',
      ...(includeChecks ? { checks } : {}),
    };
  }

  private async pingPostgres(): Promise<boolean> {
    const ok = await this.prisma.pingPostgres();
    if (!ok) {
      this.logger.debug('Readiness: postgres indisponível');
    }
    return ok;
  }

  private buildS3Client(): S3Client | null {
    const accessKey = process.env.MINIO_ACCESS_KEY;
    const secretKey = process.env.MINIO_SECRET_KEY;
    const endpointHost = process.env.MINIO_ENDPOINT;
    if (!accessKey || !secretKey || !endpointHost) {
      return null;
    }
    const useSsl = process.env.MINIO_USE_SSL === 'true';
    const protocol = useSsl ? 'https' : 'http';
    return new S3Client({
      endpoint: `${protocol}://${endpointHost}`,
      region: process.env.MINIO_REGION ?? 'us-east-1',
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      forcePathStyle: true,
    });
  }

  private async pingMinio(): Promise<boolean> {
    const client = this.buildS3Client();
    if (client) {
      try {
        await client.send(new ListBucketsCommand({}));
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.logger.debug(`Readiness: MinIO S3 ping falhou (${msg})`);
      }
    }

    const endpointHost = process.env.MINIO_ENDPOINT;
    if (!endpointHost) {
      this.logger.debug('Readiness: MINIO_ENDPOINT ausente');
      return false;
    }
    const useSsl = process.env.MINIO_USE_SSL === 'true';
    const protocol = useSsl ? 'https' : 'http';
    try {
      const res = await fetch(`${protocol}://${endpointHost}/`, {
        signal: AbortSignal.timeout(5_000),
      });
      return res.status > 0;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.debug(`Readiness: MinIO HTTP ping falhou (${msg})`);
      return false;
    }
  }

  private async pingRabbitmq(): Promise<boolean> {
    const url = process.env.RABBITMQ_URL;
    if (!url) {
      this.logger.debug('Readiness: RABBITMQ_URL ausente');
      return false;
    }
    try {
      const conn = await amqp.connect(url);
      await conn.close();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.debug(`Readiness: RabbitMQ ping falhou (${msg})`);
      return false;
    }
  }
}
