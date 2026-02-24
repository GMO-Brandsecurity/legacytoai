import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data";
import { analyzePricing, optimizeInventory } from "@/lib/ai/pricing";

export async function GET() {
  const analyses = products.map((product) => ({
    product,
    priceAnalysis: analyzePricing(product),
    inventoryOptimization: optimizeInventory(product),
  }));

  return NextResponse.json({ analyses });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { productId } = body;

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return NextResponse.json(
      { error: "商品が見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    priceAnalysis: analyzePricing(product),
    inventoryOptimization: optimizeInventory(product),
  });
}
