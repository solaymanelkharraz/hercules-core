import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DataTable, Modal, Badge } from '../components/DataTable';
import { Plus, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [zones, setZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const INITIAL_STATE = {
    sku_code: '',
    name: '',
    category: 'harness',
    zone_id: '',
    status: 'available',
    last_inspection_date: ''
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [eRes, zRes] = await Promise.all([
        api.get('/equipment'),
        api.get('/zones')
      ]);
      setEquipment(eRes.data.data);
      setZones(zRes.data.data);
    } catch (err) {
      console.error("Fetch Equipment Error:", err);
      toast.error("Failed to load inventory");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading(selectedItem ? "Updating gear..." : "Registering gear...");
    try {
      if (selectedItem) {
        await api.put(`/equipment/${selectedItem.id}`, formData);
        toast.success("Gear updated successfully", { id: loadId });
      } else {
        await api.post('/equipment', formData);
        toast.success("New gear registered successfully", { id: loadId });
      }
      setIsModalOpen(false);
      setFormData(INITIAL_STATE);
      fetchData();
    } catch (err) {
      console.error("Submit Equipment Error:", err.response?.data?.errors || err);
      toast.error(err.response?.data?.message || "An error occurred", { id: loadId });
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      sku_code: item.sku_code,
      name: item.name,
      category: item.category,
      zone_id: item.zone_id || '',
      status: item.status,
      last_inspection_date: item.last_inspection_date || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Delete ${item.name} (${item.sku_code})?`)) {
      const loadId = toast.loading("Removing gear from inventory...");
      try {
        await api.delete(`/equipment/${item.id}`);
        toast.success("Gear removed successfully", { id: loadId });
        fetchData();
      } catch (err) {
        console.error("Delete Equipment Error:", err.response?.data || err);
        toast.error("Failed to delete item", { id: loadId });
      }
    }
  };

  const columns = [
    { 
      key: 'sku_code', 
      label: 'SKU',
      render: (sku) => <span className="font-mono font-bold text-blue-600">{sku}</span>
    },
    { key: 'name', label: 'Equipment Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (cat) => <span className="capitalize">{cat.replace('_', ' ')}</span>
    },
    { 
      key: 'zone', 
      label: 'Zone',
      render: (zone) => zone ? zone.name : <span className="text-slate-300 italic">Unassigned</span>
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => (
        <Badge variant={status === 'available' ? 'success' : status === 'in_use' ? 'info' : status === 'retired' ? 'default' : 'warning'}>
          {status.replace('_', ' ')}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <p className="text-slate-500 font-bold text-xs sm:text-sm tracking-tight leading-relaxed max-w-md">Full inventory control for all adventure park gear and assets.</p>
        <button 
          onClick={() => {
            setSelectedItem(null);
            setFormData({ sku_code: '', name: '', category: 'harness', zone_id: '', status: 'available', last_inspection_date: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-8 py-3 bg-adventure text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-adventure-hover shadow-lg shadow-adventure/20 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Register Gear
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={equipment} 
        isLoading={isLoading} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
          setFormData(INITIAL_STATE);
        }} 
        title={selectedItem ? 'Edit Equipment' : 'Register Gear'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">SKU Code</label>
              <input 
                required
                value={formData.sku_code}
                onChange={e => setFormData({...formData, sku_code: e.target.value})}
                placeholder="e.g. HRN-001"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              >
                <option value="harness">Harness</option>
                <option value="helmet">Helmet</option>
                <option value="paintball_marker">Paintball Marker</option>
                <option value="buggy">Buggy</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Model Name</label>
            <input 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Assigned Zone</label>
            <select 
              value={formData.zone_id}
              onChange={e => setFormData({...formData, zone_id: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            >
              <option value="">Unassigned</option>
              {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="needs_inspection">Needs Inspection</option>
                <option value="in_repair">In Repair</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Last Inspection</label>
              <input 
                type="date"
                value={formData.last_inspection_date}
                onChange={e => setFormData({...formData, last_inspection_date: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-forest text-white font-black uppercase tracking-widest text-sm rounded-2xl mt-4 hover:bg-forest/90 transition-all shadow-xl shadow-forest/10"
          >
            {selectedItem ? 'Update Asset' : 'Register Gear'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
