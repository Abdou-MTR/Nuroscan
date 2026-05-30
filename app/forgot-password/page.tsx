"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
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
      {/* Background decorations matching login page */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 180, height: 180, background: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.60)", top: -50, left: "15%", opacity: 0.5 }} />
      <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 320, background: "radial-gradient(ellipse,rgba(56,189,248,0.15),transparent 65%)", filter: "blur(40px)", top: -80, right: -60, opacity: 0.5 }} />

      <div className="relative z-10 flex items-center justify-center flex-1 px-5 pb-12">
        <div className="animate-scale-in" style={{ width: "100%", maxWidth: 460 }}>
          <div className="glass" style={{ padding: "44px 40px", background: "rgba(255,255,255,0.85)", borderRadius: "24px", boxShadow: "0 8px 32px rgba(14,165,233,0.08)", border: "1px solid rgba(255,255,255,0.6)", backdropFilter: "blur(20px)" }}>
            <h1 className="font-bold text-center" style={{ fontSize: "22px", color: "var(--ice-dark)", letterSpacing: "-0.4px", marginBottom: 5 }}>
              Reset Password
            </h1>
            <p className="text-center" style={{ fontSize: "13px", color: "var(--ice-text3)", marginBottom: 28 }}>
              Enter your email to receive a reset link
            </p>

            {success ? (
              <div className="text-center">
                <div style={{ background: "#d1fae5", color: "#065f46", padding: "16px", borderRadius: "12px", fontSize: "14px", marginBottom: "20px" }}>
                  Check your email for the password reset link!
                </div>
                <Link href="/login" className="text-[#0284C7] font-semibold text-[14px]">
                  ← Back to login
                </Link>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--ice-text2)", marginBottom: 6, letterSpacing: "0.2px" }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--ice-border)", background: "#fff", fontSize: "14px", outline: "none" }}
                  />
                </div>

                {error && (
                  <div style={{ background: "var(--red-bg, #fee2e2)", border: "1px solid var(--red-border, #fca5a5)", color: "var(--red, #b91c1c)", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  style={{ width: "100%", padding: "12px", borderRadius: "9px", fontSize: "14px", background: loading ? "rgba(14,165,233,0.50)" : "linear-gradient(135deg,#38BDF8,#0284C7)", color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, boxShadow: "0 4px 14px rgba(14,165,233,0.25)" }}
                >
                  {loading ? "Sending link..." : "Send reset link"}
                </button>

                <div className="text-center mt-6">
                  <Link href="/login" style={{ fontSize: "13px", color: "var(--ice-text3)", textDecoration: "none" }}>
                    ← Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
