import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../api/AuthContext';
import { ArrowLeft, Send, AlertTriangle, ShieldAlert, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function CrisisChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [incident, setIncident] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);

  const fetchChatData = async () => {
    try {
      const [incidentRes, messagesRes] = await Promise.all([
        api.get(`/incident-reports/${id}`),
        api.get(`/incident-reports/${id}/messages`)
      ]);
      setIncident(incidentRes.data.data);
      setMessages(messagesRes.data.data);
    } catch (err) {
      console.error("Failed to load chat", err);
      toast.error("Failed to load war room");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatData();
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchChatData, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedImage) return;

    const formData = new FormData();
    if (newMessage.trim()) formData.append('message', newMessage);
    if (selectedImage) formData.append('image', selectedImage);

    setIsSending(true);
    try {
      await api.post(`/incident-reports/${id}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewMessage('');
      setSelectedImage(null);
      fetchChatData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
        <span className="text-red-600 font-bold uppercase tracking-widest text-xs">Securing War Room...</span>
      </div>
    );
  }

  if (!incident) return null;

  const isResolved = incident.status === 'resolved';

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/incidents')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-forest transition-colors active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <h2 className="text-xl font-black text-forest uppercase tracking-tight">Crisis Chat</h2>
              {isResolved && <span className="text-[10px] font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full uppercase tracking-widest">Archived</span>}
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Incident: {incident.zone?.name}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-red-50 text-red-600 px-4 py-2 rounded-xl">
          <ShieldAlert size={18} />
          <span className="text-xs font-black uppercase tracking-widest">{incident.severity_level} Severity</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-park-bg">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <AlertTriangle size={32} className="text-red-400 mb-2" />
          <h3 className="font-black text-forest uppercase tracking-widest text-sm">War Room Initiated</h3>
          <p className="text-slate-500 text-xs max-w-md mt-2">{incident.description}</p>
        </div>

        {messages.map((msg) => {
          const isMe = msg.user_id === user.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}>
              <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{msg.user?.name}</span>
                <span className="text-[10px] font-bold text-slate-300">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={`px-5 py-3 rounded-2xl max-w-[80%] md:max-w-md text-sm font-medium ${isMe ? 'bg-forest text-white rounded-br-sm' : 'bg-white border border-slate-100 text-forest rounded-bl-sm'}`}>
                {msg.image_path && (
                  <a href={`${api.defaults.baseURL.replace('/api', '')}${msg.image_path}`} target="_blank" rel="noreferrer">
                    <img 
                      src={`${api.defaults.baseURL.replace('/api', '')}${msg.image_path}`} 
                      alt="Attached" 
                      className="w-full max-w-sm rounded-xl mb-2 object-cover border border-white/10 shadow-sm" 
                    />
                  </a>
                )}
                {msg.message && <span>{msg.message}</span>}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        {selectedImage && (
          <div className="mb-3 flex items-center gap-3 bg-slate-50 border border-slate-100 p-2 rounded-xl w-fit">
            <ImageIcon size={16} className="text-forest" />
            <span className="text-xs font-bold text-forest truncate max-w-[150px]">{selectedImage.name}</span>
            <button 
              type="button"
              onClick={() => setSelectedImage(null)}
              className="text-slate-400 hover:text-red-500 p-1"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isResolved || isSending}
            className="w-14 h-14 bg-slate-50 text-slate-400 hover:text-forest hover:bg-slate-100 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 border border-slate-100 shrink-0"
          >
            <Paperclip size={20} />
          </button>
          
          <div className="relative flex-1">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isResolved || isSending}
              placeholder={isResolved ? "Incident resolved. Chat is closed." : "Type your message..."}
              className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-adventure/10 focus:border-adventure transition-all font-bold text-sm text-forest placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              type="submit"
              disabled={(!newMessage.trim() && !selectedImage) || isResolved || isSending}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-forest text-white rounded-xl flex items-center justify-center hover:bg-forest/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-md shadow-forest/10"
            >
              {isSending ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send size={18} className="ml-1" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
