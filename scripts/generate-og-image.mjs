import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadFont() {
  // Use system Japanese fonts (TTF format, works reliably with satori)
  const fontPaths = [
    "/usr/share/fonts/opentype/ipafont-gothic/ipagp.ttf", // IPA P Gothic (proportional)
    "/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf",  // IPA Gothic
    "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf", // fallback
  ];

  for (const p of fontPaths) {
    if (existsSync(p)) {
      console.log("  Using system font:", p);
      return readFileSync(p);
    }
  }

  throw new Error("No Japanese TTF font found on system");
}

async function generateOGImage() {
  console.log("Generating OG image...");

  const fontData = loadFont();
  const fonts = [
    {
      name: "Noto Sans JP",
      data: fontData,
      weight: 700,
      style: "normal",
    },
  ];

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #142857 0%, #193f8f 40%, #1747b6 70%, #1b6ef5 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Noto Sans JP",
        },
        children: [
          // Background circle top-left
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: -80,
                left: -80,
                width: 350,
                height: 350,
                borderRadius: "50%",
                background: "rgba(51, 141, 255, 0.15)",
              },
            },
          },
          // Background circle bottom-right
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: -120,
                right: -80,
                width: 450,
                height: 450,
                borderRadius: "50%",
                background: "rgba(89, 176, 255, 0.1)",
              },
            },
          },
          // Main content
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "0 80px",
              },
              children: [
                // Badge
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 20px",
                      background: "rgba(51, 141, 255, 0.2)",
                      borderRadius: 30,
                      marginBottom: 32,
                      border: "1px solid rgba(51, 141, 255, 0.3)",
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#4ade80",
                          },
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: 16,
                            color: "rgba(188, 223, 255, 0.9)",
                            fontWeight: 700,
                          },
                          children: "AIネイティブ受発注プラットフォーム",
                        },
                      },
                    ],
                  },
                },
                // Logo + name
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 28,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: 52,
                            height: 52,
                            background: "#338dff",
                            borderRadius: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 20px rgba(51, 141, 255, 0.4)",
                          },
                          children: {
                            type: "span",
                            props: {
                              style: {
                                fontSize: 26,
                                color: "white",
                                fontWeight: 700,
                              },
                              children: "発",
                            },
                          },
                        },
                      },
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: 40,
                            fontWeight: 700,
                            color: "white",
                          },
                          children: "発注AI",
                        },
                      },
                    ],
                  },
                },
                // Main headline
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 50,
                      fontWeight: 700,
                      color: "white",
                      textAlign: "center",
                      lineHeight: 1.35,
                      marginBottom: 28,
                    },
                    children: "飲食店の仕入れを、AIに置き換える。",
                  },
                },
                // Sub text
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 20,
                      color: "rgba(188, 223, 255, 0.85)",
                      textAlign: "center",
                      marginBottom: 44,
                    },
                    children:
                      "電話注文・FAX・Excelに依存する受発注を、AIネイティブに変革",
                  },
                },
                // Stats
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      gap: 56,
                    },
                    children: [
                      { value: "95%", label: "電話発注削減" },
                      { value: "98%", label: "帳票処理精度" },
                      { value: "¥12万+", label: "月間コスト削減" },
                    ].map((stat) => ({
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              style: {
                                fontSize: 38,
                                fontWeight: 700,
                                color: "#8eccff",
                              },
                              children: stat.value,
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: {
                                fontSize: 14,
                                color: "rgba(188, 223, 255, 0.6)",
                                marginTop: 4,
                              },
                              children: stat.label,
                            },
                          },
                        ],
                      },
                    })),
                  },
                },
              ],
            },
          },
          // Domain
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: 28,
                right: 48,
                fontSize: 18,
                color: "rgba(142, 204, 255, 0.4)",
                fontWeight: 700,
              },
              children: "hacchu.net",
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outputPath = join(ROOT, "public", "og-image.png");
  writeFileSync(outputPath, pngBuffer);
  console.log(
    `✅ OG image saved to ${outputPath} (${(pngBuffer.length / 1024).toFixed(1)} KB)`
  );
}

generateOGImage().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
