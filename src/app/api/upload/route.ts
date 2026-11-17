import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      // Check for single file "file"
      const singleFile = formData.get("file") as File;
      if (singleFile) {
        files.push(singleFile);
      } else {
        return NextResponse.json({ error: "No files provided" }, { status: 400 });
      }
    }

    const isVercel = Boolean(process.env.VERCEL);
    const uploadedUrls: string[] = [];

    if (isVercel) {
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const mime = file.type || "image/jpeg";
        const base64Data = buffer.toString("base64");
        uploadedUrls.push(`data:${mime};base64,${base64Data}`);
      }
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const sanitizedName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .toLowerCase();
        const uniqueFileName = `${Date.now()}_${sanitizedName}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        fs.writeFileSync(filePath, buffer);
        uploadedUrls.push(`/uploads/${uniqueFileName}`);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      url: uploadedUrls[0],
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
