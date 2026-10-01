import { randomUUID } from 'node:crypto';
import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
import { HealthService } from './health.service';

type ApiErrorBody = {
  code: string;
  message: string;
  correlationId: string;
};

@Controller()
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  getHealth() {
    return this.health.getLiveness();
  }

  @Get('ready')
  async getReady(@Res({ passthrough: true }) res: Response) {
    const body = await this.health.getReadiness();
    if (body.status !== 'ready') {
      const isProd = process.env.NODE_ENV === 'production';
      let message = 'Serviço não está pronto para receber tráfego';
      if (!isProd && body.checks) {
        const failed = Object.entries(body.checks)
          .filter(([, ok]) => !ok)
          .map(([name]) => name)
          .join(', ');
        if (failed.length > 0) {
          message = `Dependências indisponíveis: ${failed}`;
        }
      }
      const errorBody: ApiErrorBody = {
        code: 'SERVICE_NOT_READY',
        message,
        correlationId: randomUUID(),
      };
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
      return errorBody;
    }
    return body;
  }
}
