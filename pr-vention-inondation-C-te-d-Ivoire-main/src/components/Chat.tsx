import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  commune: string;
}

interface ChatProps {
  user: any;
  onLogin: () => void;
}

const Chat: React.FC<ChatProps> = ({ user, onLogin }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'Moussa K.', text: 'Inondation signalée à la Riviera Palmeraie, évitez le carrefour.', time: '18:05', commune: 'Cocody' },
    { id: '2', user: 'Awa D.', text: 'Est-ce que la route de Bassam est praticable ?', time: '18:10', commune: 'Port-Bouët' },
    { id: '3', user: 'Jean P.', text: 'Oui, mais ralentissement au niveau du rond-point.', time: '18:12', commune: 'Marcory' },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('Général');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: user.name,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      commune: selectedCommune,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const communes = ['Général', 'Cocody', 'Yopougon', 'Abobo', 'Koumassi', 'Marcory', 'Treichville', 'Adjamé', 'Plateau', 'Port-Bouët', 'Attécoubé'];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Chat Header */}
      <div className="p-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Espace Citoyen</h2>
            <p className="text-xs text-slate-500 font-medium">Échangez en temps réel sur la situation locale</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Filtrer par commune:</label>
          <select 
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            className="text-sm border-slate-200 rounded-lg bg-slate-50 px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            {communes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.filter(m => selectedCommune === 'Général' || m.commune === selectedCommune).map((msg) => (
          <div 
            key={msg.id} 
            className={cn(
              "flex flex-col max-w-[80%] animate-in fade-in slide-in-from-bottom-2",
              msg.user === user?.name ? "ml-auto items-end" : "items-start"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{msg.user}</span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">{msg.commune}</span>
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm shadow-sm",
              msg.user === user?.name 
                ? "bg-emerald-600 text-white rounded-tr-none" 
                : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
            )}>
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-slate-200">
        {!user ? (
          <div className="flex items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="text-center">
              <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-3 font-medium">Connectez-vous pour participer à la discussion</p>
              <button 
                onClick={onLogin}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
              >
                Se connecter
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input 
              type="text" 
              placeholder={`Message pour ${selectedCommune}...`}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button 
              type="submit"
              className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
