import React, { useEffect } from 'react';
import Login from '../components/auth/Login';

const LoginPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <Login />;
};

export default LoginPage;