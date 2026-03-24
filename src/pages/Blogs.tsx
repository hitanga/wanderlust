import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Blog } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import { motion } from 'motion/react';
import { Loader2, Search, BookOpen } from 'lucide-react';

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];
      setBlogs(blogsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0B5ED7] rounded-full text-sm font-bold font-['Poppins'] uppercase tracking-wider"
          >
            <BookOpen className="w-4 h-4" />
            <span>Our Journal</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold font-['Poppins'] text-[#212529]"
          >
            Travel <span className="text-[#0B5ED7]">Stories</span> & Guides
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 font-['Roboto'] max-w-2xl mx-auto text-lg"
          >
            Dive into our collection of travel experiences, tips, and hidden gems from across the globe.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto relative group mt-8"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0B5ED7] transition-colors" />
            <input 
              type="text" 
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0B5ED7] font-['Roboto'] transition-all shadow-sm"
            />
          </motion.div>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-[#0B5ED7] animate-spin" />
            <p className="text-gray-500 font-['Poppins']">Loading travel stories...</p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 space-y-6"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-12 h-12 text-gray-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold font-['Poppins'] text-[#212529]">No Blog Found</h3>
              <p className="text-gray-500 font-['Roboto'] max-w-sm mx-auto">
                {searchTerm 
                  ? `We couldn't find any stories matching "${searchTerm}". Try a different search term.` 
                  : "We haven't published any travel stories yet. Check back soon for exciting updates!"}
              </p>
            </div>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-[#0B5ED7] font-bold font-['Poppins'] hover:underline"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
