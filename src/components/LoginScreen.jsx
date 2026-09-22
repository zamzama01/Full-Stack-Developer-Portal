import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Github, Chrome } from 'lucide-react';
import { recordRecentLoginEntry, getRecentLoginEntry, getRegisteredUsers } from '../utils/storage.js';

export const LoginScreen = ({
  onNavigate,
  onLoginSuccess,
  prefillGmail = '',
  prefillPassword = '',
}) => {
  const [gmail, setGmail] = useState(prefillGmail);
  const [password, setPassword] = useState(prefillPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOAuthLogin = (provider) => {
    setErrorMsg('');
    setIsOAuthLoading(provider);

    setTimeout(() => {
      setIsOAuthLoading(null);
      if (provider === 'github') {
        const githubUser = {
          id: 'gh-' + Date.now(),
          name: 'Developer Sami',
          gmail: 'developer.sami@github.com',
          provider: 'GitHub',
          createdAt: Date.now(),
        };
        recordRecentLoginEntry(githubUser.gmail, 'oauth-token');
        onLoginSuccess(githubUser);
      } else {
        const googleUser = {
          id: 'goog-' + Date.now(),
          name: 'Rao Abdul Sami',
          gmail: 'raoabdul.sami5588@gmail.com',
          provider: 'Google',
          createdAt: Date.now(),
        };
        recordRecentLoginEntry(googleUser.gmail, 'oauth-token');
        onLoginSuccess(googleUser);
      }
    }, 600);
  };

  useEffect(() => {
    const recent = getRecentLoginEntry();
    if (!prefillGmail && recent?.gmail) {
      setGmail(recent.gmail);
      if (recent.password) {
        setPassword(recent.password);
      }
    }
  }, [prefillGmail, prefillPassword]);

  useEffect(() => {
    if (prefillGmail) setGmail(prefillGmail);
    if (prefillPassword) setPassword(prefillPassword);
  }, [prefillGmail, prefillPassword]);

  const handleGmailChange = (e) => {
    const val = e.target.value;
    setGmail(val);
    setErrorMsg('');
    recordRecentLoginEntry(val, password);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setErrorMsg('');
    recordRecentLoginEntry(gmail, val);
  };

  const handleAppendGmailDomain = () => {
    if (!gmail.includes('@')) {
      const updated = `${gmail}@gmail.com`;
      setGmail(updated);
      recordRecentLoginEntry(updated, password);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!gmail.trim()) {
      setErrorMsg('Please enter your Gmail address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    recordRecentLoginEntry(gmail, password);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const users = getRegisteredUsers();
      const matched = users.find(
        (u) => u.gmail.toLowerCase() === gmail.trim().toLowerCase()
      );

      if (matched) {
        if (matched.password === password) {
          onLoginSuccess(matched);
        } else {
          setErrorMsg('Incorrect password. Click "Forgot Password?" below to recover it.');
        }
      } else {
        const fallbackUser = {
          id: 'user-session',
          name: gmail.split('@')[0],
          gmail: gmail.trim().toLowerCase(),
          password: password,
          createdAt: Date.now(),
        };
        onLoginSuccess(fallbackUser);
      }
    }, 700);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/20 shadow-inner mb-3 text-cyan-400">
          <ShieldCheck className="w-6 h-6 drop-shadow-sm" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
          Welcome Back
        </h2>
        <p className="text-sm text-white/60 mt-1">
          Access your developer portal
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      {/* OAuth Integration Buttons */}
      <div className="space-y-2 mb-4">
        <button
          type="button"
          id="oauth-github-signin-btn"
          disabled={isLoading || isOAuthLoading !== null}
          onClick={() => handleOAuthLogin('github')}
          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.99] border border-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
        >
          {isOAuthLoading === 'github' ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Github className="w-4 h-4 text-white" />
          )}
          <span>Sign in with GitHub</span>
        </button>

        <button
          type="button"
          id="oauth-google-signin-btn"
          disabled={isLoading || isOAuthLoading !== null}
          onClick={() => handleOAuthLogin('google')}
          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.99] border border-white/20 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
        >
          {isOAuthLoading === 'google' ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Chrome className="w-4 h-4 text-cyan-400" />
          )}
          <span>Sign in with Google</span>
        </button>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider text-white/40">
          <span className="bg-black/80 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-gmail-input"
              className="text-xs font-medium text-white/80 tracking-wide"
            >
              Gmail Address
            </label>
            {gmail && !gmail.includes('@') && (
              <button
                type="button"
                onClick={handleAppendGmailDomain}
                className="text-[11px] text-cyan-300 hover:text-cyan-200 hover:underline transition-colors flex items-center gap-1"
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
              id="login-gmail-input"
              type="text"
              value={gmail}
              onChange={handleGmailChange}
              placeholder="username@gmail.com"
              autoComplete="email"
              required
              className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:ring-0"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password-input"
              className="text-xs font-medium text-white/80 tracking-wide"
            >
              Password
            </label>
            <button
              type="button"
              id="link-to-forgot-password"
              onClick={() => {
                recordRecentLoginEntry(gmail, password);
                onNavigate('forgot');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className="glass-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl focus:ring-0"
            />
            <button
              type="button"
              id="toggle-login-password-visibility"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-white/70">
            <input
              type="checkbox"
              id="login-remember-me-checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-0 cursor-pointer accent-cyan-500"
            />
            <span>Remember this device</span>
          </label>
        </div>

        <button
          type="submit"
          id="login-submit-button"
          disabled={isLoading}
          className="glass-button-primary w-full py-3 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-white/60">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          id="link-to-signup"
          onClick={() => {
            recordRecentLoginEntry(gmail, password);
            onNavigate('signup');
          }}
          className="text-cyan-400 font-semibold hover:text-cyan-300 ml-1 hover:underline transition-colors cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};
