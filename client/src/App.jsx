import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

import PublicRoute from "./components/common/PublicRoute";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ProtectedRoute from "./components/common/ProtectedRoute";

import AppLayout from "./layouts/AppLayout";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";


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
