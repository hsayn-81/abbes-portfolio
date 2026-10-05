import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/models/Message";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Save into MongoDB
    const newMessage = await Message.create({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      read: false,
    });

    console.log("✅ MESSAGE SAVED TO MONGODB:", newMessage._id);

    return NextResponse.json(
      { success: true, data: newMessage },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ CONTACT POST ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Database write failed." },
      { status: 500 }
    );
  }
}