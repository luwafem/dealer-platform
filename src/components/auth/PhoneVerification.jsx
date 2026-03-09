import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Phone, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Note: Supabase doesn't have built-in phone verification out of the box.
// This is a placeholder for OTP verification using Supabase's phone auth.
// You'll need to enable phone auth in Supabase and adjust accordingly.
// For now, we'll simulate a simple OTP input.

const PhoneVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, dealer } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real implementation, you would verify OTP with Supabase
    // const { error } = await supabase.auth.verifyOtp({ phone: dealer.phone, token: otp, type: 'sms' });
    // For now, just simulate success
    setTimeout(() => {
      toast.success('Phone verified successfully!');
      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  if (!user || !dealer) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Phone Number
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification code to {dealer?.phone}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="otp" className="sr-only">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <CheckCircle className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {loading ? 'Verifying...' : 'Verify Phone'}
            </button>
          </div>

          <div className="text-sm text-center">
            <button
              type="button"
              onClick={() => toast.success('New code sent!')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Resend code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneVerification;