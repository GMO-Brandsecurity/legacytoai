import { NextRequest, NextResponse } from "next/server";
import { documents } from "@/lib/data";
import { simulateDocumentProcessing } from "@/lib/ai/documents";

export async function GET() {
  return NextResponse.json({ documents });
}

export async function POST(request: NextRequest) {
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
