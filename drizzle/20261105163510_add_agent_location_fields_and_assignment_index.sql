ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "sector_region" varchar(100);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "municipality" varchar(100);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assignments_occurrence_assigned_at_idx"
  ON "assignments" ("occurrence_id", "assigned_at" DESC, "id" DESC);
