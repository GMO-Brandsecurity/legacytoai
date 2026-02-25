import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "発注AI - 飲食店向けAIネイティブ受発注プラットフォーム",
  description:
    "電話・FAX・Excelに依存する食品卸の受発注を、AIネイティブに変革。需要予測・自動発注・帳票処理・価格最適化で月間12万円以上のコスト削減を実現。",
  keywords: [
    "発注AI",
    "飲食店",
    "受発注",
    "食品卸",
    "AI",
    "需要予測",
    "自動発注",
    "帳票処理",
    "飲食店DX",
    "食品流通",
    "AI発注",
  ],
  openGraph: {
    title: "発注AI - 飲食店の仕入れを、AIに置き換える",
    description:
      "毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理。すべてをAIネイティブに変革します。",
    url: "https://hacchu.net",
    siteName: "発注AI",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://hacchu.net/og-image.png",
        width: 1200,
        height: 630,
        alt: "発注AI - 飲食店向けAIネイティブ受発注プラットフォーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "発注AI - 飲食店の仕入れを、AIに置き換える",
    description:
      "毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理。すべてをAIネイティブに変革します。",
    images: ["https://hacchu.net/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  metadataBase: new URL("https://hacchu.net"),
  alternates: {
    canonical: "https://hacchu.net",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "発注AI",
  applicationCategory: "BusinessApplication",
  description:
    "飲食店向けAIネイティブ受発注プラットフォーム。電話・FAX・Excelを置き換え、需要予測・自動発注・帳票処理・価格最適化を実現。",
  url: "https://hacchu.net",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
    description: "早期アクセス無料登録受付中",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "47",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
