-- ============================================================
-- 発注AI (HacchuAI) - データベーススキーマ
-- Supabase SQL Editor で実行してください
-- ============================================================

-- ユーザープロフィール（auth.users と連携）
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  company text,
  business_type text check (business_type in ('restaurant', 'supplier', 'other')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 新規ユーザー登録時に自動でプロフィールを作成するトリガー
-- エラーが発生してもユーザー登録自体は妨げない
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
    raise log 'handle_new_user failed for %: %', new.id, sqlerrm;
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 仕入先
create table if not exists suppliers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  categories text[] default '{}',
  area text,
  delivery_days text[] default '{}',
  minimum_order integer default 0,
  rating numeric(2,1) default 0,
  on_time_rate numeric(4,1) default 0,
  contact_phone text,
  contact_fax text,
  ai_reliability_score numeric(4,1) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 飲食店
create table if not exists restaurants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  genre text,
  area text,
  seats integer default 0,
  open_time text,
  close_time text,
  closed_days text,
  monthly_budget integer default 0,
  order_method text default 'ai_suggest',
  preferred_delivery_time text,
  monthly_order_volume integer default 0,
  primary_suppliers uuid[] default '{}',
  ai_automation_rate numeric(4,1) default 0,
  joined_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 商品
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  supplier_id uuid references suppliers on delete set null,
  name text not null,
  category text check (category in (
    'vegetables', 'fruits', 'meat', 'seafood', 'dairy',
    'dry_goods', 'frozen', 'beverages', 'alcohol'
  )),
  unit text not null default '個',
  current_price integer not null default 0,
  previous_price integer default 0,
  origin text,
  is_seasonal_peak boolean default false,
  stock_level integer default 0,
  min_stock_level integer default 0,
  lead_time_days integer default 1,
  ai_demand_forecast integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 注文
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  restaurant_id uuid references restaurants on delete set null,
  supplier_id uuid references suppliers on delete set null,
  restaurant_name text,
  supplier_name text,
  total_amount integer default 0,
  status text check (status in (
    'ai_suggested', 'pending_review', 'confirmed',
    'processing', 'shipped', 'delivered', 'invoiced'
  )) default 'ai_suggested',
  order_date date,
  delivery_date date,
  ai_confidence numeric(4,1) default 0,
  ai_savings integer default 0,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 注文明細
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders on delete cascade not null,
  product_id uuid references products on delete set null,
  product_name text not null,
  quantity numeric(10,2) not null default 0,
  unit text not null default '個',
  unit_price integer not null default 0,
  subtotal integer not null default 0,
  ai_suggested boolean default false,
  ai_reason text
);

-- 帳票（ドキュメント）
create table if not exists documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in (
    'order_sheet', 'delivery_note', 'invoice', 'receipt', 'price_list'
  )),
  file_name text not null,
  file_path text,
  status text check (status in (
    'uploaded', 'processing', 'extracted', 'verified', 'error'
  )) default 'uploaded',
  order_id uuid references orders on delete set null,
  extracted_data jsonb default '{}',
  confidence numeric(4,1) default 0,
  ai_summary text,
  uploaded_at timestamptz default now(),
  processed_at timestamptz
);

-- 価格変動履歴
create table if not exists price_changes (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products on delete cascade not null,
  product_name text not null,
  category text,
  old_price integer not null,
  new_price integer not null,
  change_percent numeric(5,1) not null,
  reason text,
  effective_date date default current_date,
  created_at timestamptz default now()
);

-- AIインサイト
create table if not exists ai_insights (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in (
    'cost_saving', 'demand_alert', 'quality_warning', 'trend', 'optimization'
  )),
  title text not null,
  description text,
  impact text check (impact in ('high', 'medium', 'low')) default 'medium',
  actionable boolean default false,
  suggested_action text,
  estimated_saving integer default 0,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS) - ユーザーごとのデータ分離
-- ============================================================

alter table profiles enable row level security;
alter table suppliers enable row level security;
alter table restaurants enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table documents enable row level security;
alter table price_changes enable row level security;
alter table ai_insights enable row level security;

-- profiles: 自分のプロフィールのみ閲覧・更新可能
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- suppliers: 自分が登録した仕入先のみ
create policy "suppliers_select_own" on suppliers for select using (auth.uid() = user_id);
create policy "suppliers_insert_own" on suppliers for insert with check (auth.uid() = user_id);
create policy "suppliers_update_own" on suppliers for update using (auth.uid() = user_id);
create policy "suppliers_delete_own" on suppliers for delete using (auth.uid() = user_id);

-- restaurants: 自分の飲食店のみ
create policy "restaurants_select_own" on restaurants for select using (auth.uid() = user_id);
create policy "restaurants_insert_own" on restaurants for insert with check (auth.uid() = user_id);
create policy "restaurants_update_own" on restaurants for update using (auth.uid() = user_id);
create policy "restaurants_delete_own" on restaurants for delete using (auth.uid() = user_id);

-- products: 自分の商品のみ
create policy "products_select_own" on products for select using (auth.uid() = user_id);
create policy "products_insert_own" on products for insert with check (auth.uid() = user_id);
create policy "products_update_own" on products for update using (auth.uid() = user_id);
create policy "products_delete_own" on products for delete using (auth.uid() = user_id);

-- orders: 自分の注文のみ
create policy "orders_select_own" on orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on orders for insert with check (auth.uid() = user_id);
create policy "orders_update_own" on orders for update using (auth.uid() = user_id);
create policy "orders_delete_own" on orders for delete using (auth.uid() = user_id);

-- order_items: 自分の注文に属する明細のみ
create policy "order_items_select_own" on order_items for select
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "order_items_insert_own" on order_items for insert
  with check (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "order_items_update_own" on order_items for update
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "order_items_delete_own" on order_items for delete
  using (exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

-- documents: 自分のドキュメントのみ
create policy "documents_select_own" on documents for select using (auth.uid() = user_id);
create policy "documents_insert_own" on documents for insert with check (auth.uid() = user_id);
create policy "documents_update_own" on documents for update using (auth.uid() = user_id);
create policy "documents_delete_own" on documents for delete using (auth.uid() = user_id);

-- price_changes: 自分の商品の価格変動のみ
create policy "price_changes_select_own" on price_changes for select
  using (exists (select 1 from products where products.id = price_changes.product_id and products.user_id = auth.uid()));

-- ai_insights: 自分のインサイトのみ
create policy "ai_insights_select_own" on ai_insights for select using (auth.uid() = user_id);
create policy "ai_insights_update_own" on ai_insights for update using (auth.uid() = user_id);

-- ============================================================
-- インデックス
-- ============================================================

create index if not exists idx_suppliers_user_id on suppliers(user_id);
create index if not exists idx_restaurants_user_id on restaurants(user_id);
create index if not exists idx_products_user_id on products(user_id);
create index if not exists idx_products_category on products(category);
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_order_date on orders(order_date);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_documents_user_id on documents(user_id);
create index if not exists idx_documents_status on documents(status);
create index if not exists idx_ai_insights_user_id on ai_insights(user_id);
create index if not exists idx_price_changes_product_id on price_changes(product_id);

-- ============================================================
-- updated_at 自動更新トリガー
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger set_suppliers_updated_at before update on suppliers for each row execute function update_updated_at();
create trigger set_restaurants_updated_at before update on restaurants for each row execute function update_updated_at();
create trigger set_products_updated_at before update on products for each row execute function update_updated_at();
create trigger set_orders_updated_at before update on orders for each row execute function update_updated_at();
