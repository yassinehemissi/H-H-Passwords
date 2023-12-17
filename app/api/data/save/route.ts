import { authOptions } from "@/lib/auth/AuthOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import fs from "fs";
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.formData();
  const client = new PrismaClient();
  await client.$connect();
  let record = await client.users.findFirst({
    where: {
      user_email: session?.user?.email as string,
    },
  });
  let file: File = body.get("file") as File;
  let text = await file.text();
  const d: { "COUNT(*)": string }[] =
    await client.$queryRaw`SELECT COUNT(*) FROM data;`;
  let record_id = (parseInt(d[0]["COUNT(*)"]) + 1).toString();
  await client.data.create({
    data: {
      data_title: body.get("data_name") as string,
      data_owner_id: record?.user_id,
      data_key_id: parseInt(body.get("data_key_id") as string),
      data_file_location: "/data/" + record_id + "-" + file.name,
    },
  });
  fs.writeFileSync("data/" + record_id + "-" + file.name, text);
  if (record != null) {
    return NextResponse.json({});
  } else {
    return NextResponse.json({});
  }
}
