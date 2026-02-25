"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  ShoppingCart,
  Store,
  FileText,
  TrendingUp,
  UtensilsCrossed,
  Brain,
  MessageSquare,
  Menu,
  X,
  BarChart3,
  Download,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/orders", label: "発注・AI提案", icon: ShoppingCart },
  { href: "/suppliers", label: "仕入先", icon: Store },
  { href: "/documents", label: "帳票処理", icon: FileText },
  { href: "/pricing", label: "価格・在庫AI", icon: TrendingUp },
  { href: "/analytics", label: "分析レポート", icon: BarChart3 },
  { href: "/exports", label: "エクスポート", icon: Download },
  { href: "/admin", label: "要望管理", icon: MessageSquare },
  { href: "/settings", label: "設定", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      <div className="px-6 py-5 border-b border-brand-800">
        <Link href="/" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">発注AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-700 text-white"
                  : "text-brand-300 hover:bg-brand-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-brand-800">
        {user && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-brand-900/50">
            <p className="text-sm font-medium text-brand-200 truncate">{user.name}</p>
            <p className="text-xs text-brand-400 truncate">{user.email}</p>
          </div>
        )}
        <div className="bg-brand-900 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-semibold text-brand-300 uppercase">
              AI Engine
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-brand-200">全システム稼働中</span>
          </div>
          <div className="mt-2 text-xs text-brand-400">
            需要予測 &bull; 自動発注 &bull; 帳票処理
          </div>
        </div>
        {user && (
          <button
            onClick={() => { logout(); onNavigate?.(); }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-brand-300 hover:text-white hover:bg-brand-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            ログアウト
          </button>
        )}
      </div>
    </>
  );
}

export default function Sidebar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-brand-950 text-white flex items-center justify-between px-4 py-3 border-b border-brand-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold">発注AI</span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 text-brand-300 hover:text-white"
          aria-label="メニューを開く"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={clsx(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-brand-950 text-white flex flex-col transition-transform duration-300",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          className="absolute top-4 right-4 p-1 text-brand-400 hover:text-white"
          aria-label="メニューを閉じる"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-brand-950 text-white flex-col min-h-screen flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
