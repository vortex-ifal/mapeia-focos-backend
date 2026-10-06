CREATE TYPE "public"."occurrence_status" AS ENUM('pending', 'validated', 'discarded', 'assigned', 'inspected', 'resolved');--> statement-breakpoint
CREATE TABLE "occurrences" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"address" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"situation_type" varchar(100),
	"contact" varchar(150),
	"status" "occurrence_status" DEFAULT 'pending' NOT NULL,
	"is_anonymous" boolean DEFAULT true NOT NULL,
	"reported_by_user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_reported_by_user_id_users_id_fk" FOREIGN KEY ("reported_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;