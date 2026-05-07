import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Wrench, 
  ClipboardList, 
  AlertTriangle, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { cn } from '../api/cn';
import { useAuth } from '../api/AuthContext';
import { useNavigate } from 'react-router-dom';
import GlobalAlert from './GlobalAlert';

const sidebarItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['admin', 'manager', 'guide', 'cashier'] },
  { name: 'Directory', path: '/directory', icon: Users, roles: ['admin', 'manager', 'guide', 'cashier'] },
  { name: 'Users', path: '/users', icon: Users, roles: ['admin', 'manager'] },
  { name: 'Zones', path: '/zones', icon: MapPin, roles: ['admin', 'manager', 'guide', 'cashier'] },
  { name: 'Equipment', path: '/equipment', icon: Wrench, roles: ['admin', 'manager', 'cashier'] },
  { name: 'Assignments', path: '/assignments', icon: ClipboardList, roles: ['admin', 'manager'] },
  { name: 'Incidents', path: '/incidents', icon: AlertTriangle, roles: ['admin', 'manager', 'guide'] },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredItems = sidebarItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-park-bg flex flex-col lg:flex-row font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-forest/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "bg-forest text-slate-100 transition-all duration-300 ease-in-out fixed lg:relative z-50 h-screen flex flex-col shadow-2xl overflow-hidden",
          isSidebarOpen ? "w-72 translate-x-0" : "w-0 lg:w-24 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 lg:p-8 flex items-center justify-between shrink-0">
          <div className={cn("font-black text-2xl tracking-tighter transition-all duration-300 overflow-hidden", !isSidebarOpen && "lg:w-0 lg:opacity-0")}>
            HERCULES<span className="text-adventure">PARK</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors hidden lg:block"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide py-4">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 lg:py-4 rounded-2xl transition-all duration-300 group min-h-[48px] lg:min-h-[56px]",
                  isActive 
                    ? "bg-adventure text-white shadow-xl shadow-adventure/20" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={cn("min-w-[24px] transition-colors", isActive ? "text-white" : "group-hover:text-adventure")}>
                  <Icon size={22} lg:size={24} strokeWidth={2.5} />
                </div>
                <span className={cn(
                  "font-black transition-all duration-300 whitespace-nowrap text-[10px] lg:text-xs tracking-[0.1em] uppercase",
                  !isSidebarOpen && "lg:opacity-0 lg:invisible lg:translate-x-4 lg:w-0"
                )}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={cn(
          "p-6 border-t border-white/10 shrink-0 transition-all duration-300",
          !isSidebarOpen && "opacity-0 invisible h-0 p-0"
        )}>
          <div className="bg-white/5 p-4 rounded-[1.5rem] lg:rounded-[2rem] flex items-center gap-4 border border-white/5">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-adventure flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-adventure/20 rotate-3 group-hover:rotate-0 transition-transform">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="font-black truncate text-white uppercase tracking-tight text-[10px] lg:text-xs">{user?.name}</div>
              <div className="text-white/40 truncate uppercase tracking-widest text-[8px] lg:text-[10px]">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
        <GlobalAlert />
        <header className="h-20 lg:h-24 bg-forest border-b border-forest/10 flex items-center justify-between px-4 lg:px-10 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={cn("p-2 lg:p-3 bg-white/5 hover:bg-white/10 rounded-xl lg:rounded-2xl transition-all active:scale-95 text-white", isSidebarOpen && "lg:hidden")}
            >
              <Menu size={22} lg:size={24} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col">
              <span className="text-[8px] lg:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">Management</span>
              <h1 className="text-lg lg:text-2xl font-black text-white uppercase tracking-tighter leading-none">
                {sidebarItems.find(i => i.path === location.pathname)?.name || 'Command Center'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[8px] lg:text-[10px] font-black text-emerald-700 uppercase tracking-widest uppercase">Live</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-3 lg:p-4 text-white/50 hover:text-red-400 hover:bg-white/5 rounded-xl lg:rounded-2xl transition-all active:scale-95 group"
            >
              <LogOut size={20} lg:size={22} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[#F8F9FA] scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
