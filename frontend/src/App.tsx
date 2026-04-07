import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { backendClient } from "./api/backendClient";
import LoginPage from "./components/auth/LoginPage";
import Callback from "./pages/Callback";
import Inbox from "./pages/Inbox";
import EmailPage from "./pages/EmailPage";
import { ToastContainer } from "./components/common/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setTokens, clearAuth } = useAuthStore();

  // On mount: attempt silent token refresh using HttpOnly cookie
  useEffect(() => {
    if (!isAuthenticated) {
      backendClient
        .post<{ access_token: string; user: any }>("/auth/refresh")
        .then(({ data }) => setTokens(data.access_token, data.user))
        .catch(() => clearAuth());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthGate>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/inbox" replace /> : <LoginPage />} />
            <Route path="/callback" element={<Callback />} />
            <Route
              path="/inbox"
              element={
                <ProtectedRoute>
                  <Inbox />
                </ProtectedRoute>
              }
            />
            <Route
              path="/email/:id"
              element={
                <ProtectedRoute>
                  <EmailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer />
        </AuthGate>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
