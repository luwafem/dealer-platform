import React from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/formatters';
import {
  Bell,
  Award,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';

const getIcon = (type) => {
  switch (type) {
    case 'badge':
      return <Award className="w-5 h-5 text-yellow-500" />;
    case 'payment':
      return <CreditCard className="w-5 h-5 text-green-500" />;
    case 'match':
      return <Bell className="w-5 h-5 text-blue-500" />;
    case 'credit_low':
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    case 'subscription_expiring':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    case 'sold':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

const NotificationItem = ({ notification, onClose }) => {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    // Navigate if there's a link in data
    if (notification.data?.link) {
      navigate(notification.data.link);
    }
    onClose?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.created_at)}</p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;