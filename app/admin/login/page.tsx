"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ROUTES } from "@/data/constants";
import { cn } from "@/lib/utils";
import { loginAdmin } from "./actions";

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      fill="none"
      stroke="#fff"
      style={{ width: 26, height: 26 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function FormInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  id,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--ice-text2)",
          marginBottom: 6,
          letterSpacing: "0.2px",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ice-input"
      />
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      
      const res = await loginAdmin(formData);

      if (!res.success) {
        throw new Error(res.error || "Authentication failed");
      }

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(160deg,#EBF5FF 0%,#D4ECFB 40%,#E8F4FF 100%)",
      }}
    >
      {/* Ice crystals */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 180,
          height: 180,
          background: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.60)",
          top: -50,
          left: "15%",
          opacity: 0.5,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 100,
          height: 100,
          background: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.60)",
          bottom: 60,
          right: "20%",
          opacity: 0.4,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 60,
          height: 60,
          background: "rgba(255,255,255,0.35)",
          border: "1px solid rgba(255,255,255,0.60)",
          top: "40%",
          right: "8%",
          opacity: 0.3,
        }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 320,
          background: "radial-gradient(ellipse,rgba(56,189,248,0.15),transparent 65%)",
          filter: "blur(40px)",
          top: -80,
          right: -60,
          opacity: 0.5,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300,
          height: 240,
          background: "radial-gradient(ellipse,rgba(14,165,233,0.08),transparent 65%)",
          filter: "blur(40px)",
          bottom: 20,
          left: -40,
          opacity: 0.5,
        }}
      />

      {/* Back to home link */}
      <div className="relative z-10" style={{ padding: "20px 32px" }}>
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 no-underline font-medium transition-colors duration-200"
          style={{ fontSize: "13px", color: "var(--ice-text3)" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            style={{ width: 15, height: 15 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to home
        </Link>
      </div>

      {/* Centred auth card */}
      <div className="relative z-10 flex items-center justify-center flex-1 px-5 pb-12">
        <div className="animate-scale-in" style={{ width: "100%", maxWidth: 420 }}>
          {/* Deco crystals */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 120,
              height: 120,
              background: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.6)",
              top: -40,
              right: -40,
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 80,
              height: 80,
              background: "rgba(255,255,255,0.35)",
              border: "1px solid rgba(255,255,255,0.6)",
              bottom: -30,
              left: -30,
            }}
          />

          {/* Glass card */}
          <div className="glass" style={{ padding: "44px 40px" }}>
            {/* Icon */}
            <div
              className="flex items-center justify-center mx-auto mb-[18px]"
              style={{
                width: 54,
                height: 54,
                background: "linear-gradient(135deg,#f59e0b,#d97706)", // Admin orange/gold theme
                borderRadius: 14,
                boxShadow: "0 6px 16px rgba(217,119,6,0.30)",
              }}
            >
              <LockIcon />
            </div>

            {/* Title */}
            <h1
              className="font-bold text-center"
              style={{
                fontSize: "22px",
                color: "var(--ice-dark)",
                letterSpacing: "-0.4px",
                marginBottom: 5,
              }}
            >
              Admin Access
            </h1>
            <p
              className="text-center"
              style={{
                fontSize: "13px",
                color: "var(--ice-text3)",
                marginBottom: 32,
              }}
            >
              Secure login for system administrators
            </p>

            {/* Email */}
            <FormInput
              id="email"
              label="Admin Email"
              type="email"
              placeholder="admin@neuroscan.ai"
              value={email}
              onChange={setEmail}
            />

            {/* Password */}
            <FormInput
              id="password"
              label="Admin Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
            />

            {/* Error Message */}
            {error && (
              <div
                className="animate-fade-in"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "rgba(220,38,38,0.1)",
                  border: "1px solid rgba(220,38,38,0.2)",
                  color: "#DC2626",
                  fontSize: "12px",
                  fontWeight: 500,
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className={cn(
                "w-full rounded-[10px] text-white font-bold transition-all duration-300 no-select",
                loading ? "opacity-80 cursor-wait" : "hover:-translate-y-[1px] cursor-pointer"
              )}
              style={{
                height: 48,
                fontSize: "14px",
                background: "linear-gradient(135deg,#f59e0b,#d97706)",
                boxShadow: "0 4px 14px rgba(217,119,6,0.25)",
                marginTop: "12px",
                border: "none",
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                "Login to Admin Portal"
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
