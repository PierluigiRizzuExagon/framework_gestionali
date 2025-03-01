CREATE TABLE `role_permissions` (
	`role_id` varchar(128) NOT NULL,
	`permission_id` varchar(128) NOT NULL,
	CONSTRAINT `role_permissions_role_id_permission_id_pk` PRIMARY KEY(`role_id`,`permission_id`)
);
