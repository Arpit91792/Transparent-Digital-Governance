/**
 * Global scroll performance optimizer for 90 FPS
 * This module optimizes all scroll-related performance across the app
 */

/**
 * Initialize global scroll optimizations
 */
export function initScrollOptimizations() {
  // Optimize scroll performance globally
  if (typeof window !== 'undefined') {
    // Use passive event listeners for better scroll performance
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    // Optimize scroll event listeners
    const scrollOptimizations = {
      // Throttle scroll events using requestAnimationFrame
      handleScroll: (() => {
        let ticking = false;
        const callbacks: Set<() => void> = new Set();
        
        const rafHandler = () => {
          callbacks.forEach(cb => cb());
          ticking = false;
        };
        
        return {
          add: (callback: () => void) => {
            callbacks.add(callback);
            if (!ticking) {
              requestAnimationFrame(rafHandler);
              ticking = true;
            }
          },
          remove: (callback: () => void) => {
            callbacks.delete(callback);
          }
        };
      })()
    };
    
    // Optimize CSS for smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add performance hints
    const style = document.createElement('style');
    style.textContent = `
      /* Optimize scrolling performance */
      * {
        -webkit-overflow-scrolling: touch;
      }
      
      /* GPU acceleration for scroll containers */
      [data-scroll-container] {
        transform: translateZ(0);
        will-change: scroll-position;
      }
      
      /* Optimize fixed elements */
      [data-fixed] {
        transform: translateZ(0);
        will-change: transform;
      }
    `;
    document.head.appendChild(style);
    
    return scrollOptimizations;
  }
  
  return null;
}

/**
 * Optimize element for smooth scrolling
 */
export function optimizeForScroll(element: HTMLElement) {
  if (!element) return;
  
  // Add GPU acceleration
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform, scroll-position';
  element.style.backfaceVisibility = 'hidden';
  
  // Mark as scroll-optimized
  element.setAttribute('data-scroll-optimized', 'true');
}

