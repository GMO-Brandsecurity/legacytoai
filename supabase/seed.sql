-- ============================================================
-- 発注AI (HacchuAI) - 開発用シードデータ
-- schema.sql を実行した後にこのファイルを実行してください
--
-- 注意: このファイルはテストユーザー (test@hacchu.net) のIDを
-- 仮のUUIDで挿入します。実際の auth.users ID に置き換えてください。
-- ============================================================

-- テスト用ユーザーID（実際のSupabase auth.users IDに置き換えてください）
-- 例: SELECT id FROM auth.users WHERE email = 'test@hacchu.net';
DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000001';
  -- supplier UUIDs
  s001 uuid := '11111111-0000-0000-0000-000000000001';
  s002 uuid := '11111111-0000-0000-0000-000000000002';
  s003 uuid := '11111111-0000-0000-0000-000000000003';
  s004 uuid := '11111111-0000-0000-0000-000000000004';
  s005 uuid := '11111111-0000-0000-0000-000000000005';
  s006 uuid := '11111111-0000-0000-0000-000000000006';
  -- product UUIDs
  p001 uuid := '22222222-0000-0000-0000-000000000001';
  p002 uuid := '22222222-0000-0000-0000-000000000002';
  p003 uuid := '22222222-0000-0000-0000-000000000003';
  p004 uuid := '22222222-0000-0000-0000-000000000004';
  p005 uuid := '22222222-0000-0000-0000-000000000005';
  p006 uuid := '22222222-0000-0000-0000-000000000006';
  p007 uuid := '22222222-0000-0000-0000-000000000007';
  p008 uuid := '22222222-0000-0000-0000-000000000008';
  p009 uuid := '22222222-0000-0000-0000-000000000009';
  p010 uuid := '22222222-0000-0000-0000-000000000010';
  p011 uuid := '22222222-0000-0000-0000-000000000011';
  p012 uuid := '22222222-0000-0000-0000-000000000012';
  -- restaurant UUID
  r001 uuid := '33333333-0000-0000-0000-000000000001';
  -- order UUIDs
  o001 uuid := '44444444-0000-0000-0000-000000000001';
  o002 uuid := '44444444-0000-0000-0000-000000000002';
  o003 uuid := '44444444-0000-0000-0000-000000000003';
BEGIN

-- ============================================================
-- 仕入先 (Suppliers)
-- ============================================================
INSERT INTO suppliers (id, user_id, name, categories, area, delivery_days, minimum_order, rating, on_time_rate, contact_phone, contact_fax, ai_reliability_score) VALUES
  (s001, test_user_id, '築地青果',         ARRAY['vegetables','fruits'],     '東京・築地', ARRAY['月','火','水','木','金','土'], 5000,  4.8, 97, '03-1234-5678', '03-1234-5679', 96),
  (s002, test_user_id, '豊洲水産',         ARRAY['seafood'],                 '東京・豊洲', ARRAY['月','火','水','木','金','土'], 10000, 4.9, 98, '03-2345-6789', '03-2345-6790', 98),
  (s003, test_user_id, 'チーズ工房ナカザワ', ARRAY['dairy'],                   '北海道・帯広', ARRAY['火','金'],                   8000,  4.7, 94, '0155-12-3456', '0155-12-3457', 90),
  (s004, test_user_id, '日本食肉卸',       ARRAY['meat'],                    '東京・品川', ARRAY['月','水','金'],               15000, 4.6, 95, '03-3456-7890', '03-3456-7891', 92),
  (s005, test_user_id, '酒のまるや',       ARRAY['beverages','alcohol'],     '東京・新宿', ARRAY['火','木','土'],               20000, 4.5, 92, '03-4567-8901', NULL,            88),
  (s006, test_user_id, '調味料の大黒',     ARRAY['dry_goods'],               '千葉・船橋', ARRAY['月','木'],                   3000,  4.4, 90, '047-123-4567', '047-123-4568', 85)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 飲食店 (Restaurants)
-- ============================================================
INSERT INTO restaurants (id, user_id, name, genre, area, seats, monthly_order_volume, ai_automation_rate) VALUES
  (r001, test_user_id, '居酒屋 はなまる', '居酒屋', '東京・渋谷', 45, 850000, 82)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 商品 (Products)
-- ============================================================
INSERT INTO products (id, user_id, supplier_id, name, category, unit, current_price, previous_price, origin, is_seasonal_peak, stock_level, min_stock_level, lead_time_days, ai_demand_forecast) VALUES
  (p001, test_user_id, s001, 'キャベツ',                 'vegetables', 'kg',    120,  98,   '群馬県',       false, 15, 20, 1, 30),
  (p002, test_user_id, s004, '豚バラ肉',                 'meat',       'kg',    980,  950,  '鹿児島県',     false, 8,  5,  1, 12),
  (p003, test_user_id, s002, 'サーモン（ノルウェー産）',   'seafood',    'kg',    2800, 2600, 'ノルウェー',   false, 3,  5,  2, 8),
  (p004, test_user_id, s001, '玉ねぎ',                   'vegetables', 'kg',    85,   80,   '北海道',       true,  25, 15, 1, 20),
  (p005, test_user_id, s004, '鶏もも肉',                 'meat',       'kg',    680,  700,  '宮崎県',       false, 12, 10, 1, 15),
  (p006, test_user_id, s005, 'アサヒスーパードライ 生樽20L', 'alcohol',  '本',    8500, 8500, '日本',         false, 2,  3,  2, 4),
  (p007, test_user_id, s002, '本マグロ 赤身',             'seafood',    'kg',    4200, 3800, '青森県大間',   true,  2,  3,  1, 5),
  (p008, test_user_id, s001, 'しめじ',                   'vegetables', 'パック', 150,  145,  '長野県',       false, 10, 8,  1, 12),
  (p009, test_user_id, s006, '特選醤油 1L',              'dry_goods',  '本',    450,  450,  '千葉県',       false, 6,  4,  3, 3),
  (p010, test_user_id, s003, 'モッツァレラチーズ',         'dairy',      'kg',    1800, 1750, '北海道',       false, 4,  5,  2, 7),
  (p011, test_user_id, NULL, '冷凍エビフライ 10尾',       'frozen',     'パック', 980,  980,  'ベトナム',     false, 8,  5,  3, 6),
  (p012, test_user_id, s001, 'にんじん',                 'vegetables', 'kg',    95,   110,  '千葉県',       true,  18, 10, 1, 15)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 注文 (Orders) — サンプル3件
-- ============================================================
INSERT INTO orders (id, user_id, restaurant_id, supplier_id, restaurant_name, supplier_name, total_amount, status, order_date, delivery_date, ai_confidence, ai_savings, note) VALUES
  (o001, test_user_id, r001, s001, '居酒屋 はなまる', '築地青果',         4625,  'ai_suggested',  '2024-12-19', '2024-12-20', 92, 380, '金曜夜の宴会需要を考慮したAI提案'),
  (o002, test_user_id, r001, s002, '居酒屋 はなまる', '豊洲水産',         29400, 'confirmed',     '2024-12-19', '2024-12-20', 88, 1200, NULL),
  (o003, test_user_id, r001, s004, '居酒屋 はなまる', '日本食肉卸',       21500, 'delivered',     '2024-12-17', '2024-12-18', 90, 0, NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 注文明細 (Order Items)
-- ============================================================
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit, unit_price, subtotal, ai_suggested, ai_reason) VALUES
  -- o001: 築地青果
  (o001, p001, 'キャベツ',   20, 'kg', 120, 2400, true,  '金曜の宴会予約が通常比+40%。キャベツ消費量の増加を予測'),
  (o001, p004, '玉ねぎ',     15, 'kg', 85,  1275, true,  '在庫が最低レベルに近づいています'),
  (o001, p012, 'にんじん',   10, 'kg', 95,  950,  false, NULL),
  -- o002: 豊洲水産
  (o002, p007, '本マグロ 赤身',           5, 'kg', 4200, 21000, true, '週末の予約状況と過去の消費パターンから算出'),
  (o002, p003, 'サーモン（ノルウェー産）', 3, 'kg', 2800, 8400,  true, '在庫が最低レベルを下回っています。緊急補充推奨'),
  -- o003: 日本食肉卸
  (o003, p002, '豚バラ肉',   15, 'kg', 980, 14700, true,  '角煮フェア開催中。通常の1.5倍の消費を予測'),
  (o003, p005, '鶏もも肉',   10, 'kg', 680, 6800,  false, NULL);

-- ============================================================
-- 帳票 (Documents) — サンプル2件
-- ============================================================
INSERT INTO documents (user_id, type, file_name, status, order_id, extracted_data, confidence, ai_summary, uploaded_at, processed_at) VALUES
  (test_user_id, 'delivery_note', '納品書_築地青果_20241218.pdf', 'verified', o001,
   '{"supplier":"築地青果","date":"2024/12/18","items":"キャベツ20kg, 玉ねぎ15kg, にんじん10kg","total":"¥4,625"}'::jsonb,
   98, '築地青果からの野菜3品目の納品書。合計¥4,625。注文と一致確認済み。',
   '2024-12-18T10:00:00Z', '2024-12-18T10:00:03Z'),
  (test_user_id, 'invoice', '請求書_豊洲水産_202412.pdf', 'extracted', NULL,
   '{"supplier":"豊洲水産","period":"2024年12月1日〜15日","total":"¥187,400","items_count":"23件"}'::jsonb,
   95, '豊洲水産の12月前半の請求書。23件の取引で合計¥187,400。',
   '2024-12-19T09:00:00Z', '2024-12-19T09:00:05Z');

-- ============================================================
-- 価格変動 (Price Changes)
-- ============================================================
INSERT INTO price_changes (product_id, product_name, category, old_price, new_price, change_percent, reason, effective_date) VALUES
  (p001, 'キャベツ',                 'vegetables', 98,   120,  22.4,  '冬場の出荷量減少',       '2024-12-15'),
  (p003, 'サーモン（ノルウェー産）',   'seafood',    2600, 2800, 7.7,   '世界的需要増・円安',     '2024-12-10'),
  (p007, '本マグロ 赤身',             'seafood',    3800, 4200, 10.5,  '年末需要・漁獲量減',     '2024-12-18'),
  (p005, '鶏もも肉',                 'meat',       700,  680,  -2.9,  '飼料価格安定',           '2024-12-12'),
  (p012, 'にんじん',                 'vegetables', 110,  95,   -13.6, '旬入りによる供給増',     '2024-12-14');

-- ============================================================
-- AIインサイト (AI Insights)
-- ============================================================
INSERT INTO ai_insights (user_id, type, title, description, impact, actionable, suggested_action, estimated_saving) VALUES
  (test_user_id, 'demand_alert',    '年末需要ピーク予測',       '12/27〜31にかけて全カテゴリで注文量が通常比180%になると予測。特に酒類と肉類の需要が顕著。', 'high',   true,  '年末特別発注を自動生成する',         45000),
  (test_user_id, 'cost_saving',     'にんじん価格下落トレンド', '千葉県産にんじんの市場価格が2週連続で下落中（-13.6%）。旬入りによる供給増が原因。',         'medium', true,  'にんじんの発注量を20%増やす',         2800),
  (test_user_id, 'quality_warning', 'サーモン価格高騰アラート', 'ノルウェー産サーモンの仕入値が先月比+7.7%。代替として北海道産トラウトサーモンへの切替検討。', 'high',   true,  '代替品の見積もりを取得する',         8400),
  (test_user_id, 'optimization',    '配送日の最適化提案',       '火曜日にまとめて発注すると配送コストを12%削減できます。',                                   'medium', true,  '火曜まとめ発注を設定する',           5600),
  (test_user_id, 'trend',           '鶏もも肉の値下がり傾向',  '宮崎県産鶏もも肉が3週連続で値下がり中。来月も安定した価格が続く見込みです。',               'low',    false, NULL,                                0);

END $$;
