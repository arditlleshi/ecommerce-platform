import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { z } from 'zod';
import { DatabaseService } from '../database/database.service';

const healthResponseSchema = z
  .object({
    status: z.literal('ok'),
    database: z.literal('up'),
    timestamp: z.string().datetime(),
  })
  .strict();

export type HealthResponse = z.infer<typeof healthResponseSchema>;

@Injectable()
export class HealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getStatus(): Promise<HealthResponse> {
    try {
      await this.databaseService.ping();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Database ping failed';

      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
        message,
      });
    }

    return healthResponseSchema.parse({
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    });
  }
}
