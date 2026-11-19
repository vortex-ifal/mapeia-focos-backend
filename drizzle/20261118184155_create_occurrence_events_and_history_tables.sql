CREATE TABLE "occurrence_events" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"key" varchar(100) NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "occurrence_events_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "occurrence_history" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"occurrence_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "occurrence_history" ADD CONSTRAINT "occurrence_history_occurrence_id_occurrences_id_fk" FOREIGN KEY ("occurrence_id") REFERENCES "public"."occurrences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occurrence_history" ADD CONSTRAINT "occurrence_history_event_id_occurrence_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."occurrence_events"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occurrence_history" ADD CONSTRAINT "occurrence_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "occurrence_history_occurrence_created_idx" ON "occurrence_history" USING btree ("occurrence_id","created_at");