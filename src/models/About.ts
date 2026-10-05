import mongoose, { Schema, model, models } from "mongoose";

const AboutSchema = new Schema(
  {
    portraitImage: { type: String, default: "/images/me.png" },
    email: { type: String, default: "abbes.engineering@gmail.com" },
    headlineMain: { type: String, default: "SYSTEM" },
    headlineAccent: { type: String, default: "ARCHITECT." },
    bio: { type: String, required: true },
    stats: [
      {
        id: String,
        label: String,
        value: Number,
        suffix: String,
      },
    ],
    capabilities: [
      {
        id: String,
        title: String,
        desc: String,
      },
    ],
  },
  { timestamps: true }
);

export default models.About || model("About", AboutSchema);