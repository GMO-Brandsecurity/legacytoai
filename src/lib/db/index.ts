import { SupabaseClient } from "@supabase/supabase-js";
import {
  orders as mockOrders,
  products as mockProducts,
  restaurants as mockRestaurants,
  suppliers as mockSuppliers,
  documents as mockDocuments,
  aiInsights as mockAiInsights,
  dashboardStats as mockDashboardStats,
  priceChanges as mockPriceChanges,
} from "@/lib/data";
import type {
  Order,
  Product,
  Restaurant,
  Supplier,
  DocumentRecord,
  AIInsight,
  DashboardStats,
  PriceChange,
} from "@/lib/types";

// Helper: try Supabase first, fallback to mock data
async function withFallback<T>(
  supabase: SupabaseClient | null,
  queryFn: (sb: SupabaseClient) => Promise<T>,
  fallback: T
): Promise<T> {
  if (!supabase) return fallback;
  try {
    return await queryFn(supabase);
  } catch {
    return fallback;
  }
}

// --- Orders ---
export async function getOrders(supabase: SupabaseClient | null): Promise<Order[]> {
  return withFallback(supabase, async (sb) => {
    const { data: ordersData, error } = await sb
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error || !ordersData?.length) return mockOrders;

    return ordersData.map((o: Record<string, unknown>) => ({
      id: o.id as string,
      restaurantId: (o.restaurant_id || "") as string,
      restaurantName: (o.restaurant_name || "") as string,
      supplierId: (o.supplier_id || "") as string,
      supplierName: (o.supplier_name || "") as string,
      items: ((o.order_items as Record<string, unknown>[]) || []).map((item) => ({
        productId: (item.product_id || "") as string,
        productName: (item.product_name || "") as string,
        quantity: item.quantity as number,
        unit: (item.unit || "") as string,
        unitPrice: item.unit_price as number,
        subtotal: item.subtotal as number,
        aiSuggested: item.ai_suggested as boolean,
        aiReason: item.ai_reason as string | undefined,
      })),
      totalAmount: o.total_amount as number,
      status: o.status as Order["status"],
      orderDate: o.order_date as string,
      deliveryDate: o.delivery_date as string,
      aiConfidence: o.ai_confidence as number,
      aiSavings: o.ai_savings as number | undefined,
      note: o.note as string | undefined,
      createdAt: o.created_at as string,
    }));
  }, mockOrders);
}

// --- Create Order ---
export async function createOrder(
  supabase: SupabaseClient | null,
  userId: string,
  order: Order
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: "Database not configured" };

  const { error: orderError } = await supabase.from("orders").insert({
    id: order.id,
    user_id: userId,
    restaurant_id: order.restaurantId,
    restaurant_name: order.restaurantName,
    supplier_id: order.supplierId,
    supplier_name: order.supplierName,
    total_amount: order.totalAmount,
    status: order.status,
    order_date: order.orderDate,
    delivery_date: order.deliveryDate,
    ai_confidence: order.aiConfidence,
    ai_savings: order.aiSavings || 0,
    note: order.note || null,
  });

  if (orderError) return { success: false, error: orderError.message };

  if (order.items.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      order.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unitPrice,
        subtotal: item.subtotal,
        ai_suggested: item.aiSuggested,
        ai_reason: item.aiReason || null,
      }))
    );

    if (itemsError) return { success: false, error: itemsError.message };
  }

  return { success: true };
}

// --- Update Order Status ---
export async function updateOrderStatus(
  supabase: SupabaseClient | null,
  orderId: string,
  status: string,
  updates?: { delivery_date?: string; note?: string }
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: "Database not configured" };

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// --- Products ---
export async function getProducts(supabase: SupabaseClient | null): Promise<Product[]> {
  return withFallback(supabase, async (sb) => {
    const { data, error } = await sb
      .from("products")
      .select("*")
      .order("name");

    if (error || !data?.length) return mockProducts;

    return data.map((p: Record<string, unknown>) => ({
      id: p.id as string,
      name: p.name as string,
      category: p.category as Product["category"],
      unit: p.unit as string,
      currentPrice: p.current_price as number,
      previousPrice: p.previous_price as number,
      supplier: (p.supplier_id || "") as string,
      origin: (p.origin || "") as string,
      isSeasonalPeak: p.is_seasonal_peak as boolean,
      stockLevel: p.stock_level as number,
      minStockLevel: p.min_stock_level as number,
      leadTimeDays: p.lead_time_days as number,
      aiDemandForecast: p.ai_demand_forecast as number,
    }));
  }, mockProducts);
}

// --- Restaurants ---
export async function getRestaurants(supabase: SupabaseClient | null): Promise<Restaurant[]> {
  return withFallback(supabase, async (sb) => {
    const { data, error } = await sb
      .from("restaurants")
      .select("*")
      .order("name");

    if (error || !data?.length) return mockRestaurants;

    return data.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      name: r.name as string,
      genre: (r.genre || "") as string,
      area: (r.area || "") as string,
      seats: r.seats as number,
      monthlyOrderVolume: r.monthly_order_volume as number,
      primarySuppliers: (r.primary_suppliers || []) as string[],
      aiAutomationRate: r.ai_automation_rate as number,
      joinedAt: r.joined_at as string,
    }));
  }, mockRestaurants);
}

// --- Suppliers ---
export async function getSuppliers(supabase: SupabaseClient | null): Promise<Supplier[]> {
  return withFallback(supabase, async (sb) => {
    const { data, error } = await sb
      .from("suppliers")
      .select("*")
      .order("name");

    if (error || !data?.length) return mockSuppliers;

    return data.map((s: Record<string, unknown>) => ({
      id: s.id as string,
      name: s.name as string,
      categories: (s.categories || []) as Supplier["categories"],
      area: (s.area || "") as string,
      deliveryDays: (s.delivery_days || []) as string[],
      minimumOrder: s.minimum_order as number,
      rating: s.rating as number,
      onTimeRate: s.on_time_rate as number,
      contactPhone: (s.contact_phone || "") as string,
      contactFax: s.contact_fax as string | undefined,
      aiReliabilityScore: s.ai_reliability_score as number,
    }));
  }, mockSuppliers);
}

// --- Documents ---
export async function getDocuments(supabase: SupabaseClient | null): Promise<DocumentRecord[]> {
  return withFallback(supabase, async (sb) => {
    const { data, error } = await sb
      .from("documents")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error || !data?.length) return mockDocuments;

    return data.map((d: Record<string, unknown>) => ({
      id: d.id as string,
      type: d.type as DocumentRecord["type"],
      fileName: d.file_name as string,
      status: d.status as DocumentRecord["status"],
      orderId: d.order_id as string | undefined,
      uploadedAt: d.uploaded_at as string,
      processedAt: d.processed_at as string | undefined,
      extractedData: d.extracted_data as Record<string, string> | undefined,
      confidence: d.confidence as number | undefined,
      aiSummary: d.ai_summary as string | undefined,
    }));
  }, mockDocuments);
}

// --- AI Insights ---
export async function getAiInsights(supabase: SupabaseClient | null): Promise<AIInsight[]> {
  return withFallback(supabase, async (sb) => {
    const { data, error } = await sb
      .from("ai_insights")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error || !data?.length) return mockAiInsights;

    return data.map((i: Record<string, unknown>) => ({
      id: i.id as string,
      type: i.type as AIInsight["type"],
      title: i.title as string,
      description: (i.description || "") as string,
      impact: i.impact as AIInsight["impact"],
      actionable: i.actionable as boolean,
      suggestedAction: i.suggested_action as string | undefined,
      estimatedSaving: i.estimated_saving as number | undefined,
      createdAt: i.created_at as string,
    }));
  }, mockAiInsights);
}

// --- Dashboard Stats ---
export async function getDashboardStats(supabase: SupabaseClient | null): Promise<DashboardStats> {
  return withFallback(supabase, async (sb) => {
    // Aggregate from orders table
    const { count: totalOrders } = await sb
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { data: sumData } = await sb
      .from("orders")
      .select("total_amount, ai_savings");

    if (!totalOrders && !sumData?.length) return mockDashboardStats;

    const monthlyAmount = (sumData || []).reduce(
      (acc: number, o: Record<string, unknown>) => acc + (o.total_amount as number || 0),
      0
    );
    const totalSavings = (sumData || []).reduce(
      (acc: number, o: Record<string, unknown>) => acc + (o.ai_savings as number || 0),
      0
    );

    const { count: docCount } = await sb
      .from("documents")
      .select("*", { count: "exact", head: true });

    return {
      totalOrders: totalOrders || 0,
      monthlyOrderAmount: monthlyAmount,
      aiAutomationRate: 76,
      avgOrderTime: "45秒",
      documentsProcessed: docCount || 0,
      costSavingsThisMonth: totalSavings,
      faxesEliminated: 312,
      phoneCallsReplaced: 468,
    };
  }, mockDashboardStats);
}

// --- Price Changes ---
export async function getPriceChanges(supabase: SupabaseClient | null): Promise<PriceChange[]> {
  return withFallback(supabase, async (sb) => {
    const { data, error } = await sb
      .from("price_changes")
      .select("*")
      .order("effective_date", { ascending: false });

    if (error || !data?.length) return mockPriceChanges;

    return data.map((pc: Record<string, unknown>) => ({
      productId: pc.product_id as string,
      productName: pc.product_name as string,
      category: pc.category as PriceChange["category"],
      oldPrice: pc.old_price as number,
      newPrice: pc.new_price as number,
      changePercent: pc.change_percent as number,
      reason: (pc.reason || "") as string,
      effectiveDate: pc.effective_date as string,
    }));
  }, mockPriceChanges);
}

// --- Profile (for settings page) ---
export async function getProfile(supabase: SupabaseClient | null) {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return profile;
  } catch {
    return null;
  }
}

export async function updateProfile(
  supabase: SupabaseClient | null,
  updates: { name?: string; company?: string; business_type?: string }
) {
  if (!supabase) return { success: false };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    return { success: !error, error: error?.message };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
