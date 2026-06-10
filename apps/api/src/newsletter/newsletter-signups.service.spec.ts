import { Test, TestingModule } from '@nestjs/testing';
import {
  type NewsletterSignupInput,
  type NewsletterSignupListQuery,
} from '@repo/schemas/newsletter';
import { NewsletterSignupsRepository } from './newsletter-signups.repository';
import { NewsletterSignupsService } from './newsletter-signups.service';

describe('NewsletterSignupsService', () => {
  let service: NewsletterSignupsService;
  const newsletterSignupsRepository = {
    findMany: jest.fn(),
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsletterSignupsService,
        {
          provide: NewsletterSignupsRepository,
          useValue: newsletterSignupsRepository,
        },
      ],
    }).compile();

    service = module.get<NewsletterSignupsService>(NewsletterSignupsService);
    newsletterSignupsRepository.findMany.mockReset();
    newsletterSignupsRepository.upsert.mockReset();
  });

  it('creates a signup response payload', async () => {
    const payload: NewsletterSignupInput = {
      name: 'Ardit',
      email: 'ardit@example.com',
      interest: 'storefront',
    };

    newsletterSignupsRepository.upsert.mockResolvedValue({
      id: 1,
      createdAt: new Date('2026-06-10T09:00:00.000Z'),
      updatedAt: new Date('2026-06-10T09:00:00.000Z'),
      ...payload,
    });

    await expect(service.create(payload)).resolves.toEqual({
      success: true,
      message: "Thanks Ardit, you're on the storefront list.",
      subscriber: payload,
    });
  });

  it('returns paginated signup records', async () => {
    const query: NewsletterSignupListQuery = {
      limit: 2,
      offset: 1,
    };

    newsletterSignupsRepository.findMany.mockResolvedValue({
      rows: [
        {
          id: 2,
          name: 'Mira',
          email: 'mira@example.com',
          interest: 'both',
          createdAt: new Date('2026-06-10T09:00:00.000Z'),
          updatedAt: new Date('2026-06-10T09:05:00.000Z'),
        },
      ],
      total: 3,
    });

    await expect(service.findMany(query)).resolves.toEqual({
      success: true,
      data: [
        {
          id: 2,
          name: 'Mira',
          email: 'mira@example.com',
          interest: 'both',
          createdAt: '2026-06-10T09:00:00.000Z',
          updatedAt: '2026-06-10T09:05:00.000Z',
        },
      ],
      pagination: {
        limit: 2,
        offset: 1,
        total: 3,
      },
    });
  });
});
