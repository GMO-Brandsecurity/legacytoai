// ============================================================
// Error Reporter — 構造化エラーロギング
//
// 現在: console.error に出力
// 将来: Sentry, LogRocket, Datadog 等に差し替え可能
//
// 使い方:
//   import { reportError } from "@/lib/error-reporter";
//   reportError(error, { context: "OrdersPage", action: "createOrder" });
// ============================================================

interface ErrorContext {
  context?: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export function reportError(error: unknown, ctx?: ErrorContext): void {
  const timestamp = new Date().toISOString();
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  const payload = {
    timestamp,
    message,
    stack,
    ...ctx,
  };

  // Always log to console in development
  console.error("[発注AI Error]", payload);

  // Production: send to external service if configured
  if (process.env.NEXT_PUBLIC_ERROR_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_ERROR_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently fail — don't cause cascading errors
    });
  }
}
