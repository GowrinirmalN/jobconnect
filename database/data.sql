-- =========================================================================
-- JobConnect - Seed Data Script
-- =========================================================================

USE `jobconnect_db`;

-- Roles
INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'ROLE_ADMIN'),
(2, 'ROLE_RECRUITER'),
(3, 'ROLE_JOB_SEEKER')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Default Users (Password for all demo accounts: 'password123' or as seeded by DataInitializer)
-- BCrypt for 'admin123': $2a$10$wKz0b9fR2fM44.L4Z7fCGe5fOtxF6e0U9V/yC1Rj8uW6V1r1q1.2m (auto initialized by Spring Boot on startup)

