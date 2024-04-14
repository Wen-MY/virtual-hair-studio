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
(18,4,11,'Grant Owner to Manage Salon Dashboard'),
(19,4,4,'Grant Owner to Appointment'),
(21,4,6,'Grant Owner to Account'),
(22,4,7,'Grant Owner to Notification'),
(23,4,8,'Grant Owner to Reschedule'),
(24,4,12,'Grant Owner to Manage Salon Service'),
(26,2,11,NULL),
(27,2,12,NULL);

/*Data for the table `features` */

insert  into `features`(`id`,`name`,`url`,`show_in_navigation`,`parent_id`,`icon`) values 
(1,'Login','/account/sign-in',0,0,'circle-fill'),
(2,'Sign Up','/account/sign-up',0,0,'circle-fill'),
(3,'Home','/',1,0,'house-fill'),
(4,'Appointment','/appointments',1,0,'calendar-fill'),
(5,'Salon','/salon/1',1,0,'person-fill'),
(6,'Account','/account',0,0,'circle-fill'),
(7,'Notification','/notification',0,0,'bell-fill'),
(8,'Reschedule','/appointment/reschedule',1,0,'clock-history'),
(9,'Explore','/explore',1,0,'globe-americas'),
(10,'Try On','/try-on',1,0,'stars'),
(11,'Dashboard','/salon/dashboard',1,0,'house-fill'),
(12,'Services','/salon/management',1,0,'scissors');

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
(3,3,4),
(4,6,4),
(5,7,4),
(16,18,4),
(17,19,4),
(18,20,4),
(19,21,4),
(20,22,4),
(21,23,4),
(22,24,3);

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`email`,`first_name`,`last_name`,`gender`,`image_url`,`created_at`,`updated_at`) values 
(1,'admin','$2b$10$vOlc5KVNGgLxiOA9U9pUdunZywUchfknpg2OAVQzp1oQhynUGJvny','admin@example.com','','','m','https://firebasestorage.googleapis.com/v0/b/virtual-hair-studio.appspot.com/o/users%2F1%2Fmedia%2Fprofile.jpg?alt=media&token=29388fc7-6423-4b8d-8706-5f34c50e3a33','2023-12-27 09:03:41','2024-04-08 13:47:51'),
(2,'client','$2b$10$4heodR5YWu5VZCtN.Kvud.aW/cxskmWqvBeJe.3VGdhN/U.kS/vQG','client@example.com','Yong','Yao Wen','f','https://firebasestorage.googleapis.com/v0/b/virtual-hair-studio.appspot.com/o/users%2F2%2Fmedia%2Fprofile.jpg?alt=media&token=2fef4821-84f6-4af0-a3a9-d46f1be1281b','2023-12-29 14:58:26','2024-04-07 13:39:02'),
(3,'owner','$2a$10$QzdcD8hUTAlNC9KW9tHkL.GrnlEgZw9xnWecTQEp/K93iYQ7Ntmo6','owner@example.com','owner','owner','o',NULL,'2023-12-29 14:59:49','2023-12-29 14:59:49'),
(4,'lee_owner','$2a$10$QzdcD8hUTAlNC9KW9tHkL.GrnlEgZw9xnWecTQEp/K93iYQ7Ntmo6','leeowner','lee','owner','o',NULL,'2024-02-21 20:34:27','2024-02-21 20:34:27'),
(5,'yong','$2a$10$QzdcD8hUTAlNC9KW9tHkL.GrnlEgZw9xnWecTQEp/K93iYQ7Ntmo6','yong',NULL,NULL,'m',NULL,'2024-02-21 20:35:01','2024-02-21 20:35:01'),
(23,'ahwen2a7a9@g1','$2b$10$/2C9M/KFCG3HZkAL/o2GfO7CnU0amO8gvinCoY8QfVV9HCfsvMqDW','ahwen2a7a9@g1',NULL,NULL,NULL,NULL,'2024-03-29 13:39:41','2024-03-29 13:39:41'),
(24,'admintest','$2b$10$MeZzpGxDe9PRQPDu7k2XcutuUpx4HJUX.U2k7lk7MnEs2QVp6YBlq','admintest@example.com','Tong','Tang Ting',NULL,NULL,'2024-04-14 20:09:32','2024-04-14 20:14:31');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
