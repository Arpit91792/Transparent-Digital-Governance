import { useEffect, useRef } from "react";

interface DynamicBackgroundProps {
  variant?: "default" | "subtle" | "vibrant";
  intensity?: "low" | "medium" | "high";
}

export function DynamicBackground({ variant = "default", intensity = "medium" }: DynamicBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef(50);
  const mouseYRef = useRef(50);
  const scrollYRef = useRef(0);

  // Mouse movement tracking for hover-based color shifts
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseXRef.current = (e.clientX / window.innerWidth) * 100;
      mouseYRef.current = (e.clientY / window.innerHeight) * 100;
      
      if (containerRef.current) {
        containerRef.current.style.setProperty("--bg-x", `${mouseXRef.current}%`);
        containerRef.current.style.setProperty("--bg-y", `${mouseYRef.current}%`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll-based background transitions
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      
      if (containerRef.current) {
        const scrollProgress = Math.min(scrollYRef.current / 1000, 1);
        const opacity = 0.6 + scrollProgress * 0.3;
        containerRef.current.style.setProperty("--bg-overlay-opacity", `${opacity}`);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intensity-based opacity adjustments
  const intensityMultiplier = {
    low: 0.5,
    medium: 1,
    high: 1.5,
  }[intensity];

  const variantStyles = {
    default: "opacity-100",
    subtle: "opacity-60",
    vibrant: "opacity-100",
  }[variant];

  return (
    <div
      ref={containerRef}
      className={`dynamic-bg-container ${variantStyles}`}
      style={{
        ["--bg-blob-opacity" as string]: `${0.15 * intensityMultiplier}`,
      }}
    >
      {/* Base Gradient Layer */}
      <div className="dynamic-bg-layer dynamic-bg-gradient animate-gradient-xy" />

      {/* Radial Gradient Layer - Follows Mouse */}
      <div className="dynamic-bg-layer dynamic-bg-radial animate-color-pulse" />

      {/* Secondary Gradient Layer */}
      <div className="dynamic-bg-layer animate-gradient-shift" style={{
        background: `linear-gradient(
          45deg,
          hsl(var(--bg-gradient-secondary) / ${0.4 * intensityMultiplier}),
          hsl(var(--bg-gradient-accent) / ${0.3 * intensityMultiplier}),
          hsl(var(--bg-gradient-tertiary) / ${0.35 * intensityMultiplier})
        )`,
        backgroundSize: "200% 200%",
      }} />

      {/* Animated Blob Shapes */}
      <div
        className="dynamic-bg-blob animate-float"
        style={{
          width: "600px",
          height: "600px",
          background: `hsl(var(--bg-gradient-primary))`,
          position: "absolute",
          top: "10%",
          left: "10%",
          animationDelay: "0s",
        }}
      />
      <div
        className="dynamic-bg-blob animate-float"
        style={{
          width: "500px",
          height: "500px",
          background: `hsl(var(--bg-gradient-secondary))`,
          position: "absolute",
          top: "60%",
          right: "10%",
          animationDelay: "2s",
        }}
      />
      <div
        className="dynamic-bg-blob animate-float"
        style={{
          width: "450px",
          height: "450px",
          background: `hsl(var(--bg-gradient-accent))`,
          position: "absolute",
          bottom: "10%",
          left: "50%",
          animationDelay: "4s",
        }}
      />
      <div
        className="dynamic-bg-blob animate-parallax-slow"
        style={{
          width: "400px",
          height: "400px",
          background: `hsl(var(--bg-gradient-tertiary))`,
          position: "absolute",
          top: "30%",
          right: "30%",
          animationDelay: "1s",
        }}
      />

      {/* Additional Subtle Blobs */}
      <div
        className="dynamic-bg-blob animate-float"
        style={{
          width: "300px",
          height: "300px",
          background: `hsl(var(--bg-gradient-primary))`,
          position: "absolute",
          top: "50%",
          left: "20%",
          animationDelay: "3s",
          opacity: 0.4,
        }}
      />
      <div
        className="dynamic-bg-blob animate-parallax-slow"
        style={{
          width: "350px",
          height: "350px",
          background: `hsl(var(--bg-gradient-accent))`,
          position: "absolute",
          bottom: "20%",
          right: "20%",
          animationDelay: "5s",
          opacity: 0.3,
        }}
      />

      {/* Parallax Overlay Layer */}
      <div
        className="dynamic-bg-layer animate-parallax-slow"
        style={{
          background: `conic-gradient(
            from 0deg at 50% 50%,
            hsl(var(--bg-gradient-primary) / ${0.2 * intensityMultiplier}),
            hsl(var(--bg-gradient-secondary) / ${0.15 * intensityMultiplier}),
            hsl(var(--bg-gradient-accent) / ${0.2 * intensityMultiplier}),
            hsl(var(--bg-gradient-primary) / ${0.15 * intensityMultiplier})
          )`,
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
    </div>
  );
}




