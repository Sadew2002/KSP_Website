import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
  Shield,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import api from "../../services/api";

/* ─── Shared light-theme input ──────────────────────────────────── */
const Field = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  icon: Icon,
  suffix,
  focused,
  onFocus,
  onBlur,
  error,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2"
    >
      {label}
    </label>
    <div
      className={`flex items-center rounded-xl border transition-all duration-300 ${
        error
          ? "border-red-400/60 bg-red-50/60"
          : focused
            ? "border-ksp-red/50 bg-white shadow-md shadow-ksp-red/8 ring-1 ring-ksp-red/8"
            : ""
      }`}
      style={
        !error && !focused
          ? { borderColor: "rgba(0,0,0,0.09)", background: "rgba(0,0,0,0.03)" }
          : {}
      }
    >
      <div
        className="ml-3.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
        style={
          focused
            ? {
                background: "linear-gradient(135deg,#EF014F,#FF6B2B)",
                boxShadow: "0 4px 12px rgba(239,1,79,0.35)",
              }
            : error
              ? { background: "rgba(254,226,226,0.8)" }
              : { background: "rgba(0,0,0,0.06)" }
        }
      >
        <Icon
          size={14}
          className={
            focused ? "text-white" : error ? "text-red-500" : "text-gray-400"
          }
        />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="flex-1 px-4 py-3.5 bg-transparent outline-none text-gray-800 font-medium placeholder-gray-400 text-sm tracking-wide"
      />
      {suffix && <div className="mr-3 flex-shrink-0">{suffix}</div>}
    </div>
    {error && (
      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-500 font-semibold">
        <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

/* ─── Step progress badge ───────────────────────────────────────── */
const StepBadge = ({ n, current }) => {
  const done = current > n,
    active = current === n;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500"
      style={
        done
          ? {
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              boxShadow: "0 0 14px rgba(34,197,94,0.35)",
            }
          : active
            ? {
                background: "linear-gradient(135deg,#EF014F,#FF6B2B)",
                boxShadow: "0 0 14px rgba(239,1,79,0.4)",
              }
            : {
                background: "rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.1)",
              }
      }
    >
      {done ? (
        <CheckCircle size={16} className="text-white" />
      ) : (
        <span className={active ? "text-white" : "text-gray-400"}>{n}</span>
      )}
    </div>
  );
};

/* ─── Password strength ─────────────────────────────────────────── */
const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", bar: "" };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  return {
    score: s,
    ...[
      { label: "Very Weak", bar: "bg-red-500" },
      { label: "Weak", bar: "bg-orange-500" },
      { label: "Fair", bar: "bg-yellow-500" },
      { label: "Good", bar: "bg-blue-500" },
      { label: "Strong", bar: "bg-green-500" },
    ][Math.min(s, 4)],
  };
};

/* ═══════════════════════════════════════════════════════════════ */
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);
  // Resend countdown
  const [resendCountdown, setResendCountdown] = useState(0);
  const countdownRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Cleanup countdown on unmount
  useEffect(
    () => () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    },
    [],
  );

  const strength = getStrength(newPassword);

  const startGoogle = () => {
    const base = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    window.location.href = `${base}/auth/google`;
  };

  const startResendCountdown = useCallback(() => {
    setResendCountdown(60);
    countdownRef.current = setInterval(() => {
      setResendCountdown((v) => {
        if (v <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }, []);

  /* ── OTP: single digit change ── */
  const handleCodeChange = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1); // keep only last digit
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
    setError("");
  };

  /* ── OTP: paste handler (paste 6 digits at once) ── */
  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = ["", "", "", "", "", ""];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setCode(next);
    setError("");
    // Focus last filled box
    const lastIdx = Math.min(pasted.length - 1, 5);
    setTimeout(() => document.getElementById(`otp-${lastIdx}`)?.focus(), 0);
  };

  /* ── OTP: backspace ── */
  const handleCodeKey = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  /* ── Step 1: Send code ── */
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/forgot-password", {
        email: email.toLowerCase().trim(),
      });
      if (res.data.success) {
        if (res.data.demoResetCode) setDemoCode(res.data.demoResetCode);
        setSuccess("Reset code sent! Check your email.");
        startResendCountdown();
        setTimeout(() => {
          setStep(2);
          setSuccess("");
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 429) {
        setError(
          "Too many attempts. Please wait 15 minutes before trying again.",
        );
      } else {
        setError(msg || "Failed to send reset code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend code (from step 2) ── */
  const handleResend = async () => {
    if (resendCountdown > 0 || loading) return;
    setLoading(true);
    setError("");
    setDemoCode("");
    setCode(["", "", "", "", "", ""]);
    try {
      const res = await api.post("/auth/forgot-password", {
        email: email.toLowerCase().trim(),
      });
      if (res.data.success) {
        if (res.data.demoResetCode) setDemoCode(res.data.demoResetCode);
        setSuccess("New code sent!");
        startResendCountdown();
        setTimeout(() => setSuccess(""), 2000);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Too many requests. Please wait before resending.");
      } else {
        setError(err.response?.data?.message || "Failed to resend code.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify code ── */
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const full = code.join("");
    if (full.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/verify-reset-code", {
        email: email.toLowerCase().trim(),
        code: full,
      });
      if (res.data.success) {
        setSuccess("Code verified!");
        setTimeout(() => {
          setStep(3);
          setSuccess("");
        }, 900);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          "Invalid or expired code. Please check and try again, or request a new code.",
        );
        setCode(["", "", "", "", "", ""]);
        setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
      } else {
        setError(
          err.response?.data?.message ||
            "Verification failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3: Reset password ── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/reset-password", {
        email: email.toLowerCase().trim(),
        code: code.join(""),
        newPassword,
      });
      if (res.data.success) {
        setSuccess("Password reset! Redirecting to sign in…");
        setTimeout(
          () =>
            navigate("/login", {
              state: {
                message:
                  "Password reset successfully. Please sign in with your new password.",
              },
            }),
          2000,
        );
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Your reset code has expired. Please start again.");
        setTimeout(() => {
          setStep(1);
          setCode(["", "", "", "", "", ""]);
          setDemoCode("");
        }, 2500);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to reset password. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Step meta ── */
  const meta = [
    null, // index 0 unused
    {
      eyebrow: "Step 1 of 3",
      line1: "Forgot",
      line2: "Password?",
      sub: "Enter your email and we'll send a 6-digit reset code.",
    },
    {
      eyebrow: "Step 2 of 3",
      line1: "Enter the",
      line2: "OTP Code.",
      sub: `We sent a code to ${email || "your email"}. Check your inbox.`,
    },
    {
      eyebrow: "Step 3 of 3",
      line1: "New",
      line2: "Password.",
      sub: "Choose a strong password you haven't used before.",
    },
  ];
  const { eyebrow, line1, line2, sub } = meta[step];

  /* ── Shared submit button ── */
  const SubmitBtn = ({ children, disabled: dis }) => (
    <button
      type="submit"
      disabled={dis || loading}
      className="relative w-full overflow-hidden rounded-xl py-3.5 font-bold text-white text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] group"
      style={{
        background:
          "linear-gradient(135deg,#EF014F 0%,#C8000E 45%,#C45200 100%)",
        boxShadow: "0 0 28px rgba(239,1,79,0.3),0 4px 20px rgba(0,0,0,0.12)",
      }}
      onMouseEnter={(e) => {
        if (!dis && !loading)
          e.currentTarget.style.boxShadow =
            "0 0 40px rgba(239,1,79,0.5),0 0 18px rgba(234,88,12,0.25),0 4px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 28px rgba(239,1,79,0.3),0 4px 20px rgba(0,0,0,0.12)";
      }}
    >
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <span className="relative flex items-center justify-center gap-2.5">
        {children}
      </span>
    </button>
  );

  /* ── render ── */
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #fff5f7 0%, #fef0f5 25%, #fffbfc 60%, #f8f5ff 100%)",
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: "-15%",
            left: "-10%",
            background:
              "radial-gradient(circle,rgba(239,1,79,0.10) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            top: "-10%",
            right: "-8%",
            background:
              "radial-gradient(circle,rgba(234,88,12,0.08) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{
            bottom: "-15%",
            right: "-10%",
            background:
              "radial-gradient(circle,rgba(200,20,80,0.08) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            bottom: "-10%",
            left: "-8%",
            background:
              "radial-gradient(circle,rgba(239,1,79,0.06) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background:
              "radial-gradient(circle,rgba(239,1,79,0.05) 0%,transparent 70%)",
          }}
        />
      </div>

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-[430px] transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(239,1,79,0.12)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.10),0 8px 24px rgba(239,1,79,0.06),inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          {/* Accent stripe */}
          <div
            className="h-[3px] w-full"
            style={{
              background:
                "linear-gradient(90deg,#EF014F 0%,#FF4500 40%,#FF6B2B 70%,#EF014F 100%)",
            }}
          />

          <div className="px-8 pt-7 pb-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group w-fit mb-6">
              <div className="relative">
                <img
                  src="/images/ksp-logo.png"
                  alt="KSP"
                  className="h-9 w-auto object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-ksp-red/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="leading-tight">
                <span className="block text-[14px] font-black text-ksp-black tracking-tight">
                  Kandy Super Phone
                </span>
                <span className="block text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase mt-0.5">
                  Premium Mobile Store
                </span>
              </div>
            </Link>

            {/* Step progress */}
            <div className="flex items-center mb-7">
              <StepBadge n={1} current={step} />
              <div
                className="flex-1 mx-2 h-px transition-all duration-500"
                style={{
                  background:
                    step > 1
                      ? "linear-gradient(to right,#22c55e,#16a34a)"
                      : "rgba(0,0,0,0.1)",
                }}
              />
              <StepBadge n={2} current={step} />
              <div
                className="flex-1 mx-2 h-px transition-all duration-500"
                style={{
                  background:
                    step > 2
                      ? "linear-gradient(to right,#22c55e,#16a34a)"
                      : "rgba(0,0,0,0.1)",
                }}
              />
              <StepBadge n={3} current={step} />
            </div>

            {/* Heading */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-[2px] bg-ksp-red rounded-full" />
                <div
                  className="w-2 h-[2px] rounded-full"
                  style={{ background: "rgba(234,88,12,0.6)" }}
                />
                <span className="text-[9px] font-black text-ksp-red uppercase tracking-[0.25em]">
                  {eyebrow}
                </span>
              </div>
              <h1
                className="font-black text-ksp-black leading-[1.02] mb-1.5"
                style={{ fontSize: "clamp(1.9rem,4vw,2.4rem)" }}
              >
                {line1}{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg,#FF6B2B 0%,#EF014F 55%,#FF1A6C 100%)",
                  }}
                >
                  {line2}
                </span>
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">{sub}</p>
            </div>

            {/* Alerts */}
            {error && (
              <div
                className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl animate-shake"
                style={{
                  background: "rgba(254,226,226,0.7)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <AlertCircle
                  size={15}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-red-700 font-medium leading-snug">
                  {error}
                </p>
              </div>
            )}
            {success && (
              <div
                className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(220,252,231,0.7)",
                  border: "1px solid rgba(34,197,94,0.25)",
                }}
              >
                <CheckCircle
                  size={15}
                  className="text-green-600 flex-shrink-0"
                />
                <p className="text-sm text-green-700 font-medium">{success}</p>
              </div>
            )}

            {/* Demo code */}
            {demoCode && step === 2 && (
              <div
                className="mb-4 px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(219,234,254,0.7)",
                  border: "1px solid rgba(59,130,246,0.2)",
                }}
              >
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider mb-1">
                  Demo Code (dev only)
                </p>
                <p className="text-2xl font-black text-blue-700 tracking-[0.35em] font-mono">
                  {demoCode}
                </p>
              </div>
            )}

            {/* ══ STEP 1 ══ */}
            {step === 1 && (
              <form
                onSubmit={handleRequestCode}
                noValidate
                className="space-y-4"
              >
                <Field
                  label="Email Address"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  icon={Mail}
                  focused={focused === "email"}
                />
                <SubmitBtn>
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" /> Sending
                      Code…
                    </>
                  ) : (
                    <>
                      Send Reset Code{" "}
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1.5 transition-transform duration-200"
                      />
                    </>
                  )}
                </SubmitBtn>
              </form>
            )}

            {/* ══ STEP 2 ══ */}
            {step === 2 && (
              <form
                onSubmit={handleVerifyCode}
                noValidate
                className="space-y-5"
              >
                {/* OTP boxes */}
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                    6-Digit Code
                  </p>
                  <div className="flex justify-center gap-2.5">
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleCodeKey(i, e)}
                        onPaste={i === 0 ? handleCodePaste : undefined}
                        disabled={loading}
                        className="w-11 text-center text-xl font-black outline-none rounded-xl transition-all duration-200 text-ksp-black"
                        style={{
                          height: "52px",
                          background: digit
                            ? "rgba(239,1,79,0.07)"
                            : "rgba(0,0,0,0.04)",
                          border: digit
                            ? "1.5px solid rgba(239,1,79,0.35)"
                            : "1.5px solid rgba(0,0,0,0.1)",
                          boxShadow: digit
                            ? "0 0 10px rgba(239,1,79,0.12)"
                            : "none",
                        }}
                        onFocus={(e) => {
                          e.target.style.border =
                            "1.5px solid rgba(239,1,79,0.55)";
                          e.target.style.background = "white";
                          e.target.style.boxShadow =
                            "0 0 14px rgba(239,1,79,0.18)";
                        }}
                        onBlur={(e) => {
                          e.target.style.border = digit
                            ? "1.5px solid rgba(239,1,79,0.35)"
                            : "1.5px solid rgba(0,0,0,0.1)";
                          e.target.style.background = digit
                            ? "rgba(239,1,79,0.07)"
                            : "rgba(0,0,0,0.04)";
                          e.target.style.boxShadow = digit
                            ? "0 0 10px rgba(239,1,79,0.12)"
                            : "none";
                        }}
                      />
                    ))}
                  </div>
                  {/* Paste hint */}
                  <p className="text-center text-[11px] text-gray-400 mt-2">
                    You can paste the code directly
                  </p>
                </div>

                <SubmitBtn disabled={code.join("").length !== 6}>
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" /> Verifying…
                    </>
                  ) : (
                    <>
                      Verify Code{" "}
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1.5 transition-transform duration-200"
                      />
                    </>
                  )}
                </SubmitBtn>

                {/* Resend row */}
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setCode(["", "", "", "", "", ""]);
                      setError("");
                    }}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors font-medium"
                  >
                    <ArrowLeft size={13} /> Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCountdown > 0 || loading}
                    className={`flex items-center gap-1.5 font-semibold transition-colors ${
                      resendCountdown > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-ksp-red hover:text-red-700"
                    }`}
                  >
                    <RefreshCw
                      size={13}
                      className={loading ? "animate-spin" : ""}
                    />
                    {resendCountdown > 0
                      ? `Resend in ${resendCountdown}s`
                      : "Resend code"}
                  </button>
                </div>
              </form>
            )}

            {/* ══ STEP 3 ══ */}
            {step === 3 && (
              <form
                onSubmit={handleResetPassword}
                noValidate
                className="space-y-4"
              >
                {/* New password */}
                <div>
                  <Field
                    label="New Password"
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocused("newPwd")}
                    onBlur={() => setFocused(null)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    disabled={loading}
                    icon={Lock}
                    focused={focused === "newPwd"}
                    suffix={
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    }
                  />
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.bar : ""}`}
                            style={
                              i > strength.score
                                ? { background: "rgba(0,0,0,0.08)" }
                                : {}
                            }
                          />
                        ))}
                      </div>
                      <p
                        className={`text-[10px] font-bold ${
                          strength.score >= 4
                            ? "text-green-600"
                            : strength.score >= 3
                              ? "text-blue-600"
                              : strength.score >= 2
                                ? "text-yellow-600"
                                : "text-red-500"
                        }`}
                      >
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <Field
                    label="Confirm Password"
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    onFocus={() => setFocused("confirmPwd")}
                    onBlur={() => setFocused(null)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    disabled={loading}
                    icon={Lock}
                    focused={focused === "confirmPwd"}
                    suffix={
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    }
                  />
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-green-600 font-semibold">
                      <CheckCircle size={11} /> Passwords match
                    </p>
                  )}
                </div>

                <SubmitBtn>
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" /> Resetting…
                    </>
                  ) : (
                    <>
                      Reset Password{" "}
                      <KeyRound
                        size={17}
                        className="group-hover:rotate-12 transition-transform duration-200"
                      />
                    </>
                  )}
                </SubmitBtn>
              </form>
            )}

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 my-5">
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(to right,transparent,rgba(0,0,0,0.08))",
                }}
              />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                or
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(to left,transparent,rgba(0,0,0,0.08))",
                }}
              />
            </div>

            {/* ── Google sign-in ── */}
            <button
              type="button"
              onClick={startGoogle}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group/g mb-5"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.border = "1px solid rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.border = "1px solid rgba(0,0,0,0.1)";
              }}
            >
              <svg
                className="w-[18px] h-[18px] flex-shrink-0"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.85h5.5c-.24 1.28-.97 2.36-2.06 3.09v2.57h3.33c1.95-1.8 3.08-4.45 3.08-7.59 0-.73-.07-1.43-.2-2.11H12z"
                />
                <path
                  fill="#34A853"
                  d="M6.53 14.13l-.72.55-2.55 1.98C4.87 19.45 8.1 21.5 12 21.5c2.7 0 4.96-.89 6.62-2.42l-3.33-2.57c-.92.62-2.1.98-3.29.98-2.52 0-4.66-1.7-5.42-3.99z"
                />
                <path
                  fill="#4A90E2"
                  d="M3.26 6.98A9.48 9.48 0 0 0 2.5 10.2c0 1.13.27 2.2.74 3.16l3.27-2.54A5.68 5.68 0 0 1 6.3 10.2c0-.63.11-1.24.2-1.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M12 5.27c1.47 0 2.79.51 3.83 1.5l2.87-2.87C17.01 2.28 14.77 1.5 12 1.5 8.1 1.5 4.87 3.55 3.26 6.98l3.03 2.35C7.34 7.2 9.48 5.27 12 5.27z"
                />
              </svg>
              <span className="flex-1 text-left text-sm font-semibold text-gray-700 group-hover/g:text-gray-900 transition-colors">
                Continue with Google instead
              </span>
              <ChevronRight
                size={13}
                className="text-gray-300 group-hover/g:text-gray-500 group-hover/g:translate-x-0.5 transition-all duration-200"
              />
            </button>

            {/* Back to login */}
            <div
              className="pt-5 text-center"
              style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
            >
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft
                  size={13}
                  className="group-hover:-translate-x-0.5 transition-transform duration-200"
                />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-5">
          © 2026 Kandy Super Phone · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
