ALTER TABLE "occurrences" ADD COLUMN "agent_id" uuid;--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "occurrences_agent_id_idx" ON "occurrences" USING btree ("agent_id");