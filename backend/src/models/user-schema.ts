import mongoose, { Schema } from "mongoose";

export interface User { 
    id: string;
    name?: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    isLoggedIn: boolean;
    isVerified: boolean;
}


export const userSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: true },
    avatar: { type: String, required: false },
    isLoggedIn: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});
userSchema.index({ id: 1, email: 1 });

export const UserModel = mongoose.model<User>('User', userSchema);