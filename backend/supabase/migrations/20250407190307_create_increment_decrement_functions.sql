create or replace function public.increment(row_id bigint)
returns void
language plpgsql
as $$
begin
  update public.emojis
  set likes_count = likes_count + 1
  where id = row_id;
end;
$$;

create or replace function public.decrement(row_id bigint)
returns void
language plpgsql
as $$
begin
  update public.emojis
  set likes_count = greatest(likes_count - 1, 0)
  where id = row_id;
end;
$$;
