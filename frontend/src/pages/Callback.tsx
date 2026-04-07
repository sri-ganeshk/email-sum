import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Callback() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((s) => s.setTokens);

  useEffect(() => {
    const hash = window.location.hash.slice(1); // remove leading #
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const userRaw = params.get("user");

    if (accessToken && userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setTokens(accessToken, user);
        // Clean the hash from the URL before navigating
        window.history.replaceState(null, "", window.location.pathname);
        navigate("/", { replace: true });
      } catch {
        navigate("/?error=invalid_callback", { replace: true });
      }
    } else {
      navigate("/?error=missing_tokens", { replace: true });
    }
  }, [navigate, setTokens]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Signing you in…</p>
      </div>
    </div>
  );
}
