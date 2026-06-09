import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { type NewsletterSignupInput } from '@repo/schemas/newsletter';
import request from 'supertest';
import { App } from 'supertest/types';
import { DATABASE, DATABASE_POOL } from './../src/database/database.constants';
import { NewsletterSignupsRepository } from './../src/newsletter/newsletter-signups.repository';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const newsletterSignupsRepository = {
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DATABASE)
      .useValue({})
      .overrideProvider(DATABASE_POOL)
      .useValue({
        end: jest.fn(),
      })
      .overrideProvider(NewsletterSignupsRepository)
      .useValue(newsletterSignupsRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    newsletterSignupsRepository.upsert.mockReset();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
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

  afterEach(async () => {
    await app.close();
  });
});
