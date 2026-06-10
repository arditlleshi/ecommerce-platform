import { z } from "zod";

export const newsletterInterestSchema = z.enum([
  "storefront",
  "admin",
  "both",
]);

export const newsletterSignupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long.")
      .max(80, "Name must be 80 characters or fewer."),
    email: z
      .email("Enter a valid email address."),
    interest: newsletterInterestSchema,
  })
  .strict();

export const newsletterSignupResponseSchema = z
  .object({
    success: z.literal(true),
    message: z.string(),
    subscriber: newsletterSignupSchema,
  })
  .strict();

export const newsletterSignupListQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(100).default(25),
    offset: z.coerce.number().int().min(0).default(0),
  })
  .strict();

export const newsletterSignupRecordSchema = z
  .object({
    id: z.number().int().positive(),
    name: z.string(),
    email: z.email(),
    interest: newsletterInterestSchema,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .strict();

export const newsletterSignupListResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.array(newsletterSignupRecordSchema),
    pagination: z
      .object({
        limit: z.number().int().min(1),
        offset: z.number().int().min(0),
        total: z.number().int().min(0),
      })
      .strict(),
  })
  .strict();

export type NewsletterSignupInput = z.infer<typeof newsletterSignupSchema>;
export type NewsletterSignupResponse = z.infer<
  typeof newsletterSignupResponseSchema
>;
export type NewsletterSignupListQuery = z.infer<
  typeof newsletterSignupListQuerySchema
>;
export type NewsletterSignupRecord = z.infer<
  typeof newsletterSignupRecordSchema
>;
export type NewsletterSignupListResponse = z.infer<
  typeof newsletterSignupListResponseSchema
>;
