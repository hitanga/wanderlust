import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Blog } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'motion/react';
import { Edit2, Trash2, Eye, Plus, Search, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const blogsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Blog[];
      setBlogs(blogsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteDoc(doc(db, 'blogs', id));
      setConfirmDeleteId(null);
    } catch (err: any) {
      console.error('Error deleting blog:', err);
      setError(err.message || 'Failed to delete blog. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-10 space-y-10">
        <header className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-['Poppins'] text-[#212529]">Manage Blog Posts</h1>
            <p className="text-gray-500 font-['Roboto']">Edit, delete, or view your published travel stories.</p>
          </div>
          <Link 
            to="/admin/add-blog"
            className="flex items-center gap-2 bg-[#0B5ED7] text-white px-6 py-3 rounded-2xl font-['Poppins'] font-bold hover:bg-[#094db3] transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Blog</span>
          </Link>
        </header>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-2xl">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 font-['Roboto'] text-gray-700"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl text-gray-500 font-['Poppins'] text-sm font-medium">
            <span>Total: {filteredBlogs.length}</span>
          </div>
        </div>

        {/* Blog Table */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Roboto']">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-8 py-4 font-semibold">Blog Info</th>
                  <th className="px-8 py-4 font-semibold">Date Created</th>
                  <th className="px-8 py-4 font-semibold">Status</th>
                  <th className="px-8 py-4 font-semibold text-right">Actions</th>
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
                ) : filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            className="w-16 h-16 rounded-xl object-cover shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1">
                            <span className="font-bold text-[#212529] line-clamp-1">{blog.title}</span>
                            <span className="text-xs text-gray-400 block line-clamp-1">{blog.description.substring(0, 50)}...</span>
                          </div>
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
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to="/" 
                            className="p-2 text-gray-400 hover:text-[#0B5ED7] transition-colors rounded-lg hover:bg-blue-50"
                            title="View on Site"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => navigate(`/admin/edit-blog/${blog.id}`)}
                            className="p-2 text-gray-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-amber-50"
                            title="Edit Post"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            disabled={deletingId === blog.id}
                            onClick={() => setConfirmDeleteId(blog.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                            title="Delete Post"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <AlertCircle className="w-12 h-12 text-gray-200" />
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold font-['Poppins'] text-gray-400">No blogs found</h3>
                          <p className="text-gray-400 font-['Roboto'] text-sm">Try a different search or add a new post.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Custom Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold font-['Poppins'] text-[#212529]">Delete Post?</h3>
                <p className="text-gray-500 font-['Roboto']">
                  Are you sure you want to delete this blog post? This action is permanent and cannot be undone.
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-['Roboto']">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold font-['Poppins'] hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={deletingId === confirmDeleteId}
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-bold font-['Poppins'] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {deletingId === confirmDeleteId ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Delete Now'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
