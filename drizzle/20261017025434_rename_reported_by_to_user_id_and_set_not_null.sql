ALTER TABLE "occurrences" DROP CONSTRAINT "occurrences_reported_by_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "occurrences" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occurrences" DROP COLUMN "reported_by_user_id";