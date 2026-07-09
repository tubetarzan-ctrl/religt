insert into site_settings (key, value)
values ('announcement_bar_text', '"📢 Next Karbala group departs 14 Aug 2026 — only 6 seats left"'::jsonb)
on conflict (key) do nothing;
