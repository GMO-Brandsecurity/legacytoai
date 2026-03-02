import Link from "next/link";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed className="w-8 h-8 text-brand-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-500 mb-8">
          お探しのページは移動または削除された可能性があります。
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Link>
      </div>
    </div>
  );
}
