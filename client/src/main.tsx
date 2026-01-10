import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initScrollOptimizations } from "./lib/scroll-optimizer";

// Initialize scroll optimizations for 90 FPS performance
if (typeof window !== 'undefined') {
  initScrollOptimizations();
}

// Global error handlers to catch unhandled errors
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent default browser error handling
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
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
