import { api, refreshClient } from "../api/axios";
import type {
  AuthResponse,
  LoginCredentials,
  ResendVerificationResponse,
} from "../interfaces/auth.interface";

export const loginRequest = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", credentials);

  return response.data;
};

export const refreshRequest = async () => {
  const response = await refreshClient.post<AuthResponse>("/api/auth/refresh");

  return response.data;
};

export const logoutRequest = async (): Promise<void> => {
  await api.post("/api/auth/logout");
};

export const resendVerficationRequest = async (
  email: string
) => {
  const response = await api.post<ResendVerificationResponse>("/api/auth/resend-verification", {
    email,
  });

  return response.data;
};
