-- ====================================================
-- EVENTFLOW: 15-TABLE MASTER ENTERPRISE SCHEMA
-- ====================================================
-- Run this in MySQL Workbench to create the complete 
-- 15-table relational database architecture!

CREATE DATABASE IF NOT EXISTS eventmangment;
USE eventmangment;

-- ----------------------------------------------------
-- 1. CORE ENTITIES
-- ----------------------------------------------------

-- 1. Users Table (Attendees & Admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    image VARCHAR(500) DEFAULT 'https://www.gravatar.com/avatar/?d=mp',
    phone VARCHAR(50) DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Venues Table
CREATE TABLE IF NOT EXISTS venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    max_capacity INT NOT NULL,
    has_parking BOOLEAN DEFAULT FALSE,
    has_wifi BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Events Table (The Core Event Record)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME,
    venue_id INT NULL,
    location VARCHAR(500), -- Legacy string location
    image VARCHAR(500),
    category VARCHAR(100), -- Legacy string category
    status VARCHAR(50) DEFAULT 'Upcoming',
    capacity INT DEFAULT 0,
    available_seats INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    owner_email VARCHAR(255) NOT NULL,
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    start_time VARCHAR(20),
    end_time VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL
);

-- ----------------------------------------------------
-- 2. VIP PROFILES & EVENT EXTENSIONS
-- ----------------------------------------------------

-- 5. Speakers Table
CREATE TABLE IF NOT EXISTS speakers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    expertise_area VARCHAR(255),
    social_linkedin VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Sponsors Table
CREATE TABLE IF NOT EXISTS sponsors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    sponsorship_tier ENUM('Bronze', 'Silver', 'Gold', 'Platinum') DEFAULT 'Bronze',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Coupons Table (Discounts)
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percentage INT CHECK (discount_percentage BETWEEN 1 AND 100),
    max_uses INT DEFAULT 100,
    uses_count INT DEFAULT 0,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------
-- 3. MANY-TO-MANY BRIDGE TABLES
-- ----------------------------------------------------

-- 8. Event Categories (Bridge)
CREATE TABLE IF NOT EXISTS event_categories (
    event_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (event_id, category_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 9. Event Speakers (Bridge)
CREATE TABLE IF NOT EXISTS event_speakers (
    event_id INT NOT NULL,
    speaker_id INT NOT NULL,
    presentation_time VARCHAR(50),
    PRIMARY KEY (event_id, speaker_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (speaker_id) REFERENCES speakers(id) ON DELETE CASCADE
);

-- 10. Event Sponsors (Bridge)
CREATE TABLE IF NOT EXISTS event_sponsors (
    event_id INT NOT NULL,
    sponsor_id INT NOT NULL,
    funding_amount DECIMAL(12,2) DEFAULT 0.00,
    PRIMARY KEY (event_id, sponsor_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (sponsor_id) REFERENCES sponsors(id) ON DELETE CASCADE
);

-- ----------------------------------------------------
-- 4. OPERATIONAL & TRANSACTIONAL TABLES
-- ----------------------------------------------------

-- 11. Bookings Table (The Master Link)
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    event_id INT NOT NULL,
    coupon_id INT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_booking (user_email, event_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);

-- 12. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('Credit Card', 'PayPal', 'Stripe', 'Free') DEFAULT 'Credit Card',
    transaction_id VARCHAR(255) UNIQUE,
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Completed',
    paid_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 13. Tickets Table (Physical/Digital Access Code)
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    qr_code_string VARCHAR(255) NOT NULL UNIQUE,
    seat_number VARCHAR(50),
    is_scanned BOOLEAN DEFAULT FALSE,
    scanned_at DATETIME NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 14. Waitlist Queue Table
CREATE TABLE IF NOT EXISTS waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    queue_position INT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 15. Reviews Table (Post-Event Feedback)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ====================================================
-- SUCCESS: 15 TABLES CREATED!
-- ====================================================
