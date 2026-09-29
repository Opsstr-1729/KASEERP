import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Award, Eye, FileText, Scale } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessFlowModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 'Step 1',
      title: 'Training Provider (TP) Basic Registration',
      actor: 'Training Provider (TP)',
      desc: 'TP submits legal entity details (Society, Trust, LLP, Company, Govt Inst) & organizational profile. Submitting generates unique login credentials for SSDM correspondence.',
      fee: '₹3,000 TP Registration Fee',
    },
    {
      step: 'Step 2',
      title: 'DSDP Proposal Submission to DSC',
      actor: 'Training Provider (TP)',
      desc: 'Logged-in TP submits District Skill Development Plan (DSDP) proposal including course design, target sectors, intended beneficiaries, infra readiness, and placement target (>=70%).',
      fee: 'Included in Registration',
    },
    {
      step: 'Step 3',
      title: 'Scrutiny & Inclusion in DSDP',
      actor: 'District Skill Committee (DSC)',
      desc: 'DSC evaluates proposal via DSDP Evaluation Matrix. Decision: Approved, Rejected, or Clarification Requested. If shortfalls exist, system automatically assigns district SPOC contact for handholding.',
      fee: 'No charge for scrutiny',
    },
    {
      step: 'Step 4a & 4b',
      title: 'Accreditation Application & Desktop Assessment',
      actor: 'TP & Inspection Agency (IA)',
      desc: 'TP pays applicable fees. IA conducts desktop assessment using Annexure A Part-A mandatory standards. Designates TP as "Deemed Ready" (valid for 3 years) or "Deemed Not Ready".',
      fee: 'TP Portal Registration',
    },
    {
      step: 'Step 5a & 5b',
      title: 'Physical Centre Inspection & Annexure A Scoring',
      actor: 'TP, IA Team & DSC Member',
      desc: 'TP pays TC accreditation & course affiliation fees. IA visits physical centre, audits Part-A (mandatory) and scores Part-B (points for area, building, transport, CCTV, library). Produces 1 to 5 Star Rating and recommendations countersigned by DSC.',
      fee: '₹10,000 TC Fee + ₹10,000 / course',
    },
    {
      step: 'Step 6',
      title: 'BAC Verification & Operations Approval',
      actor: 'Business Advisory Committee (BAC)',
      desc: 'BAC reviews physical inspection report, detailed equipment list, course curriculum & fee rationality. Awards "Accredited Training Partner" status and collects M&E fees. Only accredited TCs may start skilling.',
      fee: '₹5,000 Monitoring & Evaluation Fee',
    },
    {
      step: 'Step 7',
      title: 'Continuous Monitoring (Annexure B ERF)',
      actor: 'KASE Monitoring Cell',
      desc: 'Periodic audits using Excellence - Risk Framework (8 weighted parameters: Training 30%, Industry 15%, Financials 15%, etc.). Generates grades A, B, C, or D. May downgrade or conditionally accredit.',
      fee: 'Periodic',
    },
    {
      step: 'Step 8',
      title: 'Renewal Management',
      actor: 'TP & Admin System',
      desc: 'TC accreditation is valid for 1 year; TP registration for 3 years. Reminders triggered automatically 3 months before expiry.',
      fee: 'Renewal Fees',
    },
    {
      step: 'Step 9',
      title: 'Penalties, Appeals & Governance',
      actor: 'Accreditation Committee & BAC',
      desc: 'Automated enforcement: Late renewal (10%/mo capped at 50%; >6mo = de-accreditation); Monitoring failures (10% fine; 3 violations = suspension); 2 D-grades = conditional; Fraud = 100% fine & 2-yr ban. 15-day appeal window with 10% refundable fee.',
      fee: 'Penalties / 10% Appeal Fee',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#0e5774] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Award className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Chapter 6: Complete Accreditation Process Roadmap</h3>
              <p className="text-xs text-cyan-100">Step 1 to Step 9 End-to-End Business Logic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {steps.map((item, idx) => (
              <div
                key={item.step}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#0e5774]/40 hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#0e5774] text-white font-bold text-[10px]">
                      {item.step}
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {item.actor}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1.5">{item.title}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] font-mono text-[#0e5774] font-semibold">
                  {item.fee}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-slate-700">
            <h5 className="font-bold text-[#0e5774] mb-1">Two-Tier Grievance & Governance Framework:</h5>
            <p className="leading-relaxed text-[11px]">
              Any dispute or grievance regarding scrutiny, inspection, or penalties must first be lodged
              with the <strong>Accreditation Committee</strong> within 15 days (with 10% appeal fee). If unresolved,
              it is escalated to the <strong>Appellate Authority (Business Advisory Committee - BAC)</strong>,
              whose independent review is final and binding on both the TP and SSDM.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0e5774] text-white rounded-lg text-xs font-semibold hover:bg-[#0a4258] transition"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
