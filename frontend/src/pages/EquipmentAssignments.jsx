import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DataTable, Modal, Badge } from '../components/DataTable';
import { Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function EquipmentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const INITIAL_STATE = {
    equipment_id: '',
    assigned_at: new Date().toISOString().slice(0, 16),
    returned_at: ''
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [aRes, eRes, uRes] = await Promise.all([
        api.get('/equipment-assignments'),
        api.get('/equipment'),
        api.get('/users')
      ]);
      setAssignments(aRes.data.data);
      setEquipment(eRes.data.data.filter(e => e.status === 'available' || (selectedAssignment && e.id === selectedAssignment.equipment_id)));
      setUsers(uRes.data.data);
    } catch (err) {
      console.error("Fetch Assignments Error:", err);
      toast.error("Failed to load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedAssignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading(selectedAssignment ? "Updating record..." : "Processing assignment...");
    try {
      if (selectedAssignment) {
        await api.put(`/equipment-assignments/${selectedAssignment.id}`, formData);
        toast.success("Assignment updated", { id: loadId });
      } else {
        await api.post('/equipment-assignments', formData);
        toast.success("Gear assigned successfully", { id: loadId });
      }
      setIsModalOpen(false);
      setFormData(INITIAL_STATE);
      fetchData();
    } catch (err) {
      console.error("Submit Assignment Error:", err.response?.data?.errors || err);
      toast.error(err.response?.data?.message || "An error occurred", { id: loadId });
    }
  };

  const handleReturn = async (assignment) => {
    const loadId = toast.loading("Processing return...");
    try {
      await api.put(`/equipment-assignments/${assignment.id}`, {
        ...assignment,
        returned_at: new Date().toISOString().slice(0, 16)
      });
      toast.success("Gear returned successfully", { id: loadId });
      fetchData();
    } catch (err) {
      console.error("Return Gear Error:", err.response?.data || err);
      toast.error("Failed to process return", { id: loadId });
    }
  };

  const columns = [
    { 
      key: 'equipment', 
      label: 'Equipment',
      render: (e) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{e.name}</span>
          <span className="text-xs text-blue-600 font-mono">{e.sku_code}</span>
        </div>
      )
    },
    { 
      key: 'user', 
      label: 'Assigned To',
      render: (u) => <span className="font-medium text-slate-700">{u.name}</span>
    },
    { 
      key: 'assigned_at', 
      label: 'Assigned At',
      render: (date) => new Date(date).toLocaleString()
    },
    { 
      key: 'returned_at', 
      label: 'Status',
      render: (date) => (
        <Badge variant={date ? 'success' : 'warning'}>
          {date ? `Returned: ${new Date(date).toLocaleDateString()}` : 'In Use'}
        </Badge>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <p className="text-slate-500 font-bold text-xs sm:text-sm tracking-tight leading-relaxed max-w-md">Track real-time equipment distribution and staff deployment.</p>
        <button 
          onClick={() => {
            setSelectedAssignment(null);
            setFormData({ equipment_id: '', assigned_at: new Date().toISOString().slice(0, 16), returned_at: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-8 py-3 bg-adventure text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-adventure-hover shadow-lg shadow-adventure/20 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          Assign Gear
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={assignments} 
        isLoading={isLoading}
        actions={(row) => !row.returned_at && (
          <button 
            onClick={() => handleReturn(row)}
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-black text-xs uppercase tracking-widest transition-colors mr-4"
          >
            <CheckCircle size={16} strokeWidth={3} />
            Return
          </button>
        )}
        onEdit={(row) => {
          setSelectedAssignment(row);
          setFormData({
            equipment_id: row.equipment_id,
            assigned_at: new Date(row.assigned_at).toISOString().slice(0, 16),
            returned_at: row.returned_at ? new Date(row.returned_at).toISOString().slice(0, 16) : ''
          });
          setIsModalOpen(true);
        }}
        onDelete={async (row) => {
          if (window.confirm('Delete assignment record?')) {
            await api.delete(`/equipment-assignments/${row.id}`);
            fetchData();
          }
        }}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAssignment(null);
          setFormData(INITIAL_STATE);
        }} 
        title={selectedAssignment ? 'Edit Assignment' : 'Assign Equipment'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Select Equipment</label>
            <select 
              required
              value={formData.equipment_id}
              onChange={e => setFormData({...formData, equipment_id: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            >
              <option value="">-- Select Item --</option>
              {equipment.map(e => <option key={e.id} value={e.id}>{e.name} ({e.sku_code})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Deployment Time</label>
            <input 
              required
              type="datetime-local"
              value={formData.assigned_at}
              onChange={e => setFormData({...formData, assigned_at: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-forest text-white font-black uppercase tracking-widest text-sm rounded-2xl mt-4 hover:bg-forest/90 transition-all shadow-xl shadow-forest/10"
          >
            {selectedAssignment ? 'Update Assignment' : 'Confirm Deployment'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
