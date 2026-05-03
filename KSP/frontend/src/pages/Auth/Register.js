import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Check,
  X,
} from "lucide-react";
import api from "../../services/api";

/* ─── Light-theme input field ───────────────────────────────────── */
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
  optional,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2"
    >
      {label}
      {optional && (
        <span className="ml-1 text-gray-400 normal-case font-normal tracking-normal">
          (optional)
        </span>
      )}
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
          size={13}
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
        className="flex-1 px-3.5 py-3 bg-transparent outline-none text-gray-800 font-medium placeholder-gray-400 text-sm tracking-wide"
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

/* ─── Password requirement chip ─────────────────────────────────── */
const Req = ({ met, text }) => (
  <div
    className={`flex items-center gap-1.5 text-[11px] font-medium transition-all duration-300 ${met ? "text-green-600" : "text-gray-400"}`}
  >
    <div
      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${met ? "bg-green-100" : "bg-gray-100"}`}
    >
      {met ? (
        <Check size={8} className="text-green-600" />
      ) : (
        <X size={8} className="text-gray-400" />
      )}
    </div>
    {text}
  </div>
);

/* ═══════════════════════════════════════════════════════════════ */
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    if (token && user) navigate("/");
  }, [navigate]);

  /* ── Password strength ── */
  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: "", bar: "bg-zinc-800" };
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 8) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^a-zA-Z0-9]/.test(pw)) s++;
    const map = [
      { label: "Very Weak", bar: "bg-red-500" },
      { label: "Weak", bar: "bg-orange-500" },
      { label: "Fair", bar: "bg-yellow-500" },
      { label: "Good", bar: "bg-blue-500" },
      { label: "Strong", bar: "bg-green-500" },
    ];
    return { score: s, ...map[Math.min(s, 4)] };
  };
  const strength = getStrength(formData.password);

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim()) e.firstName = "First name is required";
    if (!formData.lastName.trim()) e.lastName = "Last name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Enter a valid email address";
    if (
      formData.phone &&
      !/^[+]?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ""))
    )
      e.phone = "Enter a valid phone number";
    if (formData.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!agreeTerms) e.terms = "You must agree to the terms";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const res = await api.post("/auth/register", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim() || null,
        password: formData.password,
      });
      if (res.data.success) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setSuccess("Account created! Redirecting…");
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── render ── */
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #fff5f7 0%, #fef0f5 25%, #fffbfc 60%, #f8f5ff 100%)",
      }}
    >
      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: "-15%",
            left: "-10%",
            background:
              "radial-gradient(circle, rgba(239,1,79,0.10) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            top: "-10%",
            right: "-8%",
            background:
              "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{
            bottom: "-15%",
            right: "-10%",
            background:
              "radial-gradient(circle, rgba(200,20,80,0.08) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            bottom: "-10%",
            left: "-8%",
            background:
              "radial-gradient(circle, rgba(239,1,79,0.06) 0%, transparent 65%)",
          }}
        />
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

      {/* ── Noise grain ── */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Card ── */}
      <div
        className={`relative z-10 w-full max-w-[460px] transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(239,1,79,0.12)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.10), 0 8px 24px rgba(239,1,79,0.06), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          {/* Top accent stripe */}
          <div
            className="h-[3px] w-full"
            style={{
              background:
                "linear-gradient(90deg, #EF014F 0%, #FF4500 40%, #FF6B2B 70%, #EF014F 100%)",
            }}
          />

          <div className="px-8 pt-7 pb-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group w-fit mb-7">
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

            {/* Heading */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-[2px] bg-ksp-red rounded-full" />
                <div
                  className="w-2 h-[2px] rounded-full"
                  style={{ background: "rgba(234,88,12,0.6)" }}
                />
                <span className="text-[9px] font-black text-ksp-red uppercase tracking-[0.25em]">
                  New Account
                </span>
              </div>
              <h1
                className="font-black text-ksp-black leading-[1.02] mb-2"
                style={{ fontSize: "clamp(2rem, 4vw, 2.6rem)" }}
              >
                Create Your
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #FF6B2B 0%, #EF014F 55%, #FF1A6C 100%)",
                  }}
                >
                  Account.
                </span>
              </h1>
              <p className="text-gray-500 text-sm">
                Join thousands of happy KSP customers.
              </p>
            </div>

            {/* General error */}
            {errors.general && (
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
                <p className="text-sm text-red-700 font-medium">
                  {errors.general}
                </p>
              </div>
            )}

            {/* Success */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John"
                  disabled={loading}
                  icon={User}
                  focused={focusedField === "firstName"}
                  error={errors.firstName}
                />
                <Field
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Doe"
                  disabled={loading}
                  icon={User}
                  focused={focusedField === "lastName"}
                  error={errors.lastName}
                />
              </div>

              {/* Email */}
              <Field
                label="Email Address"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                icon={Mail}
                focused={focusedField === "email"}
                error={errors.email}
              />

              {/* Phone */}
              <Field
                label="Phone"
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                placeholder="+94 71 234 5678"
                autoComplete="tel"
                disabled={loading}
                icon={Phone}
                optional
                focused={focusedField === "phone"}
                error={errors.phone}
              />

              {/* Password */}
              <div>
                <Field
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  disabled={loading}
                  icon={Lock}
                  focused={focusedField === "password"}
                  error={errors.password}
                  suffix={
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((v) => !v)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  }
                />

                {/* Strength bar */}
                {formData.password && (
                  <div className="mt-2 space-y-1.5">
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
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                        <Req
                          met={formData.password.length >= 6}
                          text="6+ characters"
                        />
                        <Req
                          met={/[A-Z]/.test(formData.password)}
                          text="Uppercase"
                        />
                        <Req
                          met={/[a-z]/.test(formData.password)}
                          text="Lowercase"
                        />
                        <Req met={/\d/.test(formData.password)} text="Number" />
                      </div>
                      <span
                        className={`text-[10px] font-bold ml-2 flex-shrink-0 ${
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
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <Field
                  label="Confirm Password"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  disabled={loading}
                  icon={Lock}
                  focused={focusedField === "confirmPassword"}
                  error={errors.confirmPassword}
                  suffix={
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                    </button>
                  }
                />
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-green-600 font-semibold">
                      <CheckCircle size={11} /> Passwords match
                    </p>
                  )}
              </div>

              {/* Terms */}
              <div className="pt-0.5">
                <label className="flex items-start gap-3 cursor-pointer group/terms select-none">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={agreeTerms}
                    onClick={() => {
                      setAgreeTerms((v) => !v);
                      if (errors.terms) setErrors((p) => ({ ...p, terms: "" }));
                    }}
                    className="mt-0.5 w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={
                      agreeTerms
                        ? {
                            background:
                              "linear-gradient(135deg,#EF014F,#FF6B2B)",
                            borderColor: "#EF014F",
                            boxShadow: "0 0 8px rgba(239,1,79,0.4)",
                          }
                        : { borderColor: "rgba(0,0,0,0.2)" }
                    }
                  >
                    {agreeTerms && (
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
                  <span className="text-xs text-gray-600 leading-relaxed group-hover/terms:text-gray-900 transition-colors">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-bold hover:brightness-125 transition-all"
                      style={{ color: "#EF014F" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-bold hover:brightness-125 transition-all"
                      style={{ color: "#EF014F" }}
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-500 font-semibold ml-7">
                    <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-xl py-3.5 font-bold text-white text-sm tracking-wide
                  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] group mt-1"
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
                      <Loader2 size={17} className="animate-spin" /> Creating
                      Account…
                    </>
                  ) : (
                    <>
                      Create Account{" "}
                      <ArrowRight
                        size={17}
                        className="group-hover:translate-x-1.5 transition-transform duration-200"
                      />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Login link */}
            <p
              className="text-center text-xs text-gray-500 mt-5 pt-5"
              style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-black hover:brightness-125 transition-all duration-200"
                style={{ color: "#EF014F" }}
              >
                Sign in →
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-400 mt-5">
          © 2026 Kandy Super Phone · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Register;
