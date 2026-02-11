import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generatePresignedUrl } from "@/lib/s3";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const { contentType, fileSize } = await request.json();
    const result = await generatePresignedUrl(
      contentType,
      fileSize,
      session.user.id
    );
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "업로드에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
