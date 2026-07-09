-- =========================================================================
-- Chatbot knowledge: auto-sync from tour events/bookings + AI-answer cache.
-- source distinguishes manually-typed admin entries from rows the system
-- writes itself, so the sync job can safely delete-and-replace its own rows
-- without touching what the admin typed by hand.
-- =========================================================================

alter table chatbot_knowledge
  add column if not exists tour_event_id uuid references tour_events(id) on delete cascade,
  add column if not exists source text not null default 'manual'
    check (source in ('manual', 'tour_event_sync', 'ai_cache')),
  add column if not exists normalized_question text;

create index if not exists idx_chatbot_knowledge_tour_event_id on chatbot_knowledge(tour_event_id);
create index if not exists idx_chatbot_knowledge_source on chatbot_knowledge(source);
create index if not exists idx_chatbot_knowledge_normalized_question on chatbot_knowledge(normalized_question);
