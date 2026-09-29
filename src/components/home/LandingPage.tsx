import React from 'react';
import { useKase } from '../../context/KaseContext';
import {
  Building2,
  Shield,
  Award,
  CheckCircle2,
  ArrowRight,
  FileText,
  CreditCard,
  Layers,
  MapPin,
  Users,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Clock,
  AlertOctagon,
} from 'lucide-react';
import { OFFICIAL_FEES } from '../../data/mockData';

interface Props {
  onOpenRegisterModal: () => void;
  onOpenLoginModal: (tab?: 'TSP' | 'ADMIN') => void;
  onOpenFeeModal: () => void;
  onOpenProcessModal: () => void;
  onOpenArchitectureModal?: () => void;
}

export const LandingPage: React.FC<Props> = ({
  onOpenRegisterModal,
  onOpenLoginModal,
  onOpenFeeModal,
  onOpenProcessModal,
}) => {
  const { trainingPartners, quickLoginTSP, loginAsAdmin } = useKase();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0e5774] via-[#0b475e] to-[#083647] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-cyan-500/20">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Official badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-cyan-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>State Skill Development Mission (SSDM) • Government of Kerala</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Kerala Academy for <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
              Skills Excellence (KASE)
            </span>
          </h1>
          <p className="text-base sm:text-lg text-cyan-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
            Unified accreditation, quality assurance, and affiliation platform for Training Service
            Providers (TSPs) and Training Centres (TCs) operating across all 14 districts of Kerala.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onOpenRegisterModal}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm shadow-lg hover:shadow-amber-400/25 transition flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-slate-900" />
              <span>Register as New TP (Step 1)</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>

            <button
              onClick={() => onOpenLoginModal('ADMIN')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Process Flow Roadmap (Steps 1 to 9) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0e5774]/10 text-[#0e5774] text-xs font-bold mb-2">
                Chapter 6 Comprehensive Framework
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                9-Step Registration & Accreditation Pipeline
              </h2>
              <p className="text-sm text-slate-500 max-w-2xl">
                Every stage from legal entity registration to continuous monitoring and penalty enforcement.
              </p>
            </div>
            <button
              onClick={onOpenProcessModal}
              className="text-xs font-bold text-[#0e5774] hover:underline flex items-center gap-1"
            >
              <span>View Detailed Process Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid of Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: 'Step 1',
                title: 'Basic TP Registration',
                entity: 'Training Partner',
                desc: 'Captures Legal Entity details (Society, Trust, Company, LLP, Govt Inst) & Authorized Representative to issue unique login credentials.',
                color: 'border-l-4 border-l-[#0e5774]',
              },
              {
                step: 'Step 2',
                title: 'DSDP Proposal Submission',
                entity: 'Training Partner',
                desc: 'Submit District Skill Development Plan with course design, target sectors, intended beneficiaries, infra, and placement tie-ups (>=70%).',
                color: 'border-l-4 border-l-cyan-600',
              },
              {
                step: 'Step 3',
                title: 'Scrutiny & SPOC Assignment',
                entity: 'District Skill Committee (DSC)',
                desc: 'DSC evaluates feasibility and district alignment. On shortfall, system automatically assigns district SPOC for direct guidance.',
                color: 'border-l-4 border-l-amber-500',
              },
              {
                step: 'Step 4a & 4b',
                title: 'Desktop Assessment (Annexure A)',
                entity: 'Inspection Agency (IA)',
                desc: 'Fee payment triggers desktop check of Part-A mandatory standards. Declared "Deemed Ready" (valid 3 yrs) or "Deemed Not Ready".',
                color: 'border-l-4 border-l-emerald-600',
              },
              {
                step: 'Step 5a & 5b',
                title: 'Physical Centre Inspection',
                entity: 'IA & DSC Field Representative',
                desc: 'On-site audit of infrastructure and Part-B scored indicators (area, building, accessibility, CCTV). Produces 1-5 Star Rating.',
                color: 'border-l-4 border-l-sky-600',
              },
              {
                step: 'Step 6',
                title: 'Final BAC Verification',
                entity: 'Business Advisory Committee',
                desc: 'Evaluates course syllabus, lab equipment & fee justification. Awards "Accredited Training Partner" and triggers M&E fee.',
                color: 'border-l-4 border-l-indigo-600',
              },
              {
                step: 'Step 7',
                title: 'Continuous Monitoring (Annexure B)',
                entity: 'KASE Monitoring Cell',
                desc: 'Evaluates Excellence - Risk Framework (8 weighted parameters: Training 30%, Industry 15%, etc.). Generates grades A, B, C, or D.',
                color: 'border-l-4 border-l-violet-600',
              },
              {
                step: 'Step 8',
                title: 'Renewal Management',
                entity: 'TP & Centre (TC)',
                desc: 'Tracks 1-year validity for TCs and 3-year validity for TPs. Automated reminders triggered 3 months prior to expiry.',
                color: 'border-l-4 border-l-teal-600',
              },
              {
                step: 'Step 9',
                title: 'Penalties, Appeals & Governance',
                entity: 'Accreditation Committee & BAC',
                desc: 'Strict enforcement: Late renewal (10%/mo delay, capped 50%), Monitoring fines (10%), 2 D-grades warning, and 2-year fraud ban.',
                color: 'border-l-4 border-l-rose-600',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition ${item.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#0e5774]">{item.step}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {item.entity}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* Fee & Penalty Section Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Chapter 8 Fee Regulations
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Transparent Government Fee Structure
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prescribed non-refundable charges for standardization and sustainability of skill training
              across Kerala. Integrated directly with e-Treasury simulation for instant verification.
            </p>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>TP Registration Fee: <strong>₹{OFFICIAL_FEES.TP_REGISTRATION.toLocaleString('en-IN')}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>TC Accreditation Fee: <strong>₹{OFFICIAL_FEES.TC_ACCREDITATION.toLocaleString('en-IN')}</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Course Affiliation Fee: <strong>₹{OFFICIAL_FEES.COURSE_AFFILIATION_PER_COURSE.toLocaleString('en-IN')} / course</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Monitoring & Evaluation: <strong>₹{OFFICIAL_FEES.MONITORING_EVALUATION.toLocaleString('en-IN')}</strong></span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenFeeModal}
                className="px-4 py-2.5 rounded-lg bg-[#0e5774] text-white text-xs font-bold hover:bg-[#0a4258] transition flex items-center gap-2 shadow-xs"
              >
                <CreditCard className="w-4 h-4" />
                <span>View Full Fee & Penalty Matrix</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
            <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              Step 9 Penalty Enforcement Rules Summary
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
                <div className="font-bold text-rose-900">Late Renewal (10% / Month, Capped at 50%)</div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  Applies for applications filed after the 3-month pre-expiry mark. After 6 months,
                  TC is automatically de-accredited and must pay full re-application fees.
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                <div className="font-bold text-amber-900">Monitoring Violations (10% Fine / 3 Violations = Suspension)</div>
                <div className="text-slate-600 text-[11px] mt-0.5">
                  Failing to submit quarterly reports or resolve audit deficiencies within 15 days results in
                  10% fee fine. 3 strikes in 12 months triggers suspension.
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">15-Day Appeal Window</div>
                  <div className="text-slate-500 text-[11px]">
                    Pay 10% appeal fee to Accreditation Committee (Refunded in full if appeal is upheld).
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                  Refundable
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
