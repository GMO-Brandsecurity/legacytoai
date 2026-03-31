import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "発注AI - 飲食店向けAIネイティブ受発注プラットフォーム",
    template: "%s | 発注AI",
  },
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
    "FAX廃止",
    "仕入れ効率化",
    "AI発注",
    "飲食店経営",
  ],
  openGraph: {
    title: "発注AI - 飲食店の仕入れを、AIに置き換える",
    description:
      "毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理。すべてをAIネイティブに変革。月間12万円以上のコスト削減を実現します。",
    url: "https://hacchu.net",
    siteName: "発注AI",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://hacchu.net/og-image.png",
        width: 1200,
        height: 630,
        alt: "発注AI - 飲食店の仕入れを、AIに置き換える",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "発注AI - 飲食店の仕入れを、AIに置き換える",
    description:
      "毎朝の電話注文、FAXの帳票やり取り、Excelの価格管理。すべてをAIネイティブに変革。月間12万円以上のコスト削減を実現します。",
    images: ["https://hacchu.net/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL("https://hacchu.net"),
  alternates: {
    canonical: "https://hacchu.net",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD 構造化データ
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "発注AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://hacchu.net",
  description:
    "飲食店向けAIネイティブ受発注プラットフォーム。電話・FAX・Excelを置き換え、月間12万円以上のコスト削減を実現。",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
    description: "早期アクセス無料登録",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "47",
    bestRating: "5",
  },
  provider: {
    "@type": "Organization",
    name: "発注AI",
    url: "https://hacchu.net",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "発注AI",
  url: "https://hacchu.net",
  logo: "https://hacchu.net/favicon.svg",
  description: "飲食店向けAIネイティブ受発注プラットフォーム",
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
