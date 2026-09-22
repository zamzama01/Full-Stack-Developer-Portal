import React, { useState, useEffect } from 'react';
import {
  Mail,
  KeyRound,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Send,
  LogIn,
  Inbox,
  X,
} from 'lucide-react';
import { findUserByGmail, getRecentLoginEntry } from '../utils/storage.js';

export const ForgotPasswordScreen = ({
  onNavigate,
  onQuickLoginWithRecovered,
  initialGmail = '',
}) => {
  const [gmail, setGmail] = useState(initialGmail);
  const [recoveryState, setRecoveryState] = useState({
    status: 'idle',
    searchedGmail: '',
  });
  const [stepMessage, setStepMessage] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showInboxModal, setShowInboxModal] = useState(false);

  useEffect(() => {
    if (!initialGmail) {
      const recent = getRecentLoginEntry();
      if (recent?.gmail) {
        setGmail(recent.gmail);
      }
    }
  }, [initialGmail]);

  const handleAppendGmailDomain = () => {
    if (!gmail.includes('@')) {
      setGmail(`${gmail}@gmail.com`);
    }
  };

  const handleRecover = (e) => {
    e.preventDefault();
    const cleanGmail = gmail.trim().toLowerCase();

    if (!cleanGmail) {
      setRecoveryState({
        status: 'not_found',
        searchedGmail: '',
      });
      return;
    }

    setRecoveryState({
      status: 'checking',
      searchedGmail: cleanGmail,
    });

    setStepMessage('Querying directory for ' + cleanGmail + '...');
    setTimeout(() => {
      setStepMessage('Cross-referencing registered users and login credentials...');
      setTimeout(() => {
        setStepMessage('Decrypting credential envelope...');
        setTimeout(() => {
          const matchedUser = findUserByGmail(cleanGmail);

          if (matchedUser && matchedUser.password) {
            setRecoveryState({
              status: 'found',
              searchedGmail: cleanGmail,
              recoveredPassword: matchedUser.password,
              recoveredUserName: matchedUser.name,
              timestamp: Date.now(),
              deliveryId: 'MSG-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
            });
          } else {
            setRecoveryState({
              status: 'not_found',
              searchedGmail: cleanGmail,
            });
          }
        }, 500);
      }, 500);
    }, 400);
  };

  const handleCopyPassword = () => {
    if (recoveryState.recoveredPassword) {
      navigator.clipboard.writeText(recoveryState.recoveredPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/20 shadow-inner mb-3 text-cyan-400">
          <KeyRound className="w-6 h-6 drop-shadow-sm" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
          Password Recovery
        </h2>
        <p className="text-sm text-white/60 mt-1">
          Dynamic credential retrieval for registered Gmail
        </p>
      </div>

      <form onSubmit={handleRecover} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="recovery-gmail-input"
              className="text-xs font-medium text-white/80 tracking-wide"
            >
              Enter Your Gmail
            </label>
            {gmail && !gmail.includes('@') && (
              <button
                type="button"
                onClick={handleAppendGmailDomain}
                className="text-[11px] text-cyan-300 hover:text-cyan-200 hover:underline transition-colors"
              >
                + @gmail.com
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="recovery-gmail-input"
              type="text"
              value={gmail}
              onChange={(e) => {
                setGmail(e.target.value);
                if (recoveryState.status !== 'idle') {
                  setRecoveryState({ status: 'idle', searchedGmail: '' });
                }
              }}
              placeholder="e.g. alex.rivers@gmail.com"
              required
              className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:ring-0"
            />
          </div>
        </div>

        <button
          type="submit"
          id="recovery-submit-button"
          disabled={recoveryState.status === 'checking'}
          className="glass-button-primary w-full py-3 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {recoveryState.status === 'checking' ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verifying Gmail...</span>
            </div>
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>Recover Exact Password</span>
            </>
          )}
        </button>
      </form>

      {recoveryState.status === 'checking' && (
        <div className="mt-4 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-xs text-cyan-200 flex items-center gap-2.5 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <div className="flex-1 font-mono text-[11px]">{stepMessage}</div>
        </div>
      )}

      {recoveryState.status === 'found' && recoveryState.recoveredPassword && (
        <div
          id="dynamic-password-recovery-card"
          className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-white shadow-xl space-y-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-emerald-300">
                  Exact Match Verified
                </h4>
                <p className="text-[11px] text-white/70">
                  Password retrieved for{' '}
                  <span className="font-mono text-white underline">
                    {recoveryState.searchedGmail}
                  </span>
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Decrypted
            </span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-white/50 font-mono">
                Password:
              </span>
              <span
                id="recovered-password-display"
                className="font-mono text-sm tracking-wider font-bold text-cyan-300 truncate selection:bg-cyan-500/40"
              >
                {showPassword
                  ? recoveryState.recoveredPassword
                  : '••••••••••••••••'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id="toggle-reveal-recovered-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                id="copy-recovered-password-btn"
                onClick={handleCopyPassword}
                title="Copy password to clipboard"
                className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 transition-all flex items-center gap-1 text-[11px] font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              id="quick-signin-with-recovered-btn"
              onClick={() => {
                onQuickLoginWithRecovered(
                  recoveryState.searchedGmail,
                  recoveryState.recoveredPassword
                );
              }}
              className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In With This</span>
            </button>

            <button
              type="button"
              id="view-simulated-inbox-btn"
              onClick={() => setShowInboxModal(true)}
              className="py-2 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white/80 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <Inbox className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulated Inbox</span>
            </button>
          </div>
        </div>
      )}

      {recoveryState.status === 'not_found' && (
        <div
          id="recovery-not-found-card"
          className="mt-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-white space-y-2.5 animate-in fade-in duration-200"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-rose-300">
                No Registered Account Found
              </p>
              <p className="text-white/70 text-[11px] leading-relaxed">
                The address{' '}
                <span className="font-mono text-white font-medium">
                  {recoveryState.searchedGmail || 'specified'}
                </span>{' '}
                does not match any registered users or recent login credentials in this session.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-200 font-medium transition-colors"
            >
              Create Account with this Gmail
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-white/10 text-center">
        <button
          type="button"
          id="back-to-login-btn"
          onClick={() => onNavigate('login')}
          className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors cursor-pointer hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>

      {showInboxModal && recoveryState.status === 'found' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            id="simulated-gmail-inbox-modal"
            className="w-full max-w-lg rounded-2xl bg-[#121624] border border-white/20 shadow-2xl p-5 text-white relative animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-sm">
                  M
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Simulated Gmail Notification
                  </h3>
                  <p className="text-[11px] text-white/50 font-mono">
                    Delivered to: {recoveryState.searchedGmail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInboxModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-white/80">
              <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10 space-y-1 text-[11px]">
                <div className="flex justify-between text-white/50">
                  <span>From: Google GlassVault Security &lt;security@glassmorphic.auth&gt;</span>
                  <span>Just now</span>
                </div>
                <div className="text-white/50">
                  <span>To: {recoveryState.searchedGmail}</span>
                </div>
                <div className="font-semibold text-white pt-1">
                  Subject: Security Notice - Your Requested GlassPortal Password
                </div>
              </div>

              <div className="space-y-2 leading-relaxed">
                <p>Hello {recoveryState.recoveredUserName || 'User'},</p>
                <p>
                  You recently requested your password for the Glassmorphic 3D Auth Portal.
                  As requested, your saved security password is provided below:
                </p>

                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center my-3 shadow-inner">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 mb-1">
                    Your Saved Password
                  </div>
                  <div className="font-mono text-lg font-bold text-white tracking-widest">
                    {recoveryState.recoveredPassword}
                  </div>
                </div>

                <p className="text-[11px] text-white/50">
                  Delivery Reference: {recoveryState.deliveryId || 'MSG-RECOVER-PASS'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleCopyPassword}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Password'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowInboxModal(false);
                  onQuickLoginWithRecovered(
                    recoveryState.searchedGmail,
                    recoveryState.recoveredPassword
                  );
                }}
                className="text-xs px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
