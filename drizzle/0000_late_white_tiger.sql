CREATE TABLE IF NOT EXISTS "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"imageUrl" text,
	"user_id" text NOT NULL,
	"editor_state" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
