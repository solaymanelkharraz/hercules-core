import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '../api/cn';
import { Link } from 'react-router-dom';

export default function GlobalAlert() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const res = await api.get('/alerts/latest');
        setAlert(res.data.data || null);
      } catch (err) {
        console.error("Failed to fetch global alert");
      }
    };
    fetchAlert();
    // Poll every 5 seconds for critical alerts
    const interval = setInterval(fetchAlert, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!alert) return null;

  const configs = {
    info: {
      color: 'bg-emerald-500 text-white',
      icon: Info
    },
    warning: {
      color: 'bg-yellow-500 text-white',
      icon: AlertTriangle
    },
    danger: {
      color: 'bg-red-600 text-white',
      icon: AlertOctagon
    }
  };

  const currentConfig = configs[alert.type] || configs.info;
  const Icon = currentConfig.icon;

  const content = (
    <>
      <Icon size={18} className="animate-pulse" />
      <span>{alert.message}</span>
      {alert.incident_id && (
        <span className="ml-4 px-3 py-1 bg-white/20 rounded-full text-[10px]">Click to join War Room</span>
      )}
    </>
  );

  const className = cn("w-full px-4 py-3 flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest shadow-md z-50 animate-in slide-in-from-top cursor-pointer hover:opacity-90 transition-opacity", currentConfig.color);

  if (alert.incident_id) {
    return (
      <Link to={`/incidents/${alert.incident_id}/chat`} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className}>
      {content}
    </div>
  );
}
