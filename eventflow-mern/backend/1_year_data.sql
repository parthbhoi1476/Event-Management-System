-- ==========================================
-- 1 YEAR OF DUMMY DATA & NEW REVIEWS TABLE
-- ==========================================

USE eventmangment;

-- 1. INCREASE TABLES (Adding a new Reviews Table)
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- 2. INCREASE DATA (1 Full Year of Events)
INSERT INTO events (title, description, date, location, image, category, available_seats, capacity, price, owner_email, organizer_name, start_time, end_time) VALUES
-- MONTH 1
('Tech Innovators Summit', 'A massive gathering of tech enthusiasts.', DATE_ADD(CURRENT_DATE(), INTERVAL 10 DAY), 'San Francisco Expo', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'Technology', 500, 500, 199.99, 'parth@example.com', 'Admin Organizer', '09:00', '18:00'),
('Jazz Under the Stars', 'Relaxing smooth jazz concert outdoors.', DATE_ADD(CURRENT_DATE(), INTERVAL 25 DAY), 'Central Park Amphitheater', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', 'Music', 200, 200, 45.00, 'parth@example.com', 'Admin Organizer', '19:00', '22:00'),

-- MONTH 2
('Global AI Conference', 'Future of Artificial Intelligence.', DATE_ADD(CURRENT_DATE(), INTERVAL 45 DAY), 'London Convention Center', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', 'Technology', 1000, 1000, 499.00, 'parth@example.com', 'Admin Organizer', '10:00', '16:00'),
('Food & Wine Tasting', 'Experience luxury culinary arts.', DATE_ADD(CURRENT_DATE(), INTERVAL 55 DAY), 'Downtown Winery', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', 'Food', 150, 150, 89.50, 'parth@example.com', 'Admin Organizer', '18:00', '21:00'),

-- MONTH 3
('Marathon 2026', 'City-wide running event for charity.', DATE_ADD(CURRENT_DATE(), INTERVAL 75 DAY), 'City Square', 'https://images.unsplash.com/photo-1552674605-15c37042ce88?w=800', 'Sports', 2000, 2000, 25.00, 'parth@example.com', 'Admin Organizer', '06:00', '12:00'),
('Startup Pitch Night', 'Watch founders pitch their ideas.', DATE_ADD(CURRENT_DATE(), INTERVAL 85 DAY), 'Innovation Hub', 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=800', 'Business', 300, 300, 10.00, 'parth@example.com', 'Admin Organizer', '18:30', '21:30'),

-- MONTH 5
('Summer Music Festival', 'The biggest beats of the summer.', DATE_ADD(CURRENT_DATE(), INTERVAL 140 DAY), 'Desert Valley Arena', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', 'Music', 5000, 5000, 150.00, 'parth@example.com', 'Admin Organizer', '14:00', '23:59'),
('Beach Volleyball Championship', 'National sports tournament.', DATE_ADD(CURRENT_DATE(), INTERVAL 150 DAY), 'Sunny Side Beach', 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800', 'Sports', 800, 800, 20.00, 'parth@example.com', 'Admin Organizer', '08:00', '17:00'),

-- MONTH 7
('International Comic Con', 'Cosplay, comics, and movies.', DATE_ADD(CURRENT_DATE(), INTERVAL 200 DAY), 'Metro Convention Hall', 'https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?w=800', 'Entertainment', 3000, 3000, 75.00, 'parth@example.com', 'Admin Organizer', '09:00', '20:00'),
('Local Business Mixer', 'Networking for local entrepreneurs.', DATE_ADD(CURRENT_DATE(), INTERVAL 215 DAY), 'Grand Hotel Lounge', 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800', 'Networking', 150, 150, 15.00, 'parth@example.com', 'Admin Organizer', '19:00', '22:00'),

-- MONTH 9
('Automotive Expo', 'Discover the future of electric vehicles.', DATE_ADD(CURRENT_DATE(), INTERVAL 260 DAY), 'Grand Exhibition Center', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', 'Technology', 800, 800, 30.00, 'parth@example.com', 'Admin Organizer', '10:00', '18:00'),
('Photography Masterclass', 'Learn from the best in the industry.', DATE_ADD(CURRENT_DATE(), INTERVAL 280 DAY), 'Arts Center', 'https://images.unsplash.com/photo-1516961642265-531546e84af2?w=800', 'Workshop', 50, 50, 199.00, 'parth@example.com', 'Admin Organizer', '09:00', '15:00'),

-- MONTH 11
('Winter Wonderland Gala', 'High-end charity gala in the snow.', DATE_ADD(CURRENT_DATE(), INTERVAL 320 DAY), 'Crystal Palace Hotel', 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=800', 'Networking', 400, 400, 250.00, 'parth@example.com', 'Admin Organizer', '19:00', '01:00'),
('Cyber Security Summit', 'Protecting the future of data.', DATE_ADD(CURRENT_DATE(), INTERVAL 335 DAY), 'Tech Park', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', 'Technology', 600, 600, 350.00, 'parth@example.com', 'Admin Organizer', '08:30', '17:30'),

-- MONTH 12
('New Years Eve Countdown 2027', 'Ring in the new year with an epic massive party.', DATE_ADD(CURRENT_DATE(), INTERVAL 360 DAY), 'Downtown Skyline Club', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 'Music', 1000, 1000, 120.00, 'parth@example.com', 'Admin Organizer', '21:00', '02:00');
