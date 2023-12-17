import { authOptions } from "@/lib/auth/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json();
  const client = new PrismaClient();
  await client.$connect();
  let record = await client.users.findFirst({
    where: {
      user_email: session?.user?.email as string,
    },
  });
  let newPassword: any = {
    password: body.password as string,
    password_key_id: body.password_key_id as number,
    password_owner_id: record?.user_id as number,
    password_title: body.password_name as string,
  };
  let pass = await client.passwords.create({
    data: newPassword,
  });
  if (record != null) {
    return NextResponse.json(pass);
  } else {
    return NextResponse.json({});
  }
}
