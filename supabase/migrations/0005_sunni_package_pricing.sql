-- Sunni Group Tours package builder (Section 5.1) needs Iraq-only / Umrah-only / Combined
-- pricing on the same tour_event row so the toggle can read live data with no guesswork.

alter table tour_events
  add column price_iraq_leg_only bigint,
  add column price_umrah_leg_only bigint;

update tour_events
set price_iraq_leg_only = 240000, price_umrah_leg_only = 260000
where slug = 'iraq-umrah-sunni-combined';
