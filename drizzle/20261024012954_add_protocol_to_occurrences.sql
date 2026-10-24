ALTER TABLE "occurrences" ADD COLUMN "protocol" varchar(5) NOT NULL;--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_protocol_unique" UNIQUE("protocol");