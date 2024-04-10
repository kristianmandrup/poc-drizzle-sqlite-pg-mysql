DROP INDEX IF EXISTS "users_first_name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "users_last_name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "users_email_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "users_created_at_idx";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP DEFAULT;