/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 8.0.32 : Database - vhs_tryon
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`vhs_tryon` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `vhs_tryon`;

/*Data for the table `options` */

insert  into `options`(`id`,`name`,`category_id`,`enabled`,`created_at`,`updated_at`,`remarks`) values 
(1,'NONE',0,0,'2024-03-25 14:20:09','2024-03-25 14:23:57',NULL),
(2,'Short',1,0,'2024-03-25 14:22:21','2024-03-25 14:23:18',NULL),
(3,'Medium',1,0,'2024-03-25 14:22:21','2024-03-25 14:23:18',NULL),
(4,'Long',1,0,'2024-03-25 14:22:21','2024-03-25 14:23:20',NULL),
(5,'Black',2,1,'2024-03-25 14:22:21','2024-03-31 00:11:54','{\"color-hex\":\"#100c07\"}'),
(6,'Brown',2,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#663300\"}'),
(7,'Blonde',2,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#ffd700\"}'),
(8,'Red',2,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#ff0000\"}'),
(9,'Auburn',2,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#8a2a0a\"}'),
(10,'Chestnut',2,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#954535\"}'),
(11,'Dirty Blonde',2,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#b8860b\"}'),
(12,'Sandy Blonde',2,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#f4a460\"}'),
(13,'Strawberry Blonde',2,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#ff6347\"}'),
(14,'Blue',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#0000ff\"}'),
(15,'Green',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#008000\"}'),
(16,'Pink',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#ffc0cb\"}'),
(17,'Purple',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#800080\"}'),
(18,'Teal',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#008080\"}'),
(19,'Silver',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#c0c0c0\"}'),
(20,'Gray',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#808080\"}'),
(21,'Lavender',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#e6e6fa\"}'),
(22,'Magenta',3,1,'2024-03-25 14:22:21','2024-03-31 00:19:28','{\"color-hex\":\"#ff00ff\"}'),
(41,'Bob',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(42,'Pixie',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(43,'Layered',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(44,'Blunt Cut',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(45,'Shag',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(46,'Crew Cut',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(47,'Mohawk',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(48,'Undercut',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(49,'Fade',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(50,'Crop',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(51,'Bowl Cut',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(52,'Asymmetrical',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(53,'Lob (Long Bob)',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(54,'Pageboy',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(55,'Tapered Cut',5,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(56,'Straight',6,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(57,'Wavy',6,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(58,'Curly',6,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(59,'Coily',6,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(60,'Frizzy',6,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(61,'Kinky',6,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(62,'Afro-textured',6,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(63,'Low Volume (Flat)',7,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(64,'Medium Volume',7,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(65,'High Volume (Full)',7,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(66,'Voluminous',7,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(67,'Blow Drying',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(68,'Straightening',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(69,'Curling',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(70,'Braiding',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(71,'Twisting',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(72,'Crimping',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(73,'Updos',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(74,'Top Knots',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(75,'Ponytails',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(76,'Waves',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(77,'Curls',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(78,'Sleek',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(79,'Messy',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(80,'Textured',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(81,'Slicked Back',8,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(82,'Middle Part',9,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(83,'Side Part',9,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(84,'Deep Side Part',9,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(85,'Zigzag Part',9,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(86,'Diagonal Part',9,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(87,'Off-Center Part',9,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(88,'No Part (Natural Part)',9,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(89,'Hair Clips',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(90,'Bobby Pins',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(91,'Barrettes',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(92,'Headbands',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(93,'Scrunchies',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(94,'Hair Ties',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(95,'Ribbons',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(96,'Bows',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(97,'Fascinators',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(98,'Hair Combs',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(99,'Hair Jewelry',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(100,'Hair Scarves',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL),
(101,'Hair Extensions',10,1,'2024-03-25 14:22:21','2024-03-25 14:22:21',NULL);

/*Data for the table `options_categories` */

insert  into `options_categories`(`id`,`name`,`created_at`,`updated_at`) values 
(1,'Length','2024-03-25 14:08:12','2024-03-25 14:08:12'),
(2,'Natural Colors','2024-03-25 14:08:15','2024-03-25 14:10:21'),
(3,'Adventurous Colors','2024-03-25 14:10:05','2024-03-25 14:10:05'),
(5,'Haircuts','2024-03-25 14:08:34','2024-03-25 14:10:09'),
(6,'Textures','2024-03-25 14:08:42','2024-03-25 14:10:06'),
(7,'Volume','2024-03-25 14:08:46','2024-03-25 14:09:47'),
(8,'Styling Techniques','2024-03-25 14:08:59','2024-03-25 14:09:46'),
(9,'Parting','2024-03-25 14:09:02','2024-03-25 14:09:46'),
(10,'Accessories','2024-03-25 14:09:07','2024-03-25 14:09:45');

/*Data for the table `try-on_attempts` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;