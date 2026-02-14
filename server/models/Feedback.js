/**
 * Feedback / support ticket model
 */
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true },
    email: { type: String },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    category: { type: String, default: 'general' },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

feedbackSchema.index({ status: 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
