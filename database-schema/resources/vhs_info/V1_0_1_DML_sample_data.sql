/*
SQLyog Community
MySQL - 8.0.32 
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

insert into `appointments` (`id`, `customer_id`, `service_id`, `booking_datetime`, `status`, `remarks`, `created_at`, `last_updated`) values('1','1','1','2024-01-31 14:00:00','PENDING','This is a espum lorem text for dummy remarks','2024-01-29 14:52:15','2024-01-29 14:52:17');
insert into `appointments` (`id`, `customer_id`, `service_id`, `booking_datetime`, `status`, `remarks`, `created_at`, `last_updated`) values('2','1','1','2024-01-28 14:00:00','CANCELLED','This is a espum lorem text for dummy remarks','2024-01-29 14:55:30','2024-01-29 14:55:32');
insert into `appointments` (`id`, `customer_id`, `service_id`, `booking_datetime`, `status`, `remarks`, `created_at`, `last_updated`) values('3','1','1','2024-01-29 15:00:00','IN PROGRESS','This is a espum lorem text for dummy remarks','2024-01-29 14:58:15','2024-01-29 14:58:17');
insert into `appointments` (`id`, `customer_id`, `service_id`, `booking_datetime`, `status`, `remarks`, `created_at`, `last_updated`) values('4','1','1','2024-01-30 14:00:00','CONFIRMED','This is a espum lorem text for dummy remarks','2024-01-29 14:59:01','2024-01-29 14:59:03');
insert into `appointments` (`id`, `customer_id`, `service_id`, `booking_datetime`, `status`, `remarks`, `created_at`, `last_updated`) values('5','1','1','2024-01-28 15:00:00','COMPLETED','This is a espum lorem text for dummy remarks','2024-01-29 15:00:52','2024-01-29 15:00:53');

INSERT INTO services (id, salon_id, service_name, availability, duration, `desc`)
VALUES
  (1, 3, 'Haircut', 1, 30, 'Classic haircut for men and women'),
  (2, 3, 'Balayage Color', 1, 120, 'Hand-painted highlights for a natural look'),
  (3, 3, 'Keratin Treatment', 1, 90, 'Smoothing treatment for frizz-free hair'),
  (4, 3, 'Updo Styling', 1, 60, 'Elegant updo styling for special occasions'),
  (5, 3, 'Deep Conditioning', 1, 45, 'Intensive moisture treatment for hair health'),
  (6, 3, 'Highlights & Lowlights', 1, 90, 'Dimensional color for a vibrant look'),
  (7, 3, 'Bridal Hair', 1, 120, 'Customized bridal hair styling for the big day'),
  (8, 3, 'Beard Trim', 1, 15, 'Precise trimming and shaping for men'),
  (9, 3, 'Root Touch-Up', 1, 60, 'Color touch-up for roots to maintain consistency'),
  (10, 3, 'Scalp Massage', 1, 30, 'Relaxing massage to promote scalp health');
