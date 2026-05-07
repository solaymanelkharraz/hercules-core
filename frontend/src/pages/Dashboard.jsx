import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DataTable, Modal, Badge } from '../components/DataTable';
import { Users, MapPin, Wrench, AlertTriangle, ShieldAlert, Activity, ClipboardList } from 'lucide-react';
import { cn } from '../api/cn';
import { useAuth } from '../api/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StatCard = ({ title, value, icon: Icon, color, subValue }) => (
  <div className="bg-white p-6 lg:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-xl hover:shadow-forest/5 transition-all duration-300">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500 ${color}`} />
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
      <Icon size={24} />
    </div>
    <div>
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-black text-forest tracking-tighter">{value}</div>
        {subValue && <span className="text-sm font-bold text-slate-300">{subValue}</span>}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    zones: [],
    equipment: [],
    incidents: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosNote, setSosNote] = useState('');
  const [sosCountdown, setSosCountdown] = useState(3);
  const sosTimerRef = React.useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const canViewIncidents = ['admin', 'manager', 'guide'].includes(user?.role);
        
        const requests = [
          api.get('/users'),
          api.get('/zones'),
          api.get('/equipment'),
        ];
        
        if (canViewIncidents) {
          requests.push(api.get('/incident-reports'));
        }

        const [u, z, e, i] = await Promise.all(requests);
        
        setStats({
          users: u.data.data.length,
          zones: z.data.data,
          equipment: e.data.data,
          incidents: canViewIncidents ? i.data.data.filter(report => report.status !== 'resolved').slice(0, 3) : []
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const initiateSOS = () => {
    setSosNote('');
    setSosCountdown(3);
    setIsSosModalOpen(true);
    
    let timeLeft = 3;
    sosTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      setSosCountdown(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(sosTimerRef.current);
        submitSOS('EMERGENCY: Assistance needed immediately');
      }
    }, 1000);
  };

  const handleSosNoteChange = (e) => {
    setSosNote(e.target.value);
    if (sosTimerRef.current) {
      clearInterval(sosTimerRef.current);
      setSosCountdown(null);
    }
  };

  const submitSOS = async (note) => {
    if (sosTimerRef.current) clearInterval(sosTimerRef.current);
    setIsSosModalOpen(false);
    
    const loadId = toast.loading("BROADCASTING EMERGENCY SOS...", { style: { background: '#ef4444', color: '#fff', fontWeight: 'bold' } });
    try {
      await api.post('/incident-reports', {
        zone_id: stats.zones[0]?.id, // Default to first zone
        severity_level: 'critical',
        description: note || 'EMERGENCY: Assistance needed immediately',
        status: 'reported'
      });
      toast.success("SOS BROADCASTED. HELP IS ON THE WAY.", { id: loadId, duration: 5000, icon: '🚨' });
    } catch (err) {
      toast.error("FAILED TO BROADCAST SOS", { id: loadId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-adventure/20 border-t-adventure rounded-full animate-spin" />
        <span className="text-forest font-bold uppercase tracking-widest text-xs">Syncing Hercules Core...</span>
      </div>
    );
  }

  const needsInspectionCount = stats.equipment.filter(e => e.needs_inspection).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
      {/* Mobile-Only 'Forest-Ready' Interface */}
      <div className="md:hidden space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/incidents')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-transform min-h-[120px]"
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList size={24} />
            </div>
            <span className="font-black text-forest text-xs uppercase tracking-widest">Report<br/>Incident</span>
          </button>
          
          <button 
            onClick={() => navigate('/equipment')}
            className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-transform min-h-[120px]"
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              needsInspectionCount > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
            )}>
              <ShieldAlert size={24} />
            </div>
            <span className="font-black text-forest text-xs uppercase tracking-widest">Safety<br/>Check</span>
            {needsInspectionCount > 0 && (
              <span className="absolute top-4 right-4 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
              </span>
            )}
          </button>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-forest/5 text-forest flex items-center justify-center">
              <Activity size={20} />
            </div>
            <h3 className="font-black text-forest uppercase tracking-widest text-sm">Zone Status</h3>
          </div>
          <div className="space-y-4">
            {stats.zones.slice(0, 3).map(zone => {
              const percent = Math.min((zone.current_visitors / zone.max_capacity) * 100, 100) || 0;
              let colorClass = 'bg-emerald-500';
              if (percent > 70) colorClass = 'bg-yellow-500';
              if (percent >= 90) colorClass = 'bg-red-500';
              
              return (
                <div key={zone.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600 uppercase tracking-wider">{zone.name}</span>
                    <span className="text-slate-400">{zone.current_visitors}/{zone.max_capacity}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`${colorClass} h-full transition-all duration-500`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={initiateSOS}
          className="w-full min-h-[80px] bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-3xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <AlertTriangle size={32} className="animate-pulse" />
          <div className="text-left">
            <div className="font-black text-xl tracking-tight leading-none mb-1">EMERGENCY SOS</div>
            <div className="text-[10px] font-bold text-red-200 uppercase tracking-widest leading-none">Instant Alert Broadcast</div>
          </div>
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block space-y-6 lg:space-y-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <StatCard title="Active Staff" value={stats.users} icon={Users} color="bg-forest" />
          <StatCard title="Park Zones" value={stats.zones.length} icon={MapPin} color="bg-emerald-600" />
          <StatCard title="Gear Units" value={stats.equipment.length} icon={Wrench} color="bg-adventure" />
          <StatCard title="Live Alerts" value={stats.incidents.length} icon={AlertTriangle} color="bg-rose-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-forest uppercase tracking-tight">Zone Status</h2>
                <p className="text-slate-400 text-sm font-bold">Real-time capacity tracking</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-forest/5 flex items-center justify-center text-forest">
                <MapPin size={24} />
              </div>
            </div>
            <div className="space-y-8">
              {stats.zones.map(zone => {
                const percent = Math.min((zone.current_visitors / zone.max_capacity) * 100, 100) || 0;
                let colorClass = 'bg-emerald-500';
                if (percent > 70) colorClass = 'bg-yellow-500';
                if (percent >= 90) colorClass = 'bg-red-500';

                return (
                  <div key={zone.id} className="space-y-3 group">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full animate-pulse",
                          zone.status === 'open' ? 'bg-emerald-500' : zone.status === 'maintenance' ? 'bg-adventure' : 'bg-rose-500'
                        )} />
                        <span className="text-sm font-black text-forest uppercase tracking-wide">{zone.name}</span>
                        {percent >= 90 && <span className="ml-2 text-[10px] font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase tracking-widest">Zone Full</span>}
                      </div>
                      <span className="text-sm font-bold text-slate-400">
                        <span className="text-forest">{zone.current_visitors}</span> / {zone.max_capacity}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                      <div 
                        className={cn("h-full transition-all duration-1000 ease-out", colorClass)}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-forest uppercase tracking-tight">Command Alerts</h2>
                <p className="text-slate-400 text-sm font-bold">Immediate action items</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle size={24} />
              </div>
            </div>
            <div className="space-y-4">
              {stats.incidents.length > 0 ? (
                stats.incidents.map((incident) => (
                  <div key={incident.id} className="group flex gap-5 p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-adventure/30 hover:bg-white transition-all duration-300">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                      incident.severity_level === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-adventure/10 text-adventure'
                    )}>
                      <AlertTriangle size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-black text-forest text-xs uppercase tracking-widest">{incident.severity_level}</div>
                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Active</div>
                      </div>
                      <div className="font-black text-slate-800 text-lg leading-tight mb-1">{incident.zone.name}</div>
                      <div className="text-slate-500 text-sm font-medium line-clamp-2">{incident.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-slate-300">
                  <Wrench size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-black uppercase tracking-widest">All systems clear</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isSosModalOpen} 
        onClose={() => {
          if (sosTimerRef.current) clearInterval(sosTimerRef.current);
          setIsSosModalOpen(false);
        }} 
        title="EMERGENCY SOS BROADCAST"
      >
        <div className="space-y-6">
          <div className="bg-red-50 p-4 rounded-2xl flex items-start gap-4 border border-red-100">
            <AlertTriangle className="text-red-600 shrink-0" size={24} />
            <div>
              <h3 className="font-black text-red-900 uppercase tracking-widest text-sm">Action Required</h3>
              <p className="text-red-700 text-sm mt-1">Provide a quick note or wait for auto-broadcast.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black text-red-600 uppercase tracking-widest ml-1">Quick Note (Optional)</label>
            <input 
              autoFocus
              value={sosNote}
              onChange={handleSosNoteChange}
              placeholder="e.g. Fire near zip line"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-red-600/10 focus:border-red-600 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <button 
            onClick={() => submitSOS(sosNote)}
            className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 relative overflow-hidden group"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              <ShieldAlert size={20} />
              {sosCountdown !== null ? `AUTO-BROADCASTING IN ${sosCountdown}s` : 'BROADCAST SOS NOW'}
            </div>
            {sosCountdown !== null && (
              <div 
                className="absolute inset-y-0 left-0 bg-red-800 transition-all duration-1000 ease-linear z-0" 
                style={{ width: `${(3 - sosCountdown) * 33.33}%` }}
              />
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
