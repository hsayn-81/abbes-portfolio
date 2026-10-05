import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ index: 1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Auto-generate unique string _id if not passed
    if (!body._id) {
      body._id = `proj_${Date.now()}`;
    }

    const newProject = await Project.create(body);
    console.log("✅ PROJECT CREATED IN MONGODB:", newProject._id);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("❌ CREATE PROJECT ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}