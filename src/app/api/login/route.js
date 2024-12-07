import { NextResponse } from "next/server";
import connectMongo from "@/libs/dbConnect";
import Client from "@/models/client";

export async function POST(req) {
  const { clientName, password } = await req.json();

  try {
    await connectMongo();
    const client = await Client.findOne({ clientName, password });

    if (!client) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ clientName: client.clientName });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
