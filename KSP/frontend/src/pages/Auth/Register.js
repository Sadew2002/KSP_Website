import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    // TODO: Implement register logic
    console.log('Register attempt:', formData);
    setLoading(false);
  };

  return (
    <div className="bg-ksp-gray min-h-screen flex items-center justify-center py-12 px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ksp-black mb-2">Create Account</h1>
          <p className="text-gray-600">Join Kandy Super Phone today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">First Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="John"
                />
              </div>
              {errors.firstName && <p className="form-error">{errors.firstName}</p>}
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && <p className="form-error">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="form-label">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div>
            <label className="form-label">Phone Number (Optional)</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="+94712345678"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="At least 6 characters"
              />
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div>
            <label className="form-label">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="Confirm your password"
              />
            </div>
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <label className="flex items-start mt-6">
            <input type="checkbox" className="mr-2 mt-1" required />
            <span className="text-sm text-gray-600">
              I agree to the <a href="#" className="text-ksp-red hover:underline">Terms of Service</a> and <a href="#" className="text-ksp-red hover:underline">Privacy Policy</a>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-600">Already have an account?</span>
          </div>
        </div>

        <Link
          to="/login"
          className="btn-secondary w-full text-center"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
