/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 8.0.32 : Database - vhs_info
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`vhs_info` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `vhs_info`;

/*Data for the table `appointments` */

insert  into `appointments`(`id`,`customer_id`,`service_id`,`hairstylist_id`,`booking_datetime`,`status`,`remarks`,`created_at`,`updated_at`) values 
(1,1,1,1,'2024-01-31 14:00:00','PENDING','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-17 20:16:15'),
(2,1,1,1,'2024-01-28 14:00:00','CANCELLED','This is a espum lorem text for dummy remarks','2024-01-29 14:55:30','2024-02-17 20:16:16'),
(3,1,1,1,'2024-01-29 15:00:00','IN PROGRESS','This is a espum lorem text for dummy remarks','2024-01-29 14:58:15','2024-02-17 20:16:16'),
(4,1,1,1,'2024-01-30 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:59:01','2024-02-17 20:16:16'),
(5,1,1,2,'2024-01-28 15:00:00','COMPLETED','This is a espum lorem text for dummy remarks','2024-01-29 15:00:52','2024-02-17 20:16:17'),
(6,1,2,2,'2024-01-31 14:00:00','PENDING','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-17 20:16:17'),
(7,1,2,2,'2024-01-31 14:00:00','PENDING','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-17 20:16:19'),
(8,1,2,2,'2024-01-31 14:00:00','PENDING','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-17 20:16:18'),
(9,1,2,2,'2024-01-31 14:00:00','PENDING','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-17 20:16:19'),
(10,1,2,1,'2024-01-28 15:00:00','COMPLETED','This is a espum lorem text for dummy remarks','2024-01-29 15:00:52','2024-02-17 20:16:21'),
(11,1,3,1,'2024-01-31 14:00:00','PENDING','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-17 20:16:21'),
(12,1,4,1,'2024-01-28 14:00:00','CANCELLED','This is a espum lorem text for dummy remarks','2024-01-29 14:55:30','2024-02-17 20:16:21'),
(13,1,5,1,'2024-01-29 15:00:00','IN PROGRESS','This is a espum lorem text for dummy remarks','2024-01-29 14:58:15','2024-02-17 20:16:21'),
(14,1,6,1,'2024-01-30 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:59:01','2024-02-17 20:16:22'),
(15,1,7,1,'2024-01-28 15:00:00','COMPLETED','This is a espum lorem text for dummy remarks','2024-01-29 15:00:52','2024-02-17 20:16:22'),
(16,2,4,1,'2024-02-14 12:30:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-02-02 12:20:19','2024-02-17 20:16:22'),
(17,2,3,1,'2024-02-15 19:30:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-02-15 21:28:44','2024-02-17 20:16:25'),
(18,2,1,2,'2024-02-16 14:30:00','PENDIND',NULL,'2024-02-17 20:23:46','2024-02-17 20:23:46'),
(19,1,2,2,'2024-02-17 12:30:00','PENDING',NULL,'2024-02-17 22:17:01','2024-02-17 22:17:01'),
(20,1,2,1,'2024-02-17 16:30:00','PENDING',NULL,'2024-02-17 22:22:43','2024-02-17 22:22:43'),
(21,1,2,2,'2024-02-17 14:30:00','PENDING',NULL,'2024-02-17 22:26:17','2024-02-17 22:26:17'),
(22,1,2,1,'2024-02-17 10:30:00','PENDING',NULL,'2024-02-17 22:27:27','2024-02-17 22:27:27'),
(23,1,4,2,'2024-02-23 15:30:00','PENDING',NULL,'2024-02-17 22:27:54','2024-02-17 22:27:54'),
(24,1,4,2,'2024-02-21 17:30:00','PENDING',NULL,'2024-02-17 22:28:45','2024-02-17 22:28:45');

/*Data for the table `categories` */

insert  into `categories`(`id`,`name`) values 
(1,'Haircuts'),
(2,'Colors'),
(3,'Styling'),
(4,'Texturizing'),
(5,'Treatments'),
(6,'Extentions'),
(7,'Men\'s Grooming'),
(8,'Others');

/*Data for the table `hairstylist_scopes` */

insert  into `hairstylist_scopes`(`id`,`hairstylist_id`,`service_id`,`created_at`) values 
(1,1,2,'2024-02-13 09:47:13'),
(2,2,2,'2024-02-13 19:06:33'),
(3,1,3,'2024-02-15 21:35:52'),
(4,2,3,'2024-02-15 21:35:58'),
(5,1,4,'2024-02-15 21:36:01'),
(6,2,4,'2024-02-15 21:36:09');

/*Data for the table `hairstylists` */

insert  into `hairstylists`(`id`,`name`,`salon_id`,`position`,`rating`,`updated_at`,`created_at`,`deleted_at`) values 
(1,'David Heng Tiek Tet',1,'Senior Hairstylist',NULL,'2024-02-05 17:56:11','2024-02-05 17:56:11',NULL),
(2,'Tiffany Chew Sien Meh',1,NULL,NULL,'2024-02-05 17:56:36','2024-02-05 17:56:36',NULL);

/*Data for the table `reviews` */

/*Data for the table `salons` */

insert  into `salons`(`id`,`user_id`,`name`,`address`,`state`,`contact_number`,`business_hour`,`updated_at`,`created_at`) values 
(1,3,'Charmeleon salon','No 1, Jalan Sultan Azlan Shah, Butterworth','Penang','6046585202','1-6/10:30-20:30','2024-02-05 17:48:14','2024-02-05 17:48:16');

/*Data for the table `services` */

insert  into `services`(`id`,`salon_id`,`service_name`,`category_id`,`availability`,`duration`,`desc`,`updated_at`,`created_at`,`deleted_at`) values 
(1,1,'Haircut',1,1,30,'Classic haircut for men and women','2024-02-05 17:36:35','2024-02-15 16:50:19',NULL),
(2,1,'Balayage Color',2,1,120,'Hand-painted highlights for a natural look','2024-02-05 17:36:35','2024-02-15 16:50:20',NULL),
(3,1,'Keratin Treatment',5,0,90,'Smoothing treatment for frizz-free hair','2024-02-05 17:36:35','2024-02-15 16:50:21',NULL),
(4,1,'Updo Styling',3,1,60,'Elegant updo styling for special occasions','2024-02-05 17:36:35','2024-02-15 16:50:21',NULL),
(5,1,'Deep Conditioning',5,1,45,'Intensive moisture treatment for hair health','2024-02-05 17:36:35','2024-02-15 16:50:22',NULL),
(6,1,'Highlights & Lowlights',2,1,90,'Dimensional color for a vibrant look','2024-02-05 17:36:35','2024-02-15 16:50:22',NULL),
(7,1,'Bridal Hair',3,1,120,'Customized bridal hair styling for the big day','2024-02-05 17:36:35','2024-02-15 16:50:22',NULL),
(8,1,'Beard Trim',7,1,15,'Precise trimming and shaping for men','2024-02-05 17:36:35','2024-02-15 16:50:23',NULL),
(9,1,'Root Touch-Up',2,1,60,'Color touch-up for roots to maintain consistency','2024-02-05 17:36:35','2024-02-15 16:50:23',NULL),
(10,1,'Scalp Massage',5,1,30,'Relaxing massage to promote scalp health','2024-02-05 17:36:35','2024-02-15 16:50:25',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
