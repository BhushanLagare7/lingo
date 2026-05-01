import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (req: Request) => {
  try {
    if (!(await isAdmin())) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.query.challengeOptions.findMany();

    return NextResponse.json(data, {
      headers: {
        "X-Total-Count": String(data.length),
        "Content-Range": `challengeOptions 0-${data.length}/${data.length}`,
        "Access-Control-Expose-Headers": "Content-Range, X-Total-Count",
      },
    });
  } catch (error) {
    console.error("GET /api/challengeOptions - error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  console.log("POST /api/challengeOptions - body:", JSON.stringify(body));

  try {
    const data = await db
      .insert(challengeOptions)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("POST /api/challengeOptions - error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
};
