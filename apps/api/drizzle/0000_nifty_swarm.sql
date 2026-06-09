CREATE TYPE "public"."newsletter_interest" AS ENUM('storefront', 'admin', 'both');--> statement-breakpoint
CREATE TABLE "newsletter_signups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "newsletter_signups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(120) NOT NULL,
	"email" varchar(320) NOT NULL,
	"interest" "newsletter_interest" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_signups_email_idx" ON "newsletter_signups" USING btree ("email");