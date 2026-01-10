-- Create habits table
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  title text not null,
  description text,
  category_id text,
  frequency text not null default 'daily',
  target_count integer not null default 1,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create habit_logs table
create table habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null default auth.uid(),
  habit_id uuid references habits on delete cascade not null,
  date text not null, -- YYYY-MM-DD
  count integer not null default 1,
  created_at timestamp with time zone default now()
);

-- Enable RLS (Row Level Security)
alter table habits enable row level security;
alter table habit_logs enable row level security;

-- Policies for habits
create policy "Users can view their own habits"
  on habits for select
  using ( (select auth.uid()) = user_id );

create policy "Users can insert their own habits"
  on habits for insert
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own habits"
  on habits for update
  using ( (select auth.uid()) = user_id );

create policy "Users can delete their own habits"
  on habits for delete
  using ( (select auth.uid()) = user_id );

-- Policies for habit_logs
create policy "Users can view their own logs"
  on habit_logs for select
  using ( (select auth.uid()) = user_id );

create policy "Users can insert their own logs"
  on habit_logs for insert
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own logs"
  on habit_logs for update
  using ( (select auth.uid()) = user_id );

create policy "Users can delete their own logs"
  on habit_logs for delete
  using ( (select auth.uid()) = user_id );
