import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import ErrorBoundary from './components/ui/ErrorBoundary';

import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing/Landing';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import Projects from './pages/Projects/Projects';

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
        <BrowserRouter>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Landing />} />
            </Route>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/projects" element={<Projects />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster theme="system" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
