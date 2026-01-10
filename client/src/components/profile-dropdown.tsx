import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, Mail, UserCircle } from "lucide-react";

interface ProfileDropdownProps {
  className?: string;
}

export function ProfileDropdown({ className = "" }: ProfileDropdownProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setLocation("/");
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#0071e3] to-blue-600 hover:from-[#0077ED] hover:to-blue-700 text-white flex items-center justify-center font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 overflow-hidden"
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          getInitials(user.fullName)
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Profile Header */}
          <div className="p-6 bg-gradient-to-br from-[#0071e3] to-blue-600 text-white">
            <div className="flex items-center gap-4">
              {/* Profile Photo/Avatar */}
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl border-2 border-white/30 overflow-hidden">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(user.fullName)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{user.fullName}</h3>
                <p className="text-sm text-blue-100 truncate">{user.email || user.phone}</p>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="p-4 space-y-3 border-b border-slate-200 dark:border-slate-800">
            {/* Full Name */}
            <div className="flex items-center gap-3 text-sm">
              <UserCircle className="h-4 w-4 text-[#86868b] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#86868b] dark:text-slate-400">{t("profile.fullName")}</p>
                <p className="font-medium text-[#1d1d1f] dark:text-white truncate">{user.fullName}</p>
              </div>
            </div>

            {/* Email */}
            {user.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-[#86868b] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#86868b] dark:text-slate-400">{t("profile.email")}</p>
                  <p className="font-medium text-[#1d1d1f] dark:text-white truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Phone */}
            {user.phone && (
              <div className="flex items-center gap-3 text-sm">
                <UserCircle className="h-4 w-4 text-[#86868b] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#86868b] dark:text-slate-400">{t("profile.phone")}</p>
                  <p className="font-medium text-[#1d1d1f] dark:text-white truncate">{user.phone}</p>
                </div>
              </div>
            )}

            {/* Username / User ID */}
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-[#86868b] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#86868b] dark:text-slate-400">{t("profile.username")}</p>
                <p className="font-medium text-[#1d1d1f] dark:text-white truncate">{user.username}</p>
              </div>
            </div>

            {/* Role */}
            {user.role && (
              <div className="flex items-center gap-3 text-sm">
                <UserCircle className="h-4 w-4 text-[#86868b] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#86868b] dark:text-slate-400">{t("profile.role")}</p>
                  <p className="font-medium text-[#1d1d1f] dark:text-white capitalize">{user.role}</p>
                </div>
              </div>
            )}

            {/* Department (if applicable) */}
            {user.department && (
              <div className="flex items-center gap-3 text-sm">
                <UserCircle className="h-4 w-4 text-[#86868b] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#86868b] dark:text-slate-400">{t("profile.department")}</p>
                  <p className="font-medium text-[#1d1d1f] dark:text-white truncate">{user.department}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 space-y-2">
            {/* Account Settings Button */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-[#1d1d1f] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              onClick={() => {
                setIsOpen(false);
                setLocation("/settings");
              }}
            >
              <Settings className="h-4 w-4" />
              {t("profile.accountSettings")}
            </Button>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t("profile.logout")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

