CREATE TABLE `cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` varchar(64) NOT NULL,
	`slideId` varchar(128) NOT NULL,
	`source` varchar(255) NOT NULL,
	`status` enum('ready','processing','review') NOT NULL DEFAULT 'ready',
	`patchCount` int NOT NULL,
	`rawWsiSize` varchar(32) NOT NULL,
	`capsuleSize` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `cases_caseId_unique` UNIQUE(`caseId`)
);
--> statement-breakpoint
CREATE TABLE `tileRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` varchar(64) NOT NULL,
	`tileId` varchar(64) NOT NULL,
	`x` int NOT NULL,
	`y` int NOT NULL,
	`width` int NOT NULL,
	`height` int NOT NULL,
	`level` int NOT NULL,
	`status` enum('requested','rendered','failed') NOT NULL DEFAULT 'requested',
	`latencyMs` int NOT NULL,
	`bytesReceived` int NOT NULL,
	`cacheStatus` enum('hit','miss') NOT NULL DEFAULT 'hit',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tileRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
