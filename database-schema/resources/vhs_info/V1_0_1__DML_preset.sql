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
(1,1,1,1,'2024-01-31 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-26 16:15:52'),
(2,1,1,1,'2024-01-28 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:55:30','2024-02-26 16:21:08'),
(3,1,1,1,'2024-01-29 15:00:00','IN PROGRESS','This is a espum lorem text for dummy remarks','2024-01-29 14:58:15','2024-02-17 20:16:16'),
(4,1,1,1,'2024-01-30 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:59:01','2024-02-17 20:16:16'),
(5,1,1,2,'2024-01-28 15:00:00','COMPLETED','This is a espum lorem text for dummy remarks','2024-01-29 15:00:52','2024-02-17 20:16:17'),
(6,1,2,2,'2024-01-31 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-26 16:31:49'),
(7,1,2,2,'2024-01-31 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-26 16:33:12'),
(8,1,2,2,'2024-01-31 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-26 16:34:03'),
(9,1,2,2,'2024-01-31 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-26 16:35:45'),
(10,1,2,1,'2024-01-28 15:00:00','COMPLETED','This is a espum lorem text for dummy remarks','2024-01-29 15:00:52','2024-02-17 20:16:21'),
(11,1,3,1,'2024-01-31 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-02-26 16:37:29'),
(12,1,4,1,'2024-01-28 14:00:00','CANCELLED','This is a espum lorem text for dummy remarks','2024-01-29 14:55:30','2024-02-17 20:16:21'),
(13,1,5,1,'2024-01-29 15:00:00','IN PROGRESS','This is a espum lorem text for dummy remarks','2024-01-29 14:58:15','2024-02-17 20:16:21'),
(14,1,6,1,'2024-01-30 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:59:01','2024-02-17 20:16:22'),
(15,1,7,1,'2024-01-28 15:00:00','COMPLETED','This is a espum lorem text for dummy remarks','2024-01-29 15:00:52','2024-02-17 20:16:22'),
(16,2,4,1,'2024-02-14 12:30:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-02-02 12:20:19','2024-02-17 20:16:22'),
(17,2,3,1,'2024-02-15 19:30:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-02-15 21:28:44','2024-02-17 20:16:25'),
(18,2,1,2,'2024-02-16 14:30:00','PENDING',NULL,'2024-02-17 20:23:46','2024-02-25 15:56:05'),
(19,1,2,2,'2024-02-17 12:30:00','CONFIRMED',NULL,'2024-02-17 22:17:01','2024-02-26 16:40:07'),
(20,1,2,1,'2024-02-17 16:30:00','CONFIRMED',NULL,'2024-02-17 22:22:43','2024-02-26 16:40:23'),
(21,1,2,2,'2024-02-17 14:30:00','CONFIRMED',NULL,'2024-02-17 22:26:17','2024-02-26 16:40:59'),
(22,1,2,1,'2024-02-17 10:30:00','CANCELLED',NULL,'2024-02-17 22:27:27','2024-02-26 16:45:41'),
(23,1,4,2,'2024-02-23 15:30:00','PENDING',NULL,'2024-02-17 22:27:54','2024-02-17 22:27:54'),
(24,1,4,2,'2024-02-21 17:30:00','PENDING',NULL,'2024-02-17 22:28:45','2024-02-17 22:28:45'),
(25,1,1,1,'2024-02-26 14:00:00','PENDING',NULL,'2024-02-24 21:44:52','2024-02-24 21:44:52');

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
(6,2,4,'2024-02-15 21:36:09'),
(7,1,1,'2024-02-24 21:44:22'),
(8,2,1,'2024-02-24 21:44:26');

/*Data for the table `hairstylists` */

insert  into `hairstylists`(`id`,`name`,`salon_id`,`position`,`rating`,`updated_at`,`created_at`,`deleted_at`) values 
(1,'David Heng Tiek Tet',1,'Senior Hairstylist',5,'2024-02-05 17:56:11','2024-02-05 17:56:11',NULL),
(2,'Tiffany Chew Sien Meh',1,NULL,NULL,'2024-02-05 17:56:36','2024-02-05 17:56:36',NULL);

/*Data for the table `reviews` */

insert  into `reviews`(`id`,`customer_id`,`service_id`,`rating`,`comment`,`created_at`) values 
(1,2,1,4,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat','2024-02-21 20:32:19'),
(2,2,2,5,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat','2024-02-21 20:32:31'),
(3,2,2,3,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat','2024-02-21 20:32:41'),
(4,2,1,4,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat','2024-02-21 20:32:50'),
(5,2,1,5,'Great haircut! The stylist was very skilled and friendly.','2024-02-22 10:15:00'),
(6,2,1,4,'The haircut was good, but the wait time was a bit long.','2024-02-23 14:30:00'),
(7,2,1,3,'Average haircut. Could have been better.','2024-02-24 16:45:00'),
(8,2,1,5,'Excellent service. Will definitely come back!','2024-02-25 09:00:00'),
(9,2,2,4,'The hair coloring was done professionally. Happy with the results.','2024-02-22 11:30:00'),
(10,2,2,5,'Absolutely loved my new hair color! The stylist did an amazing job.','2024-02-23 13:45:00'),
(11,2,2,3,'The hair coloring took longer than expected, but the outcome was okay.','2024-02-24 15:00:00'),
(12,2,3,5,'Great service! The manicure was done meticulously.','2024-02-22 09:45:00'),
(13,2,3,4,'My nails look fantastic after the pedicure. Very satisfied.','2024-02-23 12:00:00'),
(14,2,3,5,'The manicurist was friendly and did an excellent job!','2024-02-24 14:15:00'),
(15,2,4,3,'The massage was relaxing, but the therapist seemed inexperienced.','2024-02-22 08:30:00'),
(16,2,4,5,'I felt so relaxed after the massage. Highly recommend it!','2024-02-23 10:45:00'),
(17,2,5,5,'The facial was rejuvenating. My skin feels amazing!','2024-02-22 15:30:00'),
(18,2,5,4,'The deep conditioning treatment worked wonders on my hair.','2024-02-23 17:45:00'),
(19,2,5,5,'Excellent service! Will definitely return for more treatments.','2024-02-24 19:00:00'),
(20,2,11,5,'The beard trim was perfect. The barber was very skilled.','2024-02-26 11:15:00'),
(21,2,11,4,'Good service. The beard trimmer was friendly and attentive.','2024-02-27 13:30:00'),
(22,2,11,5,'I was pleased with the precision of the beard trim.','2024-02-28 15:45:00'),
(23,2,12,4,'The root touch-up was done well. Happy with the color.','2024-02-26 09:00:00'),
(24,2,12,5,'Great job on the root touch-up! Exactly what I wanted.','2024-02-27 12:15:00'),
(25,2,12,3,'The root touch-up didn\'t last as long as I expected.','2024-02-28 14:30:00'),
(26,2,13,5,'The scalp massage was so relaxing. Exactly what I needed.','2024-02-26 08:00:00'),
(27,2,13,4,'I felt so refreshed after the scalp massage. Highly recommend!','2024-02-27 10:15:00'),
(28,2,13,5,'Excellent service! The scalp massage helped relieve my tension.','2024-02-28 12:30:00'),
(29,2,17,3,'The hair extensions didn\'t blend well with my natural hair.','2024-02-26 15:00:00'),
(30,2,17,5,'Loved the hair extensions! They look so natural and beautiful.','2024-02-27 17:15:00'),
(31,2,17,4,'The hair extensions were of good quality, but the application took longer than expected.','2024-02-28 19:30:00'),
(32,2,18,5,'The eyelash extensions look amazing! Very pleased with the result.','2024-02-26 16:30:00'),
(33,2,18,4,'The eyelash extensions lasted longer than I expected.','2024-02-27 18:45:00'),
(34,2,18,5,'Great service! The eyelash extensions enhanced my eyes beautifully.','2024-02-28 20:00:00'),
(35,2,19,4,'The waxing service was good, but it could have been less painful.','2024-02-26 09:30:00'),
(36,2,19,5,'The waxing service was quick and efficient. Pleased with the results.','2024-02-27 11:45:00'),
(37,2,19,3,'The waxing service left some redness and irritation on my skin.','2024-02-28 14:00:00');

/*Data for the table `salons` */

insert  into `salons`(`id`,`user_id`,`name`,`address`,`state`,`contact_number`,`business_hour`,`updated_at`,`created_at`) values 
(1,1,'Charmeleon salon','No 1, Jalan Sultan Azlan Shah, Butterworth','Penang','6046585202','1-6/10:30-20:30','2024-02-05 17:48:14','2024-02-05 17:48:16'),
(2,4,'Vivian Hair Salon','Mahkamah Majistret Sepang, Sepang','Selangor','60331421133','1-6/10:30-20:30','2024-02-21 20:36:38','2024-02-21 20:36:38'),
(3,5,'HairPro Salon','Lot 6306, Jalan Besar, Mukim Dengkil, Majlis Perbandaran Kajang','Selangor','60389483692','1-6/10:30-20:30','2024-02-21 20:37:54','2024-02-21 20:37:54'),
(4,6,'Salon Doesn\'t Exist',NULL,NULL,NULL,'1-6/10:30-20:30','2024-02-21 22:18:56','2024-02-21 22:18:56'),
(5,56,'Glamour Hair Studio','No 10, Jalan Raja Chulan, Kuala Lumpur','Kuala Lumpur','60312345678','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(6,55,'Elegant Cuts Salon','Lot 123, Jalan Ampang, Ampang','Selangor','60398765432','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(7,54,'Royal Hair Palace','No 5, Jalan Sultan Ismail, Johor Bahru','Johor','6073456789','1-7/08:00-22:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(8,53,'Golden Scissors Salon','Lot 88, Jalan Tun Razak, Petaling Jaya','Selangor','60387654321','1-6/10:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(9,52,'Trendy Haircuts','No 15, Jalan Sungai Besi, Kuala Lumpur','Kuala Lumpur','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(10,51,'Chic & Stylish Salon','Lot 9, Jalan Gasing, Petaling Jaya','Selangor','60399988877','1-5/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(11,7,'Hair Haven','No 20, Jalan Pudu, Kuala Lumpur','Kuala Lumpur','60333445566','1-7/09:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(12,8,'Sunshine Hair Studio','Lot 3, Jalan Damansara, Petaling Jaya','Selangor','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(13,9,'Urban Edge Salon','No 8, Jalan Sultan Ismail, Kuala Lumpur','Kuala Lumpur','60398765432','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(14,10,'Vogue Hair Studio','Lot 123, Jalan Ampang, Ampang','Selangor','60387654321','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(15,11,'Glamour Hair Studio','No 10, Jalan Raja Chulan, Kuala Lumpur','Kuala Lumpur','60312345678','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(16,12,'Elegant Cuts Salon','Lot 123, Jalan Ampang, Ampang','Selangor','60398765432','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(17,13,'Royal Hair Palace','No 5, Jalan Sultan Ismail, Johor Bahru','Johor','6073456789','1-7/08:00-22:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(18,14,'Golden Scissors Salon','Lot 88, Jalan Tun Razak, Petaling Jaya','Selangor','60387654321','1-6/10:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(19,15,'Trendy Haircuts','No 15, Jalan Sungai Besi, Kuala Lumpur','Kuala Lumpur','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(20,16,'Chic & Stylish Salon','Lot 9, Jalan Gasing, Petaling Jaya','Selangor','60399988877','1-5/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(21,17,'Hair Haven','No 20, Jalan Pudu, Kuala Lumpur','Kuala Lumpur','60333445566','1-7/09:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(22,18,'Sunshine Hair Studio','Lot 3, Jalan Damansara, Petaling Jaya','Selangor','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(23,19,'Urban Edge Salon','No 8, Jalan Sultan Ismail, Kuala Lumpur','Kuala Lumpur','60398765432','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(24,20,'Vogue Hair Studio','Lot 123, Jalan Ampang, Ampang','Selangor','60387654321','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(25,21,'Glamour Hair Studio','No 10, Jalan Raja Chulan, Kuala Lumpur','Kuala Lumpur','60312345678','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(26,22,'Elegant Cuts Salon','Lot 123, Jalan Ampang, Ampang','Selangor','60398765432','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(27,23,'Royal Hair Palace','No 5, Jalan Sultan Ismail, Johor Bahru','Johor','6073456789','1-7/08:00-22:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(28,24,'Golden Scissors Salon','Lot 88, Jalan Tun Razak, Petaling Jaya','Selangor','60387654321','1-6/10:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(29,25,'Trendy Haircuts','No 15, Jalan Sungai Besi, Kuala Lumpur','Kuala Lumpur','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(30,26,'Chic & Stylish Salon','Lot 9, Jalan Gasing, Petaling Jaya','Selangor','60399988877','1-5/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(31,27,'Hair Haven','No 20, Jalan Pudu, Kuala Lumpur','Kuala Lumpur','60333445566','1-7/09:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(32,28,'Sunshine Hair Studio','Lot 3, Jalan Damansara, Petaling Jaya','Selangor','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(33,29,'Urban Edge Salon','No 8, Jalan Sultan Ismail, Kuala Lumpur','Kuala Lumpur','60398765432','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(34,30,'Vogue Hair Studio','Lot 123, Jalan Ampang, Ampang','Selangor','60387654321','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(35,31,'Glamour Hair Studio','No 10, Jalan Raja Chulan, Kuala Lumpur','Kuala Lumpur','60312345678','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(36,32,'Elegant Cuts Salon','Lot 123, Jalan Ampang, Ampang','Selangor','60398765432','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(37,33,'Royal Hair Palace','No 5, Jalan Sultan Ismail, Johor Bahru','Johor','6073456789','1-7/08:00-22:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(38,34,'Golden Scissors Salon','Lot 88, Jalan Tun Razak, Petaling Jaya','Selangor','60387654321','1-6/10:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(39,35,'Trendy Haircuts','No 15, Jalan Sungai Besi, Kuala Lumpur','Kuala Lumpur','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(40,36,'Chic & Stylish Salon','Lot 9, Jalan Gasing, Petaling Jaya','Selangor','60399988877','1-5/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(41,37,'Hair Haven','No 20, Jalan Pudu, Kuala Lumpur','Kuala Lumpur','60333445566','1-7/09:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(42,38,'Sunshine Hair Studio','Lot 3, Jalan Damansara, Petaling Jaya','Selangor','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(43,39,'Urban Edge Salon','No 8, Jalan Sultan Ismail, Kuala Lumpur','Kuala Lumpur','60398765432','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(44,40,'Vogue Hair Studio','Lot 123, Jalan Ampang, Ampang','Selangor','60387654321','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(45,41,'Glamour Hair Studio','No 10, Jalan Raja Chulan, Kuala Lumpur','Kuala Lumpur','60312345678','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(46,42,'Elegant Cuts Salon','Lot 123, Jalan Ampang, Ampang','Selangor','60398765432','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(47,43,'Royal Hair Palace','No 5, Jalan Sultan Ismail, Johor Bahru','Johor','6073456789','1-7/08:00-22:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(48,44,'Golden Scissors Salon','Lot 88, Jalan Tun Razak, Petaling Jaya','Selangor','60387654321','1-6/10:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(49,45,'Trendy Haircuts','No 15, Jalan Sungai Besi, Kuala Lumpur','Kuala Lumpur','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(50,46,'Chic & Stylish Salon','Lot 9, Jalan Gasing, Petaling Jaya','Selangor','60399988877','1-5/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(51,47,'Hair Haven','No 20, Jalan Pudu, Kuala Lumpur','Kuala Lumpur','60333445566','1-7/09:00-20:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(52,48,'Sunshine Hair Studio','Lot 3, Jalan Damansara, Petaling Jaya','Selangor','60311223344','1-6/11:00-21:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(53,49,'Urban Edge Salon','No 8, Jalan Sultan Ismail, Kuala Lumpur','Kuala Lumpur','60398765432','1-6/10:00-19:00','2024-02-22 08:00:00','2024-02-22 08:00:00'),
(54,50,'Vogue Hair Studio','Lot 123, Jalan Ampang, Ampang','Selangor','60387654321','1-5/09:00-18:00','2024-02-22 08:00:00','2024-02-22 08:00:00');

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
(10,1,'Scalp Massage',5,1,30,'Relaxing massage to promote scalp health','2024-02-05 17:36:35','2024-02-15 16:50:25',NULL),
(11,2,'Haircut',1,1,30,'Classic haircut for men and women','2024-02-15 16:50:19','2024-02-15 16:50:19',NULL),
(12,2,'Hair Coloring',2,1,120,'Professional hair coloring services','2024-02-15 16:50:20','2024-02-15 16:50:20',NULL),
(13,2,'Manicure',4,1,45,'Nail care and treatments','2024-02-15 16:50:21','2024-02-15 16:50:21',NULL),
(14,2,'Pedicure',4,1,60,'Foot care and treatments','2024-02-15 16:50:22','2024-02-15 16:50:22',NULL),
(15,2,'Massage Therapy',6,1,60,'Relaxing massage treatments','2024-02-15 16:50:23','2024-02-15 16:50:23',NULL),
(16,2,'Facial',6,1,90,'Skin care treatments','2024-02-15 16:50:24','2024-02-15 16:50:24',NULL),
(17,3,'Hair Styling',1,1,60,'Professional hair styling services','2024-02-15 16:50:19','2024-02-15 16:50:19',NULL),
(18,3,'Hair Extensions',2,1,120,'Extensions for adding length and volume','2024-02-15 16:50:20','2024-02-15 16:50:20',NULL),
(19,3,'Eyelash Extensions',6,1,90,'Extensions for longer and fuller eyelashes','2024-02-15 16:50:21','2024-02-15 16:50:21',NULL),
(20,3,'Waxing',6,1,45,'Hair removal services','2024-02-15 16:50:22','2024-02-15 16:50:22',NULL),
(21,3,'Tanning',6,1,30,'Spray tanning services','2024-02-15 16:50:23','2024-02-15 16:50:23',NULL),
(22,3,'Makeup',6,1,60,'Professional makeup services','2024-02-15 16:50:24','2024-02-15 16:50:24',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
