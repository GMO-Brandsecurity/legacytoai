import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getDocuments } from "@/lib/db";
import { simulateDocumentProcessing } from "@/lib/ai/documents";

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const documents = await getDocuments(supabase);
  return NextResponse.json({ documents });
}

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const documents = await getDocuments(supabase);

  const body = await request.json();
  const { documentId } = body;

  const doc = documents.find((d) => d.id === documentId);
  if (!doc) {
    return NextResponse.json(
      { error: "帳票が見つかりません" },
      { status: 404 }
    );
  }

  const result = simulateDocumentProcessing(doc);
  return NextResponse.json({ result });
}
