import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LoginPage from "./LoginPage";
import { useAuth } from "../../context/AuthContext";
import type { LoginForm } from "./types";
import { resendVerficationRequest } from "../../services/auth.service";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [auth, setAuth] = React.useState<LoginForm>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [showResendVerification, setShowResendVerification] = React.useState(false);

  const validateForm = (): boolean => {
    if (!auth.email || !auth.password) {
      toast.error("Please fill all the fields");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(auth.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (auth.password.length < 8 || auth.password.length > 32) {
      toast.error("Password must be between 8 and 32 characters");
      return false;
    }

    return true;
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsSubmitting(true);
      await login({
        email: auth.email,
        password: auth.password,
      });
      
      toast.success("Login successful");
      navigate("/home-page", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.data?.message ===
          "Too many login attempts. Please try again later."
        ) {
          toast.error("Too many login attempts. Please try again later.");
        } else if (error.response?.data?.message === "Validation failed.") {
          const validationMessage = error.response.data.errors?.[0]?.message;
          toast.error(validationMessage || "Please check your login details.");
        }
        console.error("Axios Error:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("Error:", error.message);
      } else {
        toast.error("An unexpected error occured");
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsResending(true);
      const response = await resendVerficationRequest(auth.email.trim().toLowerCase());

      toast.success(response.message);
      setShowResendVerification(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        toast.error(message || "Unable to resend verification email. Please try again.");
        console.error("Resend verification error.", error.response?.data || error.message);
      } else {
        toast.error("Unable to resend verification email. Please try again.");
        console.error("Resend verification error:", error);
      }
    } finally {
      setIsResending(false);
    }
  }

  return <LoginPage auth={auth} setAuth={setAuth} onLogin={handleLogin} isSubmitting={isSubmitting} showResendVerification={showResendVerification} onResendVerification={handleResendVerification} isResending={isResending} />;
};
