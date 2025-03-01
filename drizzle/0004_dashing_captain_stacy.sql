ALTER TABLE `notifications` ADD `is_read` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` DROP COLUMN `read`;