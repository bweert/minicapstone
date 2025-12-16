-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2025 at 02:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minicapstone`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('cellhub-cache-66eb2a7464dd7156a72e74352c5e2b0e', 'i:1;', 1765765267),
('cellhub-cache-66eb2a7464dd7156a72e74352c5e2b0e:timer', 'i:1765765266;', 1765765266),
('cellhub-cache-a4f0a0892f47480d7c00f4b2169f55b5', 'i:1;', 1765786997),
('cellhub-cache-a4f0a0892f47480d7c00f4b2169f55b5:timer', 'i:1765786996;', 1765786996),
('cellhub-cache-admin@cellhub.com|127.0.0.1', 'i:1;', 1765765270),
('cellhub-cache-admin@cellhub.com|127.0.0.1:timer', 'i:1765765270;', 1765765270);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `categorie_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `categorie_name`, `created_at`, `updated_at`) VALUES
(1, 'Cellphone', '2025-12-13 01:10:43', '2025-12-14 18:58:43'),
(4, 'Phone Case', '2025-12-13 06:09:16', '2025-12-14 18:58:32'),
(5, 'Charger', '2025-12-13 06:09:24', '2025-12-14 18:58:18'),
(6, 'Screen Protector', '2025-12-13 06:09:38', '2025-12-14 18:58:07'),
(7, 'Phone Battery', '2025-12-13 06:10:52', '2025-12-14 18:57:44'),
(8, 'Earphones', '2025-12-13 06:11:12', '2025-12-14 18:57:26'),
(9, 'Headsets', '2025-12-13 06:11:30', '2025-12-14 18:57:15');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1, 'lembert villarosa', '09709223666', 'lembertvillarosa2003@gmail.com', '2025-12-13 04:57:55', '2025-12-13 04:57:55'),
(2, 'Jeonghan', '0975625418', NULL, '2025-12-13 07:28:44', '2025-12-13 07:28:44'),
(3, 'junni santing', NULL, 'santing@gamil', '2025-12-14 02:17:13', '2025-12-14 15:52:53'),
(4, 'Chimchim  Rhea Zarate', '0978905690', 'zarate@gmail.com', '2025-12-14 02:26:51', '2025-12-14 02:26:51'),
(5, 'lembert villarosa', '09709223666', 'lembertvillarosa2003@gmail.com', '2025-12-14 15:28:38', '2025-12-14 15:28:38'),
(6, 'john doe', '0943585854', NULL, '2025-12-14 15:49:33', '2025-12-14 15:49:33');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_01_01_000001_create_customers_table', 1),
(5, '2025_01_01_000002_create_repair_parts_category_table', 1),
(6, '2025_01_01_000005_create_repair_services_table', 1),
(7, '2025_01_01_000006_create_status_table', 1),
(8, '2025_01_01_000007_create_transaction_table', 1),
(9, '2025_01_01_000008_create_transaction_services_table', 1),
(10, '2025_01_01_000010_create_refund_table', 2),
(11, '2025_08_26_100418_add_two_factor_columns_to_users_table', 3),
(12, '2025_11_29_103505_create_categories_table', 3),
(13, '2025_12_06_103101_products', 3),
(14, '2025_12_08_000001_create_pos_transactions', 3),
(15, '2025_12_13_101229_create_sales_table', 4),
(16, '2025_01_13_100001_create_repair_categories_table', 5),
(17, '2025_01_13_100002_create_repair_products_table', 5),
(18, '2025_01_13_100003_create_repair_services_table', 6),
(19, '2025_01_13_100004_create_repair_service_prices_table', 6),
(20, '2025_01_13_100005_create_repair_cart_table', 6),
(21, '2025_01_13_100006_create_repair_cart_items_table', 6),
(22, '2025_01_13_100007_create_repair_payments_table', 6),
(23, '2025_01_13_100008_create_repair_status_table', 6),
(24, '2025_01_13_100009_create_repair_history_table', 6),
(25, '2025_01_13_100010_create_repair_refunds_table', 6),
(26, '2025_01_13_100011_create_refund_items_table', 7),
(27, '2025_01_13_100012_create_restock_history_table', 7),
(28, '2025_12_13_130001_create_repair_customers_table', 8),
(29, '2025_12_13_130002_create_spare_parts_table', 8),
(30, '2025_12_13_130003_create_repair_services_table', 8),
(31, '2025_12_13_130004_create_repair_orders_table', 8),
(32, '2025_12_13_130005_create_repair_order_services_table', 8),
(33, '2025_12_13_130006_create_repair_order_parts_table', 8),
(34, '2025_12_13_130007_create_repair_payments_table', 8),
(35, '2025_12_13_130549_create_transaction_items_table', 9),
(36, '2025_12_14_000001_create_refunds_system', 10),
(37, '2025_12_14_000001_create_refunds_table', 11),
(38, '2025_12_14_100001_create_refunded_items_table', 12),
(39, '2025_12_14_100002_add_refund_columns_to_transactions_table', 13),
(40, '2025_12_14_100003_add_refund_columns_to_payments_table', 13);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `repair_order_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','card','online') NOT NULL DEFAULT 'cash',
  `status` enum('paid','pending','refunded') NOT NULL DEFAULT 'pending',
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `refund_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `refunded_by` bigint(20) UNSIGNED DEFAULT NULL,
  `refunded_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `repair_order_id`, `amount`, `payment_method`, `status`, `refund_amount`, `refund_reason`, `created_at`, `updated_at`, `refunded_by`, `refunded_at`) VALUES
(1, 1, 1505.00, 'cash', 'pending', NULL, NULL, '2025-12-13 05:13:27', '2025-12-13 05:13:27', NULL, NULL),
(2, 2, 1505.00, 'cash', 'paid', NULL, NULL, '2025-12-13 05:16:23', '2025-12-14 02:46:53', NULL, NULL),
(3, 3, 1505.00, 'cash', 'pending', NULL, NULL, '2025-12-13 05:27:53', '2025-12-13 05:27:53', NULL, NULL),
(4, 4, 1500.00, 'cash', 'pending', NULL, NULL, '2025-12-13 07:33:56', '2025-12-13 07:33:56', NULL, NULL),
(6, 5, 500.00, 'cash', 'paid', NULL, NULL, '2025-12-13 20:36:54', '2025-12-14 15:48:41', NULL, NULL),
(7, 7, 2000.00, 'cash', 'pending', NULL, NULL, '2025-12-13 20:48:41', '2025-12-13 20:48:41', NULL, NULL),
(8, 8, 350.00, 'cash', 'refunded', 350.00, 'wala', '2025-12-13 20:51:01', '2025-12-14 02:15:45', 1, '2025-12-14 02:15:45'),
(9, 9, 1000.00, 'cash', 'refunded', 500.00, 'No reason provided', '2025-12-14 02:17:59', '2025-12-14 02:18:31', 1, '2025-12-14 02:18:31'),
(10, 10, 350.00, 'cash', 'refunded', 200.00, 'No reason provided', '2025-12-14 02:19:52', '2025-12-14 02:21:00', 1, '2025-12-14 02:21:00'),
(11, 11, 350.00, 'cash', 'paid', NULL, NULL, '2025-12-14 02:21:37', '2025-12-14 02:21:37', NULL, NULL),
(12, 12, 1499.98, 'cash', 'refunded', 1499.98, 'No reason provided', '2025-12-14 02:27:46', '2025-12-14 04:43:10', 1, '2025-12-14 04:43:10'),
(13, 14, 1505.00, 'cash', 'refunded', 1505.00, 'lcd problem', '2025-12-14 15:35:26', '2025-12-14 15:36:46', 1, '2025-12-14 15:36:46'),
(14, 15, 1500.00, 'cash', 'paid', NULL, NULL, '2025-12-14 15:39:27', '2025-12-14 15:40:39', NULL, NULL),
(15, 16, 800.00, 'cash', 'refunded', 800.00, 'No reason provided', '2025-12-14 15:44:12', '2025-12-14 15:44:45', 1, '2025-12-14 15:44:45'),
(16, 17, 1000.00, 'cash', 'refunded', 1000.00, 'No reason provided', '2025-12-14 15:51:53', '2025-12-14 15:54:22', 1, '2025-12-14 15:54:22'),
(17, 13, 1500.00, 'cash', 'paid', NULL, NULL, '2025-12-14 18:36:42', '2025-12-14 18:36:42', NULL, NULL),
(18, 18, 1800.00, 'cash', 'paid', NULL, NULL, '2025-12-14 19:13:41', '2025-12-14 19:13:41', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `SKU` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `SKU`, `price`, `cost`, `stock_quantity`, `image`, `created_at`, `updated_at`) VALUES
(4, 'OPPO A5', 1, 'AHDF-1234', 8499.00, 9589.00, 20, 'products/ngPS4YZL0rLRfslgI7CsqfzWIXk7JHjjSgOzRBO4.png', '2025-12-13 06:25:16', '2025-12-14 15:22:01'),
(5, 'Iphone 11 case', 4, 'DBFIB-124', 50.00, 150.00, 20, 'products/lPcqFkSv5WMtfU08Nb0ZHTadZSfCEAvcDebBm07C.webp', '2025-12-13 06:26:57', '2025-12-14 18:57:00'),
(6, 'SECOND HAND VIVO Y11 / 2GB-32GB ROM', 1, 'EDSG-12324', 3500.00, 1500.00, 10, 'products/XEsRf3eEn7a3vTFGqkx7gx1lphYbKFaL07UFVxEj.jpg', '2025-12-13 06:31:01', '2025-12-13 06:41:44'),
(7, 'iphone x screen protector', 6, 'GJGD-12495', 150.00, 50.00, 0, 'products/ysYBrUFDXdnkeS3TK1rKAJm73U5ZSiXR0Al08DdE.jpg', '2025-12-13 06:33:21', '2025-12-13 06:41:26'),
(8, 'Vivo Original Charger USB-type 10 watts', 5, 'DHFP-1923', 450.00, 250.00, 20, 'products/Zk4r1Vav2W77UpvBmR3cWURExQco9dZ9ZnQVTGjj.jpg', '2025-12-13 06:39:34', '2025-12-14 19:00:41'),
(9, 'Poco c65 6 /128', 1, 'NHDO-1393', 5999.00, 4500.00, 15, 'products/iz60TyoUEOh770EXpz7onC74PBRhTtnShEZeSdGG.jpg', '2025-12-13 06:44:02', '2025-12-14 19:00:14'),
(10, 'iPhone 16 Promax 16 RAM / 256 GB STORAGE', 1, 'NFJG-1394', 99999.00, 92990.00, -5, 'products/KV1VR15WrnVvHFmKzuuQeRhQpS2Yok2X1CM95sBZ.jpg', '2025-12-13 06:46:34', '2025-12-14 19:22:56'),
(11, 'JBL Wireless Headset Noise Cancellation', 9, 'GJDG-1543', 9500.00, 10500.00, 15, 'products/348KLPXHfiFi7th7da7hh46TjdRivMoZw7mUfIET.jpg', '2025-12-13 06:49:49', '2025-12-14 18:59:29'),
(12, 'JBL Live 770NC - Wireless Over-Ear Headphones', 8, '7000', 18000.00, 10000.00, 50, 'products/NFFnWTtEiVzQtupOlZky0JRVMhwRv16beszIRA8P.jpg', '2025-12-13 06:55:00', '2025-12-13 06:56:27'),
(13, '45W Fast Charger USB C', 5, '9000', 1200.00, 900.00, 200, 'products/BWFzu7QNN6bH3WPd7F3zT623YjTCUfGHrZfjY0qI.jpg', '2025-12-13 07:00:26', '2025-12-14 02:10:50'),
(14, 'iPhone 7 PLUS Battery', 4, '6000', 2000.00, 1200.00, 10, NULL, '2025-12-13 07:07:09', '2025-12-14 04:04:56'),
(15, 'Infinix Hot 10s Case', 4, '6780', 350.00, 100.00, 398, 'products/1blVhBThHOxdaIHCmUqutOArogULnpBRiVMXFYxp.webp', '2025-12-13 07:09:27', '2025-12-14 04:45:34'),
(16, 'Sony Earphones', 8, '4000', 10000.00, 5000.00, 26, NULL, '2025-12-13 07:12:10', '2025-12-14 15:18:53');

-- --------------------------------------------------------

--
-- Table structure for table `refunded_items`
--

CREATE TABLE `refunded_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `transaction_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_item_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity_refunded` int(11) NOT NULL,
  `refund_amount` decimal(10,2) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `refunded_by` bigint(20) UNSIGNED NOT NULL,
  `refunded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refunded_items`
--

INSERT INTO `refunded_items` (`id`, `transaction_id`, `transaction_item_id`, `product_id`, `quantity_refunded`, `refund_amount`, `reason`, `refunded_by`, `refunded_at`, `created_at`, `updated_at`) VALUES
(11, 14, 14, 13, 1, 1200.00, NULL, 1, '2025-12-14 02:10:50', '2025-12-14 02:10:50', '2025-12-14 02:10:50'),
(12, 15, 16, 15, 1, 350.00, NULL, 1, '2025-12-14 02:12:12', '2025-12-14 02:12:12', '2025-12-14 02:12:12'),
(13, 14, 15, 15, 1, 350.00, NULL, 1, '2025-12-14 02:13:13', '2025-12-14 02:13:13', '2025-12-14 02:13:13'),
(14, 11, 11, 15, 1, 350.00, NULL, 1, '2025-12-14 03:16:53', '2025-12-14 03:16:53', '2025-12-14 03:16:53'),
(15, 13, 13, 14, 1, 2000.00, 'a,mbut', 1, '2025-12-14 04:04:56', '2025-12-14 04:04:56', '2025-12-14 04:04:56'),
(16, 12, 12, 15, 1, 350.00, NULL, 1, '2025-12-14 04:06:39', '2025-12-14 04:06:39', '2025-12-14 04:06:39'),
(17, 16, 17, 15, 1, 350.00, NULL, 1, '2025-12-14 04:45:34', '2025-12-14 04:45:34', '2025-12-14 04:45:34'),
(18, 17, 18, 10, 5, 499995.00, NULL, 1, '2025-12-14 19:22:56', '2025-12-14 19:22:56', '2025-12-14 19:22:56');

-- --------------------------------------------------------

--
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `refund_number` varchar(255) NOT NULL,
  `refund_type` enum('pos','repair') NOT NULL,
  `transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `repair_order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `original_amount` decimal(10,2) NOT NULL,
  `refund_amount` decimal(10,2) NOT NULL,
  `reason` text DEFAULT NULL,
  `refund_method` enum('cash','gcash','original_method') NOT NULL,
  `status` enum('pending','completed','rejected') NOT NULL DEFAULT 'pending',
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `repair_cart`
--

CREATE TABLE `repair_cart` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('active','submitted','paid','completed') NOT NULL DEFAULT 'active',
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `repair_categories`
--

CREATE TABLE `repair_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `repair_orders`
--

CREATE TABLE `repair_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  `refund_status` enum('none','partial','full') NOT NULL DEFAULT 'none',
  `total_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `repair_orders`
--

INSERT INTO `repair_orders` (`id`, `customer_id`, `status`, `refund_status`, `total_price`, `created_at`, `updated_at`) VALUES
(1, 1, 'completed', 'none', 1505.00, '2025-12-13 05:12:48', '2025-12-13 05:13:27'),
(2, 1, 'completed', 'none', 1505.00, '2025-12-13 05:15:42', '2025-12-13 05:16:23'),
(3, 1, 'completed', 'none', 1505.00, '2025-12-13 05:27:21', '2025-12-13 05:27:53'),
(4, 2, 'completed', 'none', 1500.00, '2025-12-13 07:30:58', '2025-12-13 07:33:56'),
(5, 2, 'completed', 'none', 500.00, '2025-12-13 20:26:43', '2025-12-13 20:36:54'),
(6, 1, 'completed', 'none', 1350.00, '2025-12-13 20:37:58', '2025-12-13 20:38:19'),
(7, 1, 'completed', 'none', 2000.00, '2025-12-13 20:44:55', '2025-12-13 20:48:01'),
(8, 2, 'completed', 'none', 350.00, '2025-12-13 20:50:48', '2025-12-13 20:51:01'),
(9, 3, 'completed', 'none', 1000.00, '2025-12-14 02:17:43', '2025-12-14 02:17:59'),
(10, 2, 'completed', 'none', 350.00, '2025-12-14 02:19:17', '2025-12-14 02:19:52'),
(11, 3, 'completed', 'none', 350.00, '2025-12-14 02:21:24', '2025-12-14 02:21:37'),
(12, 4, 'completed', 'none', 1499.98, '2025-12-14 02:27:20', '2025-12-14 02:27:46'),
(13, 3, 'completed', 'none', 1500.00, '2025-12-14 15:24:41', '2025-12-14 18:36:42'),
(14, 1, 'completed', 'none', 1505.00, '2025-12-14 15:31:51', '2025-12-14 15:35:26'),
(15, 4, 'completed', 'none', 1500.00, '2025-12-14 15:38:53', '2025-12-14 15:40:16'),
(16, 2, 'completed', 'none', 800.00, '2025-12-14 15:43:50', '2025-12-14 15:44:12'),
(17, 6, 'completed', 'none', 1000.00, '2025-12-14 15:51:20', '2025-12-14 15:51:33'),
(18, 1, 'completed', 'none', 1800.00, '2025-12-14 19:13:10', '2025-12-14 19:13:41');

-- --------------------------------------------------------

--
-- Table structure for table `repair_order_parts`
--

CREATE TABLE `repair_order_parts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `repair_order_service_id` bigint(20) UNSIGNED NOT NULL,
  `part_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `repair_order_parts`
--

INSERT INTO `repair_order_parts` (`id`, `repair_order_service_id`, `part_id`, `quantity`, `unit_price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 5.00, '2025-12-13 05:12:48', '2025-12-13 05:12:48'),
(2, 2, 1, 1, 5.00, '2025-12-13 05:15:42', '2025-12-13 05:15:42'),
(3, 3, 1, 1, 5.00, '2025-12-13 05:27:21', '2025-12-13 05:27:21'),
(4, 8, 3, 1, 500.00, '2025-12-13 20:44:55', '2025-12-13 20:44:55'),
(5, 10, 3, 1, 500.00, '2025-12-14 02:17:43', '2025-12-14 02:17:43'),
(6, 16, 1, 1, 5.00, '2025-12-14 15:31:51', '2025-12-14 15:31:51'),
(7, 16, 4, 1, 0.00, '2025-12-14 15:31:51', '2025-12-14 15:31:51'),
(8, 18, 6, 1, 500.00, '2025-12-14 15:43:50', '2025-12-14 15:43:50'),
(9, 19, 7, 1, 500.00, '2025-12-14 15:51:21', '2025-12-14 15:51:21'),
(10, 20, 2, 1, 1500.00, '2025-12-14 19:13:10', '2025-12-14 19:13:10');

-- --------------------------------------------------------

--
-- Table structure for table `repair_order_services`
--

CREATE TABLE `repair_order_services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `repair_order_id` bigint(20) UNSIGNED NOT NULL,
  `service_id` bigint(20) UNSIGNED NOT NULL,
  `service_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `repair_order_services`
--

INSERT INTO `repair_order_services` (`id`, `repair_order_id`, `service_id`, `service_price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1500.00, '2025-12-13 05:12:48', '2025-12-13 05:12:48'),
(2, 2, 1, 1500.00, '2025-12-13 05:15:42', '2025-12-13 05:15:42'),
(3, 3, 1, 1500.00, '2025-12-13 05:27:21', '2025-12-13 05:27:21'),
(4, 4, 1, 1500.00, '2025-12-13 07:30:58', '2025-12-13 07:30:58'),
(5, 5, 6, 500.00, '2025-12-13 20:26:43', '2025-12-13 20:26:43'),
(6, 6, 3, 350.00, '2025-12-13 20:37:58', '2025-12-13 20:37:58'),
(7, 6, 7, 1000.00, '2025-12-13 20:37:58', '2025-12-13 20:37:58'),
(8, 7, 1, 1500.00, '2025-12-13 20:44:55', '2025-12-13 20:44:55'),
(9, 8, 3, 350.00, '2025-12-13 20:50:48', '2025-12-13 20:50:48'),
(10, 9, 2, 500.00, '2025-12-14 02:17:43', '2025-12-14 02:17:43'),
(11, 10, 3, 350.00, '2025-12-14 02:19:18', '2025-12-14 02:19:18'),
(12, 11, 3, 350.00, '2025-12-14 02:21:24', '2025-12-14 02:21:24'),
(13, 12, 4, 999.98, '2025-12-14 02:27:20', '2025-12-14 02:27:20'),
(14, 12, 2, 500.00, '2025-12-14 02:27:20', '2025-12-14 02:27:20'),
(15, 13, 1, 1500.00, '2025-12-14 15:24:41', '2025-12-14 15:24:41'),
(16, 14, 1, 1500.00, '2025-12-14 15:31:51', '2025-12-14 15:31:51'),
(17, 15, 1, 1500.00, '2025-12-14 15:38:53', '2025-12-14 15:38:53'),
(18, 16, 5, 300.00, '2025-12-14 15:43:50', '2025-12-14 15:43:50'),
(19, 17, 2, 500.00, '2025-12-14 15:51:21', '2025-12-14 15:51:21'),
(20, 18, 5, 300.00, '2025-12-14 19:13:10', '2025-12-14 19:13:10');

-- --------------------------------------------------------

--
-- Table structure for table `repair_products`
--

CREATE TABLE `repair_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `brand` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `part_name` varchar(255) NOT NULL,
  `stock_qty` int(11) NOT NULL DEFAULT 0,
  `cost_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `repair_services`
--

CREATE TABLE `repair_services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `repair_services`
--

INSERT INTO `repair_services` (`id`, `name`, `base_price`, `created_at`, `updated_at`) VALUES
(1, 'LCD replacement', 1500.00, '2025-12-13 04:58:48', '2025-12-14 05:07:15'),
(2, 'Battery Replacement', 500.00, '2025-12-13 07:19:10', '2025-12-13 07:19:10'),
(3, 'Reformat', 350.00, '2025-12-13 07:19:39', '2025-12-13 07:19:39'),
(4, 'Password and Google Account Problem', 1000.00, '2025-12-13 07:20:44', '2025-12-13 07:20:44'),
(5, 'Charger Port Problem', 300.00, '2025-12-13 07:21:05', '2025-12-13 07:21:05'),
(6, 'Virus Remove', 500.00, '2025-12-13 07:21:27', '2025-12-13 07:21:27'),
(7, 'Open Line', 1000.00, '2025-12-13 07:21:56', '2025-12-13 07:21:56');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'completed',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('5VZtb38EAAVKikPr093yigg2M4NNRMH7pRqjBwiH', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiYXZZT0hncE5lNnhnWmdienpEQzVhMndVcjZJbE02enJBQ0h5cDJ6WiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9wYXltZW50cyI7czo1OiJyb3V0ZSI7czoxNDoicGF5bWVudHMuaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=', 1765769946),
('vjU8oUhf2ck2t6NeXQeZxWLasCGjZsPVRUJVS9ez', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiYllFOTVySW9FOXFZa0pDQU1VWVkwMTJRRTBmU0Jrd1d6a1o2d05KMCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1765787007);

-- --------------------------------------------------------

--
-- Table structure for table `spare_parts`
--

CREATE TABLE `spare_parts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `stock_qty` int(11) NOT NULL DEFAULT 0,
  `unit_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `spare_parts`
--

INSERT INTO `spare_parts` (`id`, `name`, `stock_qty`, `unit_price`, `created_at`, `updated_at`) VALUES
(1, 'iphone 20 lcd', 6, 5.00, '2025-12-13 05:00:29', '2025-12-14 15:31:51'),
(2, 'Iphone !6 Charging Port', 14, 1500.00, '2025-12-13 07:24:41', '2025-12-14 19:13:10'),
(3, 'OPPO A5 LCD', 20, 500.00, '2025-12-13 07:32:33', '2025-12-14 05:34:22'),
(4, 'screw', 99, 0.00, '2025-12-13 20:24:27', '2025-12-14 15:31:51'),
(6, 'Iphone 11 Charging Port', 14, 500.00, '2025-12-14 15:42:13', '2025-12-14 15:43:50'),
(7, 'Iphone 11 Battery', 14, 500.00, '2025-12-14 15:50:34', '2025-12-14 15:51:21');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `status_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reference_number` varchar(255) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','gcash') NOT NULL,
  `total_refunded` decimal(10,2) NOT NULL DEFAULT 0.00,
  `amount_received` decimal(10,2) DEFAULT NULL,
  `change` decimal(10,2) DEFAULT NULL,
  `gcash_reference` varchar(255) DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `status` enum('completed','refunded','partially_refunded') NOT NULL DEFAULT 'completed',
  `refund_status` enum('none','partial','full') NOT NULL DEFAULT 'none',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `reference_number`, `subtotal`, `tax`, `discount`, `total`, `payment_method`, `total_refunded`, `amount_received`, `change`, `gcash_reference`, `completed_at`, `status`, `refund_status`, `created_at`, `updated_at`) VALUES
(1, 'TRX-20251213102320-7745', 122.00, 0.00, 0.00, 122.00, 'cash', 0.00, 1222.00, 1100.00, NULL, '2025-12-13 02:23:20', 'completed', 'none', '2025-12-13 02:23:20', '2025-12-13 02:23:20'),
(2, 'TRX-20251213102856-4972', 122.00, 0.00, 0.00, 122.00, 'cash', 0.00, 1212.00, 1090.00, NULL, '2025-12-13 02:28:56', 'completed', 'none', '2025-12-13 02:28:56', '2025-12-13 02:28:56'),
(3, 'TRX-20251213110054-3782', 122.00, 14.64, 0.00, 136.64, 'cash', 0.00, 136.64, 0.00, NULL, '2025-12-13 03:00:54', 'completed', 'none', '2025-12-13 03:00:54', '2025-12-13 03:00:54'),
(4, 'TRX-20251213110505-5038', 122.00, 14.64, 0.00, 136.64, 'cash', 0.00, 150.00, 13.36, NULL, '2025-12-13 03:05:05', 'completed', 'none', '2025-12-13 03:05:05', '2025-12-13 03:05:05'),
(5, 'TRX-20251213110644-4480', 122.00, 14.64, 0.00, 136.64, 'cash', 0.00, 150.00, 13.36, NULL, '2025-12-13 03:06:44', 'completed', 'none', '2025-12-13 03:06:44', '2025-12-13 03:06:44'),
(6, 'TRX-20251213110727-1668', 122.00, 14.64, 0.00, 136.64, 'cash', 0.00, 150.00, 13.36, NULL, '2025-12-13 03:07:27', 'completed', 'none', '2025-12-13 03:07:27', '2025-12-13 03:07:27'),
(7, 'TRX-20251213140408-1122', 123.00, 14.76, 0.00, 137.76, 'gcash', 0.00, NULL, NULL, '84894964968', '2025-12-13 06:04:08', 'completed', 'none', '2025-12-13 06:04:08', '2025-12-13 06:04:08'),
(8, 'TRX-20251213140432-8999', 123.00, 14.76, 0.00, 137.76, 'cash', 0.00, 500.00, 362.24, NULL, '2025-12-13 06:04:32', 'completed', 'none', '2025-12-13 06:04:32', '2025-12-13 06:04:32'),
(9, 'TRX-20251213140657-4618', 246.00, 29.52, 0.00, 275.52, 'cash', 0.00, 276.00, 0.48, NULL, '2025-12-13 06:06:57', 'completed', 'none', '2025-12-13 06:06:57', '2025-12-13 06:06:57'),
(10, 'TRX-20251213143439-7172', 50.00, 6.00, 0.00, 56.00, 'cash', 0.00, 56.00, 0.00, NULL, '2025-12-13 06:34:39', 'completed', 'none', '2025-12-13 06:34:39', '2025-12-13 06:34:39'),
(11, 'TRX-20251213151407-7952', 350.00, 42.00, 0.00, 392.00, 'cash', 350.00, 500.00, 108.00, NULL, '2025-12-13 07:14:07', 'partially_refunded', 'none', '2025-12-13 07:14:07', '2025-12-14 03:16:53'),
(12, 'TRX-20251214042010-4168', 350.00, 42.00, 0.00, 392.00, 'cash', 350.00, 392.00, 0.00, NULL, '2025-12-13 20:20:10', 'partially_refunded', 'none', '2025-12-13 20:20:10', '2025-12-14 04:06:39'),
(13, 'TRX-20251214044956-1120', 2000.00, 240.00, 0.00, 2240.00, 'cash', 2000.00, 12345.00, 10105.00, NULL, '2025-12-13 20:49:56', 'partially_refunded', 'none', '2025-12-13 20:49:56', '2025-12-14 04:04:56'),
(14, 'TRX-20251214064201-9339', 1550.00, 186.00, 0.00, 1736.00, 'gcash', 1550.00, NULL, NULL, '54HDFEUHFE', '2025-12-13 22:42:01', 'partially_refunded', 'none', '2025-12-13 22:42:01', '2025-12-14 02:13:13'),
(15, 'TRX-20251214101139-3990', 350.00, 42.00, 0.00, 392.00, 'cash', 350.00, 392.00, 0.00, NULL, '2025-12-14 02:11:39', 'partially_refunded', 'none', '2025-12-14 02:11:39', '2025-12-14 02:12:12'),
(16, 'TRX-20251214124458-7218', 350.00, 42.00, 0.00, 392.00, 'cash', 350.00, 2000.00, 1608.00, NULL, '2025-12-14 04:44:58', 'partially_refunded', 'none', '2025-12-14 04:44:58', '2025-12-14 04:45:34'),
(17, 'TRX-20251215032152-6337', 1499985.00, 179998.20, 0.00, 1679983.20, 'cash', 499995.00, 1700000.00, 20016.80, NULL, '2025-12-14 19:21:52', 'partially_refunded', 'none', '2025-12-14 19:21:52', '2025-12-14 19:22:56');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_items`
--

CREATE TABLE `transaction_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `transaction_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `transaction_items`
--

INSERT INTO `transaction_items` (`id`, `transaction_id`, `product_id`, `quantity`, `price`, `subtotal`, `created_at`, `updated_at`) VALUES
(10, 10, 7, 1, 50.00, 50.00, '2025-12-13 06:34:39', '2025-12-13 06:34:39'),
(11, 11, 15, 1, 350.00, 350.00, '2025-12-13 07:14:07', '2025-12-13 07:14:07'),
(12, 12, 15, 1, 350.00, 350.00, '2025-12-13 20:20:10', '2025-12-13 20:20:10'),
(13, 13, 14, 1, 2000.00, 2000.00, '2025-12-13 20:49:56', '2025-12-13 20:49:56'),
(14, 14, 13, 1, 1200.00, 1200.00, '2025-12-13 22:42:01', '2025-12-13 22:42:01'),
(15, 14, 15, 1, 350.00, 350.00, '2025-12-13 22:42:01', '2025-12-13 22:42:01'),
(16, 15, 15, 1, 350.00, 350.00, '2025-12-14 02:11:39', '2025-12-14 02:11:39'),
(17, 16, 15, 1, 350.00, 350.00, '2025-12-14 04:44:58', '2025-12-14 04:44:58'),
(18, 17, 10, 15, 99999.00, 1499985.00, '2025-12-14 19:21:52', '2025-12-14 19:21:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `two_factor_secret` text DEFAULT NULL,
  `two_factor_recovery_codes` text DEFAULT NULL,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'lembert villarosa', 'lembertvillarosa2003@gmail.com', NULL, '$2y$12$urUE8oExpKDB1Xqd4kYdRO2nABf102xwW.IhaAMCzJXE60Yf93auS', NULL, NULL, NULL, NULL, '2025-12-13 01:10:11', '2025-12-13 01:10:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_repair_order_id_foreign` (`repair_order_id`),
  ADD KEY `payments_refunded_by_foreign` (`refunded_by`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_sku_unique` (`SKU`),
  ADD KEY `products_category_id_foreign` (`category_id`);

--
-- Indexes for table `refunded_items`
--
ALTER TABLE `refunded_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `refunded_items_transaction_item_id_foreign` (`transaction_item_id`),
  ADD KEY `refunded_items_product_id_foreign` (`product_id`),
  ADD KEY `refunded_items_refunded_by_foreign` (`refunded_by`),
  ADD KEY `refunded_items_transaction_id_transaction_item_id_index` (`transaction_id`,`transaction_item_id`);

--
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `refunds_refund_number_unique` (`refund_number`),
  ADD KEY `refunds_transaction_id_foreign` (`transaction_id`),
  ADD KEY `refunds_repair_order_id_foreign` (`repair_order_id`),
  ADD KEY `refunds_processed_by_foreign` (`processed_by`),
  ADD KEY `refunds_refund_type_index` (`refund_type`),
  ADD KEY `refunds_status_index` (`status`);

--
-- Indexes for table `repair_cart`
--
ALTER TABLE `repair_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `repair_cart_customer_id_index` (`customer_id`),
  ADD KEY `repair_cart_status_index` (`status`);

--
-- Indexes for table `repair_categories`
--
ALTER TABLE `repair_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `repair_categories_name_unique` (`name`);

--
-- Indexes for table `repair_orders`
--
ALTER TABLE `repair_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `repair_orders_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `repair_order_parts`
--
ALTER TABLE `repair_order_parts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `repair_order_parts_repair_order_service_id_foreign` (`repair_order_service_id`),
  ADD KEY `repair_order_parts_part_id_foreign` (`part_id`);

--
-- Indexes for table `repair_order_services`
--
ALTER TABLE `repair_order_services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `repair_order_services_repair_order_id_foreign` (`repair_order_id`),
  ADD KEY `repair_order_services_service_id_foreign` (`service_id`);

--
-- Indexes for table `repair_products`
--
ALTER TABLE `repair_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `repair_products_brand_model_part_name_unique` (`brand`,`model`,`part_name`),
  ADD KEY `repair_products_category_id_index` (`category_id`);

--
-- Indexes for table `repair_services`
--
ALTER TABLE `repair_services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `spare_parts`
--
ALTER TABLE `spare_parts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactions_reference_number_unique` (`reference_number`);

--
-- Indexes for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaction_items_transaction_id_foreign` (`transaction_id`),
  ADD KEY `transaction_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `refunded_items`
--
ALTER TABLE `refunded_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `refunds`
--
ALTER TABLE `refunds`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `repair_categories`
--
ALTER TABLE `repair_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `repair_orders`
--
ALTER TABLE `repair_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `repair_order_parts`
--
ALTER TABLE `repair_order_parts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `repair_order_services`
--
ALTER TABLE `repair_order_services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `repair_services`
--
ALTER TABLE `repair_services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `spare_parts`
--
ALTER TABLE `spare_parts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `transaction_items`
--
ALTER TABLE `transaction_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_refunded_by_foreign` FOREIGN KEY (`refunded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_repair_order_id_foreign` FOREIGN KEY (`repair_order_id`) REFERENCES `repair_orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refunded_items`
--
ALTER TABLE `refunded_items`
  ADD CONSTRAINT `refunded_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `refunded_items_refunded_by_foreign` FOREIGN KEY (`refunded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `refunded_items_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `refunded_items_transaction_item_id_foreign` FOREIGN KEY (`transaction_item_id`) REFERENCES `transaction_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refunds`
--
ALTER TABLE `refunds`
  ADD CONSTRAINT `refunds_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `refunds_repair_order_id_foreign` FOREIGN KEY (`repair_order_id`) REFERENCES `repair_orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `refunds_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `repair_orders`
--
ALTER TABLE `repair_orders`
  ADD CONSTRAINT `repair_orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `repair_order_parts`
--
ALTER TABLE `repair_order_parts`
  ADD CONSTRAINT `repair_order_parts_part_id_foreign` FOREIGN KEY (`part_id`) REFERENCES `spare_parts` (`id`),
  ADD CONSTRAINT `repair_order_parts_repair_order_service_id_foreign` FOREIGN KEY (`repair_order_service_id`) REFERENCES `repair_order_services` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `repair_order_services`
--
ALTER TABLE `repair_order_services`
  ADD CONSTRAINT `repair_order_services_repair_order_id_foreign` FOREIGN KEY (`repair_order_id`) REFERENCES `repair_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `repair_order_services_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `repair_services` (`id`);

--
-- Constraints for table `transaction_items`
--
ALTER TABLE `transaction_items`
  ADD CONSTRAINT `transaction_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaction_items_transaction_id_foreign` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
