import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  type NewsletterSignupInput,
  type NewsletterSignupListQuery,
} from '@repo/schemas/newsletter';
import request from 'supertest';
import { App } from 'supertest/types';
import { BETTER_AUTH } from './../src/auth/auth.constants';
import { AuthService } from './../src/auth/auth.service';
import { DATABASE, DATABASE_POOL } from './../src/database/database.constants';
import { DatabaseService } from './../src/database/database.service';
import { NewsletterSignupsRepository } from './../src/newsletter/newsletter-signups.repository';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const databaseService = {
    ping: jest.fn(),
  };
  const newsletterSignupsRepository = {
    findMany: jest.fn(),
    upsert: jest.fn(),
  };
  const authService = {
    getSession: jest.fn(),
    handleAuthRequest: jest.fn(),
    isGoogleSignInEnabled: jest.fn(),
  };
  const betterAuth = {
    api: {
      getSession: jest.fn(),
    },
    handler: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATABASE)
      .useValue({})
      .overrideProvider(DATABASE_POOL)
      .useValue({
        query: jest.fn(),
        end: jest.fn(),
      })
      .overrideProvider(DatabaseService)
      .useValue(databaseService)
      .overrideProvider(NewsletterSignupsRepository)
      .useValue(newsletterSignupsRepository)
      .overrideProvider(BETTER_AUTH)
      .useValue(betterAuth)
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    databaseService.ping.mockReset();
    databaseService.ping.mockResolvedValue(undefined);
    authService.getSession.mockReset();
    authService.handleAuthRequest.mockReset();
    authService.isGoogleSignInEnabled.mockReset();
    authService.isGoogleSignInEnabled.mockReturnValue(true);
    newsletterSignupsRepository.findMany.mockReset();
    newsletterSignupsRepository.upsert.mockReset();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((response) => {
        const body = response.body as {
          database?: string;
          status?: string;
          timestamp?: string;
        };

        expect(body.status).toBe('ok');
        expect(body.database).toBe('up');
        expect(body.timestamp).toEqual(expect.any(String));
      });
  });

  it('/newsletter-signups (POST)', () => {
    const payload: NewsletterSignupInput = {
      name: 'Ardit',
      email: 'ardit@example.com',
      interest: 'both',
    };

    newsletterSignupsRepository.upsert.mockResolvedValue({
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...payload,
    });

    return request(app.getHttpServer())
      .post('/newsletter-signups')
      .send(payload)
      .expect(201)
      .expect({
        success: true,
        message: "Thanks Ardit, you're on both lists.",
        subscriber: payload,
      });
  });

  it('/newsletter-signups (GET)', () => {
    const query: NewsletterSignupListQuery = {
      limit: 1,
      offset: 0,
    };

    newsletterSignupsRepository.findMany.mockResolvedValue({
      rows: [
        {
          id: 1,
          name: 'Ardit',
          email: 'ardit@example.com',
          interest: 'both',
          createdAt: new Date('2026-06-10T09:00:00.000Z'),
          updatedAt: new Date('2026-06-10T09:05:00.000Z'),
        },
      ],
      total: 1,
    });

    return request(app.getHttpServer())
      .get('/newsletter-signups')
      .query(query)
      .expect(200)
      .expect({
        success: true,
        data: [
          {
            id: 1,
            name: 'Ardit',
            email: 'ardit@example.com',
            interest: 'both',
            createdAt: '2026-06-10T09:00:00.000Z',
            updatedAt: '2026-06-10T09:05:00.000Z',
          },
        ],
        pagination: {
          limit: 1,
          offset: 0,
          total: 1,
        },
      });
  });

  it('/newsletter-signups (GET) rejects invalid query values', () => {
    return request(app.getHttpServer())
      .get('/newsletter-signups')
      .query({
        limit: 0,
        offset: -1,
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as {
          errors?: Record<string, string[] | undefined>;
          message?: string;
        };

        expect(body.message).toBe('Validation failed');
        expect(body.errors?.limit).toBeDefined();
        expect(body.errors?.offset).toBeDefined();
      });
  });

  it('/newsletter-signups (POST) rejects invalid payloads', () => {
    return request(app.getHttpServer())
      .post('/newsletter-signups')
      .send({
        name: 'A',
        email: 'not-an-email',
        interest: 'storefront',
      })
      .expect(400)
      .expect((response) => {
        const body = response.body as {
          errors?: Record<string, string[] | undefined>;
          message?: string;
        };

        expect(body.message).toBe('Validation failed');
        expect(body.errors?.name).toBeDefined();
        expect(body.errors?.email).toBeDefined();
      });
  });

  it('/auth/status (GET) returns provider availability without exposing secrets', () => {
    authService.isGoogleSignInEnabled.mockReturnValue(true);

    return request(app.getHttpServer())
      .get('/auth/status')
      .expect(200)
      .expect({
        success: true,
        data: {
          providers: {
            google: {
              enabled: true,
            },
          },
        },
      });
  });

  it('/me (GET) returns 401 without a session', () => {
    authService.getSession.mockResolvedValue(null);

    return request(app.getHttpServer()).get('/me').expect(401).expect({
      message: 'Authentication required.',
      error: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('/me (GET) returns the signed-in user', () => {
    authService.getSession.mockResolvedValue({
      user: {
        id: 'user_123',
        name: 'Ardit',
        email: 'ardit@example.com',
        image: null,
        emailVerified: true,
        createdAt: new Date('2026-06-10T09:00:00.000Z'),
        updatedAt: new Date('2026-06-10T09:05:00.000Z'),
      },
      session: {
        id: 'session_123',
        expiresAt: new Date('2026-06-17T09:00:00.000Z'),
      },
    });

    return request(app.getHttpServer())
      .get('/me')
      .expect(200)
      .expect({
        success: true,
        data: {
          user: {
            id: 'user_123',
            name: 'Ardit',
            email: 'ardit@example.com',
            image: null,
            emailVerified: true,
            createdAt: '2026-06-10T09:00:00.000Z',
            updatedAt: '2026-06-10T09:05:00.000Z',
          },
          session: {
            id: 'session_123',
            expiresAt: '2026-06-17T09:00:00.000Z',
          },
        },
      });
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });
});
