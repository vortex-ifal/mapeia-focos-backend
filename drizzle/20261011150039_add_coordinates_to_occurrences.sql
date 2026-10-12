ALTER TABLE "occurrences" ADD COLUMN "latitude" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "occurrences" ADD COLUMN "longitude" numeric(9, 6);--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_latitude_range" CHECK ("occurrences"."latitude" BETWEEN -90 AND 90);--> statement-breakpoint
ALTER TABLE "occurrences" ADD CONSTRAINT "occurrences_longitude_range" CHECK ("occurrences"."longitude" BETWEEN -180 AND 180);