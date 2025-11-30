import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
        recipient: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        type: {
            type: String,
            enum: ['new_video', 'new_subscriber', 'like', 'comment'],
            required: true
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);
