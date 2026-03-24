import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Destinations from './pages/Destinations';
import About from './pages/About';
import Contact from './pages/Contact';
import BlogDetail from './pages/BlogDetail';
import DestinationDetail from './pages/DestinationDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddBlog from './pages/AddBlog';
import ManageBlogs from './pages/ManageBlogs';
import { Loader2 } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Fallback timeout to prevent being stuck on loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeoutId);
      try {
        const email = user?.email?.toLowerCase();
        if (user && email === 'hitanga@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('ProtectedRoute auth error:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="w-12 h-12 text-[#0B5ED7] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blogs />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/add-blog" 
          element={
            <ProtectedRoute>
              <AddBlog />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/edit-blog/:id" 
          element={
            <ProtectedRoute>
              <AddBlog />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin/manage-blogs" 
          element={
            <ProtectedRoute>
              <ManageBlogs />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
