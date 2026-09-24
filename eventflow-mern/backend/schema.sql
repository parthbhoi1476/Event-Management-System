-- EventFlow MySQL Schema
-- Run this file in your MySQL client to set up the database

CREATE DATABASE IF NOT EXISTS eventmangment;

USE eventmangment;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('user', 'admin') DEFAULT 'user',
  image       VARCHAR(500) DEFAULT 'https://www.gravatar.com/avatar/?d=mp',
  phone       VARCHAR(50)  DEFAULT NULL,
  bio         TEXT         DEFAULT NULL,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(255)   NOT NULL,
  description      TEXT,
  date             DATETIME,
  location         VARCHAR(500),
  image            VARCHAR(500),
  category         VARCHAR(100),
  status           VARCHAR(50)    DEFAULT 'Upcoming',
  capacity         INT            DEFAULT 0,
  available_seats  INT            DEFAULT 0,
  price            DECIMAL(10,2)  DEFAULT 0.00,
  owner_email      VARCHAR(255)   NOT NULL,
  organizer_name   VARCHAR(255),
  organizer_email  VARCHAR(255),
  start_time       VARCHAR(20),
  end_time         VARCHAR(20),
  created_at       DATETIME       DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_email  VARCHAR(255) NOT NULL,
  event_id    INT          NOT NULL,
  booked_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_booking (user_email, event_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
