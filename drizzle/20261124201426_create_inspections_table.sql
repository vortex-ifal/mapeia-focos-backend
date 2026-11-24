CREATE TYPE "public"."inspection_result" AS ENUM('focus_eliminated', 'larvicide_applied', 'property_closed', 'resident_refused', 'abandoned_property');--> statement-breakpoint
CREATE TYPE "public"."inspection_status" AS ENUM('draft', 'completed');--> statement-breakpoint
CREATE TABLE "inspections" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"occurrence_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"status" "inspection_status" DEFAULT 'draft' NOT NULL,
	"condition" varchar(100),
	"actions_taken" text,
	"notes" text,
	"result" "inspection_result",
	"inspected_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_occurrence_id_occurrences_id_fk" FOREIGN KEY ("occurrence_id") REFERENCES "public"."occurrences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inspections" ADD CONSTRAINT "inspections_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;