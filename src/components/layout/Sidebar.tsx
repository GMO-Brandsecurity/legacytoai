"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/orders", label: "発注・AI提案", icon: ShoppingCart },
  { href: "/suppliers", label: "仕入先", icon: Store },
  { href: "/documents", label: "帳票処理", icon: FileText },
  { href: "/pricing", label: "価格・在庫AI", icon: TrendingUp },
  { href: "/admin", label: "要望管理", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-950 text-white flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-brand-800">
        <Link href="/" className="flex items-center gap-3">
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
      </div>
    </aside>
  );
}
