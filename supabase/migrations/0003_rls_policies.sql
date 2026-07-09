-- =========================================================================
-- Religious Tours — Row Level Security
-- Roles: super_admin, admin, accountant, sales_staff, guide, staff, customer
-- =========================================================================

create or replace function fn_current_role() returns text as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function fn_is_staff() returns boolean as $$
  select fn_current_role() in ('super_admin','admin','accountant','sales_staff','staff');
$$ language sql stable security definer;

create or replace function fn_is_accounting_role() returns boolean as $$
  select fn_current_role() in ('super_admin','admin','accountant');
$$ language sql stable security definer;

create or replace function fn_is_admin() returns boolean as $$
  select fn_current_role() in ('super_admin','admin');
$$ language sql stable security definer;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
alter table profiles enable row level security;
create policy "profiles_self_read" on profiles for select using (id = auth.uid() or fn_is_staff());
create policy "profiles_self_update" on profiles for update using (id = auth.uid() or fn_is_admin());
create policy "profiles_admin_insert" on profiles for insert with check (id = auth.uid() or fn_is_admin());

-- ---------------------------------------------------------------------
-- Public-readable marketing content (published only) + staff full access
-- ---------------------------------------------------------------------
alter table tour_events enable row level security;
create policy "tour_events_public_read" on tour_events for select using (true);
create policy "tour_events_staff_write" on tour_events for insert with check (fn_is_staff());
create policy "tour_events_staff_update" on tour_events for update using (fn_is_staff());
create policy "tour_events_admin_delete" on tour_events for delete using (fn_is_admin());

alter table gallery_images enable row level security;
create policy "gallery_public_read" on gallery_images for select using (visible = true or fn_is_staff());
create policy "gallery_staff_write" on gallery_images for insert with check (fn_is_staff());
create policy "gallery_staff_update" on gallery_images for update using (fn_is_staff());
create policy "gallery_staff_delete" on gallery_images for delete using (fn_is_staff());

alter table reviews enable row level security;
create policy "reviews_public_read" on reviews for select using (published = true or fn_is_staff());
create policy "reviews_public_submit" on reviews for insert with check (source = 'customer_submitted');
create policy "reviews_staff_write" on reviews for insert with check (fn_is_staff());
create policy "reviews_staff_update" on reviews for update using (fn_is_staff());
create policy "reviews_staff_delete" on reviews for delete using (fn_is_staff());

alter table blog_posts enable row level security;
create policy "blog_public_read" on blog_posts for select using (published = true or fn_is_staff());
create policy "blog_staff_write" on blog_posts for insert with check (fn_is_staff());
create policy "blog_staff_update" on blog_posts for update using (fn_is_staff());
create policy "blog_staff_delete" on blog_posts for delete using (fn_is_staff());

-- ---------------------------------------------------------------------
-- Bookings & travelers — customer sees own, staff sees all, guide sees assigned roster
-- ---------------------------------------------------------------------
alter table bookings enable row level security;
create policy "bookings_owner_read" on bookings for select using (customer_id = auth.uid() or fn_is_staff());
create policy "bookings_owner_insert" on bookings for insert with check (customer_id = auth.uid() or fn_is_staff());
create policy "bookings_staff_update" on bookings for update using (fn_is_staff());
create policy "bookings_admin_delete" on bookings for delete using (fn_is_admin());

alter table travelers enable row level security;
create policy "travelers_owner_read" on travelers for select using (
  exists (select 1 from bookings b where b.id = travelers.booking_id and b.customer_id = auth.uid())
  or fn_is_staff()
  or fn_current_role() = 'guide'
);
create policy "travelers_owner_write" on travelers for insert with check (
  exists (select 1 from bookings b where b.id = travelers.booking_id and b.customer_id = auth.uid())
  or fn_is_staff()
);
create policy "travelers_owner_update" on travelers for update using (
  exists (select 1 from bookings b where b.id = travelers.booking_id and b.customer_id = auth.uid())
  or fn_is_staff()
);
create policy "travelers_staff_delete" on travelers for delete using (fn_is_staff());

alter table payment_submissions enable row level security;
create policy "payments_owner_read" on payment_submissions for select using (
  exists (select 1 from bookings b where b.id = payment_submissions.booking_id and b.customer_id = auth.uid())
  or fn_is_staff()
);
create policy "payments_owner_insert" on payment_submissions for insert with check (
  exists (select 1 from bookings b where b.id = payment_submissions.booking_id and b.customer_id = auth.uid())
  or fn_is_staff()
);
create policy "payments_staff_update" on payment_submissions for update using (fn_is_staff());

-- ---------------------------------------------------------------------
-- Staff-only operational tables
-- ---------------------------------------------------------------------
alter table inquiries enable row level security;
create policy "inquiries_staff_all" on inquiries for all using (fn_is_staff()) with check (fn_is_staff());
create policy "inquiries_public_insert" on inquiries for insert with check (true);

alter table discount_codes enable row level security;
create policy "discount_codes_public_read_active" on discount_codes for select using (is_active = true or fn_is_staff());
create policy "discount_codes_staff_write" on discount_codes for all using (fn_is_staff()) with check (fn_is_staff());

alter table agents enable row level security;
create policy "agents_staff_all" on agents for all using (fn_is_staff()) with check (fn_is_staff());

alter table exchange_rates enable row level security;
create policy "exchange_rates_public_read" on exchange_rates for select using (true);
create policy "exchange_rates_staff_write" on exchange_rates for all using (fn_is_staff()) with check (fn_is_staff());

alter table chatbot_knowledge enable row level security;
create policy "chatbot_knowledge_staff_all" on chatbot_knowledge for all using (fn_is_staff()) with check (fn_is_staff());

alter table whatsapp_conversations enable row level security;
create policy "whatsapp_conv_staff_all" on whatsapp_conversations for all using (fn_is_staff()) with check (fn_is_staff());

alter table whatsapp_messages enable row level security;
create policy "whatsapp_msg_staff_all" on whatsapp_messages for all using (fn_is_staff()) with check (fn_is_staff());

alter table email_threads enable row level security;
create policy "email_threads_staff_all" on email_threads for all using (fn_is_staff()) with check (fn_is_staff());

alter table audit_log enable row level security;
create policy "audit_log_admin_read" on audit_log for select using (fn_is_admin());
create policy "audit_log_staff_insert" on audit_log for insert with check (fn_is_staff());

-- ---------------------------------------------------------------------
-- Accounting tables — accountant/admin only, sales_staff and guide locked out
-- ---------------------------------------------------------------------
alter table chart_of_accounts enable row level security;
create policy "coa_accounting_read" on chart_of_accounts for select using (fn_is_accounting_role());
create policy "coa_accounting_write" on chart_of_accounts for all using (fn_is_accounting_role()) with check (fn_is_accounting_role());

alter table vendors enable row level security;
create policy "vendors_accounting_all" on vendors for all using (fn_is_accounting_role()) with check (fn_is_accounting_role());

alter table journal_entries enable row level security;
create policy "je_accounting_read" on journal_entries for select using (fn_is_accounting_role());
create policy "je_accounting_write" on journal_entries for all using (fn_is_accounting_role()) with check (fn_is_accounting_role());

alter table journal_lines enable row level security;
create policy "jl_accounting_read" on journal_lines for select using (fn_is_accounting_role());
create policy "jl_accounting_write" on journal_lines for all using (fn_is_accounting_role()) with check (fn_is_accounting_role());

alter table accounting_periods enable row level security;
create policy "periods_accounting_read" on accounting_periods for select using (fn_is_accounting_role());
create policy "periods_admin_write" on accounting_periods for all using (fn_is_admin()) with check (fn_is_admin());

alter table fixed_assets enable row level security;
create policy "fixed_assets_accounting_all" on fixed_assets for all using (fn_is_accounting_role()) with check (fn_is_accounting_role());

alter table financial_notes enable row level security;
create policy "financial_notes_accounting_all" on financial_notes for all using (fn_is_accounting_role()) with check (fn_is_accounting_role());
