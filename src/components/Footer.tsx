import React, { useState } from 'react';
import { Compass, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email,
        subscribedAt: serverTimestamp()
      });
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#212529] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-8 h-8 text-[#0B5ED7]" />
              <span className="text-2xl font-bold font-['Poppins']">Wanderlust</span>
            </div>
            <p className="text-gray-400 font-['Roboto']">
              Your ultimate travel companion. Explore the world's most beautiful destinations with us.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-[#0B5ED7] cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-[#0B5ED7] cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-[#0B5ED7] cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold font-['Poppins'] mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 font-['Roboto']">
              <li><a href="/" className="hover:text-[#0B5ED7] transition-colors">Home</a></li>
              <li><a href="/destinations" className="hover:text-[#0B5ED7] transition-colors">Destinations</a></li>
              <li><a href="/about" className="hover:text-[#0B5ED7] transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-[#0B5ED7] transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold font-['Poppins'] mb-6">Contact Info</h3>
            <ul className="space-y-4 text-gray-400 font-['Roboto']">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#0B5ED7]" />
                <span>123 Travel St, Adventure City</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#0B5ED7]" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#0B5ED7]" />
                <span>hello@wanderlust.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold font-['Poppins'] mb-6">Newsletter</h3>
            <p className="text-gray-400 font-['Roboto'] mb-4">
              Subscribe to get the latest travel updates and offers.
            </p>
            {success ? (
              <div className="flex items-center gap-2 text-[#20C997] font-['Poppins'] font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email" 
                    className="bg-gray-800 border-none rounded-l-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#0B5ED7] text-white"
                  />
                  <button 
                    disabled={loading}
                    className="bg-[#0B5ED7] px-4 py-2 rounded-r-lg font-['Poppins'] font-semibold hover:bg-[#094db3] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join'}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs font-['Roboto']">{error}</p>}
              </form>
            )}
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 font-['Roboto']">
          <p>&copy; 2026 Wanderlust Travel Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
