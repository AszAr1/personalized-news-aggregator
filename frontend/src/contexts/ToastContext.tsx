// context/ToastContext.tsx
import { createContext, useContext, useState } from 'react';
import { Toast } from '../components/ToastComponent';

type ToastType = {
  message: string;
  type: 'error' | 'success';
};

type ToastContextType = {
  showToast: (toast: ToastType) => void;
};

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = ({ message, type }: ToastType) => {
    setToast({ message, type });
  };

  const handleDismiss = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={handleDismiss}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);