import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { Compass, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AdminLogin: Initializing auth listener');
    
    // Fallback timeout to prevent being stuck on "Authenticating..."
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AdminLogin: Auth state changed', user?.email);
      clearTimeout(timeoutId);
      
      try {
        if (user) {
          const email = user.email?.toLowerCase();
          if (email === 'hitanga@gmail.com') {
            console.log('AdminLogin: Admin user detected');
            
            // Try to update Firestore but don't let it block navigation if it's slow
            setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              role: 'admin'
            }, { merge: true }).catch(err => {
              console.error('AdminLogin: Firestore update failed (non-fatal):', err);
            });
            
            console.log('AdminLogin: Navigating to dashboard');
            navigate('/admin/dashboard');
          } else {
            console.warn('AdminLogin: Non-admin user attempted login', user.email);
            setError(`Access denied (${user.email}). Only the site owner can access the admin portal.`);
            // Sign out the unauthorized user immediately
            await auth.signOut();
            setLoading(false);
          }
        } else {
          console.log('AdminLogin: No user logged in');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('AdminLogin: Auth error:', err);
        setError(err.message || 'An error occurred during authentication.');
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#0B5ED7] animate-spin" />
        <p className="text-gray-500 font-['Poppins']">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0B5ED7]/10 rounded-2xl">
            <Compass className="w-10 h-10 text-[#0B5ED7]" />
          </div>
          <h1 className="text-3xl font-bold font-['Poppins'] text-[#212529]">Admin Portal</h1>
          <p className="text-gray-500 font-['Roboto']">Sign in to manage your travel stories and destinations.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-['Roboto']"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 py-4 rounded-2xl font-['Poppins'] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          <span>Sign in with Google</span>
        </button>

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-[#0B5ED7] font-['Poppins'] text-sm font-medium transition-colors"
          >
            Back to Public Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}
