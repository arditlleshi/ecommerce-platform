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
      .string()
      .trim()
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

export type NewsletterSignupInput = z.infer<typeof newsletterSignupSchema>;
export type NewsletterSignupResponse = z.infer<
  typeof newsletterSignupResponseSchema
>;
