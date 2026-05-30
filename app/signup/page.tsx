"use client";

/* ═══════════════════════════════════════════════════════════════
   NeuroScan AI — Sign Up Page
   src/app/signup/page.tsx

   Role-aware registration screen with:
   - Frosted glass card (460px wide)
   - Patient / Doctor role tab toggle
   - Username, Email, Password, Confirm Password inputs
   - Animated sign-up button
   - Supabase Auth Integration
   ═══════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { UserRole } from "@/types";
import { ROUTES } from "@/data/constants";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// ── UserPlus icon ──────────────────────────────────────────────
function UserPlusIcon() {
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
        d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
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
export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<UserRole>("patient");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);
    setSuccessMsg(null);

    // Basic Validation
    if (!username.trim() || !email.trim() || !password || !confirmPassword || !gender || !dateOfBirth) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
            full_name: username.trim(),
            role: role,
            gender: gender,
            date_of_birth: dateOfBirth,
          },
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error("An account with this email already exists.");
      }

      // Explicitly upsert the profile row so it always exists in the public schema.
      // The DB trigger handles this automatically, but this is a safety net.
      if (data.user) {
        await supabase.from("profiles").upsert(
          { id: data.user.id, full_name: username.trim(), email: email.trim(), role, gender, date_of_birth: dateOfBirth },
          { onConflict: "id" }
        );
      }

      // Success! If email confirmations are enabled, the session will be null here.
      if (data.session) {
        // Auto-login: redirect to correct dashboard based on role
        const destination = role === "patient" ? ROUTES.PATIENT_DASHBOARD : ROUTES.DOCTOR_OVERVIEW;
        router.push(destination);
      } else {
        // Needs email confirmation
        setSuccessMsg("Account created! Check your email to verify, then log in.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during sign up.");
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
        <div className="animate-scale-in" style={{ width: "100%", maxWidth: 460 }}>
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
                background: "linear-gradient(135deg,#38BDF8,#0284C7)",
                borderRadius: 14,
                boxShadow: "0 6px 16px rgba(14,165,233,0.30)",
              }}
            >
              <UserPlusIcon />
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
              Create an account
            </h1>
            <p
              className="text-center"
              style={{
                fontSize: "13px",
                color: "var(--ice-text3)",
                marginBottom: 28,
              }}
            >
              Join NeuroScan as a {role === "patient" ? "patient" : "clinician"}
            </p>

            {/* Role tabs */}
            <div className="flex role-tabs mb-6" style={{ marginBottom: 24 }}>
              <RoleTab
                label="Patient"
                active={role === "patient"}
                onClick={() => {
                  setRole("patient");
                  setError(null);
                  setSuccessMsg(null);
                }}
              />
              <RoleTab
                label="Doctor"
                active={role === "doctor"}
                onClick={() => {
                  setRole("doctor");
                  setError(null);
                  setSuccessMsg(null);
                }}
              />
            </div>

            {/* Username */}
            <FormInput
              id="username"
              label="Full Name"
              type="text"
              placeholder="e.g. Ahmed Karim"
              value={username}
              onChange={setUsername}
            />

            {/* Email */}
            <FormInput
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />

            {/* Gender */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--ice-text2)",
                  marginBottom: 6,
                  letterSpacing: "0.2px",
                }}
              >
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="ice-input"
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--ice-border)", background: "var(--ice-card)", color: "var(--ice-dark)", fontSize: "14px" }}
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Date of Birth */}
            <FormInput
              id="dateOfBirth"
              label="Date of Birth"
              type="date"
              placeholder=""
              value={dateOfBirth}
              onChange={setDateOfBirth}
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

            {/* Confirm Password */}
            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            {/* Error Message */}
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

            {/* Success Message */}
            {successMsg && (
              <div
                className="flex items-center gap-2 rounded-[8px] mt-2 mb-1"
                style={{
                  background: "var(--green-bg)",
                  border: "1px solid var(--green-border)",
                  padding: "8px 12px",
                  fontSize: "12px",
                  color: "var(--green)",
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {successMsg}
              </div>
            )}

            {/* Sign up button */}
            <button
              onClick={handleSignUp}
              disabled={loading || successMsg !== null}
              className="w-full font-semibold transition-all duration-200 font-[inherit]"
              style={{
                padding: "12px",
                borderRadius: "9px",
                fontSize: "14px",
                background: (loading || successMsg)
                  ? "rgba(14,165,233,0.50)"
                  : "linear-gradient(135deg,#38BDF8,#0284C7)",
                color: "#fff",
                border: "none",
                cursor: (loading || successMsg) ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(14,165,233,0.25)",
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Footer link */}
            <p
              className="text-center"
              style={{ marginTop: 24, fontSize: "13px", color: "var(--ice-text3)" }}
            >
              Already have an account?{" "}
              <Link
                href={ROUTES.LOGIN}
                style={{
                  color: "var(--ice-accent2)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
