import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Smartphone, 
  Shield, CheckCircle, AlertCircle, Loader2, KeyRound, Sparkles
} from 'lucide-react';
import api from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState(''); // For demo purposes

  // Handle code input
  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Step 1: Request reset code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/forgot-password', { email: email.toLowerCase().trim() });
      
      if (response.data.success) {
        setSuccess('Reset code sent to your email!');
        // For demo, save the code (remove in production)
        if (response.data.demoResetCode) {
          setDemoCode(response.data.demoResetCode);
        }
        setTimeout(() => {
          setStep(2);
          setSuccess('');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-reset-code', { 
        email: email.toLowerCase().trim(), 
        code: fullCode 
      });
      
      if (response.data.success) {
        setSuccess('Code verified successfully!');
        setTimeout(() => {
          setStep(3);
          setSuccess('');
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/reset-password', { 
        email: email.toLowerCase().trim(), 
        code: code.join(''),
        newPassword
      });
      
      if (response.data.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { state: { message: 'Password reset successfully. Please login with your new password.' } });
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const levels = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];
    return { score, ...levels[Math.min(score, 4)] };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ksp-red via-red-600 to-red-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Smartphone className="text-ksp-red" size={28} />
            </div>
            <span className="text-2xl font-bold text-white">Kandy Super Phone</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {step === 1 && 'Forgot Password?'}
              {step === 2 && 'Verify Your Email'}
              {step === 3 && 'Create New Password'}
            </h1>
            <p className="text-red-100 text-lg">
              {step === 1 && "Don't worry, it happens to the best of us. Enter your email and we'll send you a reset code."}
              {step === 2 && "We've sent a 6-digit code to your email. Enter it below to continue."}
              {step === 3 && "Choose a strong password that you haven't used before."}
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Secure password reset process', active: step >= 1 },
              { icon: Mail, text: 'Verification code via email', active: step >= 2 },
              { icon: KeyRound, text: 'Create your new password', active: step >= 3 }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-3 transition-all duration-300 ${item.active ? 'text-white' : 'text-white/40'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${item.active ? 'bg-white/20' : 'bg-white/10'}`}>
                  <item.icon size={20} />
                </div>
                <span className="font-medium">{item.text}</span>
                {item.active && <Sparkles size={16} className="text-yellow-300 animate-pulse" />}
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= s ? 'bg-white text-ksp-red' : 'bg-white/20 text-white'
                }`}>
                  {step > s ? <CheckCircle size={20} /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${
                    step > s ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-red-100 text-sm">
          © 2026 Kandy Super Phone. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-ksp-red rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">Kandy Super Phone</span>
            </Link>
          </div>

          {/* Mobile Progress */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step >= s ? 'bg-ksp-red w-8' : 'bg-gray-300'
              }`} />
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-ksp-red to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200/50">
                {step === 1 && <Mail className="text-white" size={32} />}
                {step === 2 && <Shield className="text-white" size={32} />}
                {step === 3 && <KeyRound className="text-white" size={32} />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {step === 1 && 'Reset Password'}
                {step === 2 && 'Enter Verification Code'}
                {step === 3 && 'Create New Password'}
              </h2>
              <p className="text-gray-500">
                {step === 1 && 'Enter the email address associated with your account'}
                {step === 2 && 'We sent a code to your email'}
                {step === 3 && 'Your new password must be different from previous ones'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-shake">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
                <CheckCircle size={20} />
                <span className="text-sm">{success}</span>
              </div>
            )}

            {/* Demo Code Display (Remove in production) */}
            {demoCode && step === 2 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700 font-medium mb-1">Demo Mode: Your reset code is</p>
                <p className="text-2xl font-mono font-bold text-blue-800 tracking-widest">{demoCode}</p>
              </div>
            )}

            {/* Step 1: Email Form */}
            {step === 1 && (
              <form onSubmit={handleRequestCode} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all outline-none text-lg"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-ksp-red to-red-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Code Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                    Enter the 6-digit code sent to <span className="text-ksp-red">{email}</span>
                  </label>
                  <div className="flex justify-center gap-3">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all outline-none"
                        disabled={loading}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || code.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-ksp-red to-red-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Code
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setCode(['', '', '', '', '', '']); setError(''); }}
                  className="w-full py-3 text-gray-600 font-medium hover:text-ksp-red transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Change Email Address
                </button>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all outline-none"
                      placeholder="At least 6 characters"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password Strength */}
                  {newPassword && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all ${i <= passwordStrength.score ? passwordStrength.color : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${passwordStrength.score >= 3 ? 'text-green-600' : passwordStrength.score >= 2 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-ksp-red/20 focus:border-ksp-red transition-all outline-none"
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle size={14} /> Passwords match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-ksp-red to-red-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-gray-600 hover:text-ksp-red font-medium transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
