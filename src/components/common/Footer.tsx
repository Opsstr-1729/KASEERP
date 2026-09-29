import React from 'react';
import { Shield, ExternalLink, Mail, Phone, MapPin, Award } from 'lucide-react';

interface Props {
  onOpenFeeSchedule: () => void;
  onOpenProcessFlow: () => void;
  onOpenArchitecture?: () => void;
}

export const Footer: React.FC<Props> = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
          {/* Col 1 */}
          <div className="space-y-3 max-w-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0e5774] flex items-center justify-center text-white font-bold text-sm">
                K
              </div>
              <span className="font-bold text-white text-sm">KASE • SSDM Kerala</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Kerala Academy for Skills Excellence (KASE) is the State Skill Development Mission (SSDM)
              under the Department of Labour and Skills, Government of Kerala.
            </p>
            <div className="pt-1 text-cyan-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="font-semibold">Quality & Excellence Framework</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="md:text-right space-y-2 text-slate-400 text-xs">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-2 text-slate-200">
              State Skill Development Mission
            </h4>
            <div className="flex md:justify-end items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                3rd Floor, Carmel Towers, Cotton Hill, Vazhuthacaud, Thiruvananthapuram - 695014
              </span>
            </div>
            <div className="flex md:justify-end items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>0471-2735858 / 2735949</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} Kerala Academy for Skills Excellence (KASE), Government of Kerala. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
