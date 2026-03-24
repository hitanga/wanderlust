import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Blog } from '../types';
import AdminSidebar from '../components/AdminSidebar';
import { motion } from 'motion/react';
import { Image, Type, AlignLeft, Send, Loader2, ArrowLeft, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function AddBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const blogDoc = await getDoc(doc(db, 'blogs', id));
          if (blogDoc.exists()) {
            const data = blogDoc.data();
            setFormData({
              title: data.title,
              imageUrl: data.imageUrl,
              description: data.description
            });
          }
        } catch (err) {
          console.error('Error fetching blog:', err);
        } finally {
          setFetching(false);
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (file) {
      if (file.size > 800000) { // ~800KB limit for base64 in Firestore
        setError('File is too large. Please select an image smaller than 800KB.');
        // Reset the input so the same file can be selected again if needed (to trigger onChange)
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      const reader = new FileReader();
      reader.onloadstart = () => {
        setLoading(true);
      };
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        setLoading(false);
        setError(null); // Explicitly clear error again after successful load
      };
      reader.onerror = () => {
        setError('Failed to read image file. Please try another one.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData({ ...formData, imageUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!auth.currentUser) return;
    if (!formData.imageUrl) {
      setError('Please upload a featured image.');
      return;
    }
    
    setLoading(true);
    try {
      const blogData = {
        ...formData,
        updatedAt: serverTimestamp()
      };

      if (id) {
        await updateDoc(doc(db, 'blogs', id), blogData);
        console.log('Blog updated successfully');
      } else {
        await addDoc(collection(db, 'blogs'), {
          ...formData,
          views: 0,
          createdAt: serverTimestamp(),
          authorUid: auth.currentUser.uid
        });
        console.log('Blog created successfully');
      }
      setSuccess(true);
      setTimeout(() => navigate('/admin/manage-blogs'), 1500);
    } catch (err: any) {
      console.error('Error saving blog:', err);
      let errorMessage = 'Failed to save blog.';
      if (err.code === 'permission-denied') {
        errorMessage = 'Permission denied. You might not have authorization to edit this post or the data format is invalid according to security rules.';
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#0B5ED7] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 p-10 max-w-5xl mx-auto space-y-10">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-['Poppins'] text-[#212529]">
              {id ? 'Edit Blog Post' : 'Create New Blog'}
            </h1>
            <p className="text-gray-500 font-['Roboto']">Share your latest travel adventure with the world.</p>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12"
        >
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-['Roboto']">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {success ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-['Poppins'] text-[#212529]">Success!</h2>
                <p className="text-gray-500 font-['Roboto']">Your blog post has been {id ? 'updated' : 'published'} successfully.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold font-['Poppins'] text-[#212529]">
                    <Type className="w-4 h-4 text-[#0B5ED7]" />
                    Blog Title
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter a catchy title..."
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0B5ED7] font-['Roboto'] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold font-['Poppins'] text-[#212529]">
                    <Image className="w-4 h-4 text-[#0B5ED7]" />
                    Featured Image
                  </label>
                  <div className="relative group">
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      onClick={() => setError(null)} // Clear error when user clicks to upload
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-100 hover:border-[#0B5ED7] transition-all group"
                    >
                      {formData.imageUrl ? (
                        <div className="relative w-full h-full p-2">
                          <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-2xl"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                            <p className="text-white font-bold text-sm">Change Image</p>
                          </div>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all z-10"
                            title="Remove Image"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="p-4 bg-white rounded-2xl shadow-sm text-[#0B5ED7]">
                            <Image className="w-8 h-8" />
                          </div>
                          <p className="text-gray-500 font-medium text-sm">Click to upload image</p>
                          <p className="text-xs text-gray-400">Max size: 800KB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold font-['Poppins'] text-[#212529]">
                    <AlignLeft className="w-4 h-4 text-[#0B5ED7]" />
                    Blog Description
                  </label>
                  <div className="bg-gray-50 rounded-2xl overflow-hidden border-none focus-within:ring-2 focus-within:ring-[#0B5ED7] transition-all">
                    <ReactQuill 
                      theme="snow"
                      value={formData.description}
                      onChange={(content) => setFormData({...formData, description: content})}
                      modules={modules}
                      formats={formats}
                      placeholder="Write your travel story here..."
                      className="quill-editor"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  disabled={loading}
                  type="submit"
                  className="flex items-center gap-3 bg-[#0B5ED7] text-white px-10 py-4 rounded-2xl font-['Poppins'] font-bold hover:bg-[#094db3] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {id ? 'Update Post' : 'Publish Blog'}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Preview Section */}
        {!success && formData.title && formData.imageUrl && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold font-['Poppins'] text-[#212529]">Live Preview</h2>
            <div className="max-w-sm">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img src={formData.imageUrl} alt="Preview" className="h-48 w-full object-cover" referrerPolicy="no-referrer" />
                <div className="p-6 space-y-3">
                  <h3 className="font-bold font-['Poppins'] text-lg line-clamp-1">{formData.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 font-['Roboto']">{formData.description}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
