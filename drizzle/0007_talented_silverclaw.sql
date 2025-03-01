CREATE TABLE `notification_reads` (
	`id` varchar(128) NOT NULL,
	`notification_id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`read_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_reads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `notifications` ADD `target_type` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` ADD `type` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` ADD `priority` tinyint DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `notifications` ADD `target_id` varchar(128);--> statement-breakpoint
ALTER TABLE `notifications` DROP COLUMN `is_read`;--> statement-breakpoint
ALTER TABLE `notifications` DROP COLUMN `user_id`;--> statement-breakpoint
ALTER TABLE `notifications` DROP COLUMN `role_id`;