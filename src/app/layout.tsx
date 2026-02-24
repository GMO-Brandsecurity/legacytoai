import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "発注AI - 飲食店向けAIネイティブ受発注プラットフォーム",
  description:
    "電話・FAX・Excelに依存する食品卸の受発注を、AIネイティブに変革。需要予測・自動発注・帳票処理・価格最適化で月間12万円以上のコスト削減を実現。",
  keywords: ["発注AI", "飲食店", "受発注", "食品卸", "AI", "需要予測", "自動発注", "帳票処理"],
  openGraph: {
    title: "発注AI - 飲食店の仕入れを、AIに置き換える",
    description:
      "毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理。すべてをAIネイティブに変革します。",
    url: "https://hacchu.net",
    siteName: "発注AI",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "発注AI - 飲食店の仕入れを、AIに置き換える",
    description:
      "毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理。すべてをAIネイティブに変革します。",
  },
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://hacchu.net"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
