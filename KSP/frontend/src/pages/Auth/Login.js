import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import api from "../../services/api";
import { useAuthStore } from "../../context/store";

/* ─── Input field ──────────────────────────────────────────────── */
const Field = ({
  label,
  id,
  type = "text",
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  autoComplete,
  disabled,
  icon: Icon,
  suffix,
  focused,
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
          ? {
              borderColor: "rgba(0,0,0,0.09)",
              background: "rgba(0,0,0,0.03)",
            }
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
        name={name}
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

/* ═══════════════════════════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(location.state?.message || "");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const startGoogle = () => {
    const base = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    window.location.href = `${base}/auth/google`;
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token && user)
      navigate(JSON.parse(user).role === "admin" ? "/admin" : "/");
  }, [navigate]);

  useEffect(() => {
    const saved = localStorage.getItem("rememberedEmail");
    if (saved) {
      setForm((p) => ({ ...p, email: saved }));
      setRemember(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }
    try {
      const res = await api.post("/auth/login", {
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });
      if (res.data.success) {
        remember
          ? localStorage.setItem("rememberedEmail", form.email)
          : localStorage.removeItem("rememberedEmail");
        setUser(res.data.user, res.data.token);
        setSuccess("Login successful! Redirecting…");
        setTimeout(
          () =>
            navigate(
              location.state?.from ||
                (res.data.user.role === "admin" ? "/admin" : "/"),
            ),
          700,
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #fff5f7 0%, #fef0f5 25%, #fffbfc 60%, #f8f5ff 100%)",
      }}
    >
      {/* ── Background ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left red bloom */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: "-15%",
            left: "-10%",
            background:
              "radial-gradient(circle, rgba(239,1,79,0.10) 0%, transparent 65%)",
          }}
        />
        {/* Top-right orange */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            top: "-10%",
            right: "-8%",
            background:
              "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 65%)",
          }}
        />
        {/* Bottom-right */}
        <div
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{
            bottom: "-15%",
            right: "-10%",
            background:
              "radial-gradient(circle, rgba(200,20,80,0.08) 0%, transparent 65%)",
          }}
        />
        {/* Bottom-left ember */}
        <div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            bottom: "-10%",
            left: "-8%",
            background:
              "radial-gradient(circle, rgba(239,1,79,0.06) 0%, transparent 65%)",
          }}
        />
        {/* Centre warm glow */}
        <div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background:
              "radial-gradient(circle, rgba(239,1,79,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Noise grain overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Login card ── */}
      <div
        ref={cardRef}
        className={`relative z-10 w-full max-w-[410px] transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden w-full max-w-[410px]"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(239,1,79,0.12)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.10), 0 8px 24px rgba(239,1,79,0.06), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          {/* Top gradient accent bar */}
          <div
            className="h-[3px] w-full"
            style={{
              background:
                "linear-gradient(90deg, #EF014F 0%, #FF4500 40%, #FF6B2B 70%, #EF014F 100%)",
            }}
          />

          <div className="px-8 pt-8 pb-9">
            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 group w-fit mb-8">
              <div className="relative">
                <img
                  src="/images/ksp-logo.png"
                  alt="KSP"
                  className="h-9 w-auto object-contain relative z-10 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-ksp-red/25 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

            {/* ── Heading ── */}
            <div className="mb-7">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-[2px] bg-ksp-red rounded-full" />
                <div
                  className="w-2 h-[2px] rounded-full"
                  style={{ background: "rgba(234,88,12,0.6)" }}
                />
                <span className="text-[9px] font-black text-ksp-red uppercase tracking-[0.25em]">
                  Secure Login
                </span>
              </div>

              <h1
                className="font-black text-ksp-black leading-[1.02] mb-2.5"
                style={{ fontSize: "clamp(2.2rem, 4vw, 2.8rem)" }}
              >
                Welcome
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #FF6B2B 0%, #EF014F 55%, #FF1A6C 100%)",
                  }}
                >
                  Back.
                </span>
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Sign in to manage your orders and exclusive deals.
              </p>
            </div>

            {/* ── Error ── */}
            {error && (
              <div
                className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl animate-shake"
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

            {/* ── Success ── */}
            {success && (
              <div
                className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl"
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

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Field
                label="Email Address"
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                icon={Mail}
                focused={focused === "email"}
              />

              <Field
                label="Password"
                id="password"
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={loading}
                icon={Lock}
                focused={focused === "password"}
                suffix={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPwd((v) => !v)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2.5 cursor-pointer group/chk select-none">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={remember}
                    onClick={() => setRemember((v) => !v)}
                    className="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={
                      remember
                        ? {
                            background:
                              "linear-gradient(135deg,#EF014F,#FF6B2B)",
                            borderColor: "#EF014F",
                            boxShadow: "0 0 8px rgba(239,1,79,0.4)",
                          }
                        : { borderColor: "rgba(0,0,0,0.2)" }
                    }
                    onMouseEnter={(e) => {
                      if (!remember)
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      if (!remember)
                        e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
                    }}
                  >
                    {remember && (
                      <svg
                        viewBox="0 0 10 8"
                        className="w-2.5 h-2.5 fill-none stroke-white stroke-[2.5]"
                      >
                        <path
                          d="M1 4l3 3 5-6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="text-xs text-gray-600 font-medium group-hover/chk:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold transition-colors hover:brightness-125"
                  style={{ color: "#EF014F" }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-xl py-3.5 font-bold text-white text-sm tracking-wide
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] group mt-2"
                style={{
                  background:
                    "linear-gradient(135deg, #EF014F 0%, #C8000E 45%, #C45200 100%)",
                  boxShadow:
                    "0 0 28px rgba(239,1,79,0.35), 0 4px 20px rgba(0,0,0,0.5)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 45px rgba(239,1,79,0.55), 0 0 20px rgba(234,88,12,0.3), 0 4px 24px rgba(0,0,0,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 28px rgba(239,1,79,0.35), 0 4px 20px rgba(0,0,0,0.5)";
                }}
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                <span className="relative flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" /> Signing in…
                    </>
                  ) : (
                    <>
                      Sign In{" "}
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1.5 transition-transform duration-200"
                      />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(0,0,0,0.08))",
                }}
              />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                or
              </span>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(to left, transparent, rgba(0,0,0,0.08))",
                }}
              />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={startGoogle}
              className="w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 group/g"
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
                Continue with Google
              </span>
              <ChevronRight
                size={13}
                className="text-gray-300 group-hover/g:text-gray-500 group-hover/g:translate-x-0.5 transition-all duration-200"
              />
            </button>

            {/* Register link */}
            <p
              className="text-center text-xs text-gray-500 mt-6 pt-6"
              style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-black hover:brightness-125 transition-all duration-200"
                style={{ color: "#EF014F" }}
              >
                Create one →
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-[10px] text-gray-400 mt-5">
          © 2026 Kandy Super Phone · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Login;
