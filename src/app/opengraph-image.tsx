import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "発注AI - 飲食店の仕入れを、AIに置き換える";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#3b82f6",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            🍽
          </div>
          <span style={{ fontSize: "40px", fontWeight: "bold", color: "white" }}>
            発注AI
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            飲食店の仕入れを、AIに置き換える
          </span>
          <span
            style={{
              fontSize: "24px",
              color: "#93c5fd",
              textAlign: "center",
            }}
          >
            電話・FAX・Excel → AI自動発注・帳票処理・価格最適化
          </span>
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            marginTop: "48px",
            padding: "24px 48px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
          }}
        >
          {[
            { value: "45秒", label: "で全発注完了" },
            { value: "98%", label: "帳票処理精度" },
            { value: "¥12万+", label: "月間コスト削減" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "36px", fontWeight: "bold", color: "#60a5fa" }}>
                {stat.value}
              </span>
              <span style={{ fontSize: "16px", color: "#93c5fd" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <span
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "20px",
            color: "#64748b",
          }}
        >
          hacchu.net
        </span>
      </div>
    ),
    { ...size }
  );
}
