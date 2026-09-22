import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ThreeDBackground } from './components/ThreeDBackground.jsx';
import { LoginScreen } from './components/LoginScreen.jsx';
import { SignUpScreen } from './components/SignUpScreen.jsx';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen.jsx';
import { DashboardScreen } from './components/DashboardScreen.jsx';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [prefillLoginGmail, setPrefillLoginGmail] = useState('');
  const [prefillLoginPassword, setPrefillLoginPassword] = useState('');
  const [toasts, setToasts] = useState([]);

  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const addToast = (type, title, message) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMouseMoveOnCard = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rx = -(y / (rect.height / 2)) * 6;
    const ry = (x / (rect.width / 2)) * 6;
    setTilt({ rx, ry });
  };

  const handleMouseLeaveCard = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const handleLoginSuccess = (user) => {
    setAuthenticatedUser(user);
    addToast('success', 'Sign In Successful', `Welcome back, ${user.name || user.gmail}!`);
  };

  const handleSignUpSuccess = (user) => {
    addToast(
      'success',
      'Account Created',
      `Registered ${user.gmail}. You can now sign in or recover passwords dynamically.`
    );
    setPrefillLoginGmail(user.gmail);
    setPrefillLoginPassword(user.password);
    setCurrentScreen('login');
  };

  const handleQuickLoginWithRecovered = (gmail, password) => {
    setPrefillLoginGmail(gmail);
    setPrefillLoginPassword(password);
    setCurrentScreen('login');
    addToast(
      'info',
      'Credentials Loaded',
      'Recovered Gmail and Password have been auto-filled into Sign In.'
    );
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 select-none overflow-x-hidden">
      <ThreeDBackground />

      <main className="relative z-10 flex items-center justify-center m-auto">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMoveOnCard}
          onMouseLeave={handleMouseLeaveCard}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: 'transform 0.15s ease-out',
            width: '420px',
            maxWidth: '90vw',
            height: 'auto',
            padding: '32px',
            background: 'rgba(255, 255, 255, 0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            borderRadius: '16px',
          }}
          className="relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {authenticatedUser ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
              >
                <DashboardScreen
                  user={authenticatedUser}
                  onSignOut={() => {
                    setAuthenticatedUser(null);
                    setCurrentScreen('login');
                    addToast('info', 'Signed Out', 'You have been safely disconnected.');
                  }}
                  onNavigateToScreen={(screen) => {
                    setAuthenticatedUser(null);
                    setCurrentScreen(screen);
                  }}
                />
              </motion.div>
            ) : currentScreen === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.24, ease: 'easeInOut' }}
              >
                <LoginScreen
                  onNavigate={setCurrentScreen}
                  onLoginSuccess={handleLoginSuccess}
                  prefillGmail={prefillLoginGmail}
                  prefillPassword={prefillLoginPassword}
                />
              </motion.div>
            ) : currentScreen === 'signup' ? (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.24, ease: 'easeInOut' }}
              >
                <SignUpScreen
                  onNavigate={setCurrentScreen}
                  onSignUpSuccess={handleSignUpSuccess}
                />
              </motion.div>
            ) : (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.24, ease: 'easeInOut' }}
              >
                <ForgotPasswordScreen
                  onNavigate={setCurrentScreen}
                  onQuickLoginWithRecovered={handleQuickLoginWithRecovered}
                  initialGmail={prefillLoginGmail}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-start gap-3 text-xs text-white animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-400/40 text-emerald-100'
                : toast.type === 'error'
                ? 'bg-rose-950/80 border-rose-400/40 text-rose-100'
                : 'bg-cyan-950/80 border-cyan-400/40 text-cyan-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white">{toast.title}</div>
              <div className="text-white/80 text-[11px] leading-relaxed mt-0.5">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
