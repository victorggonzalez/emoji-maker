create table if not exists public.profiles (
  user_id text not null,
  credits integer not null default 3,
  tier text not null default 'free',
  stripe_customer_id text null,
  stripe_subscription_id text null,
  created_at timestamp with time zone not null default current_timestamp,
  updated_at timestamp with time zone not null default current_timestamp,
  constraint profiles_tier_check check ((tier = any (array['free', 'pro'])))
);
