"use client";

import { Bell, Search, Zap } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="商品・仕入先を検索..."
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-brand-300 focus:ring-1 focus:ring-brand-300 outline-none w-64 transition-colors"
            />
          </div>
          <button className="relative p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
            <Zap className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              5
            </span>
          </button>
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-brand-700">田</span>
          </div>
        </div>
      </div>
    </header>
  );
}
