import { NextRequest, NextResponse } from "next/server";
import { products, restaurants } from "@/lib/data";
import { generateDemandForecast } from "@/lib/ai/matching";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { restaurantId, productId, targetDate } = body;

  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const product = products.find((p) => p.id === productId);

  if (!restaurant || !product) {
    return NextResponse.json(
      { error: "飲食店または商品が見つかりません" },
      { status: 404 }
    );
  }

  const forecast = generateDemandForecast(
    product,
    restaurant,
    targetDate || new Date().toISOString().split("T")[0]
  );

  return NextResponse.json({ forecast });
}
