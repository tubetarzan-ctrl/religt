-- Gallery Manager currently only supports uploaded images; admin wants to
-- also paste a YouTube URL/ID directly instead of uploading a file.
alter table gallery_images
  add column if not exists media_type text not null default 'image' check (media_type in ('image', 'youtube')),
  add column if not exists youtube_video_id text,
  alter column image_url drop not null,
  add constraint gallery_images_media_ref check (
    (media_type = 'image' and image_url is not null) or
    (media_type = 'youtube' and youtube_video_id is not null)
  );
