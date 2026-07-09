-- =========================================================================
-- Religious Tours — Dev seed data (dummy content, replace before launch)
-- =========================================================================

insert into tour_events (vertical, sect, title, slug, start_date, end_date, duration_days, capacity, seats_booked, price_amount, currency, guide_name, guide_bio, itinerary, hotels) values
('iraq_ziarat','shia','Karbala & Najaf Ziarat — November Group','karbala-najaf-nov-2026','2026-11-05','2026-11-15',10,40,12,285000,'PKR','Syed Ali Abbas','15 years leading Ziarat groups to Iraq.','[{"day":1,"title":"Arrival in Najaf"},{"day":2,"title":"Imam Ali (AS) Shrine Ziarat"}]','{"Karbala":{"name":"Al-Abbas Hotel","images":[]},"Najaf":{"name":"Najaf Grand","images":[]}}'),
('iran_ziarat','shia','Mashhad & Qom Ziarat — December Group','mashhad-qom-dec-2026','2026-12-01','2026-12-10',10,35,8,245000,'PKR','Maulana Hasan Rizvi','Fluent in Farsi, 20+ Iran group departures.','[{"day":1,"title":"Arrival in Mashhad"},{"day":2,"title":"Imam Reza Shrine"}]','{"Mashhad":{"name":"Ferdowsi International","images":[]}}'),
('umrah','general','Umrah Premium — 21 Day Package','umrah-premium-21day','2026-09-10','2026-10-01',21,50,30,320000,'PKR','Sheikh Imran Farooq','Certified guide, Makkah/Madinah resident 8 years.','[{"day":1,"title":"Arrival Jeddah"},{"day":2,"title":"Makkah — Umrah rites"}]','{"Makkah":{"name":"Swissotel Al Maqam","images":[]},"Madinah":{"name":"Anwar Al Madinah Mövenpick","images":[]}}'),
('sunni_group','sunni','Iraq + Umrah Combined — Sunni Group Journey','iraq-umrah-sunni-combined','2026-10-15','2026-11-05',22,30,10,410000,'PKR','Mufti Abdul Rehman','Sunni scholar, specializes in Companion-era historical sites.','[{"day":1,"title":"Arrival Baghdad"},{"day":2,"title":"Historical Sunni sites, Baghdad"}]','{"Baghdad":{"name":"Baghdad Palace Hotel","images":[]}}');

insert into gallery_images (landing_page_slug, category, image_url, visible, sort_order) values
('iraq-ziarat','shrine','/gallery/placeholder-karbala.jpg', true, 1),
('umrah','hotel','/gallery/placeholder-makkah.jpg', true, 1),
('sunni-group-tours','group_photo','/gallery/placeholder-group.jpg', true, 1);

insert into reviews (landing_page_slug, tour_event_id, customer_name, rating, text_content, source, moderation_status, published) values
('iraq-ziarat', (select id from tour_events where slug='karbala-najaf-nov-2026'), 'Br. Ahmed Khan', 5, 'Extremely well organized Ziarat group, guide was knowledgeable and caring throughout.', 'admin_added', 'auto_published', true),
('umrah', (select id from tour_events where slug='umrah-premium-21day'), 'Sr. Fatima Malik', 5, 'Hotels were excellent, very close to Haram. Highly recommend Religious Tours.', 'admin_added', 'auto_published', true);

insert into chatbot_knowledge (question_pattern, answer, vertical) values
('visa processing time iraq', 'Iraq visa processing typically takes 7-10 business days once all documents are submitted.', 'iraq_ziarat'),
('umrah package price', 'Our Umrah packages range from Standard to Luxury tiers, starting at PKR 220,000. Check the /umrah page for live pricing.', 'umrah'),
('refund policy', 'Refunds follow a tiered policy: 100% if cancelled >60 days before departure, 50% for 30-60 days, 0% under 14 days.', null),
('what is included in package', 'All packages include hotel accommodation, ground transport, guide fees, and visa processing. Airfare is included unless stated otherwise.', null);

insert into accounting_periods (period_type, start_date, end_date, status) values
('year','2026-01-01','2026-12-31','open');
