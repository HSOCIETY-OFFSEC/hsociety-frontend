/**
 * User model - auth and profile
 */
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'analyst', 'admin'],
      default: 'student',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otpSecret: { type: String, select: false },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: { type: String, select: false },
    twoFactorTempSecret: { type: String, select: false },
    twoFactorBackupCodes: { type: [String], select: false, default: [] },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
