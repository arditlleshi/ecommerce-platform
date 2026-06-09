import { Test, TestingModule } from '@nestjs/testing';
import { type NewsletterSignupInput } from '@repo/schemas/newsletter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsletterSignupsRepository } from './newsletter/newsletter-signups.repository';

describe('AppController', () => {
  let appController: AppController;
  const newsletterSignupsRepository = {
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: NewsletterSignupsRepository,
          useValue: newsletterSignupsRepository,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    newsletterSignupsRepository.upsert.mockReset();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('newsletter signups', () => {
    it('should return a success payload', async () => {
      const payload: NewsletterSignupInput = {
        name: 'Ardit',
        email: 'ardit@example.com',
        interest: 'storefront',
      };

      newsletterSignupsRepository.upsert.mockResolvedValue({
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...payload,
      });

      await expect(
        appController.createNewsletterSignup(payload),
      ).resolves.toEqual({
        success: true,
        message: "Thanks Ardit, you're on the storefront list.",
        subscriber: payload,
      });
    });
  });
});
