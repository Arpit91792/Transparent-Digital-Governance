import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Bell, Award, Clock, CheckCircle, Star, Phone, Mail, CheckCircle2, ChevronRight, ArrowRight, Activity, Users, Building2, Search, Menu, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getAllDepartmentNames } from "@shared/sub-departments";
import { useState, useEffect, useRef } from "react";

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

  // Get the color, with fallback to blue if colorName doesn't exist
  const color = colorMap[colorName] || colorMap.blue;
  
  // Get the shade, with fallback logic
  let rgb: string | undefined = color[shade];
  
  // If exact shade doesn't exist, find the closest one
  if (!rgb) {
    const availableShades = Object.keys(color).map(Number).sort((a, b) => a - b);
    const closestShade = availableShades.reduce((prev, curr) => 
      Math.abs(curr - shade) < Math.abs(prev - shade) ? curr : prev
    );
    rgb = color[closestShade];
  }
  
  // Final fallback to blue-400 if still undefined
  if (!rgb) {
    rgb = '96, 165, 250'; // blue-400
  }

  // Ensure rgb is a string before splitting
  if (typeof rgb !== 'string') {
    rgb = '96, 165, 250'; // blue-400 fallback
  }

  const [r, g, b] = rgb.split(', ').map(Number);
  return `${Math.round(r * opacity)}, ${Math.round(g * opacity)}, ${Math.round(b * opacity)}`;
}

interface DepartmentRating {
  department_id: string;
  department_name: string;
  averageRating: number;
  totalRatings: number;
  officialCount: number;
}

interface RatingsData {
  websiteRating: number;
  totalRatings: number;
  departments: DepartmentRating[];
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orangeIntensity, setOrangeIntensity] = useState(0.2);
  const [animatedStats, setAnimatedStats] = useState({
    applications: 0,
    successRate: 0,
    rating: 0,
    avgTime: 0
  });
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
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
  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Dynamic text rotation for hero section
  const heroTexts = [
    "Transparent Digital Governance",
    "AI-Powered Application Tracking",
    "Blockchain-Verified Approvals",
    "30-Day Processing Guarantee"
  ];

  useEffect(() => {
    if (!Array.isArray(heroTexts) || heroTexts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => {
        const nextIndex = (prev + 1) % heroTexts.length;
        return nextIndex >= 0 && nextIndex < heroTexts.length ? nextIndex : 0;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  // Dynamic orange color intensity based on time - optimized for 90 FPS
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const updateOrangeIntensity = () => {
      const now = performance.now();
      // Update at ~90 FPS (every ~11ms)
      if (now - lastTime >= 11) {
        // More dynamic oscillation with multiple frequencies
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

  // Dynamic background color rotation with enhanced effects - optimized for 90 FPS
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
      { primary: 'fuchsia', secondary: 'purple', accent: 'pink' },
      { primary: 'red', secondary: 'rose', accent: 'pink' },
      { primary: 'sky', secondary: 'cyan', accent: 'blue' },
      { primary: 'lime', secondary: 'green', accent: 'emerald' },
      { primary: 'amber', secondary: 'yellow', accent: 'orange' },
      { primary: 'teal', secondary: 'cyan', accent: 'sky' },
      { primary: 'pink', secondary: 'rose', accent: 'fuchsia' },
      { primary: 'violet', secondary: 'indigo', accent: 'purple' },
      { primary: 'emerald', secondary: 'green', accent: 'teal' },
      { primary: 'blue', secondary: 'indigo', accent: 'violet' },
      { primary: 'orange', secondary: 'red', accent: 'rose' }
    ];

    const transitionDuration = 4000; // 4 seconds per color scheme (faster, more dynamic transitions)
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const updateColors = () => {
      const now = performance.now();
      // Throttle to ~90 FPS (every ~11ms)
      if (now - lastTime >= 11) {
        const cyclePosition = (now % (colorSchemes.length * transitionDuration)) / transitionDuration;
        const currentIndex = Math.floor(cyclePosition);
        const nextIndex = (currentIndex + 1) % colorSchemes.length;
        const progress = cyclePosition % 1;

        // Smooth interpolation between color schemes
        const current = colorSchemes[currentIndex];
        const next = colorSchemes[nextIndex];

        // Enhanced intensity oscillation with multiple frequencies for more dynamic look
        const intensity1 = 0.6 + Math.sin(now / 1200) * 0.35;
        const intensity2 = 0.4 + Math.cos(now / 2000) * 0.3;
        const intensity3 = 0.2 + Math.sin(now / 3500) * 0.2;
        const intensity4 = 0.1 + Math.cos(now / 5000) * 0.15;
        const intensity = Math.max(0.5, Math.min(1.0, (intensity1 + intensity2 + intensity3 + intensity4) / 4));

        // Smooth color interpolation with easing - now supports gradual transitions
        const interpolateColor = (currentColor: string, nextColor: string, t: number) => {
          // Use smooth easing for color transitions
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          // Gradual transition between colors
          if (eased < 0.3) return currentColor;
          if (eased > 0.7) return nextColor;
          // Blend colors during transition
          return currentColor; // Will be handled by opacity/alpha in the actual rendering
        };

        // Calculate color blend based on progress
        const getBlendedColor = (currentColor: string, nextColor: string, t: number) => {
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          return eased < 0.5 ? currentColor : nextColor;
        };

        setBgColors({
          primary: getBlendedColor(current.primary, next.primary, progress),
          secondary: getBlendedColor(current.secondary, next.secondary, progress),
          accent: getBlendedColor(current.accent, next.accent, progress),
          intensity: intensity,
          rotation: (now / 35) % 360, // Faster rotation for more dynamic look
          blobScale1: 1 + Math.sin(now / 1800) * 0.2, // More pronounced scaling
          blobScale2: 1 + Math.cos(now / 2200) * 0.2,
          blobScale3: 1 + Math.sin(now / 2800) * 0.2
        });
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(updateColors);
    };
    
    animationFrameId = requestAnimationFrame(updateColors);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Fetch public stats first (before using in useEffect)
  const { data: publicStats, error: statsError } = useQuery<{
    totalApplications: number;
    successRate: number;
    averageRating: number;
    avgTime: number;
  }>({
    queryKey: ["/api/public/stats"],
    queryFn: async () => {
      try {
        return await apiRequest<{ totalApplications: number; successRate: number; averageRating: number; avgTime: number }>("GET", "/api/public/stats");
      } catch (error) {
        console.error('Error fetching public stats:', error);
        // Return default values on error
        return {
          totalApplications: 0,
          successRate: 98,
          averageRating: 0,
          avgTime: 30
        };
      }
    },
    retry: 3,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 15000,
    onError: (error) => {
      console.error('Public stats query error:', error);
    },
  });

  const { data: ratingsData, isLoading: ratingsLoading, error: ratingsError } = useQuery<RatingsData>({
    queryKey: ["/api/public/ratings"],
    queryFn: async () => {
      try {
        return await apiRequest<RatingsData>("GET", "/api/public/ratings");
      } catch (error) {
        console.error('Error fetching ratings data:', error);
        // Return default values on error
        return {
          websiteRating: 0,
          totalRatings: 0,
          departments: []
        };
      }
    },
    retry: 3,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
    onError: (error) => {
      console.error('Ratings query error:', error);
    },
  });

  // Animated counter for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible['stats']) return;
    
    // Wait for both stats to be available, but allow animation to start if at least publicStats is available
    if (!publicStats || typeof publicStats !== 'object') {
      // Show default values while data is loading
      setAnimatedStats({
        applications: 0,
        successRate: 98, // Default to 98% while loading
        rating: 0,
        avgTime: 30 // Default to 30 days while loading
      });
      return;
    }

    // Reset stats to 0 first
    setAnimatedStats({
      applications: 0,
      successRate: 0,
      rating: 0,
      avgTime: 0
    });

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    // Safely get website rating, default to 0 if not available yet
    const websiteRating = (ratingsData && typeof ratingsData === 'object' && ratingsData.websiteRating && typeof ratingsData.websiteRating === 'number' && ratingsData.websiteRating > 0 && isFinite(ratingsData.websiteRating)) 
      ? ratingsData.websiteRating 
      : 0;
    
    // Safely extract values with proper type checking and fallbacks
    const totalApps = (typeof publicStats.totalApplications === 'number' && publicStats.totalApplications >= 0 && isFinite(publicStats.totalApplications))
      ? publicStats.totalApplications 
      : 0;
    const successRate = (typeof publicStats.successRate === 'number' && publicStats.successRate > 0 && isFinite(publicStats.successRate))
      ? publicStats.successRate 
      : 98;
    const avgTime = (typeof publicStats.avgTime === 'number' && publicStats.avgTime > 0 && isFinite(publicStats.avgTime))
      ? publicStats.avgTime 
      : 30;
    
    const targets = {
      applications: totalApps,
      successRate: successRate,
      rating: websiteRating,
      avgTime: avgTime
    };

    let animationFrameId: number | null = null;
    let isCancelled = false;

    const animate = () => {
      // Check if cancelled before proceeding
      if (isCancelled) return;
      
      try {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(Math.max(elapsed / duration, 0), 1); // Clamp between 0 and 1
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);

        // Ensure all values are finite numbers before setting state
        const newStats = {
          applications: isFinite(targets.applications * easeOutCubic) ? targets.applications * easeOutCubic : 0,
          successRate: isFinite(targets.successRate * easeOutCubic) ? targets.successRate * easeOutCubic : 0,
          rating: isFinite(targets.rating * easeOutCubic) ? targets.rating * easeOutCubic : 0,
          avgTime: isFinite(targets.avgTime * easeOutCubic) ? targets.avgTime * easeOutCubic : 0
        };

        setAnimatedStats(newStats);

        if (progress < 1 && !isCancelled) {
          animationFrameId = requestAnimationFrame(animate);
        } else if (!isCancelled) {
          // Ensure final values are exact
          setAnimatedStats({
            applications: isFinite(targets.applications) ? targets.applications : 0,
            successRate: isFinite(targets.successRate) ? targets.successRate : 98,
            rating: isFinite(targets.rating) ? targets.rating : 0,
            avgTime: isFinite(targets.avgTime) ? targets.avgTime : 30
          });
        }
      } catch (error) {
        console.error('Error during animation:', error);
        isCancelled = true;
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isVisible['stats'], publicStats, ratingsData]);

  // Separate effect to update rating when ratingsData becomes available (without restarting animation)
  useEffect(() => {
    if (!isVisible['stats']) return;
    
    // Safely check if ratingsData exists and has valid websiteRating
    if (!ratingsData || typeof ratingsData !== 'object') return;
    
    const websiteRating = ratingsData?.websiteRating;
    if (typeof websiteRating !== 'number' || websiteRating <= 0 || !isFinite(websiteRating)) return;

    // Use a timeout to avoid updating during initial animation
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    
    timeoutId = setTimeout(() => {
      try {
        setAnimatedStats((prev) => {
          // Only update if the rating is significantly different (avoid unnecessary updates during animation)
          const currentRating = typeof prev.rating === 'number' ? prev.rating : 0;
          const newRating = websiteRating;
          
          if (newRating && Math.abs(currentRating - newRating) > 0.05) {
            return {
              ...prev,
              rating: newRating
            };
          }
          return prev;
        });
      } catch (error) {
        console.error('Error updating rating:', error);
      }
    }, 2100); // Wait until after animation completes (2000ms + 100ms buffer)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isVisible['stats'], ratingsData]);

  // Parallax effect for hero section - optimized for 90 FPS
  useEffect(() => {
    let ticking = false;
    let animationFrameId: number | null = null;
    
    const handleScroll = () => {
      if (!ticking) {
        animationFrameId = requestAnimationFrame(() => {
          try {
            if (heroRef.current) {
              const scrolled = typeof window !== 'undefined' && window.pageYOffset !== undefined 
                ? window.pageYOffset 
                : (typeof window !== 'undefined' && window.scrollY !== undefined ? window.scrollY : 0);
              const parallax = isFinite(scrolled) ? scrolled * 0.5 : 0;
              // Use translate3d for GPU acceleration
              if (heroRef.current && heroRef.current.style) {
                heroRef.current.style.transform = `translate3d(0, ${parallax}px, 0)`;
              }
            }
          } catch (error) {
            console.error('Error in parallax effect:', error);
          } finally {
            ticking = false;
          }
        });
        ticking = true;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const allDepartmentNames = getAllDepartmentNames();
  
  // Create a map of all departments with their ratings
  const departmentMap = new Map<string, DepartmentRating>();
  
  // First, add all departments with default values
  if (Array.isArray(allDepartmentNames)) {
    allDepartmentNames.forEach((name, index) => {
      if (name && typeof name === 'string') {
        departmentMap.set(name, {
          department_id: `dept-${index}`,
          department_name: name,
          averageRating: 0,
          totalRatings: 0,
          officialCount: 0,
        });
      }
    });
  }
  
  // Then, update with actual rating data if available
  if (ratingsData && typeof ratingsData === 'object' && Array.isArray(ratingsData.departments)) {
    ratingsData.departments.forEach((dept) => {
      if (dept && dept.department_name && typeof dept.department_name === 'string') {
        departmentMap.set(dept.department_name, dept);
      }
    });
  }
  
  // Convert map to array and sort: departments with ratings first (descending), then zero ratings
  const displayDepartments = Array.from(departmentMap.values())
    .filter(dept => dept && dept.department_name) // Filter out invalid entries
    .sort((a, b) => {
      try {
        // First, prioritize departments with ratings over those without
        const aHasRating = (typeof a.averageRating === 'number' && a.averageRating > 0);
        const bHasRating = (typeof b.averageRating === 'number' && b.averageRating > 0);
        
        if (aHasRating && !bHasRating) return -1; // a comes first
        if (!aHasRating && bHasRating) return 1;  // b comes first
        
        // If both have ratings or both don't, sort by rating value (descending)
        if (typeof a.averageRating === 'number' && typeof b.averageRating === 'number') {
          if (a.averageRating !== b.averageRating) {
            return b.averageRating - a.averageRating;
          }
        }
        
        // If ratings are equal, sort alphabetically
        const aName = a.department_name || '';
        const bName = b.department_name || '';
        return aName.localeCompare(bName);
      } catch (error) {
        console.error('Error sorting departments:', error);
        return 0;
      }
    });

  // Helper function to get icon and description for a department
  const getDepartmentInfo = (deptName: string) => {
    try {
      if (!deptName || typeof deptName !== 'string') {
        return { icon: FileText, desc: 'Government Services' };
      }
      
      const name = deptName.toLowerCase();
      if (name.includes('aadhaar') || name.includes('uidai')) {
        return { icon: Shield, desc: 'Identity Management' };
      } else if (name.includes('passport')) {
        return { icon: FileText, desc: 'Travel Documents' };
      } else if (name.includes('birth') || name.includes('death')) {
        return { icon: FileText, desc: 'Vital Records' };
      } else if (name.includes('finance') || name.includes('tax') || name.includes('payment')) {
        return { icon: CheckCircle, desc: 'Financial Services' };
      } else if (name.includes('driving') || name.includes('license') || name.includes('rto')) {
        return { icon: FileText, desc: 'RTO Services' };
      } else if (name.includes('property') || name.includes('land') || name.includes('revenue')) {
        return { icon: FileText, desc: 'Land Records' };
      } else if (name.includes('electricity') || name.includes('power')) {
        return { icon: FileText, desc: 'Bill & Meter' };
      } else if (name.includes('grievance') || name.includes('complaint')) {
        return { icon: Bell, desc: 'Redressal System' };
      } else if (name.includes('health')) {
        return { icon: Activity, desc: 'Healthcare Services' };
      } else if (name.includes('education')) {
        return { icon: FileText, desc: 'Educational Services' };
      } else if (name.includes('police')) {
        return { icon: Shield, desc: 'Law Enforcement' };
      } else if (name.includes('municipal') || name.includes('urban')) {
        return { icon: Building2, desc: 'Urban Services' };
      } else {
        return { icon: FileText, desc: 'Government Services' };
      }
    } catch (error) {
      console.error('Error getting department info:', error);
      return { icon: FileText, desc: 'Government Services' };
    }
  };

  const handleSubmitApplication = () => {
    try {
      if (setLocation && typeof setLocation === 'function') {
        setLocation("/login?role=citizen");
      }
    } catch (error) {
      console.error('Error navigating to login:', error);
      // Fallback to window.location if setLocation fails
      window.location.href = "/login?role=citizen";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-slate-950 font-['Outfit',sans-serif] selection:bg-blue-500/30 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 -z-10">
        {/* Base Gradient Background with Dynamic Colors - Enhanced */}
        <div 
          className="absolute inset-0 animate-gradient-xy gpu-accelerated"
          style={{
            backgroundImage: `linear-gradient(135deg, 
              rgba(${getColorValue(bgColors.primary, 100, bgColors.intensity)}, ${0.85 + bgColors.intensity * 0.15}), 
              rgba(${getColorValue(bgColors.secondary, 100, bgColors.intensity * 0.95)}, ${0.7 + bgColors.intensity * 0.2}), 
              rgba(${getColorValue(bgColors.accent, 100, bgColors.intensity)}, ${0.75 + bgColors.intensity * 0.15}), 
              rgba(${getColorValue(bgColors.primary, 100, bgColors.intensity * 0.85)}, ${0.7 + bgColors.intensity * 0.2}), 
              rgba(${getColorValue(bgColors.secondary, 100, bgColors.intensity * 0.75)}, ${0.6 + bgColors.intensity * 0.25}), 
              rgba(${getColorValue(bgColors.accent, 100, bgColors.intensity * 0.95)}, ${0.65 + bgColors.intensity * 0.25})
            )`,
            transition: 'background-image 1s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundSize: '200% 200%',
            willChange: 'background-image, background-position'
          }}
        ></div>
        
        {/* Additional Dynamic Color Wave Layer */}
        <div 
          className="absolute inset-0 animate-gradient-xy"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, 
              rgba(${getColorValue(bgColors.accent, 200, bgColors.intensity * 0.8)}, ${0.5 + bgColors.intensity * 0.3}), 
              transparent 50%
            ),
            radial-gradient(circle at 70% 60%, 
              rgba(${getColorValue(bgColors.primary, 200, bgColors.intensity * 0.7)}, ${0.45 + bgColors.intensity * 0.3}), 
              transparent 50%
            ),
            radial-gradient(circle at 50% 80%, 
              rgba(${getColorValue(bgColors.secondary, 200, bgColors.intensity * 0.75)}, ${0.5 + bgColors.intensity * 0.3}), 
              transparent 50%
            )`,
            transition: 'background-image 1.5s ease-in-out',
            backgroundSize: '200% 200%',
            animation: 'gradient-xy 20s ease infinite'
          }}
        ></div>
        
        {/* Dark Mode Base Gradient */}
        <div 
          className="absolute inset-0 animate-gradient-xy dark:opacity-100 opacity-0"
          style={{
            backgroundImage: `linear-gradient(135deg, 
              rgba(${getColorValue(bgColors.primary, 950, bgColors.intensity * 0.3)}, 0.3), 
              rgba(${getColorValue(bgColors.secondary, 950, bgColors.intensity * 0.2)}, 0.2), 
              rgba(${getColorValue(bgColors.accent, 950, bgColors.intensity * 0.25)}, 0.25), 
              rgba(${getColorValue(bgColors.primary, 950, bgColors.intensity * 0.18)}, 0.18), 
              rgba(${getColorValue(bgColors.secondary, 950, bgColors.intensity * 0.15)}, 0.15), 
              rgba(${getColorValue(bgColors.accent, 950, bgColors.intensity * 0.2)}, 0.2)
            )`,
            transition: 'background-image 2s ease-in-out, opacity 0.3s ease'
          }}
        ></div>
        
        {/* Secondary Gradient Layer with Dynamic Colors */}
        <div 
          className="absolute inset-0 animate-gradient-xy animation-delay-2000"
          style={{
            backgroundImage: `linear-gradient(45deg, 
              rgba(${getColorValue(bgColors.accent, 50, bgColors.intensity * 0.8)}, 0.5), 
              rgba(${getColorValue(bgColors.primary, 50, bgColors.intensity * 0.7)}, 0.45), 
              rgba(${getColorValue(bgColors.secondary, 50, bgColors.intensity * 0.6)}, 0.4), 
              rgba(${getColorValue(bgColors.accent, 50, bgColors.intensity * 0.75)}, 0.5)
            )`,
            transition: 'background-image 1.5s ease-in-out',
            backgroundSize: '200% 200%'
          }}
        ></div>
        
        {/* Dynamic Color Overlay - Moving Gradient with Enhanced Animation */}
        <div 
          className="absolute inset-0 gpu-accelerated"
          style={{
            backgroundImage: `conic-gradient(from ${bgColors.rotation}deg at 50% 50%, 
              rgba(${getColorValue(bgColors.primary, 300, bgColors.intensity * 0.6)}, ${0.5 + bgColors.intensity * 0.3}), 
              rgba(${getColorValue(bgColors.secondary, 300, bgColors.intensity * 0.55)}, ${0.45 + bgColors.intensity * 0.3}), 
              rgba(${getColorValue(bgColors.accent, 300, bgColors.intensity * 0.6)}, ${0.5 + bgColors.intensity * 0.3}), 
              rgba(${getColorValue(bgColors.primary, 300, bgColors.intensity * 0.55)}, ${0.45 + bgColors.intensity * 0.3}),
              rgba(${getColorValue(bgColors.accent, 300, bgColors.intensity * 0.5)}, ${0.4 + bgColors.intensity * 0.3})
            )`,
            transition: 'background-image 0.05s linear',
            mixBlendMode: 'overlay',
            opacity: 0.6 + bgColors.intensity * 0.3,
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
          className="absolute inset-0 animate-gradient-xy animation-delay-2000 dark:opacity-100 opacity-0"
          style={{
            backgroundImage: `linear-gradient(45deg, 
              rgba(${getColorValue(bgColors.accent, 950, bgColors.intensity * 0.15)}, 0.15), 
              rgba(${getColorValue(bgColors.primary, 950, bgColors.intensity * 0.12)}, 0.12), 
              rgba(${getColorValue(bgColors.secondary, 950, bgColors.intensity * 0.1)}, 0.1), 
              rgba(${getColorValue(bgColors.accent, 950, bgColors.intensity * 0.12)}, 0.12)
            )`,
            transition: 'background-image 2s ease-in-out, opacity 0.3s ease'
          }}
        ></div>
        
        {/* Light Orange Gradient Layer - Dynamic */}
        <div 
          className="absolute inset-0 bg-gradient-to-bl from-orange-100/60 via-amber-100/50 to-yellow-100/40 dark:from-orange-950/25 dark:via-amber-950/20 dark:to-yellow-950/15 animate-gradient-xy animation-delay-3000"
          style={{ opacity: 0.4 + orangeIntensity * 0.6 }}
        ></div>
        
        {/* Additional Orange Gradient Layer - Dynamic */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-orange-200/40 via-amber-200/35 to-orange-100/30 dark:from-orange-900/15 dark:via-amber-900/12 dark:to-orange-800/10 animate-gradient-xy animation-delay-4000"
          style={{ opacity: orangeIntensity * 0.8 }}
        ></div>
        
        {/* Animated Blob Shapes with Dynamic Colors - Light Mode - Enhanced */}
        <div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-blob dark:opacity-0 gpu-accelerated"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.primary, 400, 1)}, ${0.45 + bgColors.intensity * 0.35})`,
            boxShadow: `0 0 400px rgba(${getColorValue(bgColors.primary, 400, 1)}, ${0.6 + bgColors.intensity * 0.4}), 0 0 600px rgba(${getColorValue(bgColors.primary, 300, 1)}, ${0.4 + bgColors.intensity * 0.3})`,
            transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale1})`,
            willChange: 'transform, background-color, box-shadow'
          }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-2000 dark:opacity-0 gpu-accelerated"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.secondary, 400, 1)}, ${0.45 + bgColors.intensity * 0.35})`,
            boxShadow: `0 0 400px rgba(${getColorValue(bgColors.secondary, 400, 1)}, ${0.6 + bgColors.intensity * 0.4}), 0 0 600px rgba(${getColorValue(bgColors.secondary, 300, 1)}, ${0.4 + bgColors.intensity * 0.3})`,
            transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale2})`,
            willChange: 'transform, background-color, box-shadow'
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-4000 dark:opacity-0 gpu-accelerated"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.accent, 400, 1)}, ${0.45 + bgColors.intensity * 0.35})`,
            boxShadow: `0 0 400px rgba(${getColorValue(bgColors.accent, 400, 1)}, ${0.6 + bgColors.intensity * 0.4}), 0 0 600px rgba(${getColorValue(bgColors.accent, 300, 1)}, ${0.4 + bgColors.intensity * 0.3})`,
            transition: 'background-color 1.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translate3d(0, 0, 0) scale(${bgColors.blobScale3})`,
            willChange: 'transform, background-color, box-shadow'
          }}
        ></div>
        
        {/* Additional Dynamic Blob Shapes */}
        <div 
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-blob animation-delay-3000 dark:opacity-0"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.accent, 300, 1)}, ${0.2 + bgColors.intensity * 0.15})`,
            boxShadow: `0 0 200px rgba(${getColorValue(bgColors.accent, 300, 1)}, ${0.3 + bgColors.intensity * 0.15})`,
            transition: 'background-color 2s ease, box-shadow 2s ease, opacity 0.3s ease'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl animate-blob animation-delay-5000 dark:opacity-0"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.primary, 300, 1)}, ${0.2 + bgColors.intensity * 0.15})`,
            boxShadow: `0 0 200px rgba(${getColorValue(bgColors.primary, 300, 1)}, ${0.3 + bgColors.intensity * 0.15})`,
            transition: 'background-color 2s ease, box-shadow 2s ease, opacity 0.3s ease'
          }}
        ></div>
        
        {/* Animated Blob Shapes with Dynamic Colors - Dark Mode */}
        <div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-blob opacity-0 dark:opacity-100"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.primary, 500, 1)}, ${0.15 + bgColors.intensity * 0.1})`,
            boxShadow: `0 0 250px rgba(${getColorValue(bgColors.primary, 500, 1)}, ${0.2 + bgColors.intensity * 0.1})`,
            transition: 'background-color 2s ease, box-shadow 2s ease, opacity 0.3s ease, transform 0.3s ease',
            transform: `scale(${bgColors.blobScale1})`
          }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-2000 opacity-0 dark:opacity-100"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.secondary, 500, 1)}, ${0.15 + bgColors.intensity * 0.1})`,
            boxShadow: `0 0 250px rgba(${getColorValue(bgColors.secondary, 500, 1)}, ${0.2 + bgColors.intensity * 0.1})`,
            transition: 'background-color 2s ease, box-shadow 2s ease, opacity 0.3s ease, transform 0.3s ease',
            transform: `scale(${bgColors.blobScale2})`
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 w-96 h-96 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-0 dark:opacity-100"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.accent, 500, 1)}, ${0.15 + bgColors.intensity * 0.1})`,
            boxShadow: `0 0 250px rgba(${getColorValue(bgColors.accent, 500, 1)}, ${0.2 + bgColors.intensity * 0.1})`,
            transition: 'background-color 2s ease, box-shadow 2s ease, opacity 0.3s ease, transform 0.3s ease',
            transform: `scale(${bgColors.blobScale3})`
          }}
        ></div>
        
        {/* Additional Dynamic Blob Shapes - Dark Mode */}
        <div 
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-blob animation-delay-3000 opacity-0 dark:opacity-100"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.accent, 500, 1)}, ${0.12 + bgColors.intensity * 0.08})`,
            boxShadow: `0 0 200px rgba(${getColorValue(bgColors.accent, 500, 1)}, ${0.15 + bgColors.intensity * 0.08})`,
            transition: 'background-color 2s ease, box-shadow 2s ease, opacity 0.3s ease'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl animate-blob animation-delay-5000 opacity-0 dark:opacity-100"
          style={{
            backgroundColor: `rgba(${getColorValue(bgColors.primary, 500, 1)}, ${0.12 + bgColors.intensity * 0.08})`,
            boxShadow: `0 0 200px rgba(${getColorValue(bgColors.primary, 500, 1)}, ${0.15 + bgColors.intensity * 0.08})`,
            transition: 'background-color 2s ease, box-shadow 2s ease, opacity 0.3s ease'
          }}
        ></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-blob animation-delay-8000"></div>
        
        {/* Additional Colorful Blobs */}
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-blob animation-delay-3000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-3xl animate-blob animation-delay-5000"></div>
        <div className="absolute top-2/3 left-2/3 w-56 h-56 bg-violet-400/20 dark:bg-violet-500/10 rounded-full blur-3xl animate-blob animation-delay-7000"></div>
        <div className="absolute top-1/4 right-1/2 w-60 h-60 bg-rose-400/18 dark:bg-rose-500/9 rounded-full blur-3xl animate-blob animation-delay-9000"></div>
        <div className="absolute bottom-1/2 left-1/2 w-68 h-68 bg-amber-400/18 dark:bg-amber-500/9 rounded-full blur-3xl animate-blob animation-delay-10000"></div>
        
        {/* Light Orange Blobs - Dynamic */}
        <div 
          className="absolute top-1/6 right-1/6 w-80 h-80 bg-orange-300/35 dark:bg-orange-400/18 rounded-full blur-3xl animate-blob animation-delay-1500"
          style={{ opacity: 0.5 + orangeIntensity * 1.2 }}
        ></div>
        <div 
          className="absolute bottom-1/6 left-1/3 w-96 h-96 bg-orange-200/40 dark:bg-orange-300/20 rounded-full blur-3xl animate-blob animation-delay-3500"
          style={{ opacity: 0.4 + orangeIntensity * 1.0 }}
        ></div>
        <div 
          className="absolute top-3/4 right-1/3 w-72 h-72 bg-amber-300/30 dark:bg-amber-400/15 rounded-full blur-3xl animate-blob animation-delay-5500"
          style={{ opacity: 0.5 + orangeIntensity * 1.1 }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/6 w-64 h-64 bg-orange-400/28 dark:bg-orange-500/14 rounded-full blur-3xl animate-blob animation-delay-7500"
          style={{ opacity: 0.3 + orangeIntensity * 0.9 }}
        ></div>
        <div 
          className="absolute top-1/4 left-1/2 w-80 h-80 bg-orange-300/32 dark:bg-orange-400/16 rounded-full blur-3xl animate-blob animation-delay-2500"
          style={{ opacity: 0.4 + orangeIntensity * 1.0 }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-amber-200/35 dark:bg-amber-300/17 rounded-full blur-3xl animate-blob animation-delay-6500"
          style={{ opacity: 0.45 + orangeIntensity * 1.1 }}
        ></div>
        <div 
          className="absolute top-2/3 left-1/4 w-80 h-80 bg-orange-300/30 dark:bg-orange-400/15 rounded-full blur-3xl animate-blob animation-delay-4500"
          style={{ opacity: 0.35 + orangeIntensity * 0.95 }}
        ></div>
        
        {/* Enhanced Mesh Gradient Overlay with More Colors including Light Orange */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.15),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent_50%),radial-gradient(circle_at_10%_80%,rgba(6,182,212,0.1),transparent_50%),radial-gradient(circle_at_90%_20%,rgba(99,102,241,0.1),transparent_50%),radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.08),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(251,146,60,0.18),transparent_50%),radial-gradient(circle_at_30%_80%,rgba(251,191,36,0.15),transparent_50%),radial-gradient(circle_at_60%_20%,rgba(251,146,60,0.12),transparent_50%),radial-gradient(circle_at_15%_50%,rgba(251,191,36,0.1),transparent_50%),radial-gradient(circle_at_85%_60%,rgba(249,115,22,0.14),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_50%),radial-gradient(circle_at_10%_80%,rgba(6,182,212,0.05),transparent_50%),radial-gradient(circle_at_90%_20%,rgba(99,102,241,0.05),transparent_50%),radial-gradient(circle_at_40%_60%,rgba(16,185,129,0.04),transparent_50%),radial-gradient(circle_at_70%_40%,rgba(251,146,60,0.09),transparent_50%),radial-gradient(circle_at_30%_80%,rgba(251,191,36,0.08),transparent_50%),radial-gradient(circle_at_60%_20%,rgba(251,146,60,0.07),transparent_50%),radial-gradient(circle_at_15%_50%,rgba(251,191,36,0.06),transparent_50%),radial-gradient(circle_at_85%_60%,rgba(249,115,22,0.08),transparent_50%)]"
          style={{ opacity: 0.7 + orangeIntensity * 0.3 }}
        ></div>
        
        {/* Colorful Grid Pattern Overlay with Orange */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(147,51,234,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(251,146,60,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(59,130,246,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(147,51,234,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(251,146,60,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(251,191,36,0.015)_1px,transparent_1px)]"
          style={{ opacity: 0.6 + orangeIntensity * 0.4 }}
        ></div>
      </div>

      {/* Fixed Navbar with Mega Menu */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
        <div className="w-full max-w-7xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm rounded-full px-6 py-3 pointer-events-auto flex justify-between items-center relative transition-all duration-300">
          <div className="flex items-center gap-3">
            {/* Profile Icon - Only visible when logged in */}
            {user && (
              <ProfileDropdown className="mr-2" />
            )}
            <div className="p-1.5 rounded-full bg-[#0071e3] shadow-lg shadow-blue-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <a href="/" className="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">Accountability</a>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" size="icon" className="rounded-full text-[#1d1d1f] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0071e3]">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-[#1d1d1f] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0071e3]">
              <Bell className="h-5 w-5" />
            </Button>
            <LanguageSelector />
            <ThemeToggle />
            {user ? (
              // Show profile icon and redirect to appropriate dashboard
              <Link href={user.role === "admin" ? "/admin/dashboard" : user.role === "official" ? "/official/dashboard" : "/citizen/dashboard"}>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-[#1d1d1f] dark:text-white">
                  <div className="h-8 w-8 rounded-full bg-[#0071e3] flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </Link>
            ) : (
              // Show Login/Get Started buttons when not logged in
              <>
                <Link href="/register">
                  <Button variant="outline" className="rounded-full border-slate-200 dark:border-slate-700 hover:bg-[#F5F5F7] dark:hover:bg-slate-800 text-[#1d1d1f] dark:text-white px-6 ml-2">
                    {t("landing.getStarted")}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white shadow-lg shadow-blue-500/20 px-6 ml-2">
                    {t("landing.login")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            {user && <ProfileDropdown />}
            <LanguageSelector />
            <ThemeToggle />
            <button 
              className="text-[#1d1d1f] dark:text-white p-2"
              onClick={(e) => {
                try {
                  e.preventDefault();
                  e.stopPropagation();
                  const menuElement = document.getElementById('mobile-menu');
                  if (menuElement && typeof menuElement.classList?.toggle === 'function') {
                    menuElement.classList.toggle('hidden');
                  }
                } catch (error) {
                  console.error('Error toggling mobile menu:', error);
                }
              }}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div id="mobile-menu" className="hidden absolute top-[70px] left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 pointer-events-auto animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-6">
            <a href="#" className="text-lg font-medium text-[#1d1d1f] dark:text-white">Home</a>
            <div className="space-y-4">
              <div className="text-sm font-bold text-[#86868b] uppercase tracking-wider">Services</div>
              <div className="grid grid-cols-1 gap-3 pl-4">
                <a href="/track" className="text-[#1d1d1f] dark:text-white">Track Application</a>
                <a href="#" className="text-[#1d1d1f] dark:text-white">Birth/Death Certificates</a>
                <a href="#" className="text-[#1d1d1f] dark:text-white">Licenses & Permits</a>
              </div>
            </div>
            {/* <a href="#dashboard" className="text-lg font-medium text-[#1d1d1f] dark:text-white">Dashboard</a> */}
            {/* <a href="#reforms" className="text-lg font-medium text-[#1d1d1f] dark:text-white">Reforms</a> */}
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
            <div className="flex flex-col gap-4">
              <Link href="/register">
                <Button variant="outline" className="w-full rounded-full border-slate-200 dark:border-slate-700 hover:bg-[#F5F5F7] dark:hover:bg-slate-800 text-[#1d1d1f] dark:text-white h-12 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button className="w-full rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white h-12 text-lg">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div ref={heroRef} className="max-w-7xl mx-auto relative z-10 transition-transform duration-300 ease-out">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-[#1d1d1f] dark:text-white">{t("landing.liveGovernance")}</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-[64px] font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            <span 
              key={currentTextIndex}
              className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {(() => {
                try {
                  if (Array.isArray(heroTexts) && heroTexts.length > 0 && typeof currentTextIndex === 'number' && currentTextIndex >= 0 && currentTextIndex < heroTexts.length) {
                    const currentText = heroTexts[currentTextIndex];
                    if (typeof currentText === 'string') {
                      return currentText.split(' ').map((word, i) => (
                        <span key={i} className="inline-block mr-2">
                          {word}
                        </span>
                      ));
                    }
                  }
                  // Fallback: render first text or default
                  const fallbackText = (Array.isArray(heroTexts) && heroTexts.length > 0) ? heroTexts[0] : "Transparent Digital Governance";
                  return typeof fallbackText === 'string' 
                    ? fallbackText.split(' ').map((word, i) => (
                        <span key={i} className="inline-block mr-2">
                          {word}
                        </span>
                      ))
                    : <span>Transparent Digital Governance</span>;
                } catch (error) {
                  console.error('Error rendering hero text:', error);
                  return <span>Transparent Digital Governance</span>;
                }
              })()}
            </span>
            <br />
            <span className="text-[#0071e3] animate-pulse">{t("landing.platform")}</span>
          </h1>
          
          <p 
            className="text-xl text-[#86868b] max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 transition-all"
            key={`subtitle-${currentTextIndex}`}
          >
            {currentTextIndex === 0 && "Submit, track, and manage government applications with AI-powered monitoring, blockchain verification, and guaranteed 30-day processing."}
            {currentTextIndex === 1 && "Real-time status updates, automated notifications, and intelligent delay detection ensure your applications are processed efficiently."}
            {currentTextIndex === 2 && "Every approval is cryptographically secured on the blockchain, providing tamper-proof records and complete transparency."}
            {currentTextIndex === 3 && "Our system guarantees processing within 30 days or automatic escalation to higher authorities for immediate action."}
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button 
              size="lg" 
              className="h-14 px-8 rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white text-lg font-medium shadow-xl shadow-blue-500/20 transition-all hover:scale-105"
              onClick={handleSubmitApplication}
            >
              {t("landing.submitApplication")}
            </Button>
            <Link href="/track">
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#1d1d1f] dark:text-white text-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105">
                {t("landing.trackStatus")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="md:col-span-2 border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden group hover:shadow-md transition-all duration-500">
              <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#0071e3] w-fit">
                    <Activity className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#1d1d1f] dark:text-white">{t("landing.realTimeTracking")}</h3>
                  <p className="text-[#86868b] text-lg leading-relaxed">
                    {t("landing.realTimeTrackingDesc")}
                  </p>
                </div>
                <div className="flex-1 w-full relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent dark:from-blue-900/10 rounded-3xl transform rotate-3 scale-95 opacity-50"></div>
                  <div className="bg-[#F5F5F7] dark:bg-slate-800 rounded-3xl p-6 transform transition-transform group-hover:-translate-y-2 duration-500">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full mb-2"></div>
                        <div className="h-2 w-16 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden group hover:shadow-md transition-all duration-500">
              <CardContent className="p-8 flex flex-col h-full justify-between">
                <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 w-fit mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-3">{t("landing.blockchainVerified")}</h3>
                  <p className="text-[#86868b]">
                    {t("landing.blockchainVerifiedDesc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden group hover:shadow-md transition-all duration-500">
              <CardContent className="p-8 flex flex-col h-full justify-between">
                <div 
                  className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 w-fit mb-6 transition-all duration-500"
                  style={{ 
                    backgroundColor: `rgba(255, 237, 213, ${0.5 + orangeIntensity})`,
                    boxShadow: `0 4px 14px rgba(251, 146, 60, ${orangeIntensity * 0.3})`
                  }}
                >
                  <Bell className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-3">{t("landing.aiMonitoring")}</h3>
                  <p className="text-[#86868b]">
                    {t("landing.aiMonitoringDesc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="md:col-span-2 border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden group hover:shadow-md transition-all duration-500">
              <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 w-full relative order-2 md:order-1">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#F5F5F7] dark:bg-slate-800 p-4 rounded-2xl">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-3"></div>
                        <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </div>
                      <div className="bg-[#F5F5F7] dark:bg-slate-800 p-4 rounded-2xl mt-8">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 mb-3"></div>
                        <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      </div>
                   </div>
                </div>
                <div className="flex-1 space-y-4 order-1 md:order-2">
                  <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 w-fit">
                    <Award className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-[#1d1d1f] dark:text-white">{t("landing.candidateSelection")}</h3>
                  <p className="text-[#86868b] text-lg leading-relaxed">
                    {t("landing.candidateSelectionDesc")}
                  </p>
                  <Link href="/election/candidates">
                    <Button variant="link" className="p-0 h-auto text-[#0071e3] font-semibold hover:no-underline group-hover:translate-x-1 transition-transform">
                      {t("landing.exploreCandidates")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" ref={statsRef} className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { 
                icon: FileText, 
                val: animatedStats.applications, 
                suffix: '+', 
                label: t("landing.applications"),
                key: 'applications'
              },
              { 
                icon: CheckCircle, 
                val: animatedStats.successRate, 
                suffix: '%', 
                label: t("landing.successRate"),
                key: 'successRate'
              },
              { 
                icon: Star, 
                val: animatedStats.rating, 
                suffix: '/5', 
                label: t("landing.userRating"),
                key: 'rating'
              },
              { 
                icon: Clock, 
                val: animatedStats.avgTime, 
                suffix: ' Days', 
                label: t("landing.avgTime"),
                key: 'avgTime'
              }
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center group transform transition-all duration-500 hover:scale-105"
                style={{
                  opacity: isVisible['stats'] ? 1 : 0,
                  transform: isVisible['stats'] ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className="mb-4 inline-flex p-4 rounded-full bg-[#F5F5F7] dark:bg-slate-800 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 group-hover:bg-[#0071e3] group-hover:shadow-lg group-hover:shadow-blue-500/50">
                  <stat.icon className="h-8 w-8 text-[#0071e3] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-4xl font-bold text-[#1d1d1f] dark:text-white mb-2">
                  {(() => {
                    try {
                      if (stat.key === 'applications') {
                        const value = typeof animatedStats.applications === 'number' && isFinite(animatedStats.applications) ? animatedStats.applications : 0;
                        if (value >= 1000000) {
                          return `${(value / 1000000).toFixed(1)}M${stat.suffix}`;
                        } else if (value >= 1000) {
                          return `${(value / 1000).toFixed(1)}K${stat.suffix}`;
                        } else {
                          return `${Math.round(value)}${stat.suffix}`;
                        }
                      } else if (stat.key === 'rating') {
                        const value = typeof animatedStats.rating === 'number' && isFinite(animatedStats.rating) ? animatedStats.rating : 0;
                        return `${value.toFixed(1)}${stat.suffix}`;
                      } else if (stat.key === 'successRate') {
                        const value = typeof animatedStats.successRate === 'number' && isFinite(animatedStats.successRate) ? animatedStats.successRate : 98;
                        return `${value % 1 === 0 ? Math.round(value) : value.toFixed(1)}${stat.suffix}`;
                      } else if (stat.key === 'avgTime') {
                        const value = typeof animatedStats.avgTime === 'number' && isFinite(animatedStats.avgTime) ? animatedStats.avgTime : 30;
                        return `${value % 1 === 0 ? Math.round(value) : value.toFixed(1)}${stat.suffix}`;
                      }
                      return '';
                    } catch (error) {
                      console.error('Error rendering stat:', stat.key, error);
                      return '0' + stat.suffix;
                    }
                  })()}
                </h3>
                <p className="text-[#86868b] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#1d1d1f] dark:text-white mb-2">{t("landing.popularServices")}</h2>
              <p className="text-[#86868b]">{t("landing.mostAccessed")}</p>
            </div>
            <Button variant="outline" className="rounded-full border-slate-200 dark:border-slate-700">
              {t("landing.viewAll")}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(displayDepartments) && displayDepartments.slice(0, 10).map((dept, index) => {
              if (!dept || !dept.department_name) return null;
              
              try {
                const { icon: IconComponent, desc } = getDepartmentInfo(dept.department_name);
                const rating = (typeof dept.averageRating === 'number' && dept.averageRating > 0) 
                  ? dept.averageRating.toFixed(1) 
                  : '0.0';
                // Extract short name (before "–" if present)
                const shortName = dept.department_name ? dept.department_name.split('–')[0].trim() : 'Department';
                
                return (
                  <Card 
                    key={dept.department_id || `dept-${index}`} 
                    className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[24px] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                    onClick={(e) => {
                      try {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle department card click - can be customized later
                        if (dept && dept.department_name) {
                          console.log('Department clicked:', dept.department_name);
                        }
                      } catch (error) {
                        console.error('Error handling department click:', error);
                      }
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-[#F5F5F7] dark:bg-slate-800 text-[#0071e3] group-hover:bg-[#0071e3] group-hover:text-white group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
                          <IconComponent size={24} />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F5F5F7] dark:bg-slate-800 text-xs font-bold text-[#1d1d1f] dark:text-white group-hover:scale-110 transition-transform duration-300">
                          <Star size={12} className="fill-yellow-400 text-yellow-400 group-hover:animate-pulse" />
                          {rating}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-white mb-1 group-hover:text-[#0071e3] transition-colors duration-300">{shortName}</h3>
                      <p className="text-sm text-[#86868b] group-hover:text-[#1d1d1f] dark:group-hover:text-white transition-colors duration-300">{desc}</p>
                      {typeof dept.totalRatings === 'number' && dept.totalRatings > 0 && (
                        <p className="text-xs text-[#86868b] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {dept.totalRatings} {dept.totalRatings === 1 ? 'rating' : 'ratings'}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              } catch (error) {
                console.error('Error rendering department card:', error, dept);
                return null;
              }
            })}
          </div>
        </div>
      </section>

      {/* Reforms & Dashboard Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Public Dashboard */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#1d1d1f] dark:text-white">{t("landing.publicDashboard")}</h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Overall Rating */}
              <div className="lg:col-span-4 space-y-6 sticky top-24">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-[#0071e3] to-blue-600 text-white rounded-[32px] overflow-hidden relative">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <Star className="h-16 w-16 fill-yellow-400 text-yellow-400 drop-shadow-md" />
                    </div>
                    <div className="mb-2">
                      <span className="text-6xl font-extrabold tracking-tight">
                        {(() => {
                          try {
                            if (ratingsData && typeof ratingsData === 'object' && typeof ratingsData.websiteRating === 'number' && isFinite(ratingsData.websiteRating)) {
                              return ratingsData.websiteRating.toFixed(1);
                            }
                            return "0.0";
                          } catch (error) {
                            console.error('Error displaying website rating:', error);
                            return "0.0";
                          }
                        })()}
                      </span>
                      <span className="text-2xl opacity-80 font-medium">/5.0</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t("landing.overallPerformance")}</h3>
                    <p className="text-sm opacity-80">
                      {t("landing.basedOnRatings").replace("{count}", String((ratingsData && typeof ratingsData.totalRatings === 'number') ? ratingsData.totalRatings : 0))}
                    </p>
                  </CardContent>
                </Card>

                <div className="bg-[#F5F5F7] dark:bg-slate-800 p-6 rounded-[24px]">
                  <h4 className="font-bold text-[#1d1d1f] dark:text-white mb-2 flex items-center gap-2">
                    <Shield size={18} className="text-[#0071e3]" /> {t("landing.whyRatingsMatter")}
                  </h4>
                  <p className="text-sm text-[#86868b] leading-relaxed">
                    {t("landing.ratingsMatterDesc")}
                  </p>
                </div>
              </div>

              {/* Right Column: Department List */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">
                    {t("landing.departmentRatings")}
                  </h3>
                  <div className="text-sm text-[#86868b]">
                    {Array.isArray(displayDepartments) ? displayDepartments.length : 0} {t("landing.departmentsListed")}
                  </div>
                </div>

                {ratingsLoading ? (
                  <div className="text-center py-12 bg-[#F5F5F7] dark:bg-slate-800 rounded-[32px]">
                    <p className="text-[#86868b] animate-pulse">Loading ratings data...</p>
                  </div>
                ) : (
                  <div className="space-y-4 h-[400px] md:h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {Array.isArray(displayDepartments) && displayDepartments.map((dept, index) => {
                      if (!dept || !dept.department_name) return null;
                      
                      try {
                        const avgRating = typeof dept.averageRating === 'number' && isFinite(dept.averageRating) ? dept.averageRating : 0;
                        const totalRatings = typeof dept.totalRatings === 'number' ? dept.totalRatings : 0;
                        const officialCount = typeof dept.officialCount === 'number' ? dept.officialCount : 0;
                        const deptName = dept.department_name || 'Department';
                        const firstChar = deptName.charAt(0) || 'D';
                        
                        return (
                          <div
                            key={dept.department_id || `dept-${index}`}
                            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-[20px] md:rounded-[24px] bg-[#F5F5F7] dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all duration-300 cursor-pointer group"
                            onClick={(e) => {
                              try {
                                e.preventDefault();
                                e.stopPropagation();
                                // Handle department list item click - can be customized later
                                if (dept && dept.department_name) {
                                  console.log('Department list item clicked:', dept.department_name);
                                }
                              } catch (error) {
                                console.error('Error handling department list click:', error);
                              }
                            }}
                          >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base shrink-0 ${
                              avgRating > 0 
                                ? "bg-blue-100 dark:bg-blue-900/30 text-[#0071e3]"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                            }`}>
                              {firstChar}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-[#1d1d1f] dark:text-white truncate pr-4">
                                  {deptName}
                                </h4>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-xs shrink-0 ${
                                  avgRating > 0
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                                }`}>
                                  {avgRating.toFixed(1)} <Star size={10} fill="currentColor" />
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3 text-xs text-[#86868b]">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 size={12} className={totalRatings > 0 ? "text-green-600" : "text-slate-400"} /> 
                                  {totalRatings} {t("landing.ratings")}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                <span>{officialCount} {t("landing.officials")}</span>
                              </div>
                            </div>
                            
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                              <ChevronRight size={18} className="text-[#86868b]" />
                            </div>
                          </div>
                        );
                      } catch (error) {
                        console.error('Error rendering department in list:', error, dept);
                        return null;
                      }
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Column 1: Category */}
            <div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white mb-4">Category</h3>
              <ul className="space-y-3 text-sm text-[#86868b]">
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Individuals</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Foreign Nationals</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Government Employees</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Overseas Indians</a></li>
              </ul>
            </div>

            {/* Column 2: My Government */}
            <div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white mb-4">My Government</h3>
              <ul className="space-y-3 text-sm text-[#86868b]">
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Constitution of India</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Government Directory</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Indian Parliament</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Judiciary</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Ministries</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">State Governments</a></li>
              </ul>
            </div>

            {/* Column 3: Explore India + News Hub */}
            <div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white mb-4">Explore India</h3>
              <ul className="space-y-3 text-sm text-[#86868b]">
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">About India</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">India at a Glance</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">National Symbols</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">States & UTs</a></li>
              </ul>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white mb-4 mt-8">News Hub</h3>
              <ul className="space-y-3 text-sm text-[#86868b]">
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Press Releases</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">News Updates</a></li>
              </ul>
            </div>

            {/* Column 4: About Us */}
            <div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white mb-4">About Us</h3>
              <ul className="space-y-3 text-sm text-[#86868b]">
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">About Portal</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Help</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Accessibility</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Sitemap</a></li>
              </ul>
            </div>

            {/* Column 5: Calendar */}
            <div>
              <h3 className="font-bold text-[#1d1d1f] dark:text-white mb-4">Calendar</h3>
              <ul className="space-y-3 text-sm text-[#86868b]">
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">National Holidays</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Government Events</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Important Dates</a></li>
                <li><a href="#" className="hover:text-[#0071e3] transition-colors">Public Holidays</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-8">
            <div className="text-center mb-6">
              <h4 className="font-bold text-[#1d1d1f] dark:text-white mb-4">Contact Us</h4>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#0071e3]" />
                  <span className="text-sm text-[#86868b]">+91 1800-123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#0071e3]" />
                  <a href="mailto:support@digitalgovernance.gov.in" className="text-sm text-[#86868b] hover:text-[#0071e3] transition-colors">
                    support@digitalgovernance.gov.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 text-center">
            <p className="text-sm text-[#86868b]">© 2025 Digital Governance Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
