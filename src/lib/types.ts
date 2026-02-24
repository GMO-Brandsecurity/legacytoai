// ============================================================
// 発注AI (HacchuAI) - コア型定義
// 飲食店向け食品卸の受発注をAIネイティブに変革
// ============================================================

// --- 商品関連 ---

export type ProductCategory =
  | "vegetables"    // 野菜
  | "fruits"        // 果物
  | "meat"          // 肉類
  | "seafood"       // 魚介類
  | "dairy"         // 乳製品
  | "dry_goods"     // 乾物・調味料
  | "frozen"        // 冷凍食品
  | "beverages"     // 飲料
  | "alcohol";      // 酒類

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string;           // kg, 個, パック, 本, etc.
  currentPrice: number;   // 円
  previousPrice: number;
  supplier: string;
  origin: string;         // 産地
  isSeasonalPeak: boolean;
  stockLevel: number;     // 現在の在庫数
  minStockLevel: number;  // 最低在庫数
  leadTimeDays: number;   // 発注から納品までの日数
  aiDemandForecast: number; // AI予測の次回必要量
}

// --- 注文関連 ---

export type OrderStatus =
  | "ai_suggested"    // AI提案中
  | "pending_review"  // 確認待ち
  | "confirmed"       // 確定済み
  | "processing"      // 出荷準備中
  | "shipped"         // 配送中
  | "delivered"       // 納品済み
  | "invoiced";       // 請求済み

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  aiSuggested: boolean;
  aiReason?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate: string;
  aiConfidence: number;
  aiSavings?: number;
  note?: string;
  createdAt: string;
}

// --- 帳票関連 ---

export type DocumentType =
  | "order_sheet"       // 注文書
  | "delivery_note"     // 納品書
  | "invoice"           // 請求書
  | "receipt"           // 領収書
  | "price_list";       // 価格表

export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "extracted"
  | "verified"
  | "error";

export interface DocumentRecord {
  id: string;
  type: DocumentType;
  fileName: string;
  status: DocumentStatus;
  orderId?: string;
  uploadedAt: string;
  processedAt?: string;
  extractedData?: Record<string, string>;
  confidence?: number;
  aiSummary?: string;
}

// --- 飲食店 ---

export interface Restaurant {
  id: string;
  name: string;
  genre: string;
  area: string;
  seats: number;
  monthlyOrderVolume: number;
  primarySuppliers: string[];
  aiAutomationRate: number;
  joinedAt: string;
}

// --- 仕入先 ---

export interface Supplier {
  id: string;
  name: string;
  categories: ProductCategory[];
  area: string;
  deliveryDays: string[];
  minimumOrder: number;
  rating: number;
  onTimeRate: number;
  contactPhone: string;
  contactFax?: string;
  aiReliabilityScore: number;
}

// --- AI需要予測 ---

export interface DemandForecast {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  confidence: number;
  factors: string[];
  daysUntilStockout: number;
}

// --- AI洞察 ---

export interface AIInsight {
  id: string;
  type: "cost_saving" | "demand_alert" | "quality_warning" | "trend" | "optimization";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionable: boolean;
  suggestedAction?: string;
  estimatedSaving?: number;
  createdAt: string;
}

// --- ダッシュボード ---

export interface DashboardStats {
  totalOrders: number;
  monthlyOrderAmount: number;
  aiAutomationRate: number;
  avgOrderTime: string;
  documentsProcessed: number;
  costSavingsThisMonth: number;
  faxesEliminated: number;
  phoneCallsReplaced: number;
}

// --- 価格変動 ---

export interface PriceChange {
  productId: string;
  productName: string;
  category: ProductCategory;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  reason: string;
  effectiveDate: string;
}
