-- Lets admin upload a poster/hero image per tour event (Section 6, module 3) —
-- used on the departure card and the hero tour carousel (Section 5.3) instead
-- of the SceneArt placeholder once set.
alter table tour_events add column poster_image_url text;
