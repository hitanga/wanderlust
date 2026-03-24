import { Link } from 'react-router-dom';
import { Compass, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-[#0B5ED7]" />
            <span className="text-2xl font-bold font-['Poppins'] text-[#212529]">
              Wanderlust
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8 font-['Poppins'] font-semibold">
            <Link to="/" className="text-[#212529] hover:text-[#0B5ED7] transition-colors">Home</Link>
            <Link to="/blog" className="text-[#212529] hover:text-[#0B5ED7] transition-colors">Blog</Link>
            <Link to="/destinations" className="text-[#212529] hover:text-[#0B5ED7] transition-colors">Destinations</Link>
            <Link to="/about" className="text-[#212529] hover:text-[#0B5ED7] transition-colors">About</Link>
            <Link to="/contact" className="text-[#212529] hover:text-[#0B5ED7] transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/admin/login" 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              title="Admin Login"
            >
              <User className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
