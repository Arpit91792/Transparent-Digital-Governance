import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import CitizenDashboard from "@/pages/citizen/dashboard";
import SubmitApplication from "@/pages/citizen/submit-application";
import TrackApplication from "@/pages/citizen/track-application";
import ApplicationDetails from "@/pages/citizen/application-details";
import Contact from "@/pages/contact";
import OfficialDashboard from "@/pages/official/dashboard";
import AdminDashboard from "@/pages/admin/dashboard";
import CandidateSelection from "@/pages/candidate-selection";
import JudiciaryDashboard from "@/pages/judiciary/dashboard";
import FileCase from "@/pages/judiciary/file-case";
import LitigantPortal from "@/pages/judiciary/litigant-portal";
import CaseDetails from "@/pages/judiciary/case-details";
import ScrutinyPortal from "@/pages/official/scrutiny-portal";
import Settings from "@/pages/settings";

import { SessionGuard } from "@/components/session-guard";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { ErrorBoundary } from "@/components/error-boundary";
import AuthCallback from "@/pages/auth-callback";

function ProtectedRoute({ component: Component, allowedRoles }: { component: React.ComponentType; allowedRoles: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#86868b]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  // Safely check user role with proper null/undefined handling
  if (!user.role || typeof user.role !== 'string') {
    console.error('User role is missing or invalid:', user);
    return <Redirect to="/login" />;
  }

  if (!Array.isArray(allowedRoles) || !allowedRoles.includes(user.role)) {
    return <Redirect to="/" />;
  }

  try {
    return <Component />;
  } catch (error) {
    console.error('Error rendering protected component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-slate-950">
        <div className="text-center space-y-4">
          <p className="text-red-500">Error loading dashboard. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/contact" component={Contact} />
      <Route path="/election/candidates" component={CandidateSelection} />
      <Route path="/judiciary" component={JudiciaryDashboard} />
      <Route path="/judiciary/dashboard" component={JudiciaryDashboard} />
      <Route path="/judiciary/file" component={FileCase} />
      <Route path="/judiciary/portal" component={LitigantPortal} />
      <Route path="/judiciary/cases/:id" component={CaseDetails} />

      <Route path="/citizen/dashboard">
        {() => <ProtectedRoute component={CitizenDashboard} allowedRoles={["citizen"]} />}
      </Route>
      <Route path="/citizen/submit">
        {() => <ProtectedRoute component={SubmitApplication} allowedRoles={["citizen"]} />}
      </Route>
      <Route path="/track" component={TrackApplication} />
      <Route path="/citizen/track">
        {() => <ProtectedRoute component={TrackApplication} allowedRoles={["citizen"]} />}
      </Route>
      <Route path="/citizen/application/:id">
        {() => <ProtectedRoute component={ApplicationDetails} allowedRoles={["citizen"]} />}
      </Route>

      <Route path="/official/dashboard">
        {() => <ProtectedRoute component={OfficialDashboard} allowedRoles={["official"]} />}
      </Route>

      {/* New Scrutiny Portal Route */}
      <Route path="/official/scrutiny">
         {() => <ProtectedRoute component={ScrutinyPortal} allowedRoles={["official"]} />}
      </Route>

      <Route path="/admin/dashboard">
        {() => <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}
      </Route>

      {/* Settings - Available to all logged-in users */}
      <Route path="/settings">
        {() => <ProtectedRoute component={Settings} allowedRoles={["citizen", "official", "admin", "judiciary"]} />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <SessionGuard />
            <TooltipProvider>
              <Toaster />
              <ChatbotWidget />
              <ErrorBoundary>
                <Router />
              </ErrorBoundary>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
