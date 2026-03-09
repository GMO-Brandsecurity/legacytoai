-- ============================================================
-- 修正: handle_new_user() トリガー
--
-- 問題: Google OAuth でユーザー登録時に
-- 「Database error saving new user」エラーが発生
--
-- 原因: profiles テーブルへの INSERT が失敗すると
-- auth.users への INSERT もロールバックされる
--
-- 修正内容:
-- 1. ON CONFLICT で重複登録に対応
-- 2. EXCEPTION ハンドラーでエラー時もユーザー登録を継続
-- 3. NULL/空文字列の安全な処理
-- 4. business_type の CHECK 制約違反を防止
--
-- 使い方: Supabase Dashboard → SQL Editor で実行
-- ============================================================

-- まず profiles テーブルが存在するか確認（なければ作成）
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  company text,
  business_type text check (business_type in ('restaurant', 'supplier', 'other')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS を有効化（既に有効なら無視される）
alter table profiles enable row level security;

-- ポリシーが未作成の場合のみ作成
do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_select_own') then
    create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_update_own') then
    create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'profiles_insert_own') then
    create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);
  end if;
end $$;

-- トリガー関数を更新（エラーに強い版）
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email, company, business_type)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      split_part(new.email, '@', 1)
    ),
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'company',
    case
      when new.raw_user_meta_data->>'businessType' in ('restaurant', 'supplier', 'other')
      then new.raw_user_meta_data->>'businessType'
      else null
    end
  )
  on conflict (id) do update set
    name = coalesce(
      nullif(trim(new.raw_user_meta_data->>'name'), ''),
      nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
      excluded.name
    ),
    email = coalesce(new.email, excluded.email),
    updated_at = now();
  return new;
exception
  when others then
    -- ログに記録するが、ユーザー登録自体は妨げない
    raise log 'handle_new_user failed for user %: %', new.id, sqlerrm;
    return new;
end;
$$ language plpgsql security definer;

-- トリガーを再作成
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
