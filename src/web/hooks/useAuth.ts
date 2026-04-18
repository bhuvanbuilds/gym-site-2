import { useState, useEffect } from "react";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [planExpiry, setPlanExpiry] = useState("");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        if (data.authenticated) {
          setUsername(data.username);
          setPlanExpiry(data.planExpiry);
        }
      })
      .catch(() => setAuthenticated(false));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
    window.location.href = "/admin/login";
  };

  return { authenticated, username, planExpiry, logout };
}
