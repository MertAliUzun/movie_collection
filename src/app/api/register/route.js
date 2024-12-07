import { NextResponse } from "next/server";
import connectMongo from "@/libs/dbConnect";
import Client from "@/models/client";

export async function POST(req) {
  const { clientName, password } = await req.json();

  try {
    await connectMongo();

    // Kullanıcı adı zaten var mı kontrol et
    const existingClient = await Client.findOne({ clientName });
    if (existingClient) {
      return NextResponse.json(
        { error: "Client already exists" },
        { status: 400 }
      );
    }

    // Yeni kullanıcı oluştur
    const newClient = new Client({ clientName, password });
    await newClient.save();

    return NextResponse.json(
      { message: "Client registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
