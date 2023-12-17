import { authOptions } from "@/lib/auth/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import fs from "fs";
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const client = new PrismaClient();
  await client.$connect();
  let record = await client.users.findFirst({
    where: {
      user_email: session?.user?.email as string,
    },
  });

  let results = await client.data.findMany({
    select: {
      data_id: true,
      data_title: true,
      data_key_id: true,
      data_file_location: true,
    },
  });
  if (record != null) {
    return NextResponse.json(results);
  } else {
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const client = new PrismaClient();
  const body = await request.json();
  await client.$connect();
  let file = fs.readFileSync(body.data_file_location.replace("/", ""));
  let text = file.toString("utf-8");
  return NextResponse.json({
    file: text,
  });
}
