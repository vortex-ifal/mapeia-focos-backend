CREATE TABLE "status_histories" (
	"occurrence_id" uuid NOT NULL,
	"changed_by_user_id" uuid NOT NULL,
	"previous_status_id" uuid NOT NULL,
	"new_status_id" uuid NOT NULL,
	"changed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "status_histories_occurrence_id_changed_at_pk" PRIMARY KEY("occurrence_id","changed_at")
);
--> statement-breakpoint
ALTER TABLE "status_histories" ADD CONSTRAINT "status_histories_occurrence_id_occurrences_id_fk" FOREIGN KEY ("occurrence_id") REFERENCES "public"."occurrences"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_histories" ADD CONSTRAINT "status_histories_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_histories" ADD CONSTRAINT "status_histories_previous_status_id_occurrence_statuses_id_fk" FOREIGN KEY ("previous_status_id") REFERENCES "public"."occurrence_statuses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_histories" ADD CONSTRAINT "status_histories_new_status_id_occurrence_statuses_id_fk" FOREIGN KEY ("new_status_id") REFERENCES "public"."occurrence_statuses"("id") ON DELETE restrict ON UPDATE no action;