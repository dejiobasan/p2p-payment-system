import mongoose, { Schema, Document } from "mongoose";

interface ITransaction extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  timestamp: { type: Date, default: Date.now },
});

const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
