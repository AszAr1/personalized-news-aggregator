// components/Toast.tsx
import { useEffect, useState } from 'react';
import { X } from 'lucide-react'

type ToastProps = {
  message: string;
  type: 'error' | 'success';
  onDismiss?: () => void;
  duration?: number;
};

export const Toast = ({
  message,
  type = 'error',
  onDismiss,
  duration = 3000,
}: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${bgColor} text-white px-4 py-2 rounded-md shadow-lg flex items-center`}>
        <span>{message}</span>
        <button 
          onClick={() => setVisible(false)}
          className="ml-4 text-white hover:text-gray-200"
        >
          <X/>
        </button>
      </div>
    </div>
  );
};