import React, { useState } from 'react';
import { KaseProvider, useKase } from './context/KaseContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/home/LandingPage';
import { TSPPortal } from './components/tsp/TSPPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ArchitectureModal } from './components/modals/ArchitectureModal';
import { FeeScheduleModal } from './components/modals/FeeScheduleModal';
import { ProcessFlowModal } from './components/modals/ProcessFlowModal';
import { LoginModal } from './components/modals/LoginModal';
import { RegistrationModal } from './components/modals/RegistrationModal';

const AppContent: React.FC = () => {
  const { userSession, quickLoginTSP, logout } = useKase();

  // Modals
  const [architectureOpen, setArchitectureOpen] = useState(false);
  const [feeScheduleOpen, setFeeScheduleOpen] = useState(false);
  const [processFlowOpen, setProcessFlowOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'TSP' | 'ADMIN'>('TSP');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const handleOpenLogin = (tab: 'TSP' | 'ADMIN' = 'TSP') => {
    setLoginModalTab(tab);
    setLoginModalOpen(true);
  };

  const handleNavigateHome = () => {
    // Navigating home logs out or resets to landing view
    if (userSession) {
      if (confirm('Return to KASE Portal Home? (You can re-login or switch roles anytime)')) {
        logout();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-[#0e5774] selection:text-white">
      {/* Header */}
      <Header
        onOpenArchitecture={() => setArchitectureOpen(true)}
        onOpenFeeSchedule={() => setFeeScheduleOpen(true)}
        onOpenProcessFlow={() => setProcessFlowOpen(true)}
        onNavigateHome={handleNavigateHome}
        onOpenLoginModal={handleOpenLogin}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {userSession?.type === 'TSP' ? (
          <TSPPortal />
        ) : userSession?.type === 'ADMIN' ? (
          <AdminPortal />
        ) : (
          <LandingPage
            onOpenRegisterModal={() => setRegisterModalOpen(true)}
            onOpenLoginModal={handleOpenLogin}
            onOpenFeeModal={() => setFeeScheduleOpen(true)}
            onOpenProcessModal={() => setProcessFlowOpen(true)}
            onOpenArchitectureModal={() => setArchitectureOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenFeeSchedule={() => setFeeScheduleOpen(true)}
        onOpenProcessFlow={() => setProcessFlowOpen(true)}
        onOpenArchitecture={() => setArchitectureOpen(true)}
      />

      {/* Global Modals */}
      <ArchitectureModal
        isOpen={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
      />

      <FeeScheduleModal
        isOpen={feeScheduleOpen}
        onClose={() => setFeeScheduleOpen(false)}
      />

      <ProcessFlowModal
        isOpen={processFlowOpen}
        onClose={() => setProcessFlowOpen(false)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        defaultTab={loginModalTab}
        onClose={() => setLoginModalOpen(false)}
        onOpenRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />

      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSuccessLogin={(tpId) => {
          setRegisterModalOpen(false);
          quickLoginTSP(tpId);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <KaseProvider>
      <AppContent />
    </KaseProvider>
  );
}
