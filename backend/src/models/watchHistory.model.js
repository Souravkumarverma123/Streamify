import mongoose, { Schema } from "mongoose";

const watchHistorySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true
        },
        watchedAt: {
            type: Date,
            default: Date.now
        },
        progress: {
            type: Number, // Progress in seconds
            default: 0
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Compound index for efficient queries
watchHistorySchema.index({ user: 1, watchedAt: -1 });
watchHistorySchema.index({ user: 1, video: 1 }, { unique: true });

export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);
