import { type NewsletterSignupInput } from "@repo/schemas/newsletter";

type FieldErrors = Partial<
  Record<keyof NewsletterSignupInput, string[] | undefined>
>;

export type NewsletterSignupActionState = {
  fieldErrors: FieldErrors;
  message: string | null;
  status: "error" | "idle" | "success";
};

export const initialNewsletterSignupActionState: NewsletterSignupActionState = {
  fieldErrors: {},
  message: null,
  status: "idle",
};
