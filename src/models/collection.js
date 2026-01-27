

import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true }, // Base64 સ્ટોર કરવા માટે
  },
  { timestamps: true },
);


const Collection =
  mongoose.models.Collection || mongoose.model("Collection", CollectionSchema);
export default Collection;
