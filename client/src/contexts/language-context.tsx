import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import { useAuth } from "./auth-context";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation files
const translations = {
  en: {
    // Settings Page
    "settings.title": "Account Settings",
    "settings.subtitle": "Manage your account security and preferences",
    "settings.changePassword": "Change Password",
    "settings.changePasswordDesc": "Update your password to keep your account secure",
    "settings.currentPassword": "Current Password",
    "settings.newPassword": "New Password",
    "settings.confirmPassword": "Confirm New Password",
    "settings.enterCurrentPassword": "Enter your current password",
    "settings.enterNewPassword": "Enter your new password (min 6 characters)",
    "settings.confirmNewPassword": "Confirm your new password",
    "settings.updatePassword": "Update Password",
    "settings.updatingPassword": "Updating Password...",
    "settings.twoFactor": "Two-Factor Authentication",
    "settings.twoFactorDesc": "Add an extra layer of security to your account",
    "settings.enable2FA": "Enable Two-Factor Authentication",
    "settings.requireVerification": "Require a verification code in addition to your password when signing in",
    "settings.verificationMethod": "Verification Method",
    "settings.emailOTP": "Email OTP",
    "settings.smsOTP": "SMS OTP",
    "settings.emailOTPDesc": "You'll receive a verification code via email",
    "settings.smsOTPDesc": "You'll receive a verification code via SMS",
    "settings.language": "Language",
    "settings.languageDesc": "Choose your preferred language for the interface",
    "settings.selectLanguage": "Select Language",
    "settings.languageUpdated": "Language updated",
    "settings.languageUpdatedDesc": "The interface language will be updated immediately",
    "settings.english": "English",
    "settings.hindi": "हिंदी (Hindi)",
    
    // Profile Dropdown
    "profile.accountSettings": "Account Settings",
    "profile.logout": "Logout",
    "profile.fullName": "Full Name",
    "profile.email": "Email ID",
    "profile.phone": "Phone",
    "profile.username": "Username / User ID",
    "profile.role": "Role",
    "profile.department": "Department",
    
    // Common
    "common.back": "Back",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.close": "Close",
    
    // Landing Page
    "landing.getStarted": "Get Started",
    "landing.login": "Login",
    "landing.submitApplication": "Submit Application",
    "landing.trackStatus": "Track Status",
    "landing.liveGovernance": "Live Governance System",
    "landing.platform": "Platform",
    "landing.popularServices": "Popular Services",
    "landing.mostAccessed": "Most accessed government services this month",
    "landing.viewAll": "View All",
    "landing.publicDashboard": "Public Dashboard",
    "landing.overallPerformance": "Overall Performance",
    "landing.basedOnRatings": "Based on {count} verified citizen ratings",
    "landing.departmentRatings": "Department Ratings",
    "landing.departmentsListed": "Departments Listed",
    "landing.ratings": "Ratings",
    "landing.officials": "Officials",
    "landing.whyRatingsMatter": "Why Ratings Matter?",
    "landing.ratingsMatterDesc": "Department ratings directly impact funding allocation and official performance reviews. Your feedback drives real change.",
    "landing.realTimeTracking": "Real-time Tracking",
    "landing.realTimeTrackingDesc": "Monitor your application's progress at every step. Get instant notifications and detailed timeline updates.",
    "landing.blockchainVerified": "Blockchain Verified",
    "landing.blockchainVerifiedDesc": "Every approval is secured on the blockchain, ensuring tamper-proof records and absolute transparency.",
    "landing.aiMonitoring": "AI Monitoring",
    "landing.aiMonitoringDesc": "Smart algorithms detect delays and automatically escalate issues to higher authorities.",
    "landing.candidateSelection": "Candidate Selection",
    "landing.candidateSelectionDesc": "Participate in transparent internal primaries. Empower citizens to select party candidates and end dynasty politics.",
    "landing.exploreCandidates": "Explore Candidates",
    "landing.applications": "Applications",
    "landing.successRate": "Success Rate",
    "landing.userRating": "User Rating",
    "landing.avgTime": "Avg Time",
    "landing.days": "Days",
    
    // Dashboard
    "dashboard.welcome": "Welcome",
    "dashboard.dashboard": "Dashboard",
    "dashboard.applications": "Applications",
    "dashboard.total": "Total",
    "dashboard.pending": "Pending",
    "dashboard.approved": "Approved",
    "dashboard.rejected": "Rejected",
    "dashboard.submitNew": "Submit New Application",
    "dashboard.trackApplication": "Track Application",
    "dashboard.viewDetails": "View Details",
    "dashboard.noApplications": "No applications found",
    "dashboard.filter": "Filter",
    "dashboard.all": "All",
    "dashboard.logout": "Logout",
    "dashboard.assigned": "Assigned",
    "dashboard.inProgress": "In Progress",
    "dashboard.solved": "Solved",
    "dashboard.warnings": "Warnings",
    "dashboard.searchApplications": "Search applications...",
    "dashboard.welcomeBack": "Welcome back",
    "dashboard.dailyOverview": "Here's your daily overview",
    "dashboard.manageApplications": "Manage your applications and requests",
    
    // Login Page
    "login.welcomeToAccountability": "Welcome to Accountability",
    "login.selectRole": "Select your role to continue",
    "login.citizen": "Citizen",
    "login.citizenDesc": "Submit applications, track status, and rate services",
    "login.official": "Official",
    "login.officialDesc": "Process applications and manage department tasks",
    "login.admin": "Admin",
    "login.adminDesc": "Monitor system performance and manage users",
    "login.dontHaveAccount": "Don't have an account?",
    "login.registerNow": "Register Now",
    "login.welcomeBack": "Welcome Back",
    "login.signIn": "Sign in to your account",
    "login.back": "Back",
    "login.mobile": "Mobile",
    "login.email": "Email",
    "login.mobileNumber": "Mobile Number",
    "login.enter10Digit": "Enter 10-digit number",
    "login.password": "Password",
    "login.enterPassword": "Enter password",
    "login.usernameOrEmail": "Username or Email",
    "login.enterUsernameOrEmail": "Enter username or email",
    "login.forgotPassword": "Forgot Password?",
    "login.sendOTP": "Send OTP",
    "login.login": "Login",
    "login.processing": "Processing...",
    
    // Register Page
    "register.joinAccountability": "Join Accountability",
    "register.selectRoleToStart": "Select your role to get started",
    "register.alreadyHaveAccount": "Already have an account?",
    "register.login": "Login",
    "register.createAccount": "Create Account",
    "register.joinPlatform": "Join our smart governance platform",
    "register.back": "Back",
    "register.fullName": "Full Name",
    "register.enterFullName": "Enter your full name",
    "register.email": "Email",
    "register.enterEmail": "Enter your email",
    "register.mobileNumber": "Mobile Number",
    "register.enter10Digit": "Enter 10-digit number",
    "register.department": "Department",
    "register.selectDepartment": "Select Department",
    "register.subDepartment": "Sub-Department",
    "register.selectSubDepartment": "Select Sub-Department",
    "register.secretKey": "Secret Key",
    "register.enterAdminSecretKey": "Enter Admin Secret Key",
    "register.enterOfficialSecretKey": "Enter Official Secret Key",
    "register.documentType": "Document Type",
    "register.selectDocumentType": "Select document type",
    "register.aadhaarCard": "Aadhaar Card",
    "register.panCard": "PAN Card",
    "register.voterID": "Voter ID",
    "register.drivingLicense": "Driving License",
    "register.passport": "Passport",
    "register.aadhaarNumber": "Aadhaar Number",
    "register.panNumber": "PAN Number",
    "register.voterIDNumber": "Voter ID Number",
    "register.drivingLicenseNumber": "Driving License Number",
    "register.passportNumber": "Passport Number",
    "register.enterDocumentNumber": "Enter document number",
    "register.username": "Username",
    "register.chooseUsername": "Choose a username",
    "register.password": "Password",
    "register.confirm": "Confirm",
    "register.register": "Register",
    "register.registering": "Registering...",
    
    // Official Dashboard
    "official.dashboard": "Dashboard",
    "official.welcomeBack": "Welcome back",
    "official.dailyOverview": "Here's your daily overview",
    "official.searchApplications": "Search applications...",
    "official.assigned": "Assigned",
    "official.pendingReview": "Pending Review",
    "official.completedToday": "Completed Today",
    "official.avgProcessingTime": "Avg Processing Time",
    "official.allApplications": "All Applications",
    "official.recentActivity": "Recent Activity",
    
    // Admin Dashboard
    "admin.dashboard": "Dashboard",
    "admin.departmentStats": "Department Statistics",
    "admin.totalApplications": "Total Applications",
    "admin.assignedCount": "Assigned",
    "admin.approvedCount": "Approved",
    "admin.rejectedCount": "Rejected",
    "admin.pendingCount": "Pending",
    "admin.solvedCount": "Solved",
    "admin.unsolvedCount": "Unsolved",
    "admin.warningsSent": "Warnings Sent",
    "admin.officials": "Officials",
    "admin.viewDetails": "View Details",
    "admin.sendWarning": "Send Warning",
    "admin.warningMessage": "Warning Message",
    "admin.enterWarningMessage": "Enter warning message for this official",
    "admin.send": "Send",
    "admin.cancel": "Cancel",
    "common.message": "Message",
    "official.assigned": "Assigned to Me",
    "official.pendingReview": "Pending Review",
    "official.completedToday": "Completed Today",
    "official.avgProcessingTime": "Avg. Processing Time",
  },
  hi: {
    // Settings Page
    "settings.title": "खाता सेटिंग्स",
    "settings.subtitle": "अपनी खाता सुरक्षा और प्राथमिकताएं प्रबंधित करें",
    "settings.changePassword": "पासवर्ड बदलें",
    "settings.changePasswordDesc": "अपने खाते को सुरक्षित रखने के लिए अपना पासवर्ड अपडेट करें",
    "settings.currentPassword": "वर्तमान पासवर्ड",
    "settings.newPassword": "नया पासवर्ड",
    "settings.confirmPassword": "नया पासवर्ड पुष्टि करें",
    "settings.enterCurrentPassword": "अपना वर्तमान पासवर्ड दर्ज करें",
    "settings.enterNewPassword": "अपना नया पासवर्ड दर्ज करें (न्यूनतम 6 अक्षर)",
    "settings.confirmNewPassword": "अपना नया पासवर्ड पुष्टि करें",
    "settings.updatePassword": "पासवर्ड अपडेट करें",
    "settings.updatingPassword": "पासवर्ड अपडेट हो रहा है...",
    "settings.twoFactor": "दो-कारक प्रमाणीकरण",
    "settings.twoFactorDesc": "अपने खाते में एक अतिरिक्त सुरक्षा परत जोड़ें",
    "settings.enable2FA": "दो-कारक प्रमाणीकरण सक्षम करें",
    "settings.requireVerification": "साइन इन करते समय अपने पासवर्ड के अलावा एक सत्यापन कोड की आवश्यकता होगी",
    "settings.verificationMethod": "सत्यापन विधि",
    "settings.emailOTP": "ईमेल OTP",
    "settings.smsOTP": "SMS OTP",
    "settings.emailOTPDesc": "आपको ईमेल के माध्यम से एक सत्यापन कोड प्राप्त होगा",
    "settings.smsOTPDesc": "आपको SMS के माध्यम से एक सत्यापन कोड प्राप्त होगा",
    "settings.language": "भाषा",
    "settings.languageDesc": "इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें",
    "settings.selectLanguage": "भाषा चुनें",
    "settings.languageUpdated": "भाषा अपडेट की गई",
    "settings.languageUpdatedDesc": "इंटरफ़ेस भाषा तुरंत अपडेट हो जाएगी",
    "settings.english": "अंग्रेजी",
    "settings.hindi": "हिंदी",
    
    // Profile Dropdown
    "profile.accountSettings": "खाता सेटिंग्स",
    "profile.logout": "लॉगआउट",
    "profile.fullName": "पूरा नाम",
    "profile.email": "ईमेल आईडी",
    "profile.phone": "फोन",
    "profile.username": "उपयोगकर्ता नाम / उपयोगकर्ता आईडी",
    "profile.role": "भूमिका",
    "profile.department": "विभाग",
    
    // Common
    "common.back": "वापस",
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.success": "सफल",
    "common.cancel": "रद्द करें",
    "common.save": "सहेजें",
    "common.close": "बंद करें",
    
    // Landing Page
    "landing.getStarted": "शुरू करें",
    "landing.login": "लॉगिन",
    "landing.submitApplication": "आवेदन जमा करें",
    "landing.trackStatus": "स्थिति ट्रैक करें",
    "landing.liveGovernance": "लाइव शासन प्रणाली",
    "landing.platform": "प्लेटफॉर्म",
    "landing.popularServices": "लोकप्रिय सेवाएं",
    "landing.mostAccessed": "इस महीने सबसे अधिक एक्सेस की गई सरकारी सेवाएं",
    "landing.viewAll": "सभी देखें",
    "landing.publicDashboard": "सार्वजनिक डैशबोर्ड",
    "landing.overallPerformance": "समग्र प्रदर्शन",
    "landing.basedOnRatings": "{count} सत्यापित नागरिक रेटिंग के आधार पर",
    "landing.departmentRatings": "विभाग रेटिंग",
    "landing.departmentsListed": "विभाग सूचीबद्ध",
    "landing.ratings": "रेटिंग",
    "landing.officials": "अधिकारी",
    "landing.whyRatingsMatter": "रेटिंग क्यों मायने रखती है?",
    "landing.ratingsMatterDesc": "विभाग रेटिंग सीधे फंड आवंटन और अधिकारी प्रदर्शन समीक्षा को प्रभावित करती है। आपकी प्रतिक्रिया वास्तविक परिवर्तन लाती है।",
    "landing.realTimeTracking": "रीयल-टाइम ट्रैकिंग",
    "landing.realTimeTrackingDesc": "हर कदम पर अपने आवेदन की प्रगति की निगरानी करें। तत्काल सूचनाएं और विस्तृत समयरेखा अपडेट प्राप्त करें।",
    "landing.blockchainVerified": "ब्लॉकचेन सत्यापित",
    "landing.blockchainVerifiedDesc": "हर स्वीकृति ब्लॉकचेन पर सुरक्षित है, जो छेड़छाड़-प्रूफ रिकॉर्ड और पूर्ण पारदर्शिता सुनिश्चित करती है।",
    "landing.aiMonitoring": "AI निगरानी",
    "landing.aiMonitoringDesc": "स्मार्ट एल्गोरिदम देरी का पता लगाते हैं और स्वचालित रूप से मुद्दों को उच्च अधिकारियों तक बढ़ाते हैं।",
    "landing.candidateSelection": "उम्मीदवार चयन",
    "landing.candidateSelectionDesc": "पारदर्शी आंतरिक प्राथमिकताओं में भाग लें। नागरिकों को पार्टी उम्मीदवारों का चयन करने और राजवंश राजनीति को समाप्त करने के लिए सशक्त बनाएं।",
    "landing.exploreCandidates": "उम्मीदवारों का अन्वेषण करें",
    "landing.applications": "आवेदन",
    "landing.successRate": "सफलता दर",
    "landing.userRating": "उपयोगकर्ता रेटिंग",
    "landing.avgTime": "औसत समय",
    "landing.days": "दिन",
    
    // Dashboard
    "dashboard.welcome": "स्वागत है",
    "dashboard.dashboard": "डैशबोर्ड",
    "dashboard.applications": "आवेदन",
    "dashboard.total": "कुल",
    "dashboard.pending": "लंबित",
    "dashboard.approved": "अनुमोदित",
    "dashboard.rejected": "अस्वीकृत",
    "dashboard.submitNew": "नया आवेदन जमा करें",
    "dashboard.trackApplication": "आवेदन ट्रैक करें",
    "dashboard.viewDetails": "विवरण देखें",
    "dashboard.noApplications": "कोई आवेदन नहीं मिला",
    "dashboard.filter": "फ़िल्टर",
    "dashboard.all": "सभी",
    "dashboard.logout": "लॉगआउट",
    "dashboard.assigned": "नियत",
    "dashboard.inProgress": "प्रगति में",
    "dashboard.solved": "हल",
    "dashboard.warnings": "चेतावनियां",
    "dashboard.searchApplications": "आवेदन खोजें...",
    "dashboard.welcomeBack": "वापसी पर स्वागत है",
    "dashboard.dailyOverview": "यहां आपका दैनिक अवलोकन है",
    "dashboard.manageApplications": "अपने आवेदन और अनुरोध प्रबंधित करें",
    
    // Login Page
    "login.welcomeToAccountability": "Accountability में आपका स्वागत है",
    "login.selectRole": "जारी रखने के लिए अपनी भूमिका चुनें",
    "login.citizen": "नागरिक",
    "login.citizenDesc": "आवेदन जमा करें, स्थिति ट्रैक करें और सेवाओं को रेट करें",
    "login.official": "अधिकारी",
    "login.officialDesc": "आवेदन प्रसंस्करण करें और विभाग कार्य प्रबंधित करें",
    "login.admin": "एडमिन",
    "login.adminDesc": "सिस्टम प्रदर्शन की निगरानी करें और उपयोगकर्ताओं को प्रबंधित करें",
    "login.dontHaveAccount": "खाता नहीं है?",
    "login.registerNow": "अभी पंजीकरण करें",
    "login.welcomeBack": "वापसी पर स्वागत है",
    "login.signIn": "अपने खाते में साइन इन करें",
    "login.back": "वापस",
    "login.mobile": "मोबाइल",
    "login.email": "ईमेल",
    "login.mobileNumber": "मोबाइल नंबर",
    "login.enter10Digit": "10 अंकों का नंबर दर्ज करें",
    "login.password": "पासवर्ड",
    "login.enterPassword": "पासवर्ड दर्ज करें",
    "login.usernameOrEmail": "उपयोगकर्ता नाम या ईमेल",
    "login.enterUsernameOrEmail": "उपयोगकर्ता नाम या ईमेल दर्ज करें",
    "login.forgotPassword": "पासवर्ड भूल गए?",
    "login.sendOTP": "OTP भेजें",
    "login.login": "लॉगिन",
    "login.processing": "प्रसंस्करण...",
    
    // Register Page
    "register.joinAccountability": "Accountability में शामिल हों",
    "register.selectRoleToStart": "शुरू करने के लिए अपनी भूमिका चुनें",
    "register.alreadyHaveAccount": "पहले से खाता है?",
    "register.login": "लॉगिन",
    "register.createAccount": "खाता बनाएं",
    "register.joinPlatform": "हमारे स्मार्ट शासन प्लेटफॉर्म में शामिल हों",
    "register.back": "वापस",
    "register.fullName": "पूरा नाम",
    "register.enterFullName": "अपना पूरा नाम दर्ज करें",
    "register.email": "ईमेल",
    "register.enterEmail": "अपना ईमेल दर्ज करें",
    "register.mobileNumber": "मोबाइल नंबर",
    "register.enter10Digit": "10 अंकों का नंबर दर्ज करें",
    "register.department": "विभाग",
    "register.selectDepartment": "विभाग चुनें",
    "register.subDepartment": "उप-विभाग",
    "register.selectSubDepartment": "उप-विभाग चुनें",
    "register.secretKey": "गुप्त कुंजी",
    "register.enterAdminSecretKey": "एडमिन गुप्त कुंजी दर्ज करें",
    "register.enterOfficialSecretKey": "अधिकारी गुप्त कुंजी दर्ज करें",
    "register.documentType": "दस्तावेज़ प्रकार",
    "register.selectDocumentType": "दस्तावेज़ प्रकार चुनें",
    "register.aadhaarCard": "आधार कार्ड",
    "register.panCard": "पैन कार्ड",
    "register.voterID": "मतदाता आईडी",
    "register.drivingLicense": "ड्राइविंग लाइसेंस",
    "register.passport": "पासपोर्ट",
    "register.aadhaarNumber": "आधार नंबर",
    "register.panNumber": "पैन नंबर",
    "register.voterIDNumber": "मतदाता आईडी नंबर",
    "register.drivingLicenseNumber": "ड्राइविंग लाइसेंस नंबर",
    "register.passportNumber": "पासपोर्ट नंबर",
    "register.enterDocumentNumber": "दस्तावेज़ नंबर दर्ज करें",
    "register.username": "उपयोगकर्ता नाम",
    "register.chooseUsername": "एक उपयोगकर्ता नाम चुनें",
    "register.password": "पासवर्ड",
    "register.confirm": "पुष्टि करें",
    "register.register": "पंजीकरण करें",
    "register.registering": "पंजीकरण हो रहा है...",
    
    // Official Dashboard
    "official.dashboard": "डैशबोर्ड",
    "official.welcomeBack": "वापसी पर स्वागत है",
    "official.dailyOverview": "यहां आपका दैनिक अवलोकन है",
    "official.searchApplications": "आवेदन खोजें...",
    "official.assigned": "नियत",
    "official.pendingReview": "लंबित समीक्षा",
    "official.completedToday": "आज पूर्ण",
    "official.avgProcessingTime": "औसत प्रसंस्करण समय",
    "official.allApplications": "सभी आवेदन",
    "official.recentActivity": "हाल की गतिविधि",
    
    // Admin Dashboard
    "admin.dashboard": "डैशबोर्ड",
    "admin.departmentStats": "विभाग आंकड़े",
    "admin.totalApplications": "कुल आवेदन",
    "admin.assignedCount": "नियत",
    "admin.approvedCount": "अनुमोदित",
    "admin.rejectedCount": "अस्वीकृत",
    "admin.pendingCount": "लंबित",
    "admin.solvedCount": "हल",
    "admin.unsolvedCount": "अनसुलझा",
    "admin.warningsSent": "चेतावनियां भेजी गईं",
    "admin.officials": "अधिकारी",
    "admin.viewDetails": "विवरण देखें",
    "admin.sendWarning": "चेतावनी भेजें",
    "admin.warningMessage": "चेतावनी संदेश",
    "admin.enterWarningMessage": "इस अधिकारी के लिए चेतावनी संदेश दर्ज करें",
    "admin.send": "भेजें",
    "admin.cancel": "रद्द करें",
    "common.message": "संदेश",
    "official.assigned": "मुझे नियत",
    "official.pendingReview": "लंबित समीक्षा",
    "official.completedToday": "आज पूर्ण",
    "official.avgProcessingTime": "औसत प्रसंस्करण समय",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get user from auth context - must be called unconditionally
  // Since LanguageProvider is inside AuthProvider in App.tsx, this should always work
  const authContext = useAuth();
  const user = authContext?.user || null;
  
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first, then user preference, then default to "en"
    const storedLang = localStorage.getItem("language") as Language | null;
    if (storedLang) return storedLang;
    if (user?.language) return user.language as Language;
    return "en";
  });

  // Update language when user logs in or changes
  useEffect(() => {
    if (user?.language) {
      // User has a language preference in database - use it and sync to localStorage
      setLanguageState(user.language as Language);
      localStorage.setItem("language", user.language);
    } else if (user && !user.language) {
      // User logged in but no language preference - use localStorage if available
      const storedLang = localStorage.getItem("language") as Language | null;
      if (storedLang) {
        setLanguageState(storedLang);
        // Optionally sync to database (but don't force it)
      }
    }
  }, [user?.language, user]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  }, [language]);

  // Memoize the context value to ensure stability and prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  // Always provide the context, even if there was an issue with useAuth
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

