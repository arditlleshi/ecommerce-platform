import { Global, Logger, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env';
import { DATABASE, DATABASE_POOL } from './database.constants';
import { DatabaseService } from './database.service';
import * as schema from './schema';

const databasePoolProvider = {
  provide: DATABASE_POOL,
  useFactory: async () => {
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: env.DATABASE_POOL_MAX,
      ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
    });

    pool.on('error', (error) => {
      Logger.error(
        `Unexpected PostgreSQL pool error: ${error.message}`,
        error.stack,
        'DatabaseModule',
      );
    });

    try {
      await pool.query('select 1');
      return pool;
    } catch (error) {
      await pool.end();

      const message =
        error instanceof Error ? error.message : 'Unknown database error';

      throw new Error(
        `PostgreSQL connection failed. Start the local Docker database and verify DATABASE_URL. Original error: ${message}`,
      );
    }
  },
};

const databaseProvider = {
  provide: DATABASE,
  inject: [DATABASE_POOL],
  useFactory: (pool: Pool) =>
    drizzle(pool, {
      schema,
    }),
};

@Global()
@Module({
  providers: [databasePoolProvider, databaseProvider, DatabaseService],
  exports: [DATABASE, DATABASE_POOL, DatabaseService],
})
export class DatabaseModule {}
