"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  User,
  Bell,
  Building2,
  Link2,
  Brain,
  Save,
  CheckCircle2,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  ToggleLeft,
  ToggleRight,
  Key,
  Webhook,
  AlertCircle,
} from "lucide-react";

type SettingsTab = "profile" | "notifications" | "store" | "integrations";

const tabs: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "プロフィール", icon: User },
  { id: "notifications", label: "通知設定", icon: Bell },
  { id: "store", label: "店舗情報", icon: Building2 },
  { id: "integrations", label: "API連携", icon: Link2 },
];

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button onClick={onToggle} className="flex-shrink-0">
      {enabled ? (
        <ToggleRight className="w-8 h-8 text-brand-600" />
      ) : (
        <ToggleLeft className="w-8 h-8 text-gray-300" />
      )}
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [saved, setSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: "田中 太郎",
    email: "tanaka@hanamaru.jp",
    phone: "03-1234-5678",
    role: "オーナー",
  });

  // Notification state
  const [notifications, setNotifications] = useState({
    aiSuggestions: true,
    orderConfirm: true,
    priceAlerts: true,
    deliveryUpdates: true,
    weeklyReport: true,
    emailNotify: true,
    pushNotify: false,
    lineNotify: false,
  });

  // Store state
  const [store, setStore] = useState({
    name: "居酒屋 はなまる",
    genre: "居酒屋",
    address: "東京都渋谷区道玄坂1-2-3",
    seats: "45",
    openTime: "17:00",
    closeTime: "24:00",
    closedDays: "日曜日",
  });

  // Integration state
  const [integrations, setIntegrations] = useState({
    posSystem: false,
    accountingSoftware: false,
    lineOfficial: false,
    slackWebhook: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIntegration = (key: keyof typeof integrations) => {
    setIntegrations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <Header title="設定" subtitle="アカウント・通知・店舗情報・API連携の管理" />

      <div className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tab Navigation */}
          <div className="lg:w-56 flex-shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-brand-700">
                      {profile.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {profile.name}
                    </h3>
                    <span className="text-sm text-gray-500">{profile.role}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      氏名
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, name: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      メールアドレス
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, email: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      電話番号
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      パスワード変更
                    </label>
                    <div className="relative">
                      <Shield className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        placeholder="新しいパスワードを入力"
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      保存しました
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      変更を保存
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">通知設定</h3>
                <p className="text-sm text-gray-500 mb-6">
                  AIからの提案やアラートの通知方法を設定します
                </p>

                <div className="space-y-1 mb-8">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    通知する内容
                  </h4>
                  {[
                    {
                      key: "aiSuggestions" as const,
                      label: "AI発注提案",
                      desc: "AIが自動生成した発注提案を受け取る",
                    },
                    {
                      key: "orderConfirm" as const,
                      label: "発注確認",
                      desc: "発注の確定・出荷・納品の通知",
                    },
                    {
                      key: "priceAlerts" as const,
                      label: "価格アラート",
                      desc: "仕入れ価格の急変動を通知",
                    },
                    {
                      key: "deliveryUpdates" as const,
                      label: "配送状況",
                      desc: "配送ステータスの更新通知",
                    },
                    {
                      key: "weeklyReport" as const,
                      label: "週次レポート",
                      desc: "毎週月曜日に先週のサマリーを送信",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.label}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {item.desc}
                        </span>
                      </div>
                      <Toggle
                        enabled={notifications[item.key]}
                        onToggle={() => toggleNotification(item.key)}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    通知チャンネル
                  </h4>
                  {[
                    {
                      key: "emailNotify" as const,
                      label: "メール通知",
                      desc: "登録メールアドレスに通知",
                    },
                    {
                      key: "pushNotify" as const,
                      label: "プッシュ通知",
                      desc: "ブラウザのプッシュ通知",
                    },
                    {
                      key: "lineNotify" as const,
                      label: "LINE通知",
                      desc: "LINE公式アカウント経由で通知",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {item.label}
                        </span>
                        <span className="block text-xs text-gray-400">
                          {item.desc}
                        </span>
                      </div>
                      <Toggle
                        enabled={notifications[item.key]}
                        onToggle={() => toggleNotification(item.key)}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSave}
                  className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      保存しました
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      変更を保存
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Store Tab */}
            {activeTab === "store" && (
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">店舗情報</h3>
                <p className="text-sm text-gray-500 mb-6">
                  AI需要予測の精度向上に店舗情報が使用されます
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      店舗名
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={store.name}
                        onChange={(e) =>
                          setStore((s) => ({ ...s, name: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        業態
                      </label>
                      <select
                        value={store.genre}
                        onChange={(e) =>
                          setStore((s) => ({ ...s, genre: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none bg-white"
                      >
                        <option>居酒屋</option>
                        <option>イタリアン</option>
                        <option>寿司</option>
                        <option>中華</option>
                        <option>カフェ</option>
                        <option>フレンチ</option>
                        <option>和食</option>
                        <option>焼肉</option>
                        <option>ラーメン</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        座席数
                      </label>
                      <input
                        type="number"
                        value={store.seats}
                        onChange={(e) =>
                          setStore((s) => ({ ...s, seats: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      住所
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={store.address}
                        onChange={(e) =>
                          setStore((s) => ({ ...s, address: e.target.value }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        開店時間
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="time"
                          value={store.openTime}
                          onChange={(e) =>
                            setStore((s) => ({
                              ...s,
                              openTime: e.target.value,
                            }))
                          }
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        閉店時間
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="time"
                          value={store.closeTime}
                          onChange={(e) =>
                            setStore((s) => ({
                              ...s,
                              closeTime: e.target.value,
                            }))
                          }
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        定休日
                      </label>
                      <input
                        type="text"
                        value={store.closedDays}
                        onChange={(e) =>
                          setStore((s) => ({
                            ...s,
                            closedDays: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-brand-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-brand-600" />
                    <span className="text-xs text-brand-700 font-medium">
                      店舗情報はAI需要予測の精度に直結します。正確な情報を入力してください。
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      保存しました
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      変更を保存
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    外部サービス連携
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    POS・会計ソフト・コミュニケーションツールとの連携設定
                  </p>

                  <div className="space-y-4">
                    {[
                      {
                        key: "posSystem" as const,
                        label: "POSシステム連携",
                        desc: "売上データを自動取得し、AI需要予測の精度を向上",
                        icon: Globe,
                        status: "未接続",
                      },
                      {
                        key: "accountingSoftware" as const,
                        label: "会計ソフト連携",
                        desc: "freee / マネーフォワードとの仕入データ自動連携",
                        icon: Key,
                        status: "未接続",
                      },
                      {
                        key: "lineOfficial" as const,
                        label: "LINE公式アカウント",
                        desc: "AI提案・発注確認をLINEで受信",
                        icon: Bell,
                        status: "未接続",
                      },
                      {
                        key: "slackWebhook" as const,
                        label: "Slack / Webhook",
                        desc: "チーム向けの発注通知をSlackチャンネルに送信",
                        icon: Webhook,
                        status: "未接続",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {item.label}
                            </span>
                            <span className="block text-xs text-gray-400">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              integrations[item.key]
                                ? "bg-green-50 text-green-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {integrations[item.key] ? "接続中" : "未接続"}
                          </span>
                          <Toggle
                            enabled={integrations[item.key]}
                            onToggle={() => toggleIntegration(item.key)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Key Section */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    APIキー管理
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    外部システムから発注AIにアクセスするためのAPIキー
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2.5 font-mono text-sm text-gray-600 border border-gray-200">
                      hacchu_sk_••••••••••••••••••••3f7a
                    </div>
                    <button className="px-4 py-2.5 text-sm font-medium text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-50 transition-colors">
                      コピー
                    </button>
                    <button className="px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      再生成
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    APIキーは安全に管理してください。漏洩時は速やかに再生成してください。
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
