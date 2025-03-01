CREATE TABLE `menus` (
	`id` varchar(128) NOT NULL,
	`label` varchar(255) NOT NULL,
	`path` varchar(255) NOT NULL,
	`icon` varchar(50),
	`parent_id` varchar(128),
	`order` varchar(10) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `menus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_menus` (
	`id` varchar(128) NOT NULL,
	`role_id` varchar(128) NOT NULL,
	`menu_id` varchar(128) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `role_menus_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `reset_token` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `reset_token_expiry` varchar(128);