import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

export const GET = async (req: Request) => {
  try {
    if (!(await isAdmin())) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.query.lessons.findMany();

    return NextResponse.json(data, {
      headers: {
        "X-Total-Count": String(data.length),
        "Content-Range": `lessons 0-${data.length}/${data.length}`,
        "Access-Control-Expose-Headers": "Content-Range, X-Total-Count",
      },
    });
  } catch (error) {
    console.error("GET /api/lessons - error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


export const POST = async (req: Request) => {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = await db
    .insert(lessons)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
