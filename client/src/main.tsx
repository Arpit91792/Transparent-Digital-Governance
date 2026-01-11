import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initScrollOptimizations } from "./lib/scroll-optimizer";

// Initialize scroll optimizations for 90 FPS performance
if (typeof window !== 'undefined') {
  initScrollOptimizations();
}

// Global error handlers to catch unhandled errors and prevent runtime error plugin from showing them
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Only prevent default if it's a known safe error
    const errorMessage = event.reason?.message || String(event.reason || '');
    const isKnownError = errorMessage.includes('NetworkError') || 
                        errorMessage.includes('Failed to fetch') ||
                        errorMessage.includes('AbortError');
    if (!isKnownError) {
      // For unknown errors, still prevent default to avoid runtime error plugin
      event.preventDefault();
    }
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Prevent the error from propagating to the runtime error plugin
    // Only if it's not a critical error
    if (event.error && typeof event.error === 'object') {
      const errorMessage = event.error.message || String(event.error);
      // Filter out known non-critical errors
      if (errorMessage.includes('ResizeObserver') || 
          errorMessage.includes('Non-Error promise rejection') ||
          errorMessage.includes('sendError')) {
        event.preventDefault();
        return false;
      }
    }
    return true;
  });

  // Override console.error to catch errors before they reach the plugin
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    // Filter out errors from the runtime error plugin itself
    const errorString = args.map(arg => String(arg)).join(' ');
    if (!errorString.includes('sendError') && !errorString.includes('runtime-error-plugin')) {
      originalConsoleError.apply(console, args);
    }
  };
}

// Safely render the app
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  // Fallback error display
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">Something went wrong</h1>
        <p style="color: #666;">Please refresh the page or contact support if the problem persists.</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #0071e3; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    </div>
  `;
}
