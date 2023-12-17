import { authOptions } from "@/lib/auth/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const owner = body.key_owner;
  const client = new PrismaClient();
  await client.$connect();
  let record = await client.users.findFirst({ where: { user_email: owner } });
  if (record == null) {
    record = await client.users.create({
      data: {
        user_email: owner,
        user_name: session?.user?.name as string,
      },
    });
  }
  body.key_owner = record.user_id;
  if (body.key_type == 0){
    body.signature
  }
  const new_key = await client.keys.create({ data: body });
  return NextResponse.json(new_key);
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const client = new PrismaClient();
  await client.$connect();
  let record = await client.users.findFirst({
    where: { user_email: session?.user?.email as string },
  });
  if (record == null) {
    return NextResponse.json({});
  }
  const keys = await client.keys.findMany({
    select: { key_id: true, key_name: true, key_type: true },
  });
  let result: any = keys;
  result = result.map((key: any) => {
    key.key_loaded = false;
    return key;
  });
  return NextResponse.json(result);
}
