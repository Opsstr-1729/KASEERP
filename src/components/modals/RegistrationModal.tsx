import React, { useState } from 'react';
import { useKase } from '../../context/KaseContext';
import { LegalEntityType, KeralaDistrict } from '../../types/kase';
import { Building2, X, CheckCircle, ShieldCheck, ArrowRight, Copy, Check, FileText } from 'lucide-react';
import { OFFICIAL_FEES } from '../../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (tpId: string) => void;
}

export const RegistrationModal: React.FC<Props> = ({ isOpen, onClose, onSuccessLogin }) => {
  const { registerTP } = useKase();

  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [createdCredentials, setCreatedCredentials] = useState<{
    username: string;
    passwordHash: string;
    tpId: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [organizationName, setOrganizationName] = useState('');
  const [entityType, setEntityType] = useState<LegalEntityType>('Company');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [incorporationDate, setIncorporationDate] = useState('2020-01-15');
  const [panNumber, setPanNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [headOfficeAddress, setHeadOfficeAddress] = useState('');
  const [district, setDistrict] = useState<KeralaDistrict>('Ernakulam');
  const [website, setWebsite] = useState('');

  // Authorized Representative
  const [repName, setRepName] = useState('');
  const [repDesignation, setRepDesignation] = useState('Managing Director');
  const [repPhone, setRepPhone] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repIdNumber, setRepIdNumber] = useState('');

  // Primary Contact
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName || !registrationNumber || !panNumber || !repName || !repPhone) {
      alert('Please complete all required mandatory fields.');
      return;
    }

    const res = registerTP({
      organizationName,
      entityType,
      registrationNumber,
      incorporationDate,
      panNumber: panNumber.toUpperCase(),
      gstin: gstin.toUpperCase(),
      headOfficeAddress,
      district,
      website,
      authorizedRep: {
        name: repName,
        designation: repDesignation,
        phone: repPhone,
        email: repEmail,
        aadhaarOrIdNumber: repIdNumber || 'XXXX-XXXX-8822',
      },
      primaryContact: {
        name: contactName || repName,
        phone: contactPhone || repPhone,
        email: contactEmail || repEmail,
      },
    });

    if (res.success) {
      setCreatedCredentials(res.credentials);
      setStep('SUCCESS');
    }
  };

  const copyCreds = () => {
    if (!createdCredentials) return;
    const text = `KASE Portal Login Credentials\nTP ID: ${createdCredentials.tpId}\nUsername: ${createdCredentials.username}\nPassword: ${createdCredentials.passwordHash}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#0e5774] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Building2 className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <h3 className="font-bold text-base">Step 1: Training Provider (TP) Basic Registration</h3>
              <p className="text-xs text-cyan-100">
                Kerala Academy for Skills Excellence • Chapter 6 Guideline Form
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'FORM' ? (
          <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
            {/* Note banner */}
            <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl text-xs text-slate-700 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0e5774] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0e5774]">Registration Guidelines: </span>
                Any legally established entity (Society, Trust, Proprietorship, Company, LLP, or Government Institute)
                may register as an umbrella TP. Registration fee: Rs. {OFFICIAL_FEES.TP_REGISTRATION.toLocaleString('en-IN')}.
                Submitting this form immediately generates unique login credentials for subsequent DSDP proposal submission.
              </div>
            </div>

            {/* Section 1: Legal Entity Details */}
            <div>
              <h4 className="text-xs font-bold text-[#0e5774] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0e5774]" />
                1. Legal Entity & Organizational Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Organization / Entity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malabar Skill & Vocational Training Academy Pvt Ltd"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Legal Entity Type *</label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value as LegalEntityType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  >
                    <option value="Company">Company (Pvt Ltd / Public)</option>
                    <option value="Society">Registered Society</option>
                    <option value="Trust">Registered Trust</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="Government Institute">Government / Autonomous Institute</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration / CIN Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. U80902KL2020PTC061201"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Incorporation / Registration</label>
                  <input
                    type="date"
                    value={incorporationDate}
                    onChange={(e) => setIncorporationDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary District in Kerala *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value as KeralaDistrict)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  >
                    {[
                      'Thiruvananthapuram',
                      'Kollam',
                      'Pathanamthitta',
                      'Alappuzha',
                      'Kottayam',
                      'Idukki',
                      'Ernakulam',
                      'Thrissur',
                      'Palakkad',
                      'Malappuram',
                      'Kozhikode',
                      'Wayanad',
                      'Kannur',
                      'Kasaragod',
                    ].map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PAN Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="e.g. AABCM1234K"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774] font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GSTIN (if applicable)</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="e.g. 32AABCM1234K1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774] font-mono uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Registered Head Office Address *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Complete street address, pin code, district"
                    value={headOfficeAddress}
                    onChange={(e) => setHeadOfficeAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Official Website / Web Portal</label>
                  <input
                    type="url"
                    placeholder="https://example.org"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Authorized Representative */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-[#0e5774] uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0e5774]" />
                2. Authorized Signatory / Representative Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Representative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full legal name"
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Managing Director / Trustee / President"
                    value={repDesignation}
                    onChange={(e) => setRepDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98950 00000"
                    value={repPhone}
                    onChange={(e) => setRepPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="representative@domain.org"
                    value={repEmail}
                    onChange={(e) => setRepEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>
              </div>
            </div>

            {/* Fee Note & Submit */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">Applicable TP Registration Fee</div>
                <div className="text-lg font-bold text-slate-900">
                  ₹{OFFICIAL_FEES.TP_REGISTRATION.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-emerald-600 font-normal">(Included in demo registration)</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0e5774] hover:bg-[#0a4258] text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <span>Submit & Generate Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Training Provider Registration Successful!</h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Your organization has been registered in the KASE State Skill Development Mission database.
                Below are your official portal login credentials:
              </p>
            </div>

            {createdCredentials && (
              <div className="max-w-md mx-auto bg-slate-900 text-slate-100 p-5 rounded-xl text-left font-mono text-xs relative shadow-lg">
                <div className="text-[11px] text-cyan-400 font-bold mb-3 border-b border-slate-800 pb-2 flex justify-between items-center">
                  <span>KASE CREDENTIAL SLIP</span>
                  <span className="text-slate-400">Step 1 Complete</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registration TP ID:</span>
                    <span className="text-amber-300 font-bold">{createdCredentials.tpId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Portal Username:</span>
                    <span className="text-cyan-300 font-bold">{createdCredentials.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Initial Password:</span>
                    <span className="text-emerald-400 font-bold">{createdCredentials.passwordHash}</span>
                  </div>
                </div>

                <button
                  onClick={copyCreds}
                  className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-sans font-semibold flex items-center justify-center gap-2 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Credentials Copied!' : 'Copy Credentials'}
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => {
                  if (createdCredentials) {
                    onSuccessLogin(createdCredentials.tpId);
                  }
                }}
                className="px-6 py-3 bg-[#0e5774] hover:bg-[#0a4258] text-white rounded-xl text-sm font-bold shadow-lg transition inline-flex items-center gap-2"
              >
                <span>Proceed to TSP Portal (Step 2: DSDP Proposal)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
