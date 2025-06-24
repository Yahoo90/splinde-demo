'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const counterRef = useRef(0);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback((
    message: string, 
    type: NotificationType = 'info', 
    duration: number = 3000
  ) => {
    // Create a more unique ID using a counter + timestamp + random
    counterRef.current += 1;
    const id = `${Date.now()}-${counterRef.current}-${Math.random().toString(36).substr(2, 9)}`;
    const notification: Notification = { id, message, type, duration };
    
    console.log('Adding notification:', notification); // Debug log
    
    setNotifications(prev => {
      const newNotifications = [...prev, notification];
      console.log('New notifications array:', newNotifications); // Debug log
      return newNotifications;
    });
    
    if (duration > 0) {
      setTimeout(() => {
        console.log('Removing notification:', id); // Debug log
        removeNotification(id);
      }, duration);
    }
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
} 