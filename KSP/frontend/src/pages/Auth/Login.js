import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone, 
  Shield, CheckCircle, AlertCircle, Loader2, Sparkles, Star
} from 'lucide-react';
import api from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(location.state?.message || '');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      const userData = JSON.parse(user);
      navigate(userData.role === 'admin' ? '/admin' : '/');
    }
  }, [navigate]);

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      if (response.data.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
          const redirectTo = location.state?.from || 
            (response.data.user.role === 'admin' ? '/admin' : '/');
          navigate(redirectTo);
        }, 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ksp-gray via-white to-red-50/30 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ksp-red via-red-500 to-rose-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-yellow-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 group-hover:scale-105 transition-transform duration-300">
              <Smartphone className="text-ksp-red" size={32} />
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">Kandy Super Phone</span>
              <span className="block text-sm text-white/70 font-medium">Premium Mobile Store</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Welcome Back!</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">
              Sign in to your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-100">Account</span>
            </h1>
            <p className="text-white/80 text-lg max-w-md leading-relaxed">
              Access your orders, track deliveries, and discover exclusive deals on the latest smartphones.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Secure & encrypted login', color: 'from-green-400 to-emerald-500' },
              { icon: Smartphone, text: 'Access your orders anytime', color: 'from-blue-400 to-cyan-500' },
              { icon: Star, text: 'Exclusive member deals', color: 'from-yellow-400 to-orange-500' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 text-white/90 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={22} className="text-white" />
                </div>
                <span className="font-medium text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">© 2026 Kandy Super Phone. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-ksp-red to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Smartphone className="text-white" size={26} />
              </div>
              <span className="text-xl font-black text-ksp-black">Kandy Super Phone</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-8 md:p-10 border border-gray-100/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-ksp-black mb-2">Welcome Back</h2>
              <p className="text-gray-500 font-medium">Enter your credentials to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 animate-shake">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} />
                </div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-700">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={20} />
                </div>
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${focusedField === 'email' ? 'bg-ksp-red' : 'bg-gray-100'}`}>
                    <Mail className={`transition-colors duration-300 ${focusedField === 'email' ? 'text-white' : 'text-gray-400'}`} size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-16 pr-4 py-4 bg-ksp-gray border-2 border-transparent rounded-2xl focus:bg-white focus:border-ksp-red/30 focus:ring-4 focus:ring-ksp-red/10 transition-all duration-300 outline-none font-medium"
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${focusedField === 'password' ? 'bg-ksp-red' : 'bg-gray-100'}`}>
                    <Lock className={`transition-colors duration-300 ${focusedField === 'password' ? 'text-white' : 'text-gray-400'}`} size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-16 pr-14 py-4 bg-ksp-gray border-2 border-transparent rounded-2xl focus:bg-white focus:border-ksp-red/30 focus:ring-4 focus:ring-ksp-red/10 transition-all duration-300 outline-none font-medium"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-ksp-red rounded-xl hover:bg-gray-100 transition-all duration-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${rememberMe ? 'bg-ksp-red border-ksp-red' : 'border-gray-300 group-hover:border-ksp-red/50'}`}>
                      {rememberMe && <CheckCircle size={14} className="text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-ksp-red hover:text-red-700 font-semibold transition-colors hover:underline decoration-2 underline-offset-2">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-ksp-red to-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-xl shadow-red-200/50 hover:shadow-2xl hover:shadow-red-300/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={22} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-100"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-400 font-medium">New to Kandy Super Phone?</span>
              </div>
            </div>

            <Link
              to="/register"
              className="block w-full py-4 border-2 border-gray-200 rounded-2xl text-center font-bold text-gray-700 hover:border-ksp-red hover:text-ksp-red hover:bg-red-50/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Create an Account
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-ksp-red hover:underline font-medium">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-ksp-red hover:underline font-medium">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
