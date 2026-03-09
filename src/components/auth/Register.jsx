import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Lock, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    business_name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await signUp(formData.email, formData.password, {
      business_name: formData.business_name,
      phone: formData.phone,
    });
    
    if (result.success) {
      // After successful registration, redirect to login or verification page
      navigate('/login', { state: { message: 'Please check your email to verify your account.' } });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f2] text-[#1a1a1a] selection:bg-yellow-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="border-b-2 border-black pb-4">
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
            Register
          </h1>
          <p className="text-lg font-medium mt-2 border-l-4 border-black pl-4">
            Create a dealer account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Business Name */}
            <div>
              <label htmlFor="business_name" className="block text-sm font-black uppercase mb-1">
                Business Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store size={20} strokeWidth={2} className="text-black" />
                </div>
                <input
                  type="text"
                  name="business_name"
                  id="business_name"
                  required
                  value={formData.business_name}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 pl-10 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="Your dealership name"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-black uppercase mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={20} strokeWidth={2} className="text-black" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 pl-10 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="08012345678"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-black uppercase mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} strokeWidth={2} className="text-black" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 pl-10 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-black uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} strokeWidth={2} className="text-black" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 pl-10 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-black uppercase mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} strokeWidth={2} className="text-black" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 pl-10 font-medium bg-white focus:outline-none focus:border-yellow-400 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-black bg-yellow-400 text-black px-6 py-3 font-black uppercase hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <User size={20} strokeWidth={2} className="mr-2" />
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        {/* Login link */}
        <p className="text-center text-sm font-bold">
          Already have an account?{' '}
          <Link to="/login" className="underline hover:no-underline hover:text-yellow-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;