import { NextRequest, NextResponse } from "next/server";
import { generateUploadUrl } from "./s3";

export async function GET(request: NextRequest) {
    // Do whatever you want
    const url = await generateUploadUrl();
    return NextResponse.json({ uploadUrl: url }, { status: 200 });
    // return NextResponse.json({ uploadUrl: "abcd" }, { status: 200 });

  }
  