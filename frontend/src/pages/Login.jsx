import React, { useState } from 'react';
import { useAuth } from '../api/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Mountain, Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back to Hercules Park!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-adventure/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <div className="max-w-md w-full relative">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-forest/5 border border-slate-100 p-8 lg:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-forest rounded-3xl flex items-center justify-center shadow-xl shadow-forest/20 rotate-3 mb-6">
              <Mountain className="text-white" size={40} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-forest uppercase tracking-tighter">Hercules Park</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-2">Core Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hercules.ma"
                  className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-5 bg-forest text-white font-black uppercase tracking-widest text-sm rounded-2xl mt-4 hover:bg-forest/90 transition-all shadow-xl shadow-forest/20 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[56px]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
              Restricted Area<br />
              Authorized personnel only
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
          © 2026 Hercules Park Adventure
        </p>
      </div>
    </div>
  );
}
