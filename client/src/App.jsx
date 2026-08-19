import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import ErrorBoundary from "./components/ui/ErrorBoundary";

import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Settings/Settings";
import Projects from "./pages/Projects/Projects";

import WorkspaceLayout from './pages/Workspace/WorkspaceLayout';
import StartupWorkspace from './pages/Workspace/StartupWorkspace';
import BusinessPlanPage from './pages/BusinessPlan/BusinessPlanPage';
import BrandingPage from './pages/Branding/BrandingPage';
import MVPPlannerPage from './pages/MVPPlanner/MVPPlannerPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/auth"
                  element={<Navigate to="/login" replace />}
                />
              </Route>

              <Route path="/" element={<Landing />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route
                  path="/projects/:projectId"
                  element={<WorkspaceLayout />}
                >
                  <Route index element={<StartupWorkspace />} />
                  <Route path="business-plan" element={<BusinessPlanPage />} />
                  <Route path="branding" element={<BrandingPage />} />
                  <Route path="mvp" element={<MVPPlannerPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster theme="system" />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
