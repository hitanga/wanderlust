import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Blog } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BlogCard from '../components/BlogCard';
import { motion } from 'motion/react';
import { Search, MapPin, Loader2, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FEATURED_DESTINATIONS } from '../data/destinations';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const filteredDestinations = FEATURED_DESTINATIONS.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/travel/1920/1080" 
              alt="Hero" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Poppins'] text-white leading-tight"
          >
            Explore the World with <span className="text-[#0B5ED7]">Wanderlust</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 font-['Roboto'] max-w-2xl mx-auto"
          >
            Discover breathtaking destinations, hidden gems, and travel stories from around the globe.
          </motion.p>
          
          <motion.form 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSearch}
            className="flex max-w-md mx-auto bg-white rounded-full p-2 shadow-2xl"
          >
            <div className="flex items-center px-4 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Search destinations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-3 focus:outline-none font-['Roboto'] text-gray-700"
            />
            <button 
              type="submit"
              className="bg-[#0B5ED7] text-white px-6 py-3 rounded-full font-['Poppins'] font-semibold hover:bg-[#094db3] transition-colors"
            >
              Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section ref={resultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white/50">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-['Poppins'] text-[#212529]">Featured Destinations</h2>
            <div className="w-20 h-1 bg-[#0B5ED7] rounded-full"></div>
          </div>
          <a href="/destinations" className="text-[#0B5ED7] font-['Poppins'] font-bold hover:underline flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((dest, idx) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-[#FFC107] font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{dest.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#20C997] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {dest.category}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 text-[#0B5ED7]" />
                    <span>{dest.name.split(', ')[1]}</span>
                  </div>
                  <h3 className="text-xl font-bold font-['Poppins'] text-[#212529]">{dest.name}</h3>
                  <p className="text-gray-600 font-['Roboto'] text-sm line-clamp-2">
                    {dest.description}
                  </p>
                  <button 
                    onClick={() => navigate(`/destination/${dest.id}`)}
                    className="flex items-center gap-2 text-[#0B5ED7] font-['Poppins'] font-bold group/btn"
                  >
                    Explore Now
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 font-['Roboto']">No featured destinations match your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-['Poppins'] text-[#212529]">Latest Stories</h2>
            <div className="w-20 h-1 bg-[#0B5ED7] rounded-full"></div>
          </div>
          <div className="flex items-center gap-2 text-gray-500 font-['Roboto']">
            <MapPin className="w-5 h-5 text-[#20C997]" />
            <span>Global Destinations</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-[#0B5ED7] animate-spin" />
            <p className="text-gray-500 font-['Poppins']">Loading travel stories...</p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">🌍</div>
            <h3 className="text-2xl font-bold font-['Poppins'] text-gray-400">No stories found</h3>
            <p className="text-gray-500 font-['Roboto']">Try searching for something else or check back later.</p>
          </div>
        )}
      </main>

      {/* Why Choose Us Section */}
      <section className="bg-[#212529] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins']">Why Travel With <span className="text-[#0B5ED7]">Wanderlust</span>?</h2>
            <p className="text-gray-400 font-['Roboto'] max-w-2xl mx-auto">We provide the best travel experiences with a focus on comfort, safety, and unforgettable memories.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Expert Guides', desc: 'Our local experts know the best hidden spots and stories.', icon: '🗺️' },
              { title: 'Best Prices', desc: 'We offer competitive pricing without compromising on quality.', icon: '💰' },
              { title: '24/7 Support', desc: 'Our team is always available to help you during your journey.', icon: '📞' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all text-center space-y-4"
              >
                <div className="text-5xl">{item.icon}</div>
                <h3 className="text-xl font-bold font-['Poppins']">{item.title}</h3>
                <p className="text-gray-400 font-['Roboto'] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
