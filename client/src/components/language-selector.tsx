import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function LanguageSelector() {
  const { language, setLanguage: setLanguageContext, t } = useLanguage();
  const { user, setUser } = useAuth();
  const { toast } = useToast();

  const handleLanguageChange = async (newLanguage: "en" | "hi") => {
    // Update language immediately in context and localStorage
    setLanguageContext(newLanguage);
    localStorage.setItem("language", newLanguage);
    
    // If user is logged in, save preference to database
    if (user) {
      try {
        const updatedUser = await apiRequest("PUT", "/api/users/language", {
          language: newLanguage,
        });
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error: any) {
        console.error("Failed to update language preference:", error);
        // Still allow language change even if API call fails
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-[#1d1d1f] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0071e3]"
          aria-label="Select language"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
        <DropdownMenuItem
          onClick={() => handleLanguageChange("en")}
          className={`cursor-pointer rounded-lg ${
            language === "en"
              ? "bg-[#0071e3] text-white"
              : "text-[#1d1d1f] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🇬🇧</span>
            English
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange("hi")}
          className={`cursor-pointer rounded-lg ${
            language === "hi"
              ? "bg-[#0071e3] text-white"
              : "text-[#1d1d1f] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🇮🇳</span>
            हिंदी
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

