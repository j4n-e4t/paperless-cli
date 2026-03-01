import { useState, useCallback, useRef } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "error" | "info";
}

let nextId = 0;

export function useToast(duration = 5000) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const addToast = useCallback(
    (message: string, type: "error" | "info" = "error") => {
      const id = nextId++;
      setToasts((t) => [...t, { id, message, type }]);
      const timer = setTimeout(() => {
        setToasts((t) => t.filter((toast) => toast.id !== id));
        timers.current.delete(id);
      }, duration);
      timers.current.set(id, timer);
    },
    [duration],
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  return { toasts, addToast, dismissToast };
}
