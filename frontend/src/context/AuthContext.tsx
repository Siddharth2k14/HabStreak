import React, { type ReactNode } from "react";
import { loginRequest, refreshRequest, logoutRequest } from "../services/auth.service.ts";
import type { AuthContextType, AuthUser, LoginCredentials } from "../interfaces/auth.interface.ts";
import { authToken } from "../api/authToken.ts";

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refreshAccessToken = React.useCallback(async (): Promise<string> => {
    const response = await refreshRequest();

    authToken.set(response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.user);

    return response.accessToken;
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await loginRequest(credentials);

    authToken.set(response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      authToken.clear();
      setAccessToken(null);
      setUser(null);
    }
  };

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAccessToken();
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, [refreshAccessToken]);

  React.useEffect(() => {
      authToken.setAuthFailureHandler(() => {
          authToken.clear();
          setAccessToken(null);
          setUser(null);
      });
  
      return () => {
          authToken.setAuthFailureHandler(() => {});
      };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated: Boolean(accessToken), isLoading, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};