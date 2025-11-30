import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from
    "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // cloudnary url
            required: true,
        },
        thumbnail: {
            type: String, // cloudnary url
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublished: {
            type: Boolean,
            default: true,
        },
        isShort: {
            type: Boolean,
            default: false,
        },
        videoType: {
            type: String,
            enum: ['long-form', 'short-form'],
            default: 'long-form'
        },
        aspectRatio: {
            type: String,
            enum: ['16:9', '9:16', '1:1', '4:3'],
            default: '16:9'
        },
        category: {
            type: String,
            enum: ['Programming', 'Design', 'Database', 'Entertainment', 'Gaming', 'Music', 'Education', 'Sports', 'News', 'Technology', 'Other'],
            default: 'Other'
        },
        tags: {
            type: [String],
            default: []
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, { timestamps: true })


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)