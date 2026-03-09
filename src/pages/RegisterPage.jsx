import React, { useEffect } from 'react';
import Register from '../components/auth/Register';

const RegisterPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <Register />;
};

export default RegisterPage;