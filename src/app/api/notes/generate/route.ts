import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await req.json();
    if (
      !key ||
      typeof key !== "string" ||
      !key.startsWith(`uploads/${session.user.id}/`)
    ) {
      return NextResponse.json(
        { error: "Invalid or Forbidden S3 key" },
        { status: 403 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    if (!user || user.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 },
      );
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    const { Body } = await s3.send(command);
    if (!Body) {
      throw new Error("Failed to get file body from S3");
    }

    const pdfBuffer = await Body.transformToByteArray();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = process.env.PROMPT ?? "";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(pdfBuffer).toString("base64"),
          mimeType: "application/pdf",
        },
      },
    ]);
    const response = result.response;
    const notesMarkdown = response.text();

    const fileName = key.split("/").pop()!;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.creditHistory.create({
        data: {
          userId: session.user.id,
          details: `Generated notes for ${fileName}`,
          creditsUsed: 1,
        },
      }),
    ]);

    return NextResponse.json({ notes: notesMarkdown });
  } catch (error) {
    console.error("Error generating notes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
