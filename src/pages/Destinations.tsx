import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FEATURED_DESTINATIONS } from '../data/destinations';

export default function Destinations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Coastal', 'Cultural', 'Mountain', 'Nature', 'City', 'Tropical'];

  const filteredDestinations = FEATURED_DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || dest.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#212529] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-['Poppins']"
          >
            Explore Our <span className="text-[#0B5ED7]">Destinations</span>
          </motion.h1>
          <p className="text-gray-400 font-['Roboto'] max-w-2xl mx-auto">
            From the snow-capped peaks of the Alps to the sun-drenched beaches of Bali, find your next adventure.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-['Poppins'] text-sm font-semibold transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#0B5ED7] text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#0B5ED7] font-['Roboto']"
            />
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest, idx) => (
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
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">🗺️</div>
            <h3 className="text-2xl font-bold font-['Poppins'] text-gray-400">No destinations found</h3>
            <p className="text-gray-500 font-['Roboto']">Try adjusting your filters or search term.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
