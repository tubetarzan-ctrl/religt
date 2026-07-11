-- bookings/reviews/past_group_cards.tour_event_id were created with the
-- default FK behavior (blocks delete on any reference), so deleting a tour
-- event with even one linked booking/review/past-group-card fails with a
-- foreign key violation -- surfaced to the admin as a generic Server
-- Components render error. Switching to ON DELETE SET NULL: the tour event
-- can always be deleted, and the referencing record just loses that link
-- (it already stands on its own -- e.g. reviews keep landing_page_slug,
-- past_group_cards' tour_event_id was already optional in the admin form).
alter table bookings
  drop constraint if exists bookings_tour_event_id_fkey,
  add constraint bookings_tour_event_id_fkey
    foreign key (tour_event_id) references tour_events(id) on delete set null;

alter table reviews
  drop constraint if exists reviews_tour_event_id_fkey,
  add constraint reviews_tour_event_id_fkey
    foreign key (tour_event_id) references tour_events(id) on delete set null;

alter table past_group_cards
  drop constraint if exists past_group_cards_tour_event_id_fkey,
  add constraint past_group_cards_tour_event_id_fkey
    foreign key (tour_event_id) references tour_events(id) on delete set null;
