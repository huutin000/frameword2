"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type = "info", message, title = "", duration = 3500 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, type, message, title };

      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 toasts to avoid clutter

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const contextValue = useMemo(
    () => ({
      toast: addToast,
      success: (message, title) => addToast({ type: "success", message, title }),
      error: (message, title) => addToast({ type: "error", message, title }),
      warning: (message, title) => addToast({ type: "warning", message, title }),
      info: (message, title) => addToast({ type: "info", message, title }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {/* Toast container portal */}
      <div className="toast-viewport" aria-live="assertive">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`site-toast toast-${item.type}`}
            role="alert"
          >
            <div className="toast-icon">
              {item.type === "success" && <i className="fa-solid fa-circle-check text-success"></i>}
              {item.type === "error" && <i className="fa-solid fa-circle-exclamation text-danger"></i>}
              {item.type === "warning" && <i className="fa-solid fa-triangle-exclamation text-warning"></i>}
              {item.type === "info" && <i className="fa-solid fa-circle-info text-primary"></i>}
            </div>
            <div className="toast-body">
              {item.title && <div className="toast-title">{item.title}</div>}
              <div className="toast-message">{item.message}</div>
            </div>
            <button
              type="button"
              className="toast-close"
              onClick={() => removeToast(item.id)}
              aria-label="Đóng thông báo"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return safe fallback so components can call it without crashing outside provider
    return {
      toast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    };
  }
  return context;
}

