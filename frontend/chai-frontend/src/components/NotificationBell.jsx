import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { notificationAPI } from '../api/notification';
import { useSocket } from '../context/SocketContext';
import { formatTimeAgo } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const { socket, isConnected } = useSocket();

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Listen for real-time notifications
    useEffect(() => {
        if (!socket || !isConnected) return;

        const handleNewNotification = (notification) => {
            console.log('New notification received:', notification);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Show browser notification if permitted
            if (Notification.permission === 'granted') {
                new Notification(notification.message || 'New notification', {
                    icon: notification.sender?.avatar || '/logo.png',
                    body: notification.message
                });
            }
        };

        const handleNotificationRead = (data) => {
            setNotifications(prev =>
                prev.map(n =>
                    n._id === data.notificationId ? { ...n, isRead: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        };

        socket.on('notification', handleNewNotification);
        socket.on('notification_read', handleNotificationRead);

        return () => {
            socket.off('notification', handleNewNotification);
            socket.off('notification_read', handleNotificationRead);
        };
    }, [socket, isConnected]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Request notification permission
    useEffect(() => {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationAPI.getNotifications({ limit: 10 });
            if (response.data) {
                setNotifications(response.data.notifications || []);
                setUnreadCount(response.data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationAPI.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationAPI.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-secondary/50 transition-colors"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
                {isConnected && (
                    <span className="absolute bottom-1 right-1 h-2 w-2 bg-green-500 rounded-full border border-background"></span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    Loading...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification._id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-border text-center">
                                <Link
                                    to="/notifications"
                                    className="text-sm text-primary hover:underline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    View all notifications
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
    const getNotificationLink = () => {
        if (notification.video) {
            return `/watch/${notification.video._id || notification.video}`;
        }
        if (notification.sender) {
            return `/channel/${notification.sender.username}`;
        }
        return '#';
    };

    return (
        <Link
            to={getNotificationLink()}
            onClick={() => !notification.isRead && onMarkAsRead(notification._id)}
            className={`block p-4 hover:bg-secondary/30 transition-colors border-b border-border ${!notification.isRead ? 'bg-primary/5' : ''
                }`}
        >
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="shrink-0">
                    {notification.sender?.avatar ? (
                        <img
                            src={notification.sender.avatar}
                            alt={notification.sender.username}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                            {notification.sender?.username?.[0]?.toUpperCase() || 'N'}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed">
                        {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(notification.createdAt)}
                    </p>
                </div>

                {/* Unread indicator */}
                {!notification.isRead && (
                    <div className="shrink-0">
                        <div className="h-2 w-2 bg-primary rounded-full"></div>
                    </div>
                )}
            </div>

            {/* Video thumbnail if applicable */}
            {notification.video?.thumbnail && (
                <div className="mt-2 ml-13">
                    <img
                        src={notification.video.thumbnail}
                        alt={notification.video.title}
                        className="w-full h-20 object-cover rounded"
                    />
                </div>
            )}
        </Link>
    );
};

export default NotificationBell;
