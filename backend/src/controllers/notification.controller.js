import { Notification } from "../models/notification.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { isValidObjectId } from "mongoose"

const getNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, unreadOnly = false } = req.query

    const query = { recipient: req.user._id }

    if (unreadOnly === 'true') {
        query.isRead = false
    }

    const notifications = await Notification.find(query)
        .populate('sender', 'username fullName avatar')
        .populate('video', 'title thumbnail')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await Notification.countDocuments(query)
    const unreadCount = await Notification.countDocuments({
        recipient: req.user._id,
        isRead: false
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {
            notifications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            },
            unreadCount
        }, "Notifications fetched successfully"))
})

const markAsRead = asyncHandler(async (req, res) => {
    const { notificationId } = req.params

    if (!isValidObjectId(notificationId)) {
        throw new ApiError(400, "Invalid notification ID")
    }

    const notification = await Notification.findById(notificationId)

    if (!notification) {
        throw new ApiError(404, "Notification not found")
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only mark your own notifications as read")
    }

    notification.isRead = true
    await notification.save()

    return res
        .status(200)
        .json(new ApiResponse(200, notification, "Notification marked as read"))
})

const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "All notifications marked as read"))
})

const deleteNotification = asyncHandler(async (req, res) => {
    const { notificationId } = req.params

    if (!isValidObjectId(notificationId)) {
        throw new ApiError(400, "Invalid notification ID")
    }

    const notification = await Notification.findById(notificationId)

    if (!notification) {
        throw new ApiError(404, "Notification not found")
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own notifications")
    }

    await Notification.findByIdAndDelete(notificationId)

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Notification deleted successfully"))
})

export {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
}
