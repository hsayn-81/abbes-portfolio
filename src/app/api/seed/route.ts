import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import About from "@/models/About";
import { projects } from "@/data/projects";
import { aboutData } from "@/data/about";

export async function GET() {
  try {
    await dbConnect();

    // Clear existing data & re-seed
    await Project.deleteMany({});
    await About.deleteMany({});

    await Project.insertMany(projects);
    await About.create(aboutData);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully with initial High-Voltage data!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}