import type { LoginForm } from "./types";
import React from "react";

const LoginPage = ({
  auth,
  setAuth,
  onLogin,
  isSubmitting,
  showResendVerification,
  onResendVerification,
  isResending,
}: {
  auth: LoginForm;
  setAuth: React.Dispatch<React.SetStateAction<LoginForm>>;
  onLogin: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  showResendVerification: boolean;
  onResendVerification: () => void;
  isResending: boolean;
}) => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
      style={{
        backgroundImage: "var(--background-image-dashboard)",
      }}
    >
      <h1 className="text-4xl font-bold mb-8">LOGIN</h1>
      <div
        className="flex flex-col rounded-lg w-[300px] h-[300px] gap-9 p-9"
        style={{
          backgroundColor: "var(--color-auth-background)",
          border: "1px solid var(--color-auth-border)",
        }}
      >
        <form className="flex flex-col gap-4 rounded-lg" onSubmit={onLogin}>
          <label htmlFor="Email">Email</label>
          <input
            type="email"
            name="Email"
            value={auth.email}
            id="Email"
            placeholder="Enter your email"
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-white outline-none focus:border-blue-400"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
            onChange={(e) => setAuth({ ...auth, email: e.target.value })}
          />

          <label htmlFor="Password">Password</label>
          <input
            type="password"
            name="Password"
            value={auth.password}
            id="Password"
            placeholder="Enter your password"
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 text-white outline-none focus:border-blue-400"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-full px-4 py-2 text-sm font-medium text-white"
            style={{
              backgroundColor: "rgba(217, 217, 217, 0.17)",
            }}
          >
            {isSubmitting ? "Logging in...." : "Log In"}
          </button>
        </form>
        {showResendVerification && (
          <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-sm text-yellow-200">
              Your email address has not been verified yet.
            </p>

            <button
              type="button"
              onClick={onResendVerification}
              disabled={isResending}
              className="mt-2 text-sm font-medium text-blue-400 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending
                ? "Sending verification email..."
                : "Resend verification email"}
            </button>
          </div>
        )}
        <p className="mt-4 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
