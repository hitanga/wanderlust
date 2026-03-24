import { format } from 'date-fns';
import { Calendar, ArrowRight } from 'lucide-react';
import { Blog } from '../types';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface BlogCardProps {
  blog: Blog;
  key?: string;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/blog/${blog.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={blog.imageUrl} 
          alt={blog.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-[#0B5ED7] text-white px-3 py-1 rounded-full text-xs font-['Poppins'] font-semibold">
          Travel Guide
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-['Roboto']">
          <Calendar className="w-4 h-4 text-[#20C997]" />
          <span>{format(blog.createdAt.toDate(), 'MMMM dd, yyyy')}</span>
        </div>
        
        <h3 className="text-xl font-bold font-['Poppins'] text-[#212529] line-clamp-2 leading-tight group-hover:text-[#0B5ED7] transition-colors">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 font-['Roboto'] line-clamp-3 text-sm leading-relaxed">
          {blog.description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}
        </p>
        
        <button className="flex items-center gap-2 text-[#0B5ED7] font-['Poppins'] font-semibold group/btn hover:gap-3 transition-all">
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
