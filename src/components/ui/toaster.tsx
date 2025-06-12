import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (toasts.length > 0) {
        setToasts((prev) => prev.slice(1));
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`mb-2 rounded-lg p-4 shadow-lg ${
            toast.type === 'error'
              ? 'bg-red-500 text-white'
              : toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          <h3 className="font-semibold">{toast.title}</h3>
          {toast.description && <p className="text-sm">{toast.description}</p>}
        </div>
      ))}
    </div>
  );
}

export function toast(props: Omit<Toast, 'id'>) {
  const id = Math.random().toString(36).substring(7);
  const event = new CustomEvent('toast', { detail: { ...props, id } });
  window.dispatchEvent(event);
} 