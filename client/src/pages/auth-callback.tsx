import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");
    const error = params.get("error");
    const suspended = params.get("suspended") === "true";
    const suspendedUntil = params.get("suspendedUntil");
    const hoursRemaining = params.get("hoursRemaining");

    // Handle error case
    if (error) {
      toast({
        title: "Authentication Failed",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    // Handle missing token
    if (!token || !role) {
      toast({
        title: "Authentication Error",
        description: "Missing authentication token. Please try logging in again.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    // Fetch user details and complete authentication
    const completeAuth = async () => {
      try {
        // Store token first
        localStorage.setItem("token", token);

        // Fetch user details
        const user = await apiRequest<User & { suspended?: boolean; suspendedUntil?: string; hoursRemaining?: number; suspensionReason?: string }>(
          "GET",
          "/api/auth/me"
        );

        // Store user in localStorage (7-day persistence)
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword as User);

        // Handle suspension
        if (suspended || user.suspended) {
          const hours = hoursRemaining ? parseInt(hoursRemaining, 10) : 0;
          toast({
            title: "Account Suspended",
            description: `You have reached the maximum submission limit. Your account is temporarily suspended.${hours > 0 ? ` ${hours} hours remaining.` : ""}`,
            variant: "destructive",
            duration: 10000,
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "Logged in successfully",
          });
        }

        // Redirect based on role
        if (role === "admin") {
          setLocation("/admin/dashboard");
        } else if (role === "official") {
          setLocation("/official/dashboard");
        } else {
          setLocation("/citizen/dashboard");
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        toast({
          title: "Authentication Error",
          description: err?.message || "Failed to complete authentication. Please try again.",
          variant: "destructive",
        });
        setLocation("/login");
      }
    };

    completeAuth();
  }, [setLocation, setUser, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-slate-950">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#0071e3] mx-auto" />
        <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white">Completing authentication...</h2>
        <p className="text-[#86868b]">Please wait while we log you in</p>
      </div>
    </div>
  );
}

