import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from '../api/cn';

export function DataTable({ columns, data, isLoading, onEdit, onDelete, actions }) {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
        <div className="h-14 bg-slate-50 border-b border-slate-100 hidden md:block" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-32 md:h-20 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center px-6 md:px-8 gap-4 md:gap-6 py-4">
            <div className="h-5 bg-slate-50 rounded-lg w-full md:flex-1" />
            <div className="h-5 bg-slate-50 rounded-lg w-2/3 md:flex-1" />
            <div className="h-5 bg-slate-50 rounded-lg w-1/2 md:flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-forest border-b border-forest/10">
                {columns.map((col) => (
                  <th key={col.key} className="px-8 py-6 text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete || actions) && (
                  <th className="px-8 py-6 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs">
                    No active records in the forest
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.id || i} className="hover:bg-slate-50/50 transition-all group">
                    {columns.map((col) => (
                      <td key={col.key} className="px-8 py-6 text-sm font-bold text-forest">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete || actions) && (
                      <td className="px-8 py-6 text-sm text-right space-x-4">
                        <div className="flex items-center justify-end gap-4">
                          {actions && actions(row)}
                          {onEdit && (
                            <button 
                              onClick={() => onEdit(row)}
                              className="w-10 h-10 flex items-center justify-center bg-forest/5 text-forest hover:bg-adventure hover:text-white rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest"
                            >
                              Edit
                            </button>
                          )}
                          {onDelete && (
                            <button 
                              onClick={() => onDelete(row)}
                              className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest"
                            >
                              Del
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">
            No records found
          </div>
        ) : (
          data.map((row, i) => (
            <div key={row.id || i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
              <div className="space-y-4">
                {columns.map((col) => (
                  <div key={col.key} className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">{col.label}</span>
                    <div className="text-right text-sm font-bold text-forest">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </div>
                  </div>
                ))}
              </div>
              
              {(onEdit || onDelete || actions) && (
                <div className="mt-6 flex items-center justify-end gap-6 border-t border-slate-50 pt-4">
                  {actions && actions(row)}
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(row)}
                      className="p-3 text-slate-400 hover:text-adventure transition-colors active:bg-slate-50 rounded-xl"
                      title="Edit Record"
                    >
                      <Edit2 size={20} />
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(row)}
                      className="p-3 text-slate-400 hover:text-red-500 transition-colors active:bg-red-50 rounded-xl"
                      title="Delete Record"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-forest/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in duration-300">
        <div className="p-6 sm:p-10 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-black text-forest uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 sm:p-3 hover:bg-slate-50 rounded-2xl transition-colors">
            <svg size={24} className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 sm:p-10 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-500',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    warning: 'bg-adventure/10 text-adventure border border-adventure/20',
    danger: 'bg-rose-50 text-rose-600 border border-rose-100',
    info: 'bg-forest/5 text-forest border border-forest/10',
  };

  return (
    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest", variants[variant])}>
      {children}
    </span>
  );
}
