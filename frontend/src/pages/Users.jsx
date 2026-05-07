import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DataTable, Modal, Badge } from '../components/DataTable';
import { Plus, Search, Phone, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
    role: 'guide',
    status: 'active'
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error("Fetch Users Error:", err);
      toast.error("Failed to load staff members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading(selectedUser ? "Updating staff..." : "Registering staff...");
    try {
      let data = { ...formData };
      
      // If editing and password is empty, remove it so it's not validated/updated
      if (selectedUser && !data.password) {
        delete data.password;
      }

      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, data);
        toast.success("Staff profile updated successfully", { id: loadId });
      } else {
        await api.post('/users', data);
        toast.success("New staff registered successfully", { id: loadId });
      }
      setIsModalOpen(false);
      setSelectedUser(null);
      setFormData(INITIAL_STATE);
      fetchUsers();
    } catch (err) {
      console.error("Submit User Error:", err.response?.data?.errors || err);
      toast.error(err.response?.data?.message || "An error occurred", { id: loadId });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      const loadId = toast.loading("Deleting staff...");
      try {
        await api.delete(`/users/${user.id}`);
        toast.success("Staff deleted successfully", { id: loadId });
        fetchUsers();
      } catch (err) {
        console.error("Delete User Error:", err.response?.data || err);
        toast.error("Failed to delete staff member", { id: loadId });
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { 
      key: 'phone', 
      label: 'Phone',
      render: (phone) => phone ? (
        <a href={`tel:${phone}`} className="hover:text-orange-500 flex items-center gap-2 font-medium text-slate-600 transition-colors">
          <Phone size={14} className="text-slate-400" />
          {phone}
        </a>
      ) : <span className="text-slate-300 italic">Not provided</span>
    },
    { 
      key: 'role', 
      label: 'Role',
      render: (role) => (
        <Badge variant={role === 'admin' ? 'danger' : role === 'manager' ? 'warning' : 'info'}>
          {role}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => (
        <Badge variant={status === 'active' ? 'success' : 'default'}>
          {status}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-adventure/10 focus:border-adventure transition-all font-bold text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-adventure/10 focus:border-adventure transition-all font-bold text-sm appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="guide">Guide</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
        </div>
        <button 
          onClick={() => {
            setSelectedUser(null);
            setFormData({ name: '', email: '', password: '', role: 'guide', status: 'active' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-adventure text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-adventure-hover shadow-lg shadow-adventure/20 transition-all active:scale-95 shrink-0"
        >
          <Plus size={18} strokeWidth={3} />
          Add Staff
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredUsers} 
        isLoading={isLoading} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setFormData(INITIAL_STATE);
        }} 
        title={selectedUser ? 'Edit User' : 'Register User'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Full Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Email Address</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            />
          </div>
          {!selectedUser && (
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Initial Password</label>
              <input 
                required
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Role</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="guide">Guide</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-forest text-white font-black uppercase tracking-widest text-sm rounded-2xl mt-4 hover:bg-forest/90 transition-all shadow-xl shadow-forest/10"
          >
            {selectedUser ? 'Update Profile' : 'Confirm Registration'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
