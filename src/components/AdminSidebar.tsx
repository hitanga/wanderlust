import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Home } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function AdminSidebar() {
  const location = useLocation();
  
  const handleLogout = async () => {
    await signOut(auth);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: PlusCircle, label: 'Add Blog', path: '/admin/add-blog' },
    { icon: FileText, label: 'Manage Blogs', path: '/admin/manage-blogs' },
  ];

  return (
    <aside className="w-64 bg-[#212529] text-white min-h-screen fixed left-0 top-0 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 bg-[#0B5ED7] rounded-lg flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold font-['Poppins']">Admin Panel</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-['Poppins'] font-medium ${
              location.pathname === item.path
                ? 'bg-[#0B5ED7] text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all font-['Poppins'] font-medium"
        >
          <Home className="w-5 h-5" />
          <span>Back to Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-['Poppins'] font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
