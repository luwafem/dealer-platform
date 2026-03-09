import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import { Bell, CheckCheck } from 'lucide-react';

const NotificationList = ({ onClose }) => {
  const { notifications, unreadCount, markAllAsRead, loading } = useNotifications();

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="sticky top-0 bg-white px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-semibold flex items-center">
          <Bell size={16} className="mr-2" />
          Notifications
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <CheckCheck size={16} className="mr-1" />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No notifications</div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClose={onClose}
          />
        ))
      )}
    </div>
  );
};

export default NotificationList;