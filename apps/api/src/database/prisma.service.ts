import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  DB_CONNECT_RETRIES,
  DB_RETRY_DELAY_MS,
  sleepMs,
} from '../common/db-retry.constants';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async connectWithRetry(maxAttempts = DB_CONNECT_RETRIES): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.$connect();
        await this.$queryRaw`SELECT 1`;
        this.logger.log('PostgreSQL conectado');
        return;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(
          `PostgreSQL indisponível (tentativa ${attempt}/${maxAttempts}): ${message}`,
        );
        if (attempt === maxAttempts) {
          throw err;
        }
        await sleepMs(DB_RETRY_DELAY_MS);
      }
    }
  }

  async pingPostgres(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
