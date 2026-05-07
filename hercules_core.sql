-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 07, 2026 at 07:46 PM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hercules_core`
--

-- --------------------------------------------------------

--
-- Table structure for table `alerts`
--

DROP TABLE IF EXISTS `alerts`;
CREATE TABLE IF NOT EXISTS `alerts` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `message` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('info','warning','danger') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'info',
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `incident_id` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alerts_incident_id_foreign` (`incident_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
CREATE TABLE IF NOT EXISTS `equipment` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `sku_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` enum('harness','helmet','paintball_marker','buggy','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `zone_id` bigint UNSIGNED DEFAULT NULL,
  `status` enum('available','in_use','needs_inspection','in_repair','retired') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `last_inspection_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `equipment_sku_code_unique` (`sku_code`),
  KEY `equipment_zone_id_foreign` (`zone_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `sku_code`, `name`, `category`, `zone_id`, `status`, `last_inspection_date`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'HRN-001', 'Safety Harness Pro', 'harness', 3, 'available', '2026-04-27', '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL),
(2, 'HLM-001', 'Mountain Helmet X', 'helmet', 3, 'available', '2026-05-02', '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL),
(3, 'PBM-001', 'Tippmann FT-12', 'paintball_marker', 2, 'in_use', '2026-05-05', '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL),
(4, 'BGY-001', 'Polaris RZR', 'buggy', 4, 'needs_inspection', '2026-02-07', '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `equipment_assignments`
--

DROP TABLE IF EXISTS `equipment_assignments`;
CREATE TABLE IF NOT EXISTS `equipment_assignments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `equipment_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `returned_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `equipment_assignments_equipment_id_foreign` (`equipment_id`),
  KEY `equipment_assignments_user_id_foreign` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipment_assignments`
--

INSERT INTO `equipment_assignments` (`id`, `equipment_id`, `user_id`, `assigned_at`, `returned_at`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 3, '2026-05-07 16:43:49', NULL, '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incident_reports`
--

DROP TABLE IF EXISTS `incident_reports`;
CREATE TABLE IF NOT EXISTS `incident_reports` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `zone_id` bigint UNSIGNED NOT NULL,
  `equipment_id` bigint UNSIGNED DEFAULT NULL,
  `severity_level` enum('low','medium','high','critical') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('reported','investigating','resolved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'reported',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `incident_reports_user_id_foreign` (`user_id`),
  KEY `incident_reports_zone_id_foreign` (`zone_id`),
  KEY `incident_reports_equipment_id_foreign` (`equipment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `incident_reports`
--

INSERT INTO `incident_reports` (`id`, `user_id`, `zone_id`, `equipment_id`, `severity_level`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 4, 4, 'low', 'Minor oil leak detected on the buggy engine.', 'investigating', '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL),
(2, 3, 4, NULL, 'low', 'Broken fence near the entrance of the buggy circuit.', 'reported', '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `incident_id` bigint UNSIGNED NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_user_id_foreign` (`user_id`),
  KEY `messages_incident_id_foreign` (`incident_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_06_133831_create_zones_table', 1),
(5, '2026_05_06_133836_create_equipment_table', 1),
(6, '2026_05_06_133837_create_equipment_assignments_table', 1),
(7, '2026_05_06_133837_create_incident_reports_table', 1),
(8, '2026_05_06_135044_create_personal_access_tokens_table', 1),
(9, '2026_05_07_164335_add_phone_to_users_table', 1),
(10, '2026_05_07_164350_create_alerts_table', 1),
(11, '2026_05_07_173424_create_messages_table', 1),
(12, '2026_05_07_173459_add_incident_id_to_alerts_table', 1),
(13, '2026_05_07_175359_add_image_path_to_messages_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','manager','guide','cashier') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'guide',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `remember_token`, `role`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Admin Hercules', 'admin@hercules.ma', '+212600000001', NULL, '$2y$12$omwJOUtSqcGXNTlWwhF7KOLQ5Fjf9m13yNvm8BUIpN17Emb42F3u6', NULL, 'admin', 'active', '2026-05-07 18:43:47', '2026-05-07 18:43:47', NULL),
(2, 'Manager Achakkar', 'manager@hercules.ma', '+212600000002', NULL, '$2y$12$SI2G2Q6kf94m2Y3TqVJgtOHIwSOc7I89he9sizJk3YtP71e/lP5xm', NULL, 'manager', 'active', '2026-05-07 18:43:48', '2026-05-07 18:43:48', NULL),
(3, 'Guide Tangier', 'guide@hercules.ma', '+212600000003', NULL, '$2y$12$MezueCwD4CGxzkQ/AephKOORViQyA04HhlqMVXj3MWC0hAaTk1ugO', NULL, 'guide', 'active', '2026-05-07 18:43:48', '2026-05-07 18:43:48', NULL),
(4, 'Cashier Core', 'cashier@hercules.ma', '+212600000004', NULL, '$2y$12$b8FHlRrOJewMtis0M0m3eupSKsIhiLCzmmoBJY1U2uKCBNvYw6kCy', NULL, 'cashier', 'active', '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `zones`
--

DROP TABLE IF EXISTS `zones`;
CREATE TABLE IF NOT EXISTS `zones` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('open','closed','maintenance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'closed',
  `max_capacity` int NOT NULL DEFAULT '0',
  `current_visitors` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `zones`
--

INSERT INTO `zones` (`id`, `name`, `status`, `max_capacity`, `current_visitors`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Chute d\'Hippolyte', 'open', 50, 12, '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL),
(2, 'Paintball Achakkar', 'open', 24, 8, '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL),
(3, 'Tyrolienne Hercules', 'open', 15, 4, '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL),
(4, 'Circuit Buggy Spartel', 'maintenance', 10, 0, '2026-05-07 18:43:49', '2026-05-07 18:43:49', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
