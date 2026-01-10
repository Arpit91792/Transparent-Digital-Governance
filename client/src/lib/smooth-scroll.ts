/**
 * Smooth scroll utilities optimized for 90 FPS performance
 */

/**
 * Throttle function for scroll events - optimized for 90 FPS (~11ms intervals)
 */
export function throttle90FPS<T extends (...args: any[]) => any>(
  func: T,
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  const interval = 11; // ~90 FPS (1000ms / 90 ≈ 11ms)
  
  return function(this: any, ...args: Parameters<T>) {
    const now = performance.now();
    if (now - lastTime >= interval) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * RequestAnimationFrame-based throttle for smooth 90 FPS animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T,
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
}

/**
 * Smoothly scrolls to an element with offset
 */
export function smoothScrollTo(element: HTMLElement | null, offset: number = 0) {
  if (!element) return;
  
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

/**
 * Smoothly scrolls to top of page
 */
export function smoothScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Optimized scroll handler using requestAnimationFrame
 */
export function createSmoothScrollHandler(
  callback: () => void,
  options: { passive?: boolean } = { passive: true }
) {
  let ticking = false;
  let rafId: number | null = null;
  
  const handler = () => {
    if (!ticking) {
      rafId = requestAnimationFrame(() => {
        callback();
        ticking = false;
        rafId = null;
      });
      ticking = true;
    }
  };
  
  return {
    handler,
    cleanup: () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    }
  };
}

