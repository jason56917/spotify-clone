CREATE TABLE IF NOT EXISTS "liked_songs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"song_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "songs" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"album" text NOT NULL,
	"song_Url" text NOT NULL,
	"image_Url" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "liked_songs" ADD CONSTRAINT "liked_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
