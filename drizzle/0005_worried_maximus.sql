ALTER TABLE `permissions` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `permissions` MODIFY COLUMN `description` text;