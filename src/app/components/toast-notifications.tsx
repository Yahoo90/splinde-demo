'use client';

import { useEffect } from 'react';
import { useNotifications, NotificationType } from './notification-provider';

interface ToastProps {
  id: string;
  message: string;
  type: NotificationType;
  onRemove: (id: string) => void;
}

function Toast({ id, message, type, onRemove }: ToastProps) {
  const getToastStyles = () => {
    const baseStyles = "relative p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform";
    return baseStyles;
  };

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: 'var(--color-green-50)',
          borderLeftColor: 'var(--color-green-500)',
          color: 'var(--color-green-800)',
        };
      case 'error':
        return {
          backgroundColor: 'var(--color-red-50)',
          borderLeftColor: 'var(--color-red-500)',
          color: 'var(--color-red-800)',
        };
      case 'info':
      default:
        return {
          backgroundColor: 'var(--color-blue-50)',
          borderLeftColor: 'var(--color-blue-500)',
          color: 'var(--color-blue-800)',
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div 
      className={`${getToastStyles()} animate-slideInRight`}
      style={getToastStyle()}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg flex-shrink-0">{getIcon()}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 transition-all duration-200 hover:scale-110 p-1 rounded-full"
          style={{
            color: 'var(--color-gray-400)',
            backgroundColor: 'transparent',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-gray-600)';
            e.currentTarget.style.backgroundColor = 'var(--color-gray-100)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-gray-400)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Close notification"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>
    </div>
  );
}

export function ToastNotifications() {
  const { notifications, removeNotification } = useNotifications();

  console.log('Rendering toasts, count:', notifications.length); // Debug log

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            animationDelay: `${index * 100}ms` // Stagger the animations
          }}
        >
          <Toast
            id={notification.id}
            message={notification.message}
            type={notification.type}
            onRemove={removeNotification}
          />
        </div>
      ))}
    </div>
  );
} 