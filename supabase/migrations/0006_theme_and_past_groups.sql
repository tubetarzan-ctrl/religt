-- =========================================================================
-- Religious Tours — Theme system (Section 5.4) + Past Groups CMS (Section 5.5)
-- =========================================================================

-- ---------------------------------------------------------------------
-- site_settings — single-row-per-key store; active_theme drives the whole
-- public site's CSS variable set (app/globals.css theme blocks).
-- ---------------------------------------------------------------------
create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);

insert into site_settings (key, value) values ('active_theme', '"emerald-gold"'::jsonb);

alter table site_settings enable row level security;
create policy "site_settings_public_read" on site_settings for select using (true);
create policy "site_settings_admin_write" on site_settings for all using (fn_is_admin()) with check (fn_is_admin());

-- ---------------------------------------------------------------------
-- theme_overrides — optional per-theme single-variable tweaks, exposed only
-- as an "Advanced" collapsible in the Appearance admin UI (Section 5.4, item 5).
-- ---------------------------------------------------------------------
create table theme_overrides (
  id uuid primary key default gen_random_uuid(),
  theme_id text not null,
  variable text not null,
  value text not null,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  unique (theme_id, variable)
);

alter table theme_overrides enable row level security;
create policy "theme_overrides_public_read" on theme_overrides for select using (true);
create policy "theme_overrides_admin_write" on theme_overrides for all using (fn_is_admin()) with check (fn_is_admin());

-- ---------------------------------------------------------------------
-- tour_events.featured — drives the hero tour carousel (Section 5.3)
-- ---------------------------------------------------------------------
alter table tour_events add column featured boolean default false;
create index idx_tour_events_featured on tour_events(featured) where featured = true;

-- ---------------------------------------------------------------------
-- past_group_cards — curated Past Groups Manager content (Section 5.5)
-- ---------------------------------------------------------------------
create table past_group_cards (
  id uuid primary key default gen_random_uuid(),
  landing_page_slug text not null,
  tour_event_id uuid references tour_events(id),
  month_label text,
  title text not null,
  narrative text,
  rating_label text,
  cover_image_url text,
  sort_order int default 0,
  visible boolean default true,
  created_at timestamptz default now()
);
create index idx_past_group_cards_slug on past_group_cards(landing_page_slug);

alter table past_group_cards enable row level security;
create policy "past_group_cards_public_read" on past_group_cards for select using (visible = true or fn_is_staff());
create policy "past_group_cards_staff_write" on past_group_cards for all using (fn_is_staff()) with check (fn_is_staff());

-- ---------------------------------------------------------------------
-- Dev seed: mark a couple of tour_events featured so the hero carousel has
-- something to show immediately, and add two curated past-group cards.
-- ---------------------------------------------------------------------
update tour_events set featured = true
where slug in ('karbala-najaf-nov-2026', 'umrah-premium-21day', 'iraq-umrah-sunni-combined');

insert into past_group_cards (landing_page_slug, tour_event_id, month_label, title, narrative, rating_label, sort_order) values
('iraq-ziarat', (select id from tour_events where slug = 'karbala-najaf-nov-2026'), 'June 2026 · Group #47', 'Shab-e-Barat in Karbala', '42 zaireen including 11 first-timers and 6 elderly with wheelchair support — full ziarat program completed.', '★ 5.0 group rating', 1),
('umrah', (select id from tour_events where slug = 'umrah-premium-21day'), 'March 2026 · Group #44', 'Ramadan Umrah Group', '38 travelers, nightly taraweeh at the Haram, zero logistics issues throughout.', '★ 4.9 group rating', 1);
