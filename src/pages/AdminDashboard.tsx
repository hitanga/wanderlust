import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, limit, getCountFromServer } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Blog } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'motion/react';
import { FileText, Users, Eye, TrendingUp, Loader2 } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

export default function AdminDashboard() {
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [statsData, setStatsData] = useState({
    totalBlogs: 0,
    totalViews: 0,
    activeUsers: 0,
    growth: '0%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all blogs for stats
    const blogsQuery = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribeBlogs = onSnapshot(blogsQuery, (snapshot) => {
      const allBlogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];

      // Calculate total views
      const totalViews = allBlogs.reduce((acc, blog) => acc + (blog.views || 0), 0);

      // Calculate growth (blogs in last 30 days vs total)
      const thirtyDaysAgo = subDays(new Date(), 30);
      const recentCount = allBlogs.filter(blog => {
        const date = blog.createdAt?.toDate ? blog.createdAt.toDate() : new Date();
        return isAfter(date, thirtyDaysAgo);
      }).length;
      
      const growthVal = allBlogs.length > 0 
        ? Math.round((recentCount / allBlogs.length) * 100) 
        : 0;

      setStatsData(prev => ({
        ...prev,
        totalBlogs: allBlogs.length,
        totalViews,
        growth: `+${growthVal}%`
      }));

      // Set recent blogs for the table
      setRecentBlogs(allBlogs.slice(0, 5));
      setLoading(false);
    });

    // Fetch total users
    const usersQuery = query(collection(db, 'users'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setStatsData(prev => ({
        ...prev,
        activeUsers: snapshot.size
      }));
    });

    return () => {
      unsubscribeBlogs();
      unsubscribeUsers();
    };
  }, []);

  const stats = [
    { label: 'Total Blogs', value: statsData.totalBlogs, icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Views', value: statsData.totalViews > 999 ? `${(statsData.totalViews / 1000).toFixed(1)}k` : statsData.totalViews, icon: Eye, color: 'bg-teal-500' },
    { label: 'Active Users', value: statsData.activeUsers, icon: Users, color: 'bg-amber-500' },
    { label: 'Growth', value: statsData.growth, icon: TrendingUp, color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-10 space-y-10">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-['Poppins'] text-[#212529]">Dashboard Overview</h1>
            <p className="text-gray-500 font-['Roboto']">Welcome back, {auth.currentUser?.displayName?.split(' ')[0] || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold font-['Poppins'] text-[#212529]">{auth.currentUser?.displayName}</p>
              <p className="text-xs text-gray-400 font-['Roboto']">{auth.currentUser?.email}</p>
            </div>
            <img 
              src={auth.currentUser?.photoURL || 'https://ui-avatars.com/api/?name=Admin'} 
              alt="Admin" 
              className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div className={`p-4 rounded-2xl ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-['Roboto'] font-medium">{stat.label}</p>
                <p className="text-2xl font-bold font-['Poppins'] text-[#212529]">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Blogs Table */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold font-['Poppins'] text-[#212529]">Recent Blog Posts</h2>
            <button className="text-[#0B5ED7] font-['Poppins'] font-semibold text-sm hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Roboto']">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-semibold">Blog Title</th>
                  <th className="px-8 py-4 font-semibold">Date Created</th>
                  <th className="px-8 py-4 font-semibold">Status</th>
                  <th className="px-8 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-[#0B5ED7] animate-spin" />
                        <span className="text-gray-400">Loading blogs...</span>
                      </div>
                    </td>
                  </tr>
                ) : recentBlogs.length > 0 ? (
                  recentBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            className="w-12 h-12 rounded-xl object-cover shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-[#212529] line-clamp-1">{blog.title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-gray-500">
                        {format(blog.createdAt.toDate(), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                          Published
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button className="text-gray-400 hover:text-[#0B5ED7] transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                      No blogs found. Start by adding one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
