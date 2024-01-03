/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 8.0.32 : Database - vhs_um
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

insert  into `authorities`(`id`,`group_id`,`feature_id`,`desc`) values 
(1,1,1,'Grant Guest to Login'),
(2,1,2,'Grant Guest to Sign Up'),
(3,1,3,'Grant Guest to Home\r\n'),
(4,2,3,NULL),
(5,2,4,NULL),
(6,2,5,NULL),
(7,2,6,NULL),
(8,2,7,NULL),
(9,2,8,NULL),
(10,2,9,NULL),
(11,2,10,NULL),
(12,3,3,'Grant Client to Home'),
(13,3,4,'Grant Client to Appointment'),
(14,3,6,'Grant Client to Account'),
(15,3,7,'Grant Client to Notification'),
(16,3,9,'Grant Client to Salon Explore'),
(17,3,10,'Grant Client to Virtual Try On'),
(18,4,3,'Grant Owner to Home'),
(19,4,4,'Grant Owner to Appointment'),
(20,4,5,'Grant Owner to Profile'),
(21,4,6,'Grant Owner to Account'),
(22,4,7,'Grant Owner to Notification'),
(23,4,8,'Grant Owner to Reschedule');

/*Data for the table `features` */

insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (1,'Login','/account/sign-in',0,0,'circle-fill');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (2,'Sign Up','/account/sign-up',0,0,'circle-fill');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (3,'Home','/',1,0,'house-fill');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (4,'Appointment','/appointment',1,0,'calendar-fill');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (5,'Profile','/profile',1,0,'person-fill');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (6,'Account','/account',0,0,'circle-fill');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (7,'Notification','/notification',1,0,'bell-fill');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (8,'Reschedule','/appointment/reschedule',1,0,'clock-history');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (9,'Explore','/explore',1,0,'globe-americas');
insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values (10,'Try On','/try-on',1,0,'stars');

/*Data for the table `groups` */

insert  into `groups`(`id`,`name`) values 
(1,'Guest'),
(2,'Web Administrator'),
(3,'Salon Client'),
(4,'Salon Owner');

/*Data for the table `user_group` */

insert  into `user_group`(`id`,`user_id`,`group_id`) values 
(1,1,2),
(2,2,3),
(3,3,4);

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`email`,`first_name`,`last_name`,`gender`,`created_at`,`updated_at`) values 
(1,'admin','$2b$10$Lz7B0Vhn4rlfxrHsPC005utj.l9BCAzWxGoeOcPlJIG7Ffn0feuX6','admin@example.com','admin','admin','m','2023-12-27 09:03:41','2023-12-29 14:58:10'),
(2,'client','$2a$10$HTCKk35dFmwShoKjy1FBVurON5bpmK7ohAarLj47sxZlHbcqPjNx6','client@example.com','client','client','f','2023-12-29 14:58:26','2023-12-29 14:58:30'),
(3,'owner','$2a$10$QzdcD8hUTAlNC9KW9tHkL.GrnlEgZw9xnWecTQEp/K93iYQ7Ntmo6','owner@example.com','owner','owner','o','2023-12-29 14:59:49','2023-12-29 14:59:49');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
