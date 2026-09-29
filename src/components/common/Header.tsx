import React from 'react';
import { useKase } from '../../context/KaseContext';
import { Shield, Building2, LogOut, RotateCcw } from 'lucide-react';

interface Props {
  onOpenArchitecture?: () => void;
  onOpenFeeSchedule: () => void;
  onOpenProcessFlow: () => void;
  onNavigateHome: () => void;
  onOpenLoginModal: (tab?: 'TSP' | 'ADMIN') => void;
}

export const Header: React.FC<Props> = ({
  onOpenFeeSchedule,
  onOpenProcessFlow,
  onNavigateHome,
  onOpenLoginModal,
}) => {
  const { userSession, currentTP, logout, resetToDemoData } = useKase();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Govt Bar */}
      <div className="bg-[#0b435a] text-white text-[11px] font-medium py-1 px-4 sm:px-8 flex justify-between items-center tracking-wide">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Government of Kerala • Department of Labour & Skills</span>
          <span className="hidden md:inline text-cyan-200/80">| State Skill Development Mission (SSDM)</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={resetToDemoData}
            title="Reset to default mock state"
            className="flex items-center gap-1 text-cyan-200 hover:text-white transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0e5774] to-[#083647] flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform duration-200 border border-cyan-500/20">
            <span className="font-serif text-lg tracking-wider text-amber-300">K</span>
            <span className="text-xs text-white">ASE</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight leading-tight">
                KASE <span className="text-[#0e5774]">ACCREDITATION</span>
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20">
                SSDM PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Kerala Academy for Skills Excellence • Training Provider Registration & Quality Framework
            </p>
          </div>
        </div>

        {/* User Session Bar / Admin */}
        <div className="flex items-center gap-3">
          {userSession ? (
            <div className="flex items-center gap-3">
              {userSession.type === 'TSP' && currentTP ? (
                <div className="flex items-center gap-2 text-right">
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[180px]">
                      {currentTP.organizationName}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ID: <span className="font-mono text-[#0e5774]">{currentTP.tpId}</span>
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#0e5774]/10 text-[#0e5774] flex items-center justify-center font-bold text-xs border border-[#0e5774]/20">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-right">
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-800">Admin</p>
                    <p className="text-[11px] text-slate-500 font-medium">Administrator</p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-[#0e5774]/10 text-[#0e5774] flex items-center justify-center font-bold text-xs border border-[#0e5774]/20">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenLoginModal('ADMIN')}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0e5774] text-white hover:bg-[#0a4258] shadow-sm transition flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
