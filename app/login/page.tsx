"use client";

/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Login Page
   src/app/login/page.tsx

   Role-aware auth screen with:
   - Frosted glass card (460px wide)
   - Patient / Doctor role tab toggle
   - Email + password inputs
   - Animated sign-in button
   - Google OAuth button
   - Role-conditional redirect (patient → /dashboard, doctor → /doctor)
   ═══════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { UserRole } from "@/types";
import { ROUTES } from "@/data/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ── Lock icon ─────────────────────────────────────────────────

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

// ── Google SVG ────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

// ── Role tab ──────────────────────────────────────────────────

function RoleTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 text-center py-2 rounded-[7px] text-[13px] font-medium",
        "cursor-pointer transition-all duration-200 no-select border-none",
        "font-[inherit]"
      )}
      style={{
        background: active ? "rgba(255,255,255,0.80)" : "transparent",
        color: active ? "var(--ice-dark)" : "var(--ice-text3)",
        boxShadow: active ? "0 2px 8px rgba(14,165,233,0.12)" : "none",
      }}
    >
      {label}
    </button>
  );
}

// ── Form input ────────────────────────────────────────────────

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

// ── Main component ─────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole]         = useState<UserRole>("patient");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSignIn = async () => {
    setError(null);
    setLoading(true);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      // Upsert the profile row so it always exists in the public schema.
      // This handles users who signed up before the profiles table existed.
      if (data.user) {
        const userRole = data.user.user_metadata?.role || role;
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.username || email.split("@")[0],
            email: data.user.email,
            role: userRole,
          },
          { onConflict: "id" }
        );

        const destination = userRole === "patient" ? ROUTES.PATIENT_DASHBOARD : ROUTES.DOCTOR_OVERVIEW;
        router.push(destination);
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      // Pass the selected role as a query param so the auth callback can save it
      const destination = role === "patient" ? ROUTES.PATIENT_DASHBOARD : ROUTES.DOCTOR_OVERVIEW;
      const callbackUrl = `${window.location.origin}/auth/callback?role=${role}&next=${destination}`;
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        }
      });
      if (oAuthError) throw new Error(oAuthError.message);
    } catch (err: any) {
      setError(err.message || "Could not sign in with Google.");
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
          background:
            "radial-gradient(ellipse,rgba(56,189,248,0.15),transparent 65%)",
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
          background:
            "radial-gradient(ellipse,rgba(14,165,233,0.08),transparent 65%)",
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to home
        </Link>
      </div>

      {/* Centred auth card */}
      <div className="relative z-10 flex items-center justify-center flex-1 px-5 pb-12">
        <div
          className="animate-scale-in"
          style={{ width: "100%", maxWidth: 460 }}
        >
          {/* Deco crystal top-right of card */}
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
          {/* Deco crystal bottom-left of card */}
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
            {/* Lock icon */}
            <div
              className="flex items-center justify-center mx-auto mb-[18px]"
              style={{
                width: 54,
                height: 54,
                background: "linear-gradient(135deg,#38BDF8,#0284C7)",
                borderRadius: 14,
                boxShadow: "0 6px 16px rgba(14,165,233,0.30)",
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
              Welcome to NeuroScan
            </h1>
            <p
              className="text-center"
              style={{
                fontSize: "13px",
                color: "var(--ice-text3)",
                marginBottom: 28,
              }}
            >
              Sign in to access your{" "}
              {role === "patient" ? "patient" : "clinician"} dashboard
            </p>

            {/* Role tabs */}
            <div
              className="flex role-tabs mb-6"
              style={{ marginBottom: 24 }}
            >
              <RoleTab
                label="Patient"
                active={role === "patient"}
                onClick={() => {
                  setRole("patient");
                  setError(null);
                }}
              />
              <RoleTab
                label="Doctor"
                active={role === "doctor"}
                onClick={() => {
                  setRole("doctor");
                  setError(null);
                }}
              />
            </div>

            {/* Role context hint */}
            <div
              className="flex items-center gap-2 rounded-[8px] mb-5"
              style={{
                background: "var(--blue-bg)",
                border: "1px solid var(--ice-border)",
                padding: "8px 12px",
                fontSize: "11.5px",
                color: "var(--ice-accent2)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                style={{ width: 14, height: 14, flexShrink: 0 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <span>
                {role === "patient"
                  ? "Demo: metiri.abderrahmane@example.com / patient123"
                  : "Demo: r.benali@neuroscan.ai / doctor123"}
              </span>
            </div>

            {/* Email */}
            <FormInput
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />

            {/* Password */}
            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
            />

            {/* Forgot password */}
            <div className="flex justify-end" style={{ marginBottom: 4 }}>
              <a
                href="#"
                style={{
                  fontSize: "12px",
                  color: "var(--ice-accent2)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 rounded-[8px] mt-2 mb-1"
                style={{
                  background: "var(--red-bg)",
                  border: "1px solid var(--red-border)",
                  padding: "8px 12px",
                  fontSize: "12px",
                  color: "var(--red)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ width: 13, height: 13, flexShrink: 0 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Sign in button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full font-semibold transition-all duration-200 font-[inherit]"
              style={{
                padding: "12px",
                borderRadius: "9px",
                fontSize: "14px",
                background: loading
                  ? "rgba(14,165,233,0.50)"
                  : "linear-gradient(135deg,#38BDF8,#0284C7)",
                color: "#fff",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(14,165,233,0.25)",
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  {/* Spinner */}
                  <svg
                    style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                `Sign in as ${role === "patient" ? "Patient" : "Doctor"} →`
              )}
            </button>

            {/* Divider */}
            <div
              className="flex items-center gap-3"
              style={{ margin: "20px 0" }}
            >
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(14,165,233,0.12)" }}
              />
              <span
                style={{ fontSize: "12px", color: "var(--ice-text3)" }}
              >
                or
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(14,165,233,0.12)" }}
              />
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 transition-all duration-200 font-[inherit]"
              style={{
                padding: "10px",
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(14,165,233,0.18)",
                borderRadius: "9px",
                color: "var(--ice-text2)",
                fontSize: "13.5px",
                cursor: "pointer",
                fontWeight: 500,
                backdropFilter: "blur(8px)",
              }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Footer link */}
            <p
              className="text-center"
              style={{ marginTop: 18, fontSize: "13px", color: "var(--ice-text3)" }}
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                style={{
                  color: "var(--ice-accent2)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Spinner keyframe (inline) */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
