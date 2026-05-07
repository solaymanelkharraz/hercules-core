import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Phone, Search, Contact } from 'lucide-react';
import { cn } from '../api/cn';

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data.data.filter(u => u.status === 'active'));
      } catch (err) {
        console.error("Failed to load directory", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center text-forest">
            <Contact size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-forest uppercase tracking-tight">Staff Directory</h2>
            <p className="text-slate-400 text-sm font-bold">Public Contact List</p>
          </div>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or position..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-adventure/10 focus:border-adventure transition-all font-bold text-sm text-forest placeholder:text-slate-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-adventure/20 border-t-adventure rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-6 group hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest to-emerald-900 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-forest/20 group-hover:scale-105 transition-transform">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-forest text-lg truncate">{user.name}</h3>
                  <div className="text-xs font-bold text-adventure uppercase tracking-widest">{user.role}</div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                {user.phone ? (
                  <a 
                    href={`tel:${user.phone}`}
                    className="w-full py-4 px-6 bg-slate-50 hover:bg-adventure hover:text-white text-forest font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group/btn"
                  >
                    <Phone size={16} className="text-slate-400 group-hover/btn:text-white transition-colors" />
                    Call Staff Member
                  </a>
                ) : (
                  <div className="w-full py-4 px-6 bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3">
                    <Phone size={16} className="opacity-50" />
                    No Phone Available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
