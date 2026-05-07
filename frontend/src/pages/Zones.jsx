import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DataTable, Modal, Badge } from '../components/DataTable';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const INITIAL_STATE = {
    name: '',
    status: 'closed',
    max_capacity: 0,
    current_visitors: 0
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredZones = zones.filter(zone => 
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchZones = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/zones');
      setZones(res.data.data);
    } catch (err) {
      console.error("Fetch Zones Error:", err);
      toast.error("Failed to load zones");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading(selectedZone ? "Updating zone..." : "Creating zone...");
    try {
      if (selectedZone) {
        await api.put(`/zones/${selectedZone.id}`, formData);
        toast.success("Zone updated successfully", { id: loadId });
      } else {
        await api.post('/zones', formData);
        toast.success("Zone created successfully", { id: loadId });
      }
      setIsModalOpen(false);
      setFormData(INITIAL_STATE);
      fetchZones();
    } catch (err) {
      console.error("Submit Zone Error:", err.response?.data?.errors || err);
      toast.error(err.response?.data?.message || "An error occurred", { id: loadId });
    }
  };

  const handleEdit = (zone) => {
    setSelectedZone(zone);
    setFormData({
      name: zone.name,
      status: zone.status,
      max_capacity: zone.max_capacity,
      current_visitors: zone.current_visitors
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (zone) => {
    if (window.confirm(`Are you sure you want to delete ${zone.name}?`)) {
      const loadId = toast.loading("Deleting zone...");
      try {
        await api.delete(`/zones/${zone.id}`);
        toast.success("Zone deleted successfully", { id: loadId });
        fetchZones();
      } catch (err) {
        console.error("Delete Zone Error:", err.response?.data || err);
        toast.error("Failed to delete zone", { id: loadId });
      }
    }
  };

  const columns = [
    { key: 'name', label: 'Zone Name' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => (
        <Badge variant={status === 'open' ? 'success' : status === 'maintenance' ? 'warning' : 'default'}>
          {status}
        </Badge>
      )
    },
    { 
      key: 'capacity', 
      label: 'Capacity',
      render: (_, row) => {
        const percent = Math.min((row.current_visitors / row.max_capacity) * 100, 100) || 0;
        let colorClass = 'bg-emerald-500';
        if (percent > 70) colorClass = 'bg-yellow-500';
        if (percent >= 90) colorClass = 'bg-red-500';

        return (
          <div className="w-full min-w-[150px]">
            <div className="flex justify-between items-end mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{row.current_visitors}</span>
                <span className="text-xs text-slate-400">/ {row.max_capacity}</span>
              </div>
              {percent >= 90 && (
                <span className="text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Zone Full</span>
              )}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
              <div 
                className={`${colorClass} h-full transition-all duration-1000 ease-out`} 
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <p className="text-slate-500 font-bold text-xs sm:text-sm tracking-tight leading-relaxed max-w-md">Active monitoring of adventure park zones and live capacity tracking.</p>
        <button 
          onClick={() => {
            setSelectedZone(null);
            setFormData({ name: '', status: 'closed', max_capacity: 0, current_visitors: 0 });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-8 py-3 bg-adventure text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-adventure-hover shadow-lg shadow-adventure/20 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          New Zone
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredZones} 
        isLoading={isLoading} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedZone(null);
          setFormData(INITIAL_STATE);
        }} 
        title={selectedZone ? 'Edit Zone' : 'Create Zone'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Zone Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Paintball Achakkar"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Operational Status</label>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Max Capacity</label>
              <input 
                required
                type="number"
                value={formData.max_capacity}
                onChange={e => setFormData({...formData, max_capacity: parseInt(e.target.value)})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Current Visitors</label>
              <input 
                required
                type="number"
                value={formData.current_visitors}
                onChange={e => setFormData({...formData, current_visitors: parseInt(e.target.value)})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-forest text-white font-black uppercase tracking-widest text-sm rounded-2xl mt-4 hover:bg-forest/90 transition-all shadow-xl shadow-forest/10"
          >
            {selectedZone ? 'Update Zone' : 'Initialize Zone'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
