import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Compass, Users, Globe, Award, CheckCircle } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '50k+' },
    { icon: Globe, label: 'Destinations', value: '200+' },
    { icon: Award, label: 'Travel Awards', value: '15+' },
    { icon: Compass, label: 'Years Experience', value: '10+' },
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'Michael Chen', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'Elena Rodriguez', role: 'Lead Travel Consultant', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
    { name: 'David Smith', role: 'Customer Experience', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="About Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 text-center px-4 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-['Poppins'] text-white"
          >
            Our <span className="text-[#0B5ED7]">Story</span>
          </motion.h1>
          <p className="text-gray-200 font-['Roboto'] max-w-2xl mx-auto">
            We're on a mission to inspire the world to travel more and explore the beauty of our planet.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-['Poppins'] text-[#212529]">Who We Are</h2>
              <div className="w-20 h-1 bg-[#0B5ED7] rounded-full"></div>
            </div>
            <p className="text-gray-600 font-['Roboto'] leading-relaxed text-lg">
              Founded in 2016, Wanderlust Travel Agency started as a small blog sharing personal travel stories. Today, we've grown into a full-service travel companion, helping thousands of travelers discover the world's most breathtaking destinations.
            </p>
            <div className="space-y-4">
              {['Expert Travel Guides', 'Personalized Itineraries', '24/7 Customer Support', 'Sustainable Travel Focus'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-700 font-['Poppins'] font-semibold">
                  <CheckCircle className="w-5 h-5 text-[#20C997]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Our Team" 
              className="rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0B5ED7] rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-['Poppins'] text-[#212529]">10+</p>
                  <p className="text-gray-500 text-sm font-['Roboto']">Years of Excellence</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="bg-[#212529] rounded-[3rem] p-12 md:p-20 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0B5ED7]/20 rounded-2xl">
                  <stat.icon className="w-8 h-8 text-[#0B5ED7]" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-bold font-['Poppins']">{stat.value}</p>
                  <p className="text-gray-400 font-['Roboto'] text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold font-['Poppins'] text-[#212529]">Meet Our Team</h2>
            <p className="text-gray-500 font-['Roboto'] max-w-2xl mx-auto">
              Our team of travel experts is dedicated to making your travel dreams come true.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 text-center space-y-1">
                  <h3 className="text-xl font-bold font-['Poppins'] text-[#212529]">{member.name}</h3>
                  <p className="text-[#0B5ED7] font-['Roboto'] font-medium text-sm">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
