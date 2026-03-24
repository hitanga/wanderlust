import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FEATURED_DESTINATIONS } from '../data/destinations';
import { MapPin, Star, ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<any>(null);

  useEffect(() => {
    const dest = FEATURED_DESTINATIONS.find(d => d.id === Number(id));
    if (dest) {
      setDestination(dest);
    } else {
      navigate('/destinations');
    }
  }, [id, navigate]);

  if (!destination) return null;

  const socialLinks = [
    { icon: Facebook, color: 'hover:bg-[#1877F2]' },
    { icon: Twitter, color: 'hover:bg-[#1DA1F2]' },
    { icon: Instagram, color: 'hover:bg-[#E4405F]' },
    { icon: Youtube, color: 'hover:bg-[#FF0000]' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#0B5ED7] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-['Poppins'] font-medium">Back to Destinations</span>
        </motion.button>

        <article className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-['Roboto']">
              <div className="flex items-center gap-1.5 bg-[#20C997]/10 text-[#20C997] px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs">
                {destination.category}
              </div>
              <div className="flex items-center gap-1.5 text-[#FFC107] font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{destination.rating} Rating</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-[#212529] leading-tight">
              {destination.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 font-['Roboto']">
              <MapPin className="w-5 h-5 text-[#0B5ED7]" />
              <span>{destination.name}</span>
            </div>
          </motion.div>

          <div className="flow-root">
            <div className="md:float-left md:mr-10 md:mb-6 w-full md:w-[45%] lg:w-[40%] mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-[2rem] overflow-hidden shadow-xl"
              >
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-auto object-cover aspect-[3/4] md:aspect-auto max-h-[70vh]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-['Roboto'] text-gray-700 leading-relaxed text-lg text-left"
            >
              <div className="space-y-6">
                <p className="font-semibold text-xl text-[#212529]">
                  {destination.description}
                </p>
                <p>
                  {destination.longDescription}
                </p>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                  <h3 className="font-bold font-['Poppins'] text-[#212529] text-xl">Quick Facts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Best Time to Visit</p>
                      <p className="font-medium">March to June</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Ideal Duration</p>
                      <p className="font-medium">4-6 Days</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Average Budget</p>
                      <p className="font-medium">₹15,000 - ₹25,000</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Difficulty Level</p>
                      <p className="font-medium">Moderate</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Social Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#212529] p-8 md:p-12 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold font-['Poppins']">Share this Destination</h3>
              <p className="text-gray-400 font-['Roboto']">Help others discover this amazing place.</p>
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <div key={idx} className={`w-12 h-12 bg-white/10 rounded-2xl ${social.color} transition-all cursor-pointer flex items-center justify-center group`}>
                  <social.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
