import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DataTable, Modal, Badge } from '../components/DataTable';
import { Plus, CheckCircle, ShieldAlert, Search, Filter } from 'lucide-react';
import { cn } from '../api/cn';
import { toast } from 'sonner';

export default function IncidentReports() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [zones, setZones] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const INITIAL_STATE = {
    zone_id: '',
    equipment_id: '',
    severity_level: 'low',
    description: '',
    status: 'reported'
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rRes, uRes, zRes, eRes] = await Promise.all([
        api.get('/incident-reports'),
        api.get('/users'),
        api.get('/zones'),
        api.get('/equipment')
      ]);
      setReports(rRes.data.data);
      setUsers(uRes.data.data);
      setZones(zRes.data.data);
      setEquipment(eRes.data.data);
    } catch (err) {
      console.error("Fetch Reports Error:", err);
      toast.error("Failed to load incident reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadId = toast.loading(selectedReport ? "Updating report..." : "Submitting incident report...");
    try {
      if (selectedReport) {
        await api.put(`/incident-reports/${selectedReport.id}`, formData);
        toast.success("Incident report updated", { id: loadId });
      } else {
        await api.post('/incident-reports', formData);
        toast.success("Incident reported successfully", { id: loadId });
      }
      setIsModalOpen(false);
      setFormData(INITIAL_STATE);
      fetchData();
    } catch (err) {
      console.error("Submit Report Error:", err.response?.data?.errors || err);
      toast.error(err.response?.data?.message || "An error occurred", { id: loadId });
    }
  };

  const handleResolve = async (report) => {
    const loadId = toast.loading("Resolving incident...");
    try {
      await api.put(`/incident-reports/${report.id}`, {
        ...report,
        status: 'resolved'
      });
      toast.success("Incident marked as resolved", { id: loadId });
      fetchData();
    } catch (err) {
      console.error("Resolve Incident Error:", err.response?.data || err);
      toast.error("Failed to resolve incident", { id: loadId });
    }
  };

  const columns = [
    { 
      key: 'severity_level', 
      label: 'Severity',
      render: (level) => (
        <Badge variant={level === 'critical' ? 'danger' : level === 'major' ? 'warning' : 'info'}>
          {level}
        </Badge>
      )
    },
    { 
      key: 'zone', 
      label: 'Location',
      render: (z) => z.name
    },
    { 
      key: 'description', 
      label: 'Issue',
      render: (desc) => <span className="text-slate-600 line-clamp-1 max-w-[200px]">{desc}</span>
    },
    { 
      key: 'user', 
      label: 'Reported By',
      render: (u) => u.name
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => (
        <Badge variant={status === 'resolved' ? 'success' : status === 'investigating' ? 'warning' : 'danger'}>
          {status}
        </Badge>
      )
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredReports = reports.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.zone?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || item.severity_level === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-adventure/10 focus:border-adventure transition-all font-bold text-sm"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-adventure/10 focus:border-adventure transition-all font-bold text-sm appearance-none cursor-pointer"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <button 
          onClick={() => {
            setSelectedReport(null);
            setFormData({ zone_id: '', equipment_id: '', severity_level: 'low', description: '', status: 'reported' });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-8 py-3 bg-adventure text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-adventure-hover shadow-lg shadow-adventure/20 transition-all active:scale-95 w-full lg:w-auto justify-center"
        >
          <Plus size={18} strokeWidth={3} />
          Report Incident
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredReports} 
        isLoading={isLoading}
        actions={(row) => row.status !== 'resolved' && (
          <button 
            onClick={() => handleResolve(row)}
            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 font-black text-xs uppercase tracking-widest transition-colors mr-4"
          >
            <CheckCircle size={16} strokeWidth={3} />
            Resolve
          </button>
        )}
        onEdit={(row) => {
          setSelectedReport(row);
          setFormData({
            zone_id: row.zone_id,
            equipment_id: row.equipment_id || '',
            severity_level: row.severity_level,
            description: row.description,
            status: row.status
          });
          setIsModalOpen(true);
        }}
        onDelete={async (row) => {
          if (window.confirm('Delete incident report?')) {
            await api.delete(`/incident-reports/${row.id}`);
            fetchData();
          }
        }}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReport(null);
          setFormData(INITIAL_STATE);
        }} 
        title={selectedReport ? 'Review Incident' : 'New Incident Report'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Location / Zone</label>
              <select 
                required
                value={formData.zone_id}
                onChange={e => setFormData({...formData, zone_id: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              >
                <option value="">-- Select Zone --</option>
                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Involved Equipment (Optional)</label>
            <select 
              value={formData.equipment_id}
              onChange={e => setFormData({...formData, equipment_id: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
            >
              <option value="">-- None --</option>
              {equipment.map(e => <option key={e.id} value={e.id}>{e.name} ({e.sku_code})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Incident Description</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed description of what happened..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Severity Level</label>
              <select 
                value={formData.severity_level}
                onChange={e => setFormData({...formData, severity_level: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-forest uppercase tracking-widest ml-1">Report Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-adventure/10 focus:border-adventure outline-none transition-all font-bold text-forest"
              >
                <option value="reported">Reported</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-forest text-white font-black uppercase tracking-widest text-sm rounded-2xl mt-4 hover:bg-forest/90 transition-all shadow-xl shadow-forest/10 flex items-center justify-center gap-2"
          >
            <ShieldAlert size={20} />
            {selectedReport ? 'Update Record' : 'Confirm & Submit Report'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
