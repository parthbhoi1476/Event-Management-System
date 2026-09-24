import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "authenticated" | "unauthenticated"

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("eventflow_token");
    const storedUser = localStorage.getItem("eventflow_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem("eventflow_token", newToken);
    localStorage.setItem("eventflow_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setStatus("authenticated");
  };

  const logout = () => {
    localStorage.removeItem("eventflow_token");
    localStorage.removeItem("eventflow_user");
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  };

  // Update user info in context + localStorage (e.g., after profile update)
  const updateUser = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    localStorage.setItem("eventflow_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        status,
        isAuthenticated: status === "authenticated",
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
