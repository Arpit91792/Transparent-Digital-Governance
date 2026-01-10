import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Lock, Shield, Globe, Eye, EyeOff, Loader2 } from "lucide-react";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { OTPModal } from "@/components/otp-modal";
import { DynamicBackground } from "@/components/dynamic-background-universal";

export default function Settings() {
  const { user, setUser } = useAuth();
  const { language, setLanguage: setLanguageContext, t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);

  // Two-Factor Authentication State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<"email" | "otp">(
    (user?.twoFactorMethod as "email" | "otp") || "email"
  );
  const [isUpdating2FA, setIsUpdating2FA] = useState(false);

  // Language Selection State
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "All fields required",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match",
        variant: "destructive",
      });
      return;
    }

    if (!user?.email) {
      toast({
        title: "Email required",
        description: "Email address is required for password change verification",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      // Step 1: Verify current password and send OTP
      await apiRequest("POST", "/api/users/change-password/verify", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: "OTP sent to your email",
        description: "Please check your email and enter the verification code.",
      });

      // Open OTP modal
      setShowOTPModal(true);
    } catch (error: any) {
      toast({
        title: "Failed to verify password",
        description: error?.message || "Please verify your current password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleOTPVerify = async (otp: string): Promise<boolean> => {
    setIsVerifyingOTP(true);
    try {
      await apiRequest("PUT", "/api/users/change-password", {
        newPassword: passwordData.newPassword,
        otp: otp,
      });

      toast({
        title: "Password changed successfully!",
        description: "Your password has been updated.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowOTPModal(false);
      return true;
    } catch (error: any) {
      toast({
        title: "Failed to change password",
        description: error?.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    setIsUpdating2FA(true);
    try {
      const updatedUser = await apiRequest("PUT", "/api/users/two-factor", {
        enabled,
        method: enabled ? twoFactorMethod : null,
      });

      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setTwoFactorEnabled(enabled);

      toast({
        title: enabled ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
        description: enabled
          ? `2FA is now enabled via ${twoFactorMethod === "email" ? "Email" : "OTP"}`
          : "Your account is now using single-factor authentication",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update 2FA",
        description: error?.message || "Failed to update two-factor authentication settings.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating2FA(false);
    }
  };

  const handleLanguageChange = async (newLanguage: "en" | "hi") => {
    setIsUpdatingLanguage(true);
    try {
      const updatedUser = await apiRequest("PUT", "/api/users/language", {
        language: newLanguage,
      });

      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      setLanguageContext(newLanguage);

      toast({
        title: t("settings.languageUpdated"),
        description: `Language changed to ${newLanguage === "en" ? t("settings.english") : t("settings.hindi")}`,
      });
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error?.message || "Failed to update language preference.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingLanguage(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-slate-950 font-['Outfit',sans-serif] relative">
      <DynamicBackground variant="subtle" intensity="low" />
      {/* Header */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-6">
        <div className="w-full max-w-7xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm rounded-full px-6 py-3 pointer-events-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProfileDropdown className="mr-2" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Navigate to appropriate dashboard based on user role
                if (user?.role === "citizen") {
                  setLocation("/citizen/dashboard");
                } else if (user?.role === "official") {
                  setLocation("/official/dashboard");
                } else if (user?.role === "admin") {
                  setLocation("/admin/dashboard");
                } else if (user?.role === "judiciary") {
                  setLocation("/judiciary/dashboard");
                } else {
                  setLocation("/");
                }
              }}
              className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 -ml-2"
            >
              <ArrowLeft className="h-5 w-5 text-[#1d1d1f] dark:text-white" />
            </Button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-[#0071e3] shadow-lg shadow-blue-500/20">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sm tracking-tight text-[#1d1d1f] dark:text-white">
                {t("settings.title")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1d1d1f] dark:text-white mb-2">{t("settings.title")}</h1>
          <p className="text-lg text-[#86868b]">{t("settings.subtitle")}</p>
        </div>

        {/* Change Password Card */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[32px]">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#0071e3]">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#1d1d1f] dark:text-white">{t("settings.changePassword")}</CardTitle>
                <CardDescription className="text-[#86868b] mt-1">
                  {t("settings.changePasswordDesc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-semibold text-[#1d1d1f] dark:text-white">
                  {t("settings.currentPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pr-10"
                    placeholder={t("settings.enterCurrentPassword")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-semibold text-[#1d1d1f] dark:text-white">
                  {t("settings.newPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pr-10"
                    placeholder={t("settings.enterNewPassword")}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#1d1d1f] dark:text-white">
                  {t("settings.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pr-10"
                    placeholder={t("settings.confirmNewPassword")}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full h-12 rounded-full bg-[#0071e3] hover:bg-[#0077ED] text-white text-lg font-medium"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t("settings.updatingPassword")}
                  </>
                ) : (
                  t("settings.updatePassword")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication Card */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[32px]">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#1d1d1f] dark:text-white">
                  {t("settings.twoFactor")}
                </CardTitle>
                <CardDescription className="text-[#86868b] mt-1">
                  {t("settings.twoFactorDesc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            {/* 2FA Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[#1d1d1f] dark:text-white mb-1">{t("settings.enable2FA")}</h3>
                <p className="text-sm text-[#86868b]">
                  {t("settings.requireVerification")}
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
                disabled={isUpdating2FA}
                className="data-[state=checked]:bg-[#0071e3]"
              />
            </div>

            {/* 2FA Method Selection */}
            {twoFactorEnabled && (
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                <Label className="text-sm font-semibold text-[#1d1d1f] dark:text-white">
                  {t("settings.verificationMethod")}
                </Label>
                <Select
                  value={twoFactorMethod}
                  onValueChange={async (value: "email" | "otp") => {
                    setTwoFactorMethod(value);
                    if (twoFactorEnabled) {
                      // Update 2FA with new method
                      setIsUpdating2FA(true);
                      try {
                        const updatedUser = await apiRequest("PUT", "/api/users/two-factor", {
                          enabled: true,
                          method: value,
                        });
                        setUser(updatedUser);
                        sessionStorage.setItem("user", JSON.stringify(updatedUser));
                        toast({
                          title: t("common.success"),
                          description: `${t("settings.twoFactor")} method changed to ${value === "email" ? t("settings.emailOTP") : t("settings.smsOTP")}`,
                        });
                      } catch (error: any) {
                        toast({
                          title: t("common.error"),
                          description: error?.message || "Failed to update 2FA method.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsUpdating2FA(false);
                      }
                    }
                  }}
                  disabled={isUpdating2FA}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">{t("settings.emailOTP")}</SelectItem>
                    <SelectItem value="otp">{t("settings.smsOTP")}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#86868b]">
                  {twoFactorMethod === "email"
                    ? t("settings.emailOTPDesc")
                    : t("settings.smsOTPDesc")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Language Selection Card */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-[32px]">
          <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-[#1d1d1f] dark:text-white">{t("settings.language")}</CardTitle>
                <CardDescription className="text-[#86868b] mt-1">
                  {t("settings.languageDesc")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-[#1d1d1f] dark:text-white">{t("settings.selectLanguage")}</Label>
              <Select
                value={language}
                onValueChange={(value: "en" | "hi") => handleLanguageChange(value)}
                disabled={isUpdatingLanguage}
              >
                <SelectTrigger className="h-12 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t("settings.english")}</SelectItem>
                  <SelectItem value="hi">{t("settings.hindi")}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[#86868b]">
                {t("settings.languageUpdatedDesc")}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* OTP Modal for Password Change */}
      {user?.email && (
        <OTPModal
          open={showOTPModal}
          onClose={() => {
            setShowOTPModal(false);
            setIsVerifyingOTP(false);
          }}
          onVerify={handleOTPVerify}
          email={user.email}
          purpose="change-password"
        />
      )}
    </div>
  );
}

