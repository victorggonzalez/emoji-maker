alter table public.emoji_likes
add constraint fk_emoji_likes_emoji
foreign key (emoji_id) references public.emojis(id) on delete cascade;
