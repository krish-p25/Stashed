import { useState } from "react";
import { AuthContext } from "./auth-context";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function readAuthFromStorage() {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  if (storedToken && isTokenValid(storedToken)) {
    let parsedUser = null;
    try {
      parsedUser = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      /* ignore */
    }
    return { token: storedToken, user: parsedUser };
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [{ token, user }, setAuth] = useState(() => readAuthFromStorage());

  async function login(email, password) {
    const res  = await fetch(`${API}/api/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Login failed.");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user",  JSON.stringify(data.user));
    setAuth({ token: data.token, user: data.user });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  }

  function updateUser(partial) {
    setAuth((prev) => {
      const next = { ...prev.user, ...partial };
      localStorage.setItem("user", JSON.stringify(next));
      return { ...prev, user: next };
    });
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, updateUser, initializing: false }}
    >
      {children}
    </AuthContext.Provider>
  );
}
