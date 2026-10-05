import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    _id: { type: String }, // Custom string _id support
    index: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    year: { type: String, required: true },
    client: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String, required: true },
    gallery: [{ type: String }],
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);