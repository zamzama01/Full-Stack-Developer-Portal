import React from 'react';
import { ShieldCheck, LogOut, Key, Mail, CheckCircle2, Sparkles, Lock } from 'lucide-react';

export const DashboardScreen = ({ user, onSignOut, onNavigateToScreen }) => {
  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 shadow-lg mb-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
          Authenticated Session
        </h2>
        <p className="text-sm text-emerald-300/80 mt-1 flex items-center justify-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Developer Workspace Active</span>
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/15 space-y-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md uppercase">
            {(user.name || user.gmail)[0]}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-white truncate">
              {user.name || 'Full Stack Developer'}
            </h3>
            <p className="text-xs text-white/60 font-mono truncate flex items-center gap-1">
              <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>{user.gmail}</span>
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-black/20 border border-white/10">
            <span className="text-white/50 block">Auth Provider:</span>
            <span className="text-cyan-300 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{user.provider ? `${user.provider} OAuth` : 'Developer Protocol'}</span>
            </span>
          </div>
          <div className="p-2 rounded-xl bg-black/20 border border-white/10">
            <span className="text-white/50 block">Session Date:</span>
            <span className="text-white/80 font-mono mt-0.5 block truncate">
              {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 text-[11px] font-mono text-white/60 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Cipher Protocol:</span>
          </span>
          <span className="text-cyan-300">AES-GCM-256</span>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          id="dashboard-test-forgot-btn"
          onClick={() => onNavigateToScreen('forgot')}
          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs text-cyan-300 font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Key className="w-3.5 h-3.5" />
          <span>Test Dynamic Password Recovery for this Gmail</span>
        </button>

        <button
          type="button"
          id="dashboard-signout-btn"
          onClick={onSignOut}
          className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs text-rose-300 font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out to Auth Portal</span>
        </button>
      </div>
    </div>
  );
};
