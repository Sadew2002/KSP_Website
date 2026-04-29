import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      navigate('/login?error=google_login_failed', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('rememberedEmail');

      const redirectTo = user.role === 'admin' ? '/admin' : '/';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Google auth callback error:', error);
      navigate('/login?error=google_login_failed', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ksp-gray via-white to-red-50/30 px-6">
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 p-8 md:p-10 text-center max-w-md w-full border border-gray-100/50">
        <div className="w-14 h-14 border-4 border-ksp-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-black text-ksp-black mb-2">Signing you in</h1>
        <p className="text-gray-500 font-medium">Completing Google authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;