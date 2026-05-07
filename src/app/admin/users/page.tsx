"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  Mail,
  Building2,
  Calendar,
  RefreshCw,
  Search,
} from "lucide-react";

interface EarlyAccessEntry {
  id: string;
  email: string;
  business_type: string;
  company_name: string | null;
  created_at: string;
}

interface ProfileEntry {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  business_type: string | null;
  created_at: string;
  updated_at: string;
}

const businessTypeLabels: Record<string, string> = {
  restaurant: "飲食店",
  supplier: "卸売業者",
  other: "その他",
};

export default function AdminUsersPage() {
  const [tab, setTab] = useState<"early" | "registered">("early");
  const [earlyAccess, setEarlyAccess] = useState<EarlyAccessEntry[]>([]);
  const [profiles, setProfiles] = useState<ProfileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("データの取得に失敗しました");
      const data = await res.json();
      setEarlyAccess(data.earlyAccess || []);
      setProfiles(data.profiles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEarly = earlyAccess.filter(
    (e) =>
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.company_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredProfiles = profiles.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.company || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-7 h-7 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        </div>
        <p className="text-gray-500">
          事前登録（早期アクセス）と会員登録済みユーザーの一覧を確認できます。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? "..." : earlyAccess.length}
              </div>
              <div className="text-sm text-gray-500">事前登録者</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? "..." : profiles.length}
              </div>
              <div className="text-sm text-gray-500">会員登録済み</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("early")}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
              tab === "early"
                ? "bg-brand-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            事前登録者
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === "early"
                  ? "bg-white/20"
                  : "bg-gray-100"
              }`}
            >
              {earlyAccess.length}
            </span>
          </button>
          <button
            onClick={() => setTab("registered")}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors flex items-center gap-2 ${
              tab === "registered"
                ? "bg-brand-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            会員登録済み
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab === "registered"
                  ? "bg-white/20"
                  : "bg-gray-100"
              }`}
            >
              {profiles.length}
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="検索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-brand-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="更新"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4 mb-4">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : tab === "early" ? (
        /* Early Access List */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {filteredEarly.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>事前登録者はまだいません</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      #
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        メール
                      </div>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        業種
                      </div>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      会社名
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        登録日
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEarly.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {entry.email}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-brand-100 text-brand-700 font-medium">
                          {businessTypeLabels[entry.business_type] ||
                            entry.business_type}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {entry.company_name || "-"}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(entry.created_at).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Registered Users List */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>会員登録済みユーザーはまだいません</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      #
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      名前
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        メール
                      </div>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        会社名
                      </div>
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      業種
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        登録日
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((user, idx) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {user.name || "-"}
                      </td>
                      <td className="px-5 py-3 text-gray-700">
                        {user.email || "-"}
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {user.company || "-"}
                      </td>
                      <td className="px-5 py-3">
                        {user.business_type ? (
                          <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                            {businessTypeLabels[user.business_type] ||
                              user.business_type}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(user.created_at).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
