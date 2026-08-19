import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing/Landing';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

import Projects from './pages/Projects/Projects';
import ProjectWorkspace from './pages/ProjectWorkspace/ProjectWorkspace';

import PitchDeckPage from './pages/PitchDeck/PitchDeckPage';
import DigitalTwinPage from './pages/DigitalTwin/DigitalTwin';
import MarketResearchPage from './pages/MarketResearch/MarketResearchPages';

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

              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route
                  path="/auth"
                  element={<Navigate to="/login" replace />}
                />
              </Route>

              <Route path="/" element={<Landing />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>

                  <Route path="/projects" element={<Projects />} />

                </Route>

                {/* Project Workspace */}
                <Route
                  path="/projects/:projectId"
                  element={<ProjectWorkspace />}
                />

                {/* Pitch Deck */}
                <Route
                  path="/projects/:projectId/pitch-deck"
                  element={<PitchDeckPage />}
                />

                {/* Digital Twin */}
                <Route
                  path="/projects/:projectId/digital-twin"
                  element={<DigitalTwinPage />}
                />

                {/* AI Market Research */}
                <Route
                  path="/projects/:projectId/market-research"
                  element={<MarketResearchPage />}
                />
              </Route>

              {/* Fallback */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>
          </BrowserRouter>

          <Toaster theme="system" />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;