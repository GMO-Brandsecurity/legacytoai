import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "発注AI - 飲食店向けAIネイティブ受発注プラットフォーム",
  description:
    "電話・FAX・スプレッドシートに依存する食品卸の受発注を、AIネイティブに変革する。需要予測・自動発注・帳票処理・価格最適化。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
