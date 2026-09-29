import React, { useState } from 'react';
import { useKase } from '../../context/KaseContext';
import { Shield, Building2, Lock, User, ArrowRight, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { AdminRole, KeralaDistrict } from '../../types/kase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'TSP' | 'ADMIN';
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<Props> = ({
  isOpen,
  onClose,
  defaultTab = 'TSP',
  onOpenRegister,
}) => {
  const { loginAsTSP, loginAsAdmin, quickLoginTSP, trainingPartners } = useKase();
  const [tab, setTab] = useState<'TSP' | 'ADMIN'>(defaultTab);

  // TSP Form State
  const [tspUsername, setTspUsername] = useState('');
  const [tspPassword, setTspPassword] = useState('');
  const [tspError, setTspError] = useState('');

  // Admin Form State
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  if (!isOpen) return null;

  const handleTSPLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setTspError('');
    if (!tspUsername.trim()) {
      setTspError('Please enter your TP Username or TP ID');
      return;
    }
    const res = loginAsTSP(tspUsername, tspPassword);
    if (res.success) {
      onClose();
    } else {
      setTspError(res.message || 'Login failed');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin('KASE_ADMIN', 'Admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-[#0e5774] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <span className="font-serif font-bold text-amber-300 text-lg">K</span>
            </div>
            <div>
              <h3 className="font-bold text-base">SSDM Unified Login Portal</h3>
              <p className="text-xs text-cyan-100">Kerala Academy for Skills Excellence (KASE)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              setTab('TSP');
              setTspError('');
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              tab === 'TSP'
                ? 'border-[#0e5774] text-[#0e5774] bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>TSP Login</span>
            <span className="text-[10px] bg-cyan-100 text-[#0e5774] px-1.5 py-0.5 rounded font-normal">
              Training Provider
            </span>
          </button>
          <button
            onClick={() => {
              setTab('ADMIN');
              setTspError('');
            }}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition ${
              tab === 'ADMIN'
                ? 'border-[#0e5774] text-[#0e5774] bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === 'TSP' ? (
            <div>
              <form onSubmit={handleTSPLogin} className="space-y-4">
                {tspError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{tspError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    TP Username or Registration ID
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. keltron_tp or KASE-TP-2024-001"
                      value={tspUsername}
                      onChange={(e) => setTspUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e5774] focus:border-[#0e5774]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <span className="text-[11px] text-slate-400">Demo pwd: kase123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      placeholder="Enter password (default: kase123)"
                      value={tspPassword}
                      onChange={(e) => setTspPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e5774] focus:border-[#0e5774]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0e5774] hover:bg-[#0a4258] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>Sign In to TSP Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Quick Demo Switchers */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Click Quick Demo Accounts (Select to explore):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {trainingPartners.slice(0, 4).map((tp) => (
                    <button
                      key={tp.tpId}
                      onClick={() => {
                        quickLoginTSP(tp.tpId);
                        onClose();
                      }}
                      className="p-2 text-left bg-slate-50 hover:bg-cyan-50/50 border border-slate-200 hover:border-[#0e5774]/50 rounded-lg transition group"
                    >
                      <div className="font-semibold text-slate-800 text-[11px] line-clamp-1 group-hover:text-[#0e5774]">
                        {tp.organizationName}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                        <span className="font-mono">{tp.tpId}</span>
                        <span className="text-[#0e5774] font-medium">{tp.overallStatus.split(' ')[0]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Register Callout */}
              <div className="mt-5 p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#0e5774]">New Training Provider?</p>
                  <p className="text-[11px] text-slate-500">Register in Step 1 to generate login credentials.</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenRegister();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0e5774] text-white font-semibold text-xs hover:bg-[#0a4258] transition"
                >
                  Register Now
                </button>
              </div>
            </div>
          ) : (
            <div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e5774]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <span className="text-[11px] text-slate-400">Default: admin123</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e5774]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
                  <p className="text-[11px]">
                    Admin access manages scrutiny, desktop evaluations, physical inspections, accreditation approvals, and monitoring.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#0e5774] hover:bg-[#0a4258] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Sign in as Admin</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
