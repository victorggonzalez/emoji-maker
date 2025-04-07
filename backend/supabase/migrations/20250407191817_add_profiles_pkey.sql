-- Ensure the user_id column is unique and can be used as a primary key
-- (this will fail if any duplicate user_id rows exist)

alter table public.profiles
add constraint profiles_pkey primary key (user_id);
