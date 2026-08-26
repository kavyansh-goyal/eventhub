import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticketId: { type: String, required: true, unique: true }, // uuid encoded into QR
    qrCode: { type: String, required: true }, // base64 data URL of QR image
    status: { type: String, enum: ["registered", "cancelled", "attended"], default: "registered" },
    attendedAt: { type: Date },
  },
  { timestamps: true }
);

registrationSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model("Registration", registrationSchema);
