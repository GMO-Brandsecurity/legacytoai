-- ============================================================
-- early_access テーブル追加マイグレーション
-- Supabase SQL Editor で実行してください
-- ============================================================

create table if not exists early_access (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  business_type text default 'restaurant',
  company_name text,
  created_at timestamptz default now()
);

alter table early_access enable row level security;

-- 匿名ユーザーからのINSERT/SELECTを許可
create policy "early_access_insert_anon" on early_access
  for insert with check (true);
create policy "early_access_select_anon" on early_access
  for select using (true);

-- インデックス
create index if not exists idx_early_access_email on early_access(email);
create index if not exists idx_early_access_created_at on early_access(created_at);
