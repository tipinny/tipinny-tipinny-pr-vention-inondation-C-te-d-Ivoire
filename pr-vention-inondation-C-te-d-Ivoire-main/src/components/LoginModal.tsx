import React, { useState } from 'react';
import { X, User, Mail, Lock, ShieldCheck, ChevronRight, Phone } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/register
    onLogin({
      id: '123',
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      phone: formData.phone,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="p-8 bg-emerald-600 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Compte Citoyen Risk PICI</h2>
          </div>
          <p className="text-emerald-50 text-sm font-medium opacity-90">
            {mode === 'login' 
              ? 'Connectez-vous pour accéder aux services d\'alerte et de discussion.' 
              : 'Rejoignez la communauté pour aider à la prévention des inondations.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nom complet</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Moussa Koné"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Adresse Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="nom@exemple.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Numéro de téléphone</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    required
                    placeholder="Ex: 07 00 00 00 00"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-400 italic">Utilisé pour l'envoi d'alertes SMS en cas d'urgence.</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Mot de passe</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
            </p>
            <button 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {mode === 'login' ? 'S\'inscrire gratuitement' : 'Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
