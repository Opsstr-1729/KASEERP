import React from 'react';
import { X, CreditCard, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { OFFICIAL_FEES } from '../../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FeeScheduleModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#0e5774] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <CreditCard className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Chapter 8: Applicable Fee Schedule & Penalties</h3>
              <p className="text-xs text-cyan-100">KASE Accreditation & Affiliation Norms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-xs">
          {/* Main Fee Table */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0e5774]" />
              Official Prescribed Fees (Non-refundable)
            </h4>
            <div className="overflow-hidden border border-slate-200 rounded-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Stage / Fee Head</th>
                    <th className="px-4 py-2.5">Applicability & Timing</th>
                    <th className="px-4 py-2.5 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">Training Provider (TP) Registration Fee</td>
                    <td className="px-4 py-2.5">Upon basic TP application submission (Step 1)</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{OFFICIAL_FEES.TP_REGISTRATION.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">Training Centre (TC) Accreditation Fee</td>
                    <td className="px-4 py-2.5">Upon completion of desktop assessment & 'Deemed Ready' status</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{OFFICIAL_FEES.TC_ACCREDITATION.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">Course Affiliation Fee</td>
                    <td className="px-4 py-2.5">Upon 'Deemed Ready' status (Per Course/Job Role)</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{OFFICIAL_FEES.COURSE_AFFILIATION_PER_COURSE.toLocaleString('en-IN')} / course
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">Monitoring and Evaluation (M&E) Fee</td>
                    <td className="px-4 py-2.5">Upon final BAC approval before commencing operations (Step 6)</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{OFFICIAL_FEES.MONITORING_EVALUATION.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">Re-inspection Fees (if required)</td>
                    <td className="px-4 py-2.5">If previous inspection failed Part-A standards</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{OFFICIAL_FEES.RE_INSPECTION_BASE.toLocaleString('en-IN')} + ₹10,000 / course
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/50">
                    <td className="px-4 py-2.5 font-semibold text-slate-800">Grievance & Appeal Fee</td>
                    <td className="px-4 py-2.5">Payable to Accreditation Committee within 15 days (Refundable if appeal upheld)</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{OFFICIAL_FEES.APPEAL_FEE.toLocaleString('en-IN')} (or 10% fee)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Step 9 Penalties Matrix */}
          <div>
            <h4 className="font-bold text-rose-700 text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Step 9: Penalties for Non-Compliance Matrix
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <div className="font-bold text-rose-900 text-xs">Late Renewal Surcharge</div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  • 10% penalty per month of delay, capped at 50% of the renewal fee, for submissions after the 3-month pre-expiry deadline.
                </p>
                <p className="text-rose-800 font-semibold text-[11px]">
                  • Failure to renew within 6 months of expiry = Automatic de-accreditation requiring full reapplication (Rs. 10,000 TP, Rs. 13,000+ TC).
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div className="font-bold text-amber-900 text-xs">Continuous Monitoring Failure</div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  • 10% accreditation fee penalty per instance of non-submission of monitoring reports or failure to fix deficiencies within 15 days.
                </p>
                <p className="text-amber-800 font-semibold text-[11px]">
                  • 3 violations in a year = Automatic suspension of affiliation for affected job roles.
                </p>
              </div>

              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                <div className="font-bold text-purple-900 text-xs">Poor Performance (Annexure C)</div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  • Overall Performance Grades: A (85-100%), B (70-84%), C (60-69%), D (&lt;60%).
                </p>
                <p className="text-purple-800 font-semibold text-[11px]">
                  • 2 consecutive 'D' grades trigger "Conditional" accreditation pending Appellate Authority review & mandatory Risk Mitigation Plan.
                </p>
              </div>

              <div className="p-3.5 bg-red-50 border border-red-300 rounded-xl space-y-1">
                <div className="font-bold text-red-900 text-xs">Fraud & Misrepresentation</div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  • Immediate cancellation of accreditation and registration.
                </p>
                <p className="text-red-800 font-semibold text-[11px]">
                  • 100% fine applied + 2-year complete ban from re-applying, with escalation to law enforcement.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0e5774] text-white rounded-lg text-xs font-semibold hover:bg-[#0a4258] transition"
          >
            Close Fee Table
          </button>
        </div>
      </div>
    </div>
  );
};
