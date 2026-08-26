import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, default: "General" },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    poster: { type: String, default: "" }, // path to uploaded image
    capacity: { type: Number, required: true, default: 100 },
    registeredCount: { type: Number, default: 0 },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

eventSchema.virtual("seatsLeft").get(function () {
  return Math.max(this.capacity - this.registeredCount, 0);
});
eventSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Event", eventSchema);
