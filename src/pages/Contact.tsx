import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Save to Firestore
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp()
      });

      // Send email via backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, label: 'Call Us', value: '+1 234 567 890', color: 'bg-blue-500' },
    { icon: Mail, label: 'Email Us', value: 'hello@wanderlust.com', color: 'bg-teal-500' },
    { icon: MapPin, label: 'Visit Us', value: '123 Travel St, Adventure City', color: 'bg-amber-500' },
  ];

  const socialLinks = [
    { icon: Facebook, color: 'hover:bg-[#1877F2]' },
    { icon: Twitter, color: 'hover:bg-[#1DA1F2]' },
    { icon: Instagram, color: 'hover:bg-[#E4405F]' },
    { icon: Youtube, color: 'hover:bg-[#FF0000]' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-['Poppins'] text-[#212529]"
          >
            Get in <span className="text-[#0B5ED7]">Touch</span>
          </motion.h1>
          <p className="text-gray-500 font-['Roboto'] max-w-2xl mx-auto">
            Have questions about a destination or want to plan your next trip? Our team is here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {contactInfo.map((info, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all"
              >
                <div className={`p-4 rounded-2xl ${info.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                  <info.icon className={`w-6 h-6 ${info.color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <p className="text-sm font-bold font-['Poppins'] text-gray-400 uppercase tracking-wider">{info.label}</p>
                  <p className="text-lg font-bold font-['Poppins'] text-[#212529]">{info.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="bg-[#212529] p-8 rounded-3xl text-white space-y-6">
              <h3 className="text-xl font-bold font-['Poppins']">Follow Our Journey</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <div key={idx} className={`w-10 h-10 bg-white/10 rounded-xl ${social.color} transition-all cursor-pointer flex items-center justify-center group`}>
                    <social.icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border border-gray-100"
          >
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-['Roboto']">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {success ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold font-['Poppins'] text-[#212529]">Message Sent!</h2>
                  <p className="text-gray-500 font-['Roboto'] max-w-sm mx-auto">
                    Thank you for reaching out. Our travel experts will get back to you within 24 hours.
                  </p>
                </div>
                <button 
                  onClick={() => setSuccess(false)}
                  className="text-[#0B5ED7] font-bold font-['Poppins'] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-['Poppins'] text-[#212529] ml-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0B5ED7] font-['Roboto'] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold font-['Poppins'] text-[#212529] ml-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0B5ED7] font-['Roboto'] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold font-['Poppins'] text-[#212529] ml-2">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Plan my next trip"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0B5ED7] font-['Roboto'] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold font-['Poppins'] text-[#212529] ml-2">Your Message</label>
                  <textarea 
                    required
                    rows={6}
                    placeholder="Tell us about your travel plans..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0B5ED7] font-['Roboto'] transition-all resize-none"
                  />
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-[#0B5ED7] text-white py-5 rounded-2xl font-['Poppins'] font-bold text-lg hover:bg-[#094db3] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
