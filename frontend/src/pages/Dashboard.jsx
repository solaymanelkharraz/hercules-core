import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { DataTable, Modal, Badge } from '../components/DataTable';
import { Users, MapPin, Wrench, AlertTriangle } from 'lucide-react';
import { cn } from '../api/cn';
import { useAuth } from '../api/AuthContext';

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
  const [stats, setStats] = useState({
    users: 0,
    zones: [],
    equipment: 0,
    incidents: []
  });
  const [isLoading, setIsLoading] = useState(true);

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
          equipment: e.data.data.length,
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-adventure/20 border-t-adventure rounded-full animate-spin" />
        <span className="text-forest font-bold uppercase tracking-widest text-xs">Syncing Hercules Core...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <StatCard title="Active Staff" value={stats.users} icon={Users} color="bg-forest" />
        <StatCard title="Park Zones" value={stats.zones.length} icon={MapPin} color="bg-emerald-600" />
        <StatCard title="Gear Units" value={stats.equipment} icon={Wrench} color="bg-adventure" />
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
            {stats.zones.map(zone => (
              <div key={zone.id} className="space-y-3 group">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full animate-pulse",
                      zone.status === 'open' ? 'bg-emerald-500' : zone.status === 'maintenance' ? 'bg-adventure' : 'bg-rose-500'
                    )} />
                    <span className="text-sm font-black text-forest uppercase tracking-wide">{zone.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-400">
                    <span className="text-forest">{zone.current_visitors}</span> / {zone.max_capacity}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000 ease-out",
                      zone.status === 'open' ? 'bg-emerald-500' : zone.status === 'maintenance' ? 'bg-adventure' : 'bg-rose-500'
                    )}
                    style={{ width: `${(zone.current_visitors / zone.max_capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
  );
}
