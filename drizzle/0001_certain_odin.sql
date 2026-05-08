CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int,
	`oldValue` json,
	`newValue` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `authorizationLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expiresAt` datetime NOT NULL,
	`isUsed` boolean NOT NULL DEFAULT false,
	`usedAt` datetime,
	`clientIpAddress` varchar(45),
	`securityHash` varchar(255),
	`signatureData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `authorizationLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `authorizationLinks_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `bankProducts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bankId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`minAmount` decimal(12,2),
	`maxAmount` decimal(12,2),
	`interestRate` decimal(5,2),
	`termMonths` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bankProducts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `banks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(10),
	`logoUrl` text,
	`status` enum('active','inactive','maintenance') NOT NULL DEFAULT 'active',
	`integrationType` enum('api','webhook','csv','manual') NOT NULL DEFAULT 'manual',
	`slaHours` int,
	`approvalRate` decimal(5,2),
	`description` text,
	`contactEmail` varchar(320),
	`contactPhone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `banks_id` PRIMARY KEY(`id`),
	CONSTRAINT `banks_name_unique` UNIQUE(`name`),
	CONSTRAINT `banks_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `clientDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`documentType` varchar(100) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clientDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientInteractions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`type` enum('call','email','meeting','proposal','document','note') NOT NULL,
	`description` text NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `clientInteractions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`cpfCnpj` varchar(20),
	`rg` varchar(20),
	`phone` varchar(20),
	`whatsapp` varchar(20),
	`email` varchar(320),
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`zipCode` varchar(10),
	`dateOfBirth` datetime,
	`maritalStatus` enum('single','married','divorced','widowed','other'),
	`monthlyIncome` decimal(12,2),
	`creditScore` int,
	`status` enum('active','inactive','blocked','prospect') NOT NULL DEFAULT 'prospect',
	`tags` json,
	`notes` text,
	`consultantId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_cpfCnpj_unique` UNIQUE(`cpfCnpj`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`managerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('info','warning','error','success') NOT NULL DEFAULT 'info',
	`relatedEntityType` varchar(50),
	`relatedEntityId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposalHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`previousStatus` enum('draft','analysis','approved','rejected','contracted'),
	`newStatus` enum('draft','analysis','approved','rejected','contracted') NOT NULL,
	`changedBy` int NOT NULL,
	`reason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proposalHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalNumber` varchar(50) NOT NULL,
	`clientId` int NOT NULL,
	`bankId` int NOT NULL,
	`productId` int,
	`consultantId` int NOT NULL,
	`status` enum('draft','analysis','approved','rejected','contracted') NOT NULL DEFAULT 'draft',
	`amount` decimal(12,2) NOT NULL,
	`termMonths` int,
	`interestRate` decimal(5,2),
	`monthlyPayment` decimal(12,2),
	`approvalDate` datetime,
	`rejectionReason` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposals_id` PRIMARY KEY(`id`),
	CONSTRAINT `proposals_proposalNumber_unique` UNIQUE(`proposalNumber`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` enum('financial','operational','conversion','performance') NOT NULL,
	`filters` json,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`trigger` enum('status_change','amount_threshold','score_threshold','time_based') NOT NULL,
	`triggerValue` text,
	`action` enum('auto_approve','auto_reject','send_notification','create_task','escalate') NOT NULL,
	`actionValue` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','manager','consultant','operator') NOT NULL DEFAULT 'operator';--> statement-breakpoint
ALTER TABLE `users` ADD `departmentId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `entity_idx` ON `auditLogs` (`entityType`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `auditLogs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `proposal_idx` ON `authorizationLinks` (`proposalId`);--> statement-breakpoint
CREATE INDEX `token_idx` ON `authorizationLinks` (`token`);--> statement-breakpoint
CREATE INDEX `expiresAt_idx` ON `authorizationLinks` (`expiresAt`);--> statement-breakpoint
CREATE INDEX `bank_idx` ON `bankProducts` (`bankId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `banks` (`status`);--> statement-breakpoint
CREATE INDEX `client_idx` ON `clientDocuments` (`clientId`);--> statement-breakpoint
CREATE INDEX `client_idx` ON `clientInteractions` (`clientId`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `clientInteractions` (`userId`);--> statement-breakpoint
CREATE INDEX `cpfCnpj_idx` ON `clients` (`cpfCnpj`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `clients` (`email`);--> statement-breakpoint
CREATE INDEX `consultant_idx` ON `clients` (`consultantId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `clients` (`status`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `isRead_idx` ON `notifications` (`isRead`);--> statement-breakpoint
CREATE INDEX `proposal_idx` ON `proposalHistory` (`proposalId`);--> statement-breakpoint
CREATE INDEX `client_idx` ON `proposals` (`clientId`);--> statement-breakpoint
CREATE INDEX `bank_idx` ON `proposals` (`bankId`);--> statement-breakpoint
CREATE INDEX `consultant_idx` ON `proposals` (`consultantId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `proposals` (`status`);--> statement-breakpoint
CREATE INDEX `proposalNumber_idx` ON `proposals` (`proposalNumber`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);