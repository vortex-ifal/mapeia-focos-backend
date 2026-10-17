CREATE TABLE "occurrence_statuses" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar(100) NOT NULL,
	"key" varchar(50) NOT NULL,
	CONSTRAINT "occurrence_statuses_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "occurrences" ADD COLUMN "status_id" uuid NOT NULL;
--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_status_id_occurrence_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."occurrence_statuses"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "occurrences" DROP COLUMN "status";
--> statement-breakpoint
DROP TYPE "public"."occurrence_status";