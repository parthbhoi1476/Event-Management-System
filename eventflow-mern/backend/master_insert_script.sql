-- ====================================================
-- EVENTFLOW: MASTER INSERT SCRIPT (15 TABLES)
-- ====================================================
-- Run this script AFTER running 15_tables_schema.sql
-- It populates all 15 enterprise tables with realistic dummy data!

USE eventmangment;

-- ----------------------------------------------------
-- 1. INDEPENDENT ENTITIES
-- ----------------------------------------------------

-- 1. Users
INSERT INTO users (name, email, password, role, phone, bio) VALUES
('Admin Parth', 'admin@eventflow.com', '$2a$10$xyz...', 'admin', '+1-555-0101', 'System Administrator & CTO'),
('John Doe', 'john@example.com', '$2a$10$abc...', 'user', '+1-555-0202', 'Loves tech and music events.'),
('Jane Smith', 'jane@example.com', '$2a$10$def...', 'user', '+1-555-0303', 'Foodie and networking enthusiast.'),
('Mike Ross', 'mike.ross@example.com', '$2a$10$ghi...', 'user', '+1-555-0404', 'Corporate lawyer looking for seminars.');

-- 2. Categories
INSERT INTO categories (name, description, icon_name) VALUES
('Technology', 'Tech summits, AI expos, and hackathons.', 'laptop'),
('Music', 'Concerts, festivals, and live bands.', 'music'),
('Business', 'Networking, startups, and entrepreneurship.', 'briefcase'),
('Food', 'Wine tasting, culinary masterclasses.', 'coffee');

-- 3. Venues
INSERT INTO venues (name, address, city, country, max_capacity, has_parking, has_wifi) VALUES
('Grand Convention Center', '100 Main St', 'New York', 'USA', 5000, TRUE, TRUE),
('Silicon Valley Tech Park', '404 Innovation Dr', 'San Francisco', 'USA', 2000, TRUE, TRUE),
('Central Amphitheater', '50 Park Ave', 'Chicago', 'USA', 10000, FALSE, FALSE),
('Downtown Winery HQ', '99 Vineyard Rd', 'Napa Valley', 'USA', 200, TRUE, TRUE);

-- 4. Speakers
INSERT INTO speakers (name, bio, expertise_area, social_linkedin) VALUES
('Dr. Alan Turing', 'Pioneer in Artificial Intelligence.', 'AI & Machine Learning', 'linkedin.com/alanturing'),
('Gordon Ramsay', 'Multi-Michelin starred chef.', 'Culinary Arts', 'linkedin.com/gramsay'),
('Gary Vaynerchuk', 'Serial entrepreneur and investor.', 'Digital Marketing & Startups', 'linkedin.com/garyvee');

-- 5. Sponsors
INSERT INTO sponsors (company_name, website_url, logo_url, sponsorship_tier) VALUES
('TechCorp', 'https://techcorp.com', 'logo1.png', 'Platinum'),
('Global Bank', 'https://globalbank.com', 'logo2.png', 'Gold'),
('Fresh Foods', 'https://freshfoods.com', 'logo3.png', 'Silver');

-- 6. Coupons
INSERT INTO coupons (code, discount_percentage, max_uses, uses_count, expires_at) VALUES
('EARLYBIRD', 20, 100, 15, '2026-12-31 23:59:59'),
('STUDENT50', 50, 500, 200, '2026-12-31 23:59:59'),
('FREEMUSIC', 100, 10, 10, '2025-01-01 00:00:00'); -- expired/used up

-- ----------------------------------------------------
-- 2. CORE DEPENDENT ENTITIES
-- ----------------------------------------------------

-- 7. Events
INSERT INTO events (title, description, date, venue_id, location, image, category, status, capacity, available_seats, price, owner_email, organizer_name, organizer_email, start_time, end_time) VALUES
('Global AI Summit 2026', 'Future of tech and machine learning.', '2026-08-15 09:00:00', 2, 'Silicon Valley Tech Park', 'ai.png', 'Technology', 'Upcoming', 1000, 998, 299.99, 'admin@eventflow.com', 'Admin Parth', 'admin@eventflow.com', '09:00', '17:00'),
('Summer Jazz Festival', 'Open air music night.', '2026-07-20 18:00:00', 3, 'Central Amphitheater', 'jazz.png', 'Music', 'Upcoming', 5000, 4800, 45.00, 'admin@eventflow.com', 'Admin Parth', 'admin@eventflow.com', '18:00', '23:00'),
('Startup Pitch Battle', 'Watch founders pitch to investors.', '2026-06-10 10:00:00', 1, 'Grand Convention Center', 'startup.png', 'Business', 'Upcoming', 500, 50, 15.00, 'john@example.com', 'John Doe', 'john@example.com', '10:00', '15:00'),
('Exclusive Wine Tasting', 'Premium wine and cheese pairings.', '2026-09-05 19:00:00', 4, 'Downtown Winery HQ', 'wine.png', 'Food', 'Upcoming', 100, 0, 150.00, 'jane@example.com', 'Jane Smith', 'jane@example.com', '19:00', '22:00'); -- Sold out!

-- ----------------------------------------------------
-- 3. BRIDGE TABLES (MANY-TO-MANY)
-- ----------------------------------------------------

-- 8. Event Categories
INSERT INTO event_categories (event_id, category_id) VALUES
(1, 1), -- AI Summit -> Tech
(1, 3), -- AI Summit -> Business
(2, 2), -- Jazz Test -> Music
(3, 3), -- Pitch Battle -> Business
(4, 4); -- Wine -> Food

-- 9. Event Speakers
INSERT INTO event_speakers (event_id, speaker_id, presentation_time) VALUES
(1, 1, '10:00 AM - 11:30 AM'), -- Turing at AI Summit
(3, 3, '02:00 PM - 03:00 PM'), -- Gary at Pitch Battle
(4, 2, '07:30 PM - 08:30 PM'); -- Ramsay at Wine tasting

-- 10. Event Sponsors
INSERT INTO event_sponsors (event_id, sponsor_id, funding_amount) VALUES
(1, 1, 50000.00), -- TechCorp funds AI Summit
(3, 2, 10000.00), -- Global Bank funds Pitch Battle
(4, 3, 5000.00);  -- Fresh Foods funds Wine tasting

-- ----------------------------------------------------
-- 4. OPERATIONAL / TRANSACTIONAL TABLES
-- ----------------------------------------------------

-- 11. Bookings
INSERT INTO bookings (id, user_email, event_id, coupon_id, booking_date) VALUES
(1001, 'john@example.com', 1, NULL, '2026-04-10 10:00:00'),
(1002, 'jane@example.com', 1, 1, '2026-04-12 11:30:00'), -- used EARLYBIRD
(1003, 'mike.ross@example.com', 4, NULL, '2026-03-05 09:15:00');

-- 12. Payments
INSERT INTO payments (booking_id, amount, payment_method, transaction_id, payment_status) VALUES
(1001, 299.99, 'Credit Card', 'TXN_9A8B7C', 'Completed'),
(1002, 239.99, 'PayPal', 'TXN_1D2E3F', 'Completed'), -- 20% off from EARLYBIRD
(1003, 150.00, 'Stripe', 'TXN_5X6Y7Z', 'Completed');

-- 13. Tickets
INSERT INTO tickets (booking_id, qr_code_string, seat_number, is_scanned) VALUES
(1001, 'QR_AI_JOHN_XYZ', 'Row A - Seat 15', FALSE),
(1002, 'QR_AI_JANE_ABC', 'Row A - Seat 16', FALSE),
(1003, 'QR_WINE_MIKE_123', 'VIP Lounge', TRUE); -- Already scanned event

-- 14. Waitlist
-- (Event 4 is sold out, so users join the waitlist)
INSERT INTO waitlist (event_id, user_email, queue_position) VALUES
(4, 'john@example.com', 1),
(4, 'admin@eventflow.com', 2);

-- 15. Reviews
-- (Assume Event 3 happened previously for mocking purposes)
INSERT INTO reviews (event_id, user_email, rating, comment) VALUES
(3, 'jane@example.com', 5, 'Absolutely mind-blowing startup pitches. Loved the networking!'),
(3, 'mike.ross@example.com', 4, 'Great event, but seating was a bit cramped.');

-- ====================================================
-- SUCCESS: DUMMY DATA FOR 15 TABLES INSERTED!
-- ====================================================
