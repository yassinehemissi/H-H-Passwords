import { authOptions } from "@/lib/auth/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const client = new PrismaClient();
  await client.$connect();
  const record = await client.keys.findFirst({
    where: {
      key_name: body.key_name,
    },
    select: {
      key_signature: true,
    },
  });
  if (record != null) {
    return NextResponse.json(record);
  } else {
    return NextResponse.json({});
  }
}
