-- =========================================================================
-- Religious Tours — Core schema (non-accounting)
-- Section 11 of the master brief. Accounting tables live in 0002.
-- =========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles (extends auth.users)
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('super_admin','admin','accountant','sales_staff','guide','staff','customer')) default 'customer',
  phone text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- tour_events
-- ---------------------------------------------------------------------
create table tour_events (
  id uuid primary key default gen_random_uuid(),
  vertical text not null check (vertical in ('iraq_ziarat','iran_ziarat','umrah','air_ticket','visa','sunni_group')),
  sect text not null check (sect in ('sunni','shia','general')) default 'general',
  combined_group_id uuid,
  title text not null,
  slug text unique not null,
  start_date date not null,
  end_date date not null,
  duration_days int,
  capacity int not null default 0,
  seats_booked int not null default 0,
  waitlist_count int not null default 0,
  price_amount bigint not null,
  price_single_sharing bigint,
  price_triple_sharing bigint,
  price_quad_sharing bigint,
  currency text not null default 'PKR',
  early_bird_price bigint,
  early_bird_deadline date,
  guide_name text,
  guide_bio text,
  status text not null default 'upcoming' check (status in ('upcoming','past')),
  itinerary jsonb default '[]'::jsonb,
  hotels jsonb default '{}'::jsonb,
  document_checklist jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);
create index idx_tour_events_vertical on tour_events(vertical);
create index idx_tour_events_sect on tour_events(sect);
create index idx_tour_events_slug on tour_events(slug);

-- status can't be a generated column — `current_date` is STABLE, not IMMUTABLE,
-- so Postgres rejects it in a generated expression. Kept correct instead via:
-- this trigger (fixes it at write time) + a daily cron sweep (Section 12, item 1)
-- for events that age past their date with no write happening.
create or replace function fn_set_tour_event_status() returns trigger as $$
begin
  new.status := case when new.end_date < current_date then 'past' else 'upcoming' end;
  return new;
end;
$$ language plpgsql;

create trigger trg_set_tour_event_status
before insert or update of end_date on tour_events
for each row execute function fn_set_tour_event_status();

-- ---------------------------------------------------------------------
-- bookings
-- ---------------------------------------------------------------------
create table bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references profiles(id),
  tour_event_id uuid references tour_events(id),
  vertical text,
  agent_id uuid,
  pax_count int not null default 1,
  total_amount bigint not null,
  payment_plan text check (payment_plan in ('full','2_installment','3_installment')) default 'full',
  status text not null check (status in ('inquiry','quoted','confirmed','paid','completed','cancelled')) default 'inquiry',
  cancelled_at timestamptz,
  cancellation_reason text,
  refund_amount bigint,
  created_at timestamptz default now()
);
create index idx_bookings_customer on bookings(customer_id);
create index idx_bookings_tour_event on bookings(tour_event_id);
create index idx_bookings_status on bookings(status);

-- ---------------------------------------------------------------------
-- travelers
-- ---------------------------------------------------------------------
create table travelers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  full_name text not null,
  passport_number text,
  passport_expiry date,
  date_of_birth date,
  gender text,
  room_sharing_pref text check (room_sharing_pref in ('single','double','triple','quad')),
  room_number text,
  medical_notes text,
  emergency_contact jsonb,
  documents_submitted jsonb default '{}'::jsonb,
  visa_status text check (visa_status in ('not_started','submitted','approved','rejected')) default 'not_started',
  created_at timestamptz default now()
);
create index idx_travelers_booking on travelers(booking_id);
create index idx_travelers_passport_expiry on travelers(passport_expiry);

-- ---------------------------------------------------------------------
-- exchange_rates
-- ---------------------------------------------------------------------
create table exchange_rates (
  id uuid primary key default gen_random_uuid(),
  currency_code text not null,
  rate_to_pkr numeric not null,
  effective_date date not null
);

-- ---------------------------------------------------------------------
-- discount_codes
-- ---------------------------------------------------------------------
create table discount_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text check (discount_type in ('percent','fixed')),
  discount_value numeric,
  vertical text,
  max_uses int,
  used_count int default 0,
  valid_from date,
  valid_until date,
  is_active boolean default true
);

-- ---------------------------------------------------------------------
-- agents (referral / sub-agent commissions)
-- ---------------------------------------------------------------------
create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  commission_type text check (commission_type in ('percent','fixed')),
  commission_value numeric,
  payable_account_id uuid,
  created_at timestamptz default now()
);
alter table bookings add constraint fk_bookings_agent foreign key (agent_id) references agents(id);

-- ---------------------------------------------------------------------
-- payment_submissions
-- ---------------------------------------------------------------------
create table payment_submissions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  proof_url text not null,
  claimed_amount bigint,
  bank_account_used text,
  status text not null check (status in ('pending','verified','rejected')) default 'pending',
  reviewed_by uuid references profiles(id),
  rejection_reason text,
  created_at timestamptz default now()
);
create index idx_payment_submissions_status on payment_submissions(status);

-- ---------------------------------------------------------------------
-- reviews
-- ---------------------------------------------------------------------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  landing_page_slug text not null,
  tour_event_id uuid references tour_events(id),
  customer_id uuid references profiles(id),
  customer_name text,
  customer_phone text,
  rating int check (rating between 1 and 5),
  text_content text,
  image_urls text[] default '{}',
  video_status text check (video_status in ('none','uploading','processing','ready','failed')) default 'none',
  youtube_video_id text,
  source text check (source in ('admin_added','customer_submitted')) default 'admin_added',
  moderation_status text check (moderation_status in ('auto_published','pending_review','rejected')) default 'auto_published',
  published boolean default false,
  admin_reply text,
  admin_reply_at timestamptz,
  google_review_prompted boolean default false,
  google_review_clicked boolean default false,
  flagged_reason text,
  created_at timestamptz default now()
);
create index idx_reviews_slug on reviews(landing_page_slug);
create index idx_reviews_tour_event on reviews(tour_event_id);
create index idx_reviews_moderation on reviews(moderation_status);

-- ---------------------------------------------------------------------
-- gallery_images
-- ---------------------------------------------------------------------
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  landing_page_slug text,
  category text check (category in ('hotel','shrine','group_photo')),
  image_url text not null,
  visible boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index idx_gallery_slug on gallery_images(landing_page_slug);

-- ---------------------------------------------------------------------
-- inquiries
-- ---------------------------------------------------------------------
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  name text, email text, phone text,
  vertical text,
  message text,
  source text check (source in ('form','whatsapp','email')),
  assigned_to uuid references profiles(id),
  status text default 'open',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- chatbot / whatsapp / email automation tables
-- ---------------------------------------------------------------------
create table chatbot_knowledge (
  id uuid primary key default gen_random_uuid(),
  question_pattern text not null,
  answer text not null,
  vertical text,
  hit_count int default 0,
  created_at timestamptz default now()
);

create table whatsapp_conversations (
  id uuid primary key default gen_random_uuid(),
  customer_phone text,
  status text check (status in ('bot_active','needs_human','resolved')) default 'bot_active',
  assigned_to uuid references profiles(id),
  created_at timestamptz default now()
);

create table whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references whatsapp_conversations(id) on delete cascade,
  direction text check (direction in ('inbound','outbound')),
  body text,
  used_ai boolean default false,
  created_at timestamptz default now()
);

create table email_threads (
  id uuid primary key default gen_random_uuid(),
  sender_email text,
  subject text,
  classification text,
  auto_replied boolean default false,
  escalated boolean default false,
  assigned_to uuid references profiles(id),
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- blog (Section 13.3)
-- ---------------------------------------------------------------------
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_image_url text,
  vertical text,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- audit_log
-- ---------------------------------------------------------------------
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- seats_booked auto-decrement trigger
-- ---------------------------------------------------------------------
create or replace function fn_sync_seats_booked() returns trigger as $$
begin
  if (tg_op = 'INSERT' and new.status in ('confirmed','paid','completed')) then
    update tour_events set seats_booked = seats_booked + new.pax_count where id = new.tour_event_id;
  elsif (tg_op = 'UPDATE') then
    if old.status not in ('confirmed','paid','completed') and new.status in ('confirmed','paid','completed') then
      update tour_events set seats_booked = seats_booked + new.pax_count where id = new.tour_event_id;
    elsif old.status in ('confirmed','paid','completed') and new.status not in ('confirmed','paid','completed') then
      update tour_events set seats_booked = greatest(0, seats_booked - old.pax_count) where id = old.tour_event_id;
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_sync_seats_booked
after insert or update on bookings
for each row execute function fn_sync_seats_booked();
