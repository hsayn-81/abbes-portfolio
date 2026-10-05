import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import About from "@/models/About";

export async function GET() {
  try {
    await dbConnect();
    // Fetch the first/only About document
    const aboutData = await About.findOne({});
    return NextResponse.json(aboutData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Update the first document, or create it if it doesn't exist (upsert)
    const updatedAbout = await About.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });
    
    return NextResponse.json(updatedAbout);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}