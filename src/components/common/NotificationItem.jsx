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
  const iconProps = { size: 20, strokeWidth: 2, className: 'text-black' };
  switch (type) {
    case 'badge':
      return <Award {...iconProps} />;
    case 'payment':
      return <CreditCard {...iconProps} />;
    case 'match':
      return <Bell {...iconProps} />;
    case 'credit_low':
      return <AlertTriangle {...iconProps} />;
    case 'subscription_expiring':
      return <AlertTriangle {...iconProps} />;
    case 'sold':
      return <CheckCircle {...iconProps} />;
    default:
      return <Bell {...iconProps} />;
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
      className={`px-4 py-3 border-b-2 border-black hover:bg-yellow-100 cursor-pointer ${
        !notification.read ? 'bg-yellow-50' : 'bg-white'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black uppercase tracking-tighter text-black">
            {notification.title}
          </p>
          <p className="text-sm font-bold text-gray-800 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs font-medium mt-1">{timeAgo(notification.created_at)}</p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-black border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;