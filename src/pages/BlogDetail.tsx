import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { Calendar, User, ArrowLeft, Loader2, Clock, Facebook, Twitter, Instagram, Youtube, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import DOMPurify from 'dompurify';

interface Blog {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: any;
  authorUid: string;
  views?: number;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBlog({ id: docSnap.id, ...docSnap.data() } as Blog);
          // Increment views
          await updateDoc(docRef, {
            views: increment(1)
          });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#0B5ED7] animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  const date = blog.createdAt?.toDate ? blog.createdAt.toDate().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }) : 'Recently';

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
          <span className="font-['Poppins'] font-medium">Back to Stories</span>
        </motion.button>

        <article className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-['Roboto']">
              <div className="flex items-center gap-1.5 bg-[#20C997]/10 text-[#20C997] px-3 py-1 rounded-full font-bold uppercase tracking-wider text-xs">
                Travel Story
              </div>
              <div className="flex items-center gap-1.5 text-[#FFC107] font-bold">
                <Clock className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-[#212529] leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 font-['Roboto']">
              <Calendar className="w-5 h-5 text-[#0B5ED7]" />
              <span>{date}</span>
            </div>
          </motion.div>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="flow-root">
              <div className="md:float-left md:mr-10 md:mb-6 w-full md:w-[45%] lg:w-[40%] mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-[2rem] overflow-hidden shadow-xl"
                >
                  <img 
                    src={blog.imageUrl} 
                    alt={blog.title}
                    className="w-full h-auto object-cover aspect-[3/4] md:aspect-auto max-h-[70vh]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-['Roboto'] text-gray-700 leading-relaxed text-lg text-left break-words"
              >
                <div className="space-y-6">
                  <div 
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.description) }}
                  />
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold font-['Poppins'] text-[#212529] text-xl">Story Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Published On</p>
                        <p className="font-medium">{date}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Reading Time</p>
                        <p className="font-medium">5 Minutes</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Views</p>
                        <p className="font-medium">{blog.views || 0} Views</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Category</p>
                        <p className="font-medium">Travel Guide</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Social Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#212529] p-8 md:p-12 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold font-['Poppins']">Share this Story</h3>
              <p className="text-gray-400 font-['Roboto']">Help others discover this amazing travel story.</p>
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
