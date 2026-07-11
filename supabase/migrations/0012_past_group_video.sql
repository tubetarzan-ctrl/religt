-- Past Group cards can now also carry a YouTube video (shown as a
-- click-to-play thumbnail on the landing page), same as gallery_images.
alter table past_group_cards
  add column if not exists youtube_video_id text;
