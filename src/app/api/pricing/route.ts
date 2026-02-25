import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getProducts } from "@/lib/db";
import { analyzePricing, optimizeInventory } from "@/lib/ai/pricing";

export async function GET() {
  const supabase = await createSupabaseServer();
  const products = await getProducts(supabase);

  const analyses = products.map((product) => ({
    product,
    priceAnalysis: analyzePricing(product),
    inventoryOptimization: optimizeInventory(product),
  }));

  return NextResponse.json({ analyses });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const products = await getProducts(supabase);

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
