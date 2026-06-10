import { z } from "zod";

export const currentUserResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    user: z.object({
      id: z.string().min(1),
      name: z.string().min(1),
      email: z.string().email(),
      image: z.string().url().nullable(),
      emailVerified: z.boolean(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    }),
    session: z.object({
      id: z.string().min(1),
      expiresAt: z.string().datetime(),
    }),
  }),
});

export type CurrentUserResponse = z.infer<typeof currentUserResponseSchema>;

export const authStatusResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    providers: z.object({
      google: z.object({
        enabled: z.boolean(),
      }),
    }),
  }),
});

export type AuthStatusResponse = z.infer<typeof authStatusResponseSchema>;
