-- Same issue as migration 0013, missed because journal_entries lives in the
-- accounting module (0002), not the core tables migration -- it also
-- references tour_events(id) with no ON DELETE behavior, blocking deletion
-- of any tour event with accounting entries against it (e.g. "Mashhad & Qom
-- Ziarat"). ON DELETE SET NULL: the journal entry (financial record) is kept
-- intact, it just loses the specific tour_event link.
alter table journal_entries
  drop constraint if exists journal_entries_tour_event_id_fkey,
  add constraint journal_entries_tour_event_id_fkey
    foreign key (tour_event_id) references tour_events(id) on delete set null;
