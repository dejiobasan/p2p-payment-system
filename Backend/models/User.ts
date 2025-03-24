import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  balance: number;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 1000 }, // Initial balance
});

export default mongoose.model<IUser>("User", userSchema);
