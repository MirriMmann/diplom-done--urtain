import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    poster: { type: String }, 
    title: { type: String, required: true },  
    description: { type: String, required: true }, 
    date: { type: Date, required: true }, 
    time: { type: String, required: true },  
    location: { type: String, required: true },  
    price: { type: Number, required: true }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }]  
  },
  { timestamps: true }
);

const Show = mongoose.model("Show", showSchema);

export default Show;