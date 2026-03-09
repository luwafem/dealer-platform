import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationItem from './NotificationItem';
import { Bell, CheckCheck } from 'lucide-react';

const NotificationList = ({ onClose }) => {
  const { notifications, unreadCount, markAllAsRead, loading } = useNotifications();

  return (
    <div className="max-h-96 overflow-y-auto bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white px-4 py-3 border-b-2 border-black flex items-center justify-between">
        <h3 className="font-black uppercase flex items-center text-sm tracking-tighter">
          <Bell size={16} className="mr-2" strokeWidth={2} />
          Notifications
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="border-2 border-black px-2 py-1 font-black uppercase text-xs hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center"
          >
            <CheckCheck size={14} className="mr-1" strokeWidth={2} />
            Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-4 text-center font-bold">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="p-4 text-center font-bold">No notifications</div>
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