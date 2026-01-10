import { useState, useEffect } from "react";

// Helper function to get RGB color values for Tailwind colors
function getColorValue(colorName: string, shade: number, opacity: number): string {
  const colorMap: Record<string, Record<number, string>> = {
    blue: { 50: '239, 246, 255', 100: '219, 234, 254', 200: '191, 219, 254', 300: '147, 197, 253', 400: '96, 165, 250', 500: '59, 130, 246', 950: '23, 37, 84' },
    purple: { 50: '250, 245, 255', 100: '243, 232, 255', 200: '233, 213, 255', 300: '216, 180, 254', 400: '192, 132, 252', 500: '168, 85, 247', 950: '59, 7, 100' },
    pink: { 50: '253, 244, 255', 100: '250, 232, 255', 200: '245, 208, 254', 300: '240, 171, 252', 400: '244, 114, 182', 500: '236, 72, 153', 950: '80, 7, 36' },
    orange: { 50: '255, 247, 237', 100: '255, 237, 213', 200: '254, 215, 170', 300: '253, 186, 116', 400: '251, 146, 60', 500: '249, 115, 22', 950: '67, 20, 7' },
    emerald: { 50: '236, 253, 245', 100: '209, 250, 229', 200: '167, 243, 208', 300: '110, 231, 183', 400: '52, 211, 153', 500: '16, 185, 129', 950: '2, 44, 34' },
    teal: { 50: '240, 253, 250', 100: '204, 251, 241', 200: '153, 246, 228', 300: '94, 234, 212', 400: '45, 212, 191', 500: '20, 184, 166', 950: '19, 78, 74' },
    cyan: { 50: '236, 254, 255', 100: '207, 250, 254', 200: '165, 243, 252', 300: '103, 232, 249', 400: '34, 211, 238', 500: '6, 182, 212', 950: '22, 78, 99' },
    amber: { 50: '255, 251, 235', 100: '254, 243, 199', 200: '253, 230, 138', 300: '252, 211, 77', 400: '251, 191, 36', 500: '245, 158, 11', 950: '69, 26, 3' },
    yellow: { 50: '254, 252, 232', 100: '254, 249, 195', 200: '254, 240, 138', 300: '253, 224, 71', 400: '250, 204, 21', 500: '234, 179, 8', 950: '66, 32, 6' },
    rose: { 50: '255, 241, 242', 100: '255, 228, 230', 200: '254, 205, 211', 300: '253, 164, 175', 400: '251, 113, 133', 500: '244, 63, 94', 950: '76, 5, 25' },
    fuchsia: { 50: '253, 244, 255', 100: '250, 232, 255', 200: '245, 208, 254', 300: '240, 171, 252', 400: '232, 121, 249', 500: '217, 70, 239', 950: '74, 4, 78' },
    indigo: { 50: '238, 242, 255', 100: '224, 231, 255', 200: '199, 210, 254', 300: '165, 180, 252', 400: '129, 140, 248', 500: '99, 102, 241', 950: '30, 27, 75' },
    violet: { 50: '245, 243, 255', 100: '237, 233, 254', 200: '221, 214, 254', 300: '196, 181, 253', 400: '167, 139, 250', 500: '139, 92, 246', 950: '46, 16, 101' },
    green: { 50: '240, 253, 244', 100: '220, 252, 231', 200: '187, 247, 208', 300: '134, 239, 172', 400: '74, 222, 128', 500: '34, 197, 94', 950: '20, 83, 45' }
  };

  const color = colorMap[colorName] || colorMap.blue;
  let rgb: string | undefined = color[shade];
  
  if (!rgb) {
    const availableShades = Object.keys(color).map(Number).sort((a, b) => a - b);
    const closestShade = availableShades.reduce((prev, curr) => 
      Math.abs(curr - shade) < Math.abs(prev - shade) ? curr : prev
    );
    rgb = color[closestShade];
  }
  
  if (!rgb) {
    rgb = '96, 165, 250';
  }

  if (typeof rgb !== 'string') {
    rgb = '96, 165, 250';
  }

  const [r, g, b] = rgb.split(', ').map(Number);
  return `${Math.round(r * opacity)}, ${Math.round(g * opacity)}, ${Math.round(b * opacity)}`;
}

export function DynamicBackground() {
  const [orangeIntensity, setOrangeIntensity] = useState(0.2);
  const [bgColors, setBgColors] = useState({
    primary: 'blue',
    secondary: 'purple',
    accent: 'pink',
    intensity: 0.6,
    rotation: 0,
    blobScale1: 1,
    blobScale2: 1,
    blobScale3: 1
  });

  // Dynamic orange color intensity - optimized for 90 FPS
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const updateOrangeIntensity = () => {
      const now = performance.now();
      if (now - lastTime >= 11) {
        const wave1 = Math.sin(now / 2000) * 0.2;
        const wave2 = Math.cos(now / 1500) * 0.15;
        const wave3 = Math.sin(now / 4000) * 0.1;
        setOrangeIntensity(0.2 + wave1 + wave2 + wave3);
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(updateOrangeIntensity);
    };
    
    animationFrameId = requestAnimationFrame(updateOrangeIntensity);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Dynamic background color rotation - optimized for 90 FPS
  useEffect(() => {
    const colorSchemes = [
      { primary: 'blue', secondary: 'purple', accent: 'pink' },
      { primary: 'purple', secondary: 'pink', accent: 'orange' },
      { primary: 'emerald', secondary: 'teal', accent: 'cyan' },
      { primary: 'orange', secondary: 'amber', accent: 'yellow' },
      { primary: 'rose', secondary: 'pink', accent: 'fuchsia' },
      { primary: 'indigo', secondary: 'blue', accent: 'cyan' },
      { primary: 'violet', secondary: 'purple', accent: 'pink' },
      { primary: 'green', secondary: 'emerald', accent: 'teal' },
      { primary: 'cyan', secondary: 'blue', accent: 'indigo' },
      { primary: 'fuchsia', secondary: 'purple', accent: 'pink' }
    ];

    const transitionDuration = 5000;
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const updateColors = () => {
      const now = performance.now();
      if (now - lastTime >= 11) {
        const cyclePosition = (now % (colorSchemes.length * transitionDuration)) / transitionDuration;
        const currentIndex = Math.floor(cyclePosition);
        const nextIndex = (currentIndex + 1) % colorSchemes.length;
        const progress = cyclePosition % 1;

        const current = colorSchemes[currentIndex];
        const next = colorSchemes[nextIndex];

        const intensity1 = 0.5 + Math.sin(now / 1500) * 0.3;
        const intensity2 = 0.3 + Math.cos(now / 2500) * 0.25;
        const intensity3 = 0.1 + Math.sin(now / 4000) * 0.15;
        const intensity = Math.max(0.4, Math.min(0.9, (intensity1 + intensity2 + intensity3) / 3));

        const interpolateColor = (currentColor: string, nextColor: string, t: number) => {
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          if (eased < 0.5) return currentColor;
          return nextColor;
        };

        setBgColors({
          primary: interpolateColor(current.primary, next.primary, progress),
          secondary: interpolateColor(current.secondary, next.secondary, progress),
          accent: interpolateColor(current.accent, next.accent, progress),
          intensity: intensity,
          rotation: (now / 40) % 360,
          blobScale1: 1 + Math.sin(now / 2000) * 0.15,
          blobScale2: 1 + Math.cos(now / 2500) * 0.15,
          blobScale3: 1 + Math.sin(now / 3000) * 0.15
        });
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(updateColors);
    };
    
    animationFrameId = requestAnimationFrame(updateColors);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 gpu-accelerated" style={{ willChange: 'background-image, transform' }}>
      {/* Base Gradient Background */}
      <div 
        className="absolute inset-0 animate-gradient-xy gpu-accelerated"
        style={{
          backgroundImage: `linear-gradient(135deg, 
            rgba(${getColorValue(bgColors.primary, 100, bgColors.intensity)}, 0.8), 
            rgba(${getColorValue(bgColors.secondary, 100, bgColors.intensity * 0.95)}, 0.6), 
            rgba(${getColorValue(bgColors.accent, 100, bgColors.intensity)}, 0.7), 
            rgba(${getColorValue(bgColors.primary, 100, bgColors.intensity * 0.85)}, 0.65), 
            rgba(${getColorValue(bgColors.secondary, 100, bgColors.intensity * 0.75)}, 0.5), 
            rgba(${getColorValue(bgColors.accent, 100, bgColors.intensity * 0.95)}, 0.6)
          )`,
          transition: 'background-image 1s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundSize: '200% 200%',
          willChange: 'background-image, background-position'
        }}
      ></div>
      
      {/* Dynamic Color Wave Layer */}
      <div 
        className="absolute inset-0 animate-gradient-xy gpu-accelerated"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, 
            rgba(${getColorValue(bgColors.accent, 200, bgColors.intensity * 0.6)}, 0.4), 
            transparent 50%
          ),
          radial-gradient(circle at 70% 60%, 
            rgba(${getColorValue(bgColors.primary, 200, bgColors.intensity * 0.5)}, 0.35), 
            transparent 50%
          ),
          radial-gradient(circle at 50% 80%, 
            rgba(${getColorValue(bgColors.secondary, 200, bgColors.intensity * 0.55)}, 0.4), 
            transparent 50%
          )`,
          transition: 'background-image 1s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundSize: '200% 200%',
          animation: 'gradient-xy 20s ease infinite',
          willChange: 'background-image, background-position'
        }}
      ></div>
      
      {/* Dark Mode Base Gradient */}
      <div 
        className="absolute inset-0 animate-gradient-xy dark:opacity-100 opacity-0 gpu-accelerated"
        style={{
          backgroundImage: `linear-gradient(135deg, 
            rgba(${getColorValue(bgColors.primary, 950, bgColors.intensity * 0.3)}, 0.3), 
            rgba(${getColorValue(bgColors.secondary, 950, bgColors.intensity * 0.2)}, 0.2), 
            rgba(${getColorValue(bgColors.accent, 950, bgColors.intensity * 0.25)}, 0.25), 
            rgba(${getColorValue(bgColors.primary, 950, bgColors.intensity * 0.18)}, 0.18), 
            rgba(${getColorValue(bgColors.secondary, 950, bgColors.intensity * 0.15)}, 0.15), 
            rgba(${getColorValue(bgColors.accent, 950, bgColors.intensity * 0.2)}, 0.2)
          )`,
          transition: 'background-image 2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          willChange: 'background-image, opacity'
        }}
      ></div>
      
      {/* Secondary Gradient Layer */}
      <div 
        className="absolute inset-0 animate-gradient-xy animation-delay-2000 gpu-accelerated"
        style={{
          backgroundImage: `linear-gradient(45deg, 
            rgba(${getColorValue(bgColors.accent, 50, bgColors.intensity * 0.8)}, 0.5), 
            rgba(${getColorValue(bgColors.primary, 50, bgColors.intensity * 0.7)}, 0.45), 
            rgba(${getColorValue(bgColors.secondary, 50, bgColors.intensity * 0.6)}, 0.4), 
            rgba(${getColorValue(bgColors.accent, 50, bgColors.intensity * 0.75)}, 0.5)
          )`,
          transition: 'background-image 1s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundSize: '200% 200%',
          willChange: 'background-image'
        }}
      ></div>
      
      {/* Dynamic Color Overlay - Enhanced Rotating Gradient */}
      <div 
        className="absolute inset-0 gpu-accelerated"
        style={{
          backgroundImage: `conic-gradient(from ${bgColors.rotation}deg at 50% 50%, 
            rgba(${getColorValue(bgColors.primary, 300, bgColors.intensity * 0.4)}, 0.4), 
            rgba(${getColorValue(bgColors.secondary, 300, bgColors.intensity * 0.35)}, 0.35), 
            rgba(${getColorValue(bgColors.accent, 300, bgColors.intensity * 0.4)}, 0.4), 
            rgba(${getColorValue(bgColors.primary, 300, bgColors.intensity * 0.35)}, 0.35),
            rgba(${getColorValue(bgColors.accent, 300, bgColors.intensity * 0.3)}, 0.3)
          )`,
          transition: 'background-image 0.05s linear',
          mixBlendMode: 'overlay',
          opacity: 0.5 + bgColors.intensity * 0.2,
          willChange: 'background-image, transform'
        }}
      ></div>
      
      {/* Additional Rotating Gradient Layer */}
      <div 
        className="absolute inset-0 gpu-accelerated"
        style={{
          backgroundImage: `conic-gradient(from ${(bgColors.rotation * 1.5) % 360}deg at 30% 70%, 
            rgba(${getColorValue(bgColors.accent, 200, bgColors.intensity * 0.25)}, 0.25), 
            rgba(${getColorValue(bgColors.primary, 200, bgColors.intensity * 0.2)}, 0.2), 
            rgba(${getColorValue(bgColors.secondary, 200, bgColors.intensity * 0.25)}, 0.25)
          )`,
          transition: 'background-image 0.05s linear',
          mixBlendMode: 'screen',
          opacity: 0.3,
          willChange: 'background-image'
        }}
      ></div>
      
      {/* Dark Mode Secondary Gradient */}
      <div 
        className="absolute inset-0 animate-gradient-xy animation-delay-2000 dark:opacity-100 opacity-0 gpu-accelerated"
        style={{
          backgroundImage: `linear-gradient(45deg, 
            rgba(${getColorValue(bgColors.accent, 950, bgColors.intensity * 0.15)}, 0.15), 
            rgba(${getColorValue(bgColors.primary, 950, bgColors.intensity * 0.12)}, 0.12), 
            rgba(${getColorValue(bgColors.secondary, 950, bgColors.intensity * 0.1)}, 0.1), 
            rgba(${getColorValue(bgColors.accent, 950, bgColors.intensity * 0.12)}, 0.12)
          )`,
          transition: 'background-image 2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          willChange: 'background-image, opacity'
        }}
      ></div>
      
      {/* Light Orange Gradient Layer - Dynamic */}
      <div 
        className="absolute inset-0 bg-gradient-to-bl from-orange-100/60 via-amber-100/50 to-yellow-100/40 dark:from-orange-950/25 dark:via-amber-950/20 dark:to-yellow-950/15 animate-gradient-xy animation-delay-3000 gpu-accelerated"
        style={{ opacity: 0.4 + orangeIntensity * 0.6 }}
      ></div>
      
      {/* Additional Orange Gradient Layer - Dynamic */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-orange-200/40 via-amber-200/35 to-orange-100/30 dark:from-orange-900/15 dark:via-amber-900/12 dark:to-orange-800/10 animate-gradient-xy animation-delay-4000 gpu-accelerated"
        style={{ opacity: orangeIntensity * 0.8 }}
      ></div>
      
      {/* Animated Blob Shapes - Light Mode - Enhanced */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-blob dark:opacity-0 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.primary, 400, 1)}, ${0.35 + bgColors.intensity * 0.25})`,
          boxShadow: `0 0 300px rgba(${getColorValue(bgColors.primary, 400, 1)}, ${0.5 + bgColors.intensity * 0.3}), 0 0 500px rgba(${getColorValue(bgColors.primary, 300, 1)}, ${0.3 + bgColors.intensity * 0.2})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale1})`,
          willChange: 'transform, background-color, box-shadow'
        }}
      ></div>
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-2000 dark:opacity-0 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.secondary, 400, 1)}, ${0.35 + bgColors.intensity * 0.25})`,
          boxShadow: `0 0 300px rgba(${getColorValue(bgColors.secondary, 400, 1)}, ${0.5 + bgColors.intensity * 0.3}), 0 0 500px rgba(${getColorValue(bgColors.secondary, 300, 1)}, ${0.3 + bgColors.intensity * 0.2})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale2})`,
          willChange: 'transform, background-color, box-shadow'
        }}
      ></div>
      <div 
        className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-4000 dark:opacity-0 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.accent, 400, 1)}, ${0.35 + bgColors.intensity * 0.25})`,
          boxShadow: `0 0 300px rgba(${getColorValue(bgColors.accent, 400, 1)}, ${0.5 + bgColors.intensity * 0.3}), 0 0 500px rgba(${getColorValue(bgColors.accent, 300, 1)}, ${0.3 + bgColors.intensity * 0.2})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale3})`,
          willChange: 'transform, background-color, box-shadow'
        }}
      ></div>
      
      {/* Additional Dynamic Blob Shapes */}
      <div 
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-blob animation-delay-3000 dark:opacity-0 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.accent, 300, 1)}, ${0.25 + bgColors.intensity * 0.2})`,
          boxShadow: `0 0 250px rgba(${getColorValue(bgColors.accent, 300, 1)}, ${0.35 + bgColors.intensity * 0.2})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          willChange: 'background-color, box-shadow'
        }}
      ></div>
      <div 
        className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl animate-blob animation-delay-5000 dark:opacity-0 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.primary, 300, 1)}, ${0.25 + bgColors.intensity * 0.2})`,
          boxShadow: `0 0 250px rgba(${getColorValue(bgColors.primary, 300, 1)}, ${0.35 + bgColors.intensity * 0.2})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          willChange: 'background-color, box-shadow'
        }}
      ></div>
      
      {/* Animated Blob Shapes - Dark Mode - Enhanced */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-blob opacity-0 dark:opacity-100 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.primary, 500, 1)}, ${0.18 + bgColors.intensity * 0.12})`,
          boxShadow: `0 0 300px rgba(${getColorValue(bgColors.primary, 500, 1)}, ${0.25 + bgColors.intensity * 0.15}), 0 0 500px rgba(${getColorValue(bgColors.primary, 400, 1)}, ${0.15 + bgColors.intensity * 0.1})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale1})`,
          willChange: 'transform, background-color, box-shadow'
        }}
      ></div>
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-2000 opacity-0 dark:opacity-100 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.secondary, 500, 1)}, ${0.18 + bgColors.intensity * 0.12})`,
          boxShadow: `0 0 300px rgba(${getColorValue(bgColors.secondary, 500, 1)}, ${0.25 + bgColors.intensity * 0.15}), 0 0 500px rgba(${getColorValue(bgColors.secondary, 400, 1)}, ${0.15 + bgColors.intensity * 0.1})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale2})`,
          willChange: 'transform, background-color, box-shadow'
        }}
      ></div>
      <div 
        className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-0 dark:opacity-100 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.accent, 500, 1)}, ${0.18 + bgColors.intensity * 0.12})`,
          boxShadow: `0 0 300px rgba(${getColorValue(bgColors.accent, 500, 1)}, ${0.25 + bgColors.intensity * 0.15}), 0 0 500px rgba(${getColorValue(bgColors.accent, 400, 1)}, ${0.15 + bgColors.intensity * 0.1})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale3})`,
          willChange: 'transform, background-color, box-shadow'
        }}
      ></div>
      
      {/* Additional Dynamic Blob Shapes - Dark Mode */}
      <div 
        className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-blob animation-delay-3000 opacity-0 dark:opacity-100 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.accent, 500, 1)}, ${0.15 + bgColors.intensity * 0.1})`,
          boxShadow: `0 0 250px rgba(${getColorValue(bgColors.accent, 500, 1)}, ${0.2 + bgColors.intensity * 0.1})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          willChange: 'background-color, box-shadow'
        }}
      ></div>
      <div 
        className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl animate-blob animation-delay-5000 opacity-0 dark:opacity-100 gpu-accelerated"
        style={{
          backgroundColor: `rgba(${getColorValue(bgColors.primary, 500, 1)}, ${0.15 + bgColors.intensity * 0.1})`,
          boxShadow: `0 0 250px rgba(${getColorValue(bgColors.primary, 500, 1)}, ${0.2 + bgColors.intensity * 0.1})`,
          transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
          willChange: 'background-color, box-shadow'
        }}
      ></div>
      
      {/* Additional Colorful Blobs */}
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-6000 gpu-accelerated"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-8000 gpu-accelerated"></div>
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-blob animation-delay-3000 gpu-accelerated"></div>
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-blob animation-delay-5000 gpu-accelerated"></div>
      <div className="absolute top-2/3 left-2/3 w-56 h-56 bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-3xl animate-blob animation-delay-7000 gpu-accelerated"></div>
      <div className="absolute top-1/4 right-1/2 w-60 h-60 bg-rose-400/18 dark:bg-rose-500/9 rounded-full blur-3xl animate-blob animation-delay-9000 gpu-accelerated"></div>
      <div className="absolute bottom-1/2 left-1/2 w-68 h-68 bg-amber-400/18 dark:bg-amber-500/9 rounded-full blur-3xl animate-blob animation-delay-10000 gpu-accelerated"></div>
      
      {/* Light Orange Blobs - Dynamic */}
      <div 
        className="absolute top-1/6 right-1/6 w-80 h-80 bg-orange-300/35 dark:bg-orange-400/18 rounded-full blur-3xl animate-blob animation-delay-1500 gpu-accelerated"
        style={{ opacity: 0.5 + orangeIntensity * 1.2 }}
      ></div>
      <div 
        className="absolute bottom-1/6 left-1/3 w-96 h-96 bg-orange-200/40 dark:bg-orange-300/20 rounded-full blur-3xl animate-blob animation-delay-3500 gpu-accelerated"
        style={{ opacity: 0.4 + orangeIntensity * 1.0 }}
      ></div>
      <div 
        className="absolute top-3/4 right-1/3 w-72 h-72 bg-amber-300/30 dark:bg-amber-400/15 rounded-full blur-3xl animate-blob animation-delay-5500 gpu-accelerated"
        style={{ opacity: 0.5 + orangeIntensity * 1.1 }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/6 w-64 h-64 bg-orange-400/28 dark:bg-orange-500/14 rounded-full blur-3xl animate-blob animation-delay-7500 gpu-accelerated"
        style={{ opacity: 0.3 + orangeIntensity * 0.9 }}
      ></div>
      <div 
        className="absolute top-1/4 left-1/2 w-80 h-80 bg-orange-300/32 dark:bg-orange-400/16 rounded-full blur-3xl animate-blob animation-delay-2500 gpu-accelerated"
        style={{ opacity: 0.4 + orangeIntensity * 1.0 }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-200/35 dark:bg-amber-300/17 rounded-full blur-3xl animate-blob animation-delay-6500 gpu-accelerated"
        style={{ opacity: 0.45 + orangeIntensity * 1.1 }}
      ></div>
      <div 
        className="absolute top-2/3 left-1/4 w-80 h-80 bg-orange-300/30 dark:bg-orange-400/15 rounded-full blur-3xl animate-blob animation-delay-4500 gpu-accelerated"
        style={{ opacity: 0.35 + orangeIntensity * 0.95 }}
      ></div>
      
      {/* Enhanced Mesh Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.15),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%),radial-gradient(circle_at_10%_80%,rgba(6,182,212,0.1),transparent_50%),radial-gradient(circle_at_90%_20%,rgba(99,102,241,0.1),transparent_50%),radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(251,146,60,0.18),transparent_50%),radial-gradient(circle_at_30%_80%,rgba(251,191,36,0.15),transparent_50%),radial-gradient(circle_at_60%_20%,rgba(251,146,60,0.12),transparent_50%),radial-gradient(circle_at_15%_50%,rgba(251,191,36,0.1),transparent_50%),radial-gradient(circle_at_85%_60%,rgba(249,115,22,0.14),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_50%),radial-gradient(circle_at_10%_80%,rgba(6,182,212,0.05),transparent_50%),radial-gradient(circle_at_90%_20%,rgba(99,102,241,0.05),transparent_50%),radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.04),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(251,146,60,0.09),transparent_50%),radial-gradient(circle_at_30%_80%,rgba(251,191,36,0.08),transparent_50%),radial-gradient(circle_at_60%_20%,rgba(251,146,60,0.07),transparent_50%),radial-gradient(circle_at_15%_50%,rgba(251,191,36,0.06),transparent_50%),radial-gradient(circle_at_85%_60%,rgba(249,115,22,0.08),transparent_50%)] gpu-accelerated"
        style={{ opacity: 0.7 + orangeIntensity * 0.3 }}
      ></div>
      
      {/* Colorful Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(251,146,60,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(147,51,234,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(251,146,60,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.015)_1px,transparent_1px)] gpu-accelerated"
        style={{ opacity: 0.6 + orangeIntensity * 0.4 }}
      ></div>
    </div>
  );
}

