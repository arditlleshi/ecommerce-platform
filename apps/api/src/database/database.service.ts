import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE, DATABASE_POOL } from './database.constants';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  constructor(
    @Inject(DATABASE)
    readonly db: NodePgDatabase<typeof schema>,
    @Inject(DATABASE_POOL)
    private readonly pool: Pool,
  ) {}

  async ping(): Promise<void> {
    await this.pool.query('select 1');
  }

  async onApplicationShutdown(): Promise<void> {
    await this.pool.end();
  }
}
