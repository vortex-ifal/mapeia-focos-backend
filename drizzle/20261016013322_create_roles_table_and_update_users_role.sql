CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
INSERT INTO "roles" ("name") VALUES ('citizen'), ('agent'), ('manager') ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role_id" uuid;
--> statement-breakpoint
UPDATE "users" u SET "role_id" = r."id" FROM "roles" r WHERE u."role"::text = r."name";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role_id" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";
--> statement-breakpoint
DROP TYPE "public"."role";