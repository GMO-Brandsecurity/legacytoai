import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_TO = process.env.NOTIFICATION_EMAIL || "ryukozu@gmail.com";
const FROM_ADDRESS = process.env.NOTIFICATION_FROM || "発注AI <noreply@hacchu.net>";

interface EarlyAccessInfo {
  email: string;
  businessType?: string;
  companyName?: string;
  totalCount: number;
}

/**
 * 早期アクセス登録時に管理者へ通知メールを送信
 * RESEND_API_KEY と NOTIFICATION_EMAIL が未設定の場合はスキップ
 */
export async function notifyEarlyAccess(info: EarlyAccessInfo): Promise<void> {
  if (!resend || !NOTIFY_TO) return;

  const businessLabel =
    info.businessType === "restaurant" ? "飲食店" :
    info.businessType === "supplier" ? "仕入先" : info.businessType || "未指定";

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: NOTIFY_TO,
      subject: `[発注AI] 早期アクセス登録 #${info.totalCount} — ${info.email}`,
      html: `
        <h2>新規早期アクセス登録がありました</h2>
        <table style="border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">メール</td><td>${info.email}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">業種</td><td>${businessLabel}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">会社名</td><td>${info.companyName || "—"}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">累計登録数</td><td>${info.totalCount} 件</td></tr>
        </table>
      `,
    });
  } catch (err) {
    // メール送信失敗は登録処理に影響させない
    console.error("[notifyEarlyAccess] Failed to send email:", err);
  }
}
