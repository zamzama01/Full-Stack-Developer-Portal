import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, CheckCircle, AlertCircle, Shield, Github, Chrome } from 'lucide-react';
import { saveRegisteredUser, recordRecentLoginEntry } from '../utils/storage.js';

export const SignUpScreen = ({ onNavigate, onSignUpSuccess }) => {
  const [name, setName] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOAuthSignUp = (provider) => {
    setErrorMsg('');
    setIsOAuthLoading(provider);

    setTimeout(() => {
      setIsOAuthLoading(null);
      if (provider === 'github') {
        const githubUser = saveRegisteredUser({
          name: 'Developer Sami',
          gmail: 'developer.sami@github.com',
          password: 'oauth-verified-github',
          provider: 'GitHub',
        });
        recordRecentLoginEntry(githubUser.gmail, 'oauth-verified-github');
        onSignUpSuccess(githubUser);
      } else {
        const googleUser = saveRegisteredUser({
          name: 'Rao Abdul Sami',
          gmail: 'raoabdul.sami5588@gmail.com',
          password: 'oauth-verified-google',
          provider: 'Google',
        });
        recordRecentLoginEntry(googleUser.gmail, 'oauth-verified-google');
        onSignUpSuccess(googleUser);
      }
    }, 600);
  };

  const calculateStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-white/20' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-cyan-400' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-400' };
      default:
        return { score: 10, label: 'Too short', color: 'bg-rose-500' };
    }
  };

  const strength = calculateStrength(password);

  const handleAppendGmailDomain = () => {
    if (!gmail.includes('@')) {
      const updated = `${gmail}@gmail.com`;
      setGmail(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanGmail = gmail.trim().toLowerCase();

    if (!cleanGmail) {
      setErrorMsg('Please enter your Gmail address.');
      return;
    }

    if (!cleanGmail.includes('@')) {
      setErrorMsg('Please specify a valid Gmail address (e.g. name@gmail.com).');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser = saveRegisteredUser({
        name: name.trim() || cleanGmail.split('@')[0],
        gmail: cleanGmail,
        password: password,
      });

      recordRecentLoginEntry(cleanGmail, password);
      onSignUpSuccess(newUser);
    }, 700);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/20 shadow-inner mb-3 text-cyan-400">
          <UserPlus className="w-6 h-6 drop-shadow-sm" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
          Create Account
        </h2>
        <p className="text-sm text-white/60 mt-1">
          Register your credentials for dynamic access
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      {/* OAuth Integration Buttons */}
      <div className="space-y-2 mb-4">
        <button
          type="button"
          id="oauth-github-signup-btn"
          disabled={isLoading || isOAuthLoading !== null}
          onClick={() => handleOAuthSignUp('github')}
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
          id="oauth-google-signup-btn"
          disabled={isLoading || isOAuthLoading !== null}
          onClick={() => handleOAuthSignUp('google')}
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

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label
            htmlFor="signup-name-input"
            className="block text-xs font-medium text-white/80 tracking-wide mb-1"
          >
            Full Name (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <User className="w-4 h-4" />
            </div>
            <input
              id="signup-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Vane"
              className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:ring-0"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="signup-gmail-input"
              className="text-xs font-medium text-white/80 tracking-wide"
            >
              Gmail Address
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
              id="signup-gmail-input"
              type="text"
              value={gmail}
              onChange={(e) => {
                setGmail(e.target.value);
                setErrorMsg('');
              }}
              placeholder="yourname@gmail.com"
              required
              className="glass-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl focus:ring-0"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-password-input"
            className="block text-xs font-medium text-white/80 tracking-wide mb-1"
          >
            Choose Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="signup-password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Create strong password"
              required
              className="glass-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl focus:ring-0"
            />
            <button
              type="button"
              id="toggle-signup-password-visibility"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-white/60">
                <span>Strength:</span>
                <span className="font-medium text-white/90">{strength.label}</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="signup-confirm-password-input"
            className="block text-xs font-medium text-white/80 tracking-wide mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
              <Shield className="w-4 h-4" />
            </div>
            <input
              id="signup-confirm-password-input"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Repeat password"
              required
              className="glass-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl focus:ring-0"
            />
            <button
              type="button"
              id="toggle-signup-confirm-password-visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && password && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px]">
              {confirmPassword === password ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            id="signup-submit-button"
            disabled={isLoading}
            className="glass-button-primary w-full py-3 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-white/60">
        Already have an account?{' '}
        <button
          type="button"
          id="link-to-signin-from-signup"
          onClick={() => onNavigate('login')}
          className="text-cyan-400 font-semibold hover:text-cyan-300 ml-1 hover:underline transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
