import { authOptions } from "@/lib/auth/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const client = new PrismaClient();
  await client.$connect();
  let record = await client.users.findFirst({
    where: {
      user_email: session?.user?.email as string,
    },
  });
  let passwords = await client.passwords.findMany({
    select: {
      password_title: true,
      password_id: true,
      password: true,
      password_key_id: true,
    },
    where: {
      password_owner_id: record?.user_id,
    },
  });
  if (record != null) {
    return NextResponse.json(passwords);
  } else {
    return NextResponse.json({});
  }
}
