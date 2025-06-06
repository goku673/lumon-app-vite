import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthGuard({
  children,
  tokenName = "token",
  redirectTo = "/auth/signIn"
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(tokenName) : null;
    if (!token) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, tokenName, redirectTo]);

  return children || null;
}