/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <> */
import { useEffect, useState } from "react";
import type { ApiResponse, AuthResponse } from "@/types/api";
import type { User } from "@/types/models";

export const useAuth = () => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/refresh");
      const data: ApiResponse<AuthResponse> = await response.json();

      if (data.success && data.data) {
        setUser(data.data.user);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data: ApiResponse<AuthResponse> = await response.json();

    if (data.success && data.data) {
      setUser(data.data.user);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch("/api/auth/logout");
    setUser(null);
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data: ApiResponse<AuthResponse> = await response.json();

    if (data.success && data.data) {
      setUser(data.data.user);
      return true;
    }
    return false;
  };

  return {
    user,
    loading,
    login,
    logout,
    signup,
  };
};
