import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Check, X, AlertCircle } from 'lucide-react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Brutalist toast helper
const showBrutalistToast = (message, type = 'success') => {
  const icons = {
    success: <Check size={20} strokeWidth={3} className="text-black" />,
    error: <X size={20} strokeWidth={3} className="text-black" />,
    warning: <AlertCircle size={20} strokeWidth={3} className="text-black" />
  };

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3 max-w-md w-full`}
      >
        <div className={`flex-shrink-0 ${type === 'success' ? 'text-green-600' : type === 'error' ? 'text-red-600' : 'text-yellow-600'}`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="font-black uppercase text-sm tracking-tighter">{message}</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="flex-shrink-0 border-2 border-black p-1 hover:bg-yellow-400 transition-colors">
          <X size={14} strokeWidth={3} />
        </button>
      </div>
    ),
    {
      duration: 3000,
      position: 'top-center',
    }
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchDealerProfileWithRetry(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchDealerProfileWithRetry(session.user.id);
      } else {
        setDealer(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDealerProfileWithRetry = async (userId, retries = 5) => {
    let attempt = 0;
    while (attempt < retries) {
      try {
        const { data, error } = await supabase
          .from('dealers')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No profile yet, wait and retry
            attempt++;
            if (attempt < retries) {
              console.log(`Dealer profile not found, retrying (${attempt}/${retries})...`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec
              continue;
            } else {
              // No profile after all retries
              console.log('No dealer profile found after retries.');
              setDealer(null);
              setLoading(false);
              return;
            }
          } else {
            throw error;
          }
        } else {
          // Profile found
          setDealer(data);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching dealer profile:', error.message);
        showBrutalistToast('Failed to load dealer profile', 'error');
        setLoading(false);
        return;
      }
    }
  };

  const signUp = async (email, password, dealerData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: dealerData.business_name,
            phone: dealerData.phone,
          }
        }
      });

      if (error) {
        // Check for rate limit error
        if (error.message?.toLowerCase().includes('rate limit') || error.status === 429) {
          showBrutalistToast('Too many sign-up attempts. Please wait a few minutes and try again.', 'error');
        } else {
          showBrutalistToast(error.message, 'error');
        }
        throw error;
      }

      showBrutalistToast('Registration successful! Please verify your email.', 'success');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      // Loading will be cleared by fetchDealerProfile after auth change
      // Do not setLoading(false) here
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      showBrutalistToast('Logged in successfully', 'success');
      return { success: true };
    } catch (error) {
      showBrutalistToast(error.message, 'error');
      return { success: false, error: error.message };
    } finally {
      // Loading will be cleared by fetchDealerProfile after auth change
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showBrutalistToast('Logged out', 'success');
    } catch (error) {
      showBrutalistToast(error.message, 'error');
    } finally {
      setLoading(false); // Sign out clears everything, so we can set loading false
    }
  };

  // Compute admin status from dealer (if dealer exists and has is_admin = true)
  const isAdmin = dealer?.is_admin || false;

  const value = {
    user,
    dealer,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    refreshDealer: () => fetchDealerProfileWithRetry(user?.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};