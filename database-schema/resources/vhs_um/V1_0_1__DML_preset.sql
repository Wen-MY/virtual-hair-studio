/*
SQLyog Community v13.2.0 (64 bit)
MySQL - 8.1.0 : Database - vhs_um
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`vhs_um` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `vhs_um`;

/*Data for the table `authorities` */

insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (1,1,1,'Grant Guest to Login');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (2,1,2,'Grant Guest to Sign Up');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (3,1,3,'Grant Guest to Home\r\n');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (4,2,3,NULL);
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (5,2,4,NULL);
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (6,2,5,NULL);
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (7,2,6,NULL);
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (8,2,7,NULL);
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (9,2,8,NULL);
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (10,2,9,NULL);
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (11,2,10,NULL);
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (12,3,3,'Grant Client to Home');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (13,3,4,'Grant Client to Appointment');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (14,3,6,'Grant Client to Account');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (15,3,7,'Grant Client to Notification');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (16,3,9,'Grant Client to Salon Explore');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (17,3,10,'Grant Client to Virtual Try On');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (18,4,3,'Grant Owner to Home');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (19,4,4,'Grant Owner to Appointment');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (20,4,5,'Grant Owner to Profile');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (21,4,6,'Grant Owner to Account');
insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values (22,4,7,'Grant Owner to Notification');

/*Data for the table `features` */

insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (1,'Login','/account/sign-in',0,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (2,'Sign Up','/account/sign-up',0,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (3,'Home','/',1,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (4,'Appointment','/appointment',1,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (5,'Profile','/profile',1,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (6,'Account','/account',1,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (7,'Notification','/notification',1,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (8,'Reschedule','/appointment/reschedule',1,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (9,'Explore','/explore',1,0);
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`) values (10,'Try On','/try-on',1,0);

/*Data for the table `groups` */

insert  into `groups`(`id`,`name`) values (1,'Guest');
insert  into `groups`(`id`,`name`) values (2,'Web Administrator');
insert  into `groups`(`id`,`name`) values (3,'Salon Client');
insert  into `groups`(`id`,`name`) values (4,'Salon Owner');

/*Data for the table `user_group` */

insert  into `user_group`(`id`,`user_id`,`group_id`) values (1,1,2);
insert  into `user_group`(`id`,`user_id`,`group_id`) values (2,2,3);
insert  into `user_group`(`id`,`user_id`,`group_id`) values (3,3,3);

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`email`,`first_name`,`last_name`,`gender`,`created_at`,`updated_at`) values (1,'admin','$2b$10$Lz7B0Vhn4rlfxrHsPC005utj.l9BCAzWxGoeOcPlJIG7Ffn0feuX6','admin@example.com','admin','admin','m','2023-12-27 09:03:41','2023-12-29 14:58:10');
insert  into `users`(`id`,`username`,`password`,`email`,`first_name`,`last_name`,`gender`,`created_at`,`updated_at`) values (2,'client','$2a$10$HTCKk35dFmwShoKjy1FBVurON5bpmK7ohAarLj47sxZlHbcqPjNx6','client@example.com','client','client','f','2023-12-29 14:58:26','2023-12-29 14:58:30');
insert  into `users`(`id`,`username`,`password`,`email`,`first_name`,`last_name`,`gender`,`created_at`,`updated_at`) values (3,'owner','$2a$10$QzdcD8hUTAlNC9KW9tHkL.GrnlEgZw9xnWecTQEp/K93iYQ7Ntmo6','owner@example.com','owner','owner','o','2023-12-29 14:59:49','2023-12-29 14:59:49');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
