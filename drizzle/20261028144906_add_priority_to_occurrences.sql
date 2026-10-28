CREATE TYPE "public"."occurrence_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
ALTER TABLE "occurrences" ADD COLUMN "priority" "occurrence_priority";