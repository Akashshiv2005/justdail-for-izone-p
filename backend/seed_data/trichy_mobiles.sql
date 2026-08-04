-- BizDial SQL Seed Script for 15 Trichy Mobile Shops
-- Target Database: PostgreSQL

BEGIN;

-- 1. Ensure Category & Subcategory exist (Insert if not exists)
INSERT INTO categories (name, slug, icon, description, is_featured, is_active, display_order)
VALUES ('Shopping & Retail', 'shopping-retail', 'shopping-bag', 'Clothing, electronics, grocery, and online shopping.', true, true, 10)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO subcategories (category_id, name, slug, icon, description, is_active, display_order)
SELECT id, 'Mobile & Accessories', 'mobile-accessories', 'smartphone', 'Mobile phone dealers, accessories, and repair services.', true, 6
FROM categories WHERE slug = 'shopping-retail'
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Owner Users
INSERT INTO users (name, email, phone, hashed_password, role)
VALUES 
  ('Rajendran Krishnamoorthy', 'owner001@bizdial.com', '+91 98420 70001', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Senthil Kumar Natarajan', 'owner002@bizdial.com', '+91 98420 70002', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Manikandan Subramanian', 'owner003@bizdial.com', '+91 98420 70003', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Dinesh Babu Rajan', 'owner004@bizdial.com', '+91 98420 70004', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Arun Prakash Venkatesh', 'owner005@bizdial.com', '+91 98420 70005', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Karthikeyan Mohan', 'owner006@bizdial.com', '+91 98420 70006', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Vijayakumar Palaniswami', 'owner007@bizdial.com', '+91 98420 70007', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Saravanan Kannan', 'owner008@bizdial.com', '+91 98420 70008', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Balasubramanian Ramasamy', 'owner009@bizdial.com', '+91 98420 70009', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Ganesan Thirunavukarasu', 'owner010@bizdial.com', '+91 98420 70010', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Prakash Sundararajan', 'owner011@bizdial.com', '+91 98420 70011', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Ashwin Kumar Prabhu', 'owner012@bizdial.com', '+91 98420 70012', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Murugan Shanmugam', 'owner013@bizdial.com', '+91 98420 70013', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Vigneshwaran Arumugam', 'owner014@bizdial.com', '+91 98420 70014', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner'),
  ('Ramesh Venkatesan', 'owner015@bizdial.com', '+91 98420 70015', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'owner')
ON CONFLICT (email) DO NOTHING;

-- 3. Insert Businesses (Sample 2 shown for brevity, all 15 inserted via python script)
INSERT INTO businesses (
  owner_id, business_name, slug, category, short_description, description, address, area, city, state, country, pincode,
  latitude, longitude, google_map_url, phone, whatsapp, email, website, logo_url, cover_image_url,
  is_verified, is_premium, approval_status, average_rating, total_reviews, opening_time, closing_time, working_days,
  profile_views, call_clicks, whatsapp_clicks, website_clicks, direction_requests, bookmark_count
)
SELECT 
  u.id, 'The Chennai Mobiles', 'the-chennai-mobiles-thillai-nagar-trichy', 'Shopping & Retail',
  'Trusted multi-brand mobile showroom in Thillai Nagar with 10+ years of experience.',
  'The Chennai Mobiles is one of the most trusted multi-brand mobile showrooms in Thillai Nagar, Trichy...',
  'No. 5, 7th Cross Street, Thillai Nagar, Tiruchirappalli, Tamil Nadu 620018', 'Thillai Nagar', 'Trichy', 'Tamil Nadu', 'India', '620018',
  10.8155, 78.6873, 'https://www.google.com/maps/search/?api=1&query=10.8155,78.6873',
  '+91 98424 51001', '+91 98424 51001', 'thechennaimobiles.trichy@gmail.com', 'https://www.thechennaimobiles.com',
  'https://ui-avatars.com/api/?name=The+Chennai+Mobiles&size=200&background=random&bold=true',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
  true, true, 'Approved', 4.7, 1842, '09:30', '21:00', 'Mon-Sat',
  28450, 3420, 2180, 1560, 4230, 876
FROM users u WHERE u.email = 'owner001@bizdial.com'
ON CONFLICT (slug) DO NOTHING;

COMMIT;
