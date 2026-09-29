import React, { useState } from 'react';
import { useKase } from '../../context/KaseContext';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  Eye,
  Award,
  Clock,
  Ban,
  Scale,
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  AdminRole,
  KeralaDistrict,
  TrainingPartner,
  AnnexureAChecklist,
  PerformanceGrade,
} from '../../types/kase';
import { OFFICIAL_FEES } from '../../data/mockData';

export const AdminPortal: React.FC = () => {
  const {
    trainingPartners,
    activeRole,
    setActiveRole,
    selectedDistrictFilter,
    setSelectedDistrictFilter,
    scrutinizeDSDP,
    evaluateDesktopAssessment,
    evaluatePhysicalInspection,
    evaluateBAC,
    evaluateERF,
    issuePenalty,
    resolveAppeal,
    triggerImmediateFraudCancellation,
    applyRenewalWithLatePenalty,
    reviewAnnexureC,
  } = useKase();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  // Selected TP for Active Modal / Drawer
  const [selectedTP, setSelectedTP] = useState<TrainingPartner | null>(null);
  const [activeActionModal, setActiveActionModal] = useState<
    | null
    | 'SCRUTINY'
    | 'DESKTOP'
    | 'INSPECTION'
    | 'BAC'
    | 'MONITORING'
    | 'RENEWAL'
    | 'PENALTY'
  >(null);

  // Scrutiny Matrix State
  const [scrutinyFeasibility, setScrutinyFeasibility] = useState(22);
  const [scrutinyAlignment, setScrutinyAlignment] = useState(23);
  const [scrutinyPlacement, setScrutinyPlacement] = useState(22);
  const [scrutinyInfra, setScrutinyInfra] = useState(24);
  const [scrutinyRemarks, setScrutinyRemarks] = useState(
    'Strong district alignment and verified industry placement partners. Approved for next stage.'
  );

  // Desktop Assessment Part-A State
  const [desktopChecklist, setDesktopChecklist] = useState<AnnexureAChecklist['partA']>({
    classroomAreaCapacity: true,
    skillLabPracticalArea: true,
    placementCoordinatorAppointed: true,
    counsellorAppointed: true,
    buildingConstruction: true,
    separateMaleFemaleWashrooms: true,
    cleanlinessAndHygiene: true,
  });

  // Physical Inspection Part-A & Part-B State
  const [physicalPartA, setPhysicalPartA] = useState<AnnexureAChecklist['partA']>({
    classroomAreaCapacity: true,
    skillLabPracticalArea: true,
    placementCoordinatorAppointed: true,
    counsellorAppointed: true,
    buildingConstruction: true,
    separateMaleFemaleWashrooms: true,
    cleanlinessAndHygiene: true,
  });

  const [physicalPartB, setPhysicalPartB] = useState<AnnexureAChecklist['partB']>({
    internetFacility50Mbps: true,
    centreAreaPoints: 15,
    typeOfBuildingPoints: 10,
    ownershipPoints: 5,
    proximityToTransportPoints: 5,
    differentlyAbledFriendlyPoints: 7,
    cctvCamerasPoints: 3,
    libraryFacilityWithRegister: true,
  });
  const [dscSignatory] = useState('Admin');
  const [inspectionRecommendation, setInspectionRecommendation] = useState<
    'Accreditation' | 'Conditional Accreditation' | 'Rejected'
  >('Accreditation');

  // BAC Verification State
  const [bacRemarks, setBacRemarks] = useState(
    'Equipment list verified against Sector Skill Council curriculum. Training Centre approved to commence operations upon M&E fee payment.'
  );

  // Annexure B Continuous Monitoring (ERF) State
  const [erfFinancials, setErfFinancials] = useState(14);
  const [erfGov, setErfGov] = useState(9);
  const [erfQual, setErfQual] = useState(9);
  const [erfTraining, setErfTraining] = useState(28);
  const [erfAssessment, setErfAssessment] = useState(9);
  const [erfIndustry, setErfIndustry] = useState(13);
  const [erfFuture, setErfFuture] = useState(5);
  const [erfGrievance, setErfGrievance] = useState(5);
  const [erfNotes, setErfNotes] = useState(
    'Periodic audit shows exceptional placement tracking and high student satisfaction scores.'
  );

  // Step 9 Penalties Form State
  const [penaltyType, setPenaltyType] = useState<
    'LATE_RENEWAL' | 'MONITORING_FAILURE' | 'POOR_PERFORMANCE_D' | 'FRAUD_MISREPRESENTATION'
  >('MONITORING_FAILURE');
  const [penaltyTitle, setPenaltyTitle] = useState('Failure to submit Q3 Placement Monitoring Report');
  const [penaltyDesc, setPenaltyDesc] = useState(
    'Quarterly monitoring report overdue by >15 days. 10% accreditation fee penalty imposed.'
  );
  const [penaltyAmount, setPenaltyAmount] = useState(1000);

  // Filtered list
  const filteredTPs = trainingPartners.filter((tp) => {
    const matchesSearch =
      tp.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.tpId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tp.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDistrict =
      selectedDistrictFilter === 'ALL' || tp.district === selectedDistrictFilter;

    const matchesStage = stageFilter === 'ALL' || tp.currentStage === stageFilter;

    return matchesSearch && matchesDistrict && matchesStage;
  });

  const openActionModal = (
    tp: TrainingPartner,
    modalType: 'SCRUTINY' | 'DESKTOP' | 'INSPECTION' | 'BAC' | 'MONITORING' | 'RENEWAL' | 'PENALTY'
  ) => {
    setSelectedTP(tp);
    setActiveActionModal(modalType);

    // Seed defaults if available
    if (tp.dsdpProposal?.scrutinyRemarks) setScrutinyRemarks(tp.dsdpProposal.scrutinyRemarks);
    if (tp.annexureA?.partA) {
      setDesktopChecklist(tp.annexureA.partA);
      setPhysicalPartA(tp.annexureA.partA);
    }
    if (tp.annexureA?.partB) {
      setPhysicalPartB(tp.annexureA.partB);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Bar & Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0e5774]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0e5774]">
              Evaluation & Governance Portal
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-600 font-medium">State Skill Development Mission</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Admin Dashboard
          </h1>
        </div>

        {/* Admin Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#0e5774] text-white font-bold text-xs flex items-center gap-2 shadow-xs">
            <Shield className="w-4 h-4 text-amber-300" />
            <span>Admin</span>
          </div>
        </div>
      </div>

      {/* District & Stage Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-center justify-between text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by TP Name, TP ID, or District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
            />
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">District:</span>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value as KeralaDistrict | 'ALL')}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
            >
              <option value="ALL">All 14 Districts</option>
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
              ].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Stage:</span>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
            >
              <option value="ALL">All Stages</option>
              <option value="STEP_1_REGISTRATION">Step 1: Registration</option>
              <option value="STEP_2_DSDP_SUBMISSION">Step 2: DSDP Proposal</option>
              <option value="STEP_3_DSDP_SCRUTINY">Step 3: DSDP Scrutiny</option>
              <option value="STEP_4_ACCREDITATION_DESKTOP">Step 4: Desktop Audit</option>
              <option value="STEP_5_PHYSICAL_INSPECTION">Step 5: Physical Inspection</option>
              <option value="STEP_6_BAC_VERIFICATION">Step 6: BAC Verification</option>
              <option value="STEP_7_CONTINUOUS_MONITORING">Step 7: Continuous Monitoring</option>
              <option value="STEP_8_RENEWAL">Step 8: Renewal Pending</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="DEACCREDITED">De-Accredited / Banned</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-semibold">
          Showing <strong>{filteredTPs.length}</strong> Training Partners
        </div>
      </div>

      {/* Main Applications Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">TP ID & Organization</th>
                <th className="px-4 py-3">District & Type</th>
                <th className="px-4 py-3">Current Stage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ratings / Grade</th>
                <th className="px-4 py-3 text-right">Available Evaluation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {filteredTPs.map((tp) => (
                <tr key={tp.tpId} className="hover:bg-slate-50 transition">
                  {/* TP ID & Org */}
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 text-xs">{tp.organizationName}</div>
                    <div className="font-mono text-[11px] text-[#0e5774] font-semibold">{tp.tpId}</div>
                    <div className="text-[10px] text-slate-400">Reg: {tp.registrationDate}</div>
                  </td>

                  {/* District & Type */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{tp.district}</div>
                    <span className="inline-block px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                      {tp.entityType}
                    </span>
                  </td>

                  {/* Current Stage */}
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-slate-700">
                      {tp.currentStage.replace(/_/g, ' ')}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        tp.overallStatus === 'Accredited Training Partner'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tp.overallStatus.includes('Clarification')
                          ? 'bg-amber-100 text-amber-800'
                          : tp.overallStatus.includes('De-Accredited') || tp.overallStatus === 'Suspended'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-cyan-100 text-[#0e5774]'
                      }`}
                    >
                      {tp.overallStatus}
                    </span>
                  </td>

                  {/* Ratings / Grade */}
                  <td className="px-4 py-3">
                    <div className="space-y-0.5 text-[11px]">
                      {tp.annexureA?.starRating && (
                        <div className="font-bold text-amber-700">{tp.annexureA.starRating}</div>
                      )}
                      {tp.annexureB_ERF && (
                        <div className="font-semibold text-slate-600">
                          Grade {tp.annexureB_ERF.grade} ({tp.annexureB_ERF.totalPercentage}%)
                        </div>
                      )}
                      {tp.penalties.length > 0 && (
                        <div className="text-rose-600 font-bold">{tp.penalties.length} Penalty Notice(s)</div>
                      )}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {/* Step 3: Scrutiny */}
                      <button
                        onClick={() => openActionModal(tp, 'SCRUTINY')}
                        title="Step 3: DSDP Scrutiny"
                        className="px-2.5 py-1 bg-cyan-50 hover:bg-[#0e5774] hover:text-white text-[#0e5774] rounded font-semibold text-[11px] border border-cyan-200 transition"
                      >
                        Scrutiny
                      </button>

                      {/* Step 4b: Desktop Assessment */}
                      <button
                        onClick={() => openActionModal(tp, 'DESKTOP')}
                        title="Step 4b: Desktop Audit"
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-700 hover:text-white text-slate-700 rounded font-semibold text-[11px] border border-slate-200 transition"
                      >
                        Desktop
                      </button>

                      {/* Step 5b: Physical Inspection */}
                      <button
                        onClick={() => openActionModal(tp, 'INSPECTION')}
                        title="Step 5b: Physical Centre Inspection"
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 rounded font-semibold text-[11px] border border-amber-200 transition"
                      >
                        Inspection
                      </button>

                      {/* Step 6: BAC Approval */}
                      <button
                        onClick={() => openActionModal(tp, 'BAC')}
                        title="Step 6: BAC Final Verification"
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-800 rounded font-semibold text-[11px] border border-indigo-200 transition"
                      >
                        BAC
                      </button>

                      {/* Step 7: ERF Monitoring */}
                      <button
                        onClick={() => openActionModal(tp, 'MONITORING')}
                        title="Step 7: Continuous Monitoring"
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-700 hover:text-white text-emerald-800 rounded font-semibold text-[11px] border border-emerald-200 transition"
                      >
                        Monitoring
                      </button>

                      {/* Step 9: Penalties */}
                      <button
                        onClick={() => openActionModal(tp, 'PENALTY')}
                        title="Step 9: Penalties & Compliance"
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-700 hover:text-white text-rose-800 rounded font-semibold text-[11px] border border-rose-200 transition"
                      >
                        Penalties
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACTION MODAL: STEP 3 - DSDP SCRUTINY */}
      {activeActionModal === 'SCRUTINY' && selectedTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#0e5774] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Step 3: District Skill Committee (DSC) DSDP Scrutiny</h3>
                <p className="text-xs text-cyan-100">{selectedTP.organizationName} ({selectedTP.district})</p>
              </div>
              <button
                onClick={() => setActiveActionModal(null)}
                className="text-white/80 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-800">Submitted Proposal Summary:</div>
                <p>• Courses: {selectedTP.dsdpProposal?.courses.map((c) => c.courseName).join(', ') || 'General Skilling'}</p>
                <p>• Placement Target: {selectedTP.dsdpProposal?.placementCommitmentPercentage || 70}%</p>
                <p>• Industry Partners: {selectedTP.dsdpProposal?.industryPartners.join(', ') || 'Local industries'}</p>
              </div>

              {/* Matrix Scoring */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase mb-2">DSDP Evaluation Scoring Matrix</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Feasibility (Max 25)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={scrutinyFeasibility}
                      onChange={(e) => setScrutinyFeasibility(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">District Alignment (Max 25)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={scrutinyAlignment}
                      onChange={(e) => setScrutinyAlignment(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Placement Credibility (Max 25)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={scrutinyPlacement}
                      onChange={(e) => setScrutinyPlacement(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Infrastructure Adequacy (Max 25)</label>
                    <input
                      type="number"
                      min={0}
                      max={25}
                      value={scrutinyInfra}
                      onChange={(e) => setScrutinyInfra(parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>
                <div className="mt-2 text-right font-bold text-[#0e5774]">
                  Total Scrutiny Score: {scrutinyFeasibility + scrutinyAlignment + scrutinyPlacement + scrutinyInfra} / 100
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scrutiny Remarks / Shortfalls Identified *
                </label>
                <textarea
                  rows={3}
                  value={scrutinyRemarks}
                  onChange={(e) => setScrutinyRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    scrutinizeDSDP(selectedTP.tpId, 'Clarification Requested', scrutinyRemarks, {
                      feasibility: scrutinyFeasibility,
                      districtAlignment: scrutinyAlignment,
                      placementCredibility: scrutinyPlacement,
                      infrastructureAdequacy: scrutinyInfra,
                      total: scrutinyFeasibility + scrutinyAlignment + scrutinyPlacement + scrutinyInfra,
                    });
                    alert('Shortfalls recorded. Clarification requested from TSP.');
                    setActiveActionModal(null);
                  }}
                  className="px-4 py-2 bg-amber-600 text-white rounded font-bold hover:bg-amber-700"
                >
                  Request Clarification
                </button>

                <button
                  onClick={() => {
                    scrutinizeDSDP(selectedTP.tpId, 'Rejected', scrutinyRemarks);
                    setActiveActionModal(null);
                  }}
                  className="px-4 py-2 bg-rose-600 text-white rounded font-bold hover:bg-rose-700"
                >
                  Reject Proposal
                </button>

                <button
                  onClick={() => {
                    scrutinizeDSDP(selectedTP.tpId, 'Approved', scrutinyRemarks, {
                      feasibility: scrutinyFeasibility,
                      districtAlignment: scrutinyAlignment,
                      placementCredibility: scrutinyPlacement,
                      infrastructureAdequacy: scrutinyInfra,
                      total: scrutinyFeasibility + scrutinyAlignment + scrutinyPlacement + scrutinyInfra,
                    });
                    alert('DSDP Proposal approved! TP advanced to Step 4 Desktop Assessment.');
                    setActiveActionModal(null);
                  }}
                  className="px-5 py-2 bg-[#0e5774] text-white rounded font-bold hover:bg-[#0a4258]"
                >
                  Approve Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL: STEP 4b - DESKTOP ASSESSMENT (ANNEXURE A PART A) */}
      {activeActionModal === 'DESKTOP' && selectedTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#0e5774] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Step 4b: Desktop Assessment (Annexure A Part A)</h3>
                <p className="text-xs text-cyan-100">{selectedTP.organizationName}</p>
              </div>
              <button onClick={() => setActiveActionModal(null)} className="text-white/80 font-bold">✕</button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
              <p className="text-slate-600">
                Verify mandatory documents and proof. All Part-A parameters must be compliant to award "Deemed Ready".
                Deemed Ready grant confers 3-year TP validity.
              </p>

              <div className="space-y-2">
                {[
                  { key: 'classroomAreaCapacity' as const, label: 'Classroom: Min 200 sqft per lab / 10 sqft per trainee' },
                  { key: 'skillLabPracticalArea' as const, label: 'Skill Lab: Min 200 sqft / Practical area approved' },
                  { key: 'placementCoordinatorAppointed' as const, label: 'Dedicated Placement Coordinator appointed (Proof verified)' },
                  { key: 'counsellorAppointed' as const, label: 'Dedicated Counsellor appointed (Proof verified)' },
                  { key: 'buildingConstruction' as const, label: 'Building Construction: Plastered walls, proper ventilation' },
                  { key: 'separateMaleFemaleWashrooms' as const, label: 'Separate Male / Female washroom facilities available' },
                  { key: 'cleanlinessAndHygiene' as const, label: 'Cleanliness & hygiene maintained with dedicated staff' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={desktopChecklist[item.key]}
                      onChange={(e) =>
                        setDesktopChecklist({
                          ...desktopChecklist,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#0e5774] rounded focus:ring-[#0e5774]"
                    />
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    evaluateDesktopAssessment(selectedTP.tpId, false, desktopChecklist);
                    alert('Status set to "Deemed Not Ready".');
                    setActiveActionModal(null);
                  }}
                  className="px-4 py-2 bg-rose-600 text-white rounded font-bold hover:bg-rose-700"
                >
                  Mark Deemed Not Ready
                </button>
                <button
                  onClick={() => {
                    evaluateDesktopAssessment(selectedTP.tpId, true, desktopChecklist);
                    alert('Accredited as "Deemed Ready"! Registration valid for 3 years.');
                    setActiveActionModal(null);
                  }}
                  className="px-5 py-2 bg-[#0e5774] text-white rounded font-bold hover:bg-[#0a4258]"
                >
                  Award "Deemed Ready" (3 Years Validity)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL: STEP 5b - PHYSICAL INSPECTION & ANNEXURE A SCORING */}
      {activeActionModal === 'INSPECTION' && selectedTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#0e5774] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Step 5b: Physical Centre Inspection & Scoring</h3>
                <p className="text-xs text-cyan-100">Annexure A Part-A & Part-B Star Rating Engine</p>
              </div>
              <button onClick={() => setActiveActionModal(null)} className="text-white/80 font-bold">✕</button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
              {/* Part B Scored points */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase mb-2">Part-B: Scored Indicators (Max 50 Pts)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Centre Area</label>
                    <select
                      value={physicalPartB.centreAreaPoints}
                      onChange={(e) =>
                        setPhysicalPartB({ ...physicalPartB, centreAreaPoints: parseInt(e.target.value) })
                      }
                      className="w-full p-2 border border-slate-300 rounded"
                    >
                      <option value={15}>3,000 sqft or more (15 pts)</option>
                      <option value={12}>2,000 to 2,999 sqft (12 pts)</option>
                      <option value={10}>1,500 to 1,999 sqft (10 pts)</option>
                      <option value={5}>1,200 to 1,499 sqft (5 pts)</option>
                      <option value={0}>Less than 1,200 sqft (0 pts)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Type of Building</label>
                    <select
                      value={physicalPartB.typeOfBuildingPoints}
                      onChange={(e) =>
                        setPhysicalPartB({ ...physicalPartB, typeOfBuildingPoints: parseInt(e.target.value) })
                      }
                      className="w-full p-2 border border-slate-300 rounded"
                    >
                      <option value={10}>Stand-alone building (10 pts)</option>
                      <option value={8}>Exclusive space within industry (8 pts)</option>
                      <option value={6}>Exclusively demarcated built-up space (6 pts)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Building Ownership</label>
                    <select
                      value={physicalPartB.ownershipPoints}
                      onChange={(e) =>
                        setPhysicalPartB({ ...physicalPartB, ownershipPoints: parseInt(e.target.value) })
                      }
                      className="w-full p-2 border border-slate-300 rounded"
                    >
                      <option value={5}>Owned building (5 pts)</option>
                      <option value={3}>Rented / Leased building (3 pts)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Proximity to Public Transport</label>
                    <select
                      value={physicalPartB.proximityToTransportPoints}
                      onChange={(e) =>
                        setPhysicalPartB({ ...physicalPartB, proximityToTransportPoints: parseInt(e.target.value) })
                      }
                      className="w-full p-2 border border-slate-300 rounded"
                    >
                      <option value={5}>Within 500 meters (5 pts)</option>
                      <option value={3}>500 meters to 1 km (3 pts)</option>
                      <option value={2}>1 to 3 kilometers (2 pts)</option>
                      <option value={0}>More than 3 km (0 pts)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Differently-Abled Friendly</label>
                    <select
                      value={physicalPartB.differentlyAbledFriendlyPoints}
                      onChange={(e) =>
                        setPhysicalPartB({ ...physicalPartB, differentlyAbledFriendlyPoints: parseInt(e.target.value) })
                      }
                      className="w-full p-2 border border-slate-300 rounded"
                    >
                      <option value={7}>Ramps, lifts & washrooms available (7 pts)</option>
                      <option value={5}>Any two facilities / ground floor (5 pts)</option>
                      <option value={3}>One facility for non-ground floor (3 pts)</option>
                      <option value={0}>Non-compliant (0 pts)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">CCTV Cameras Setup</label>
                    <select
                      value={physicalPartB.cctvCamerasPoints}
                      onChange={(e) =>
                        setPhysicalPartB({ ...physicalPartB, cctvCamerasPoints: parseInt(e.target.value) })
                      }
                      className="w-full p-2 border border-slate-300 rounded"
                    >
                      <option value={3}>CCTV with recording in all rooms (3 pts)</option>
                      <option value={2}>CCTV in classrooms and labs only (2 pts)</option>
                      <option value={1}>CCTV in 50% of rooms (1 pt)</option>
                      <option value={0}>Non-compliant (0 pts)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recommendation & DSC Sign */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inspection Recommendation *</label>
                  <select
                    value={inspectionRecommendation}
                    onChange={(e) =>
                      setInspectionRecommendation(
                        e.target.value as 'Accreditation' | 'Conditional Accreditation' | 'Rejected'
                      )
                    }
                    className="w-full p-2 border border-slate-300 rounded"
                  >
                    <option value="Accreditation">Accreditation</option>
                    <option value="Conditional Accreditation">Conditional Accreditation</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-xs font-semibold text-slate-700 mb-1">
                    Signatory Authority
                  </span>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 font-semibold text-xs">
                    <Shield className="w-4 h-4 text-[#0e5774]" />
                    <span>Admin</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    evaluatePhysicalInspection(
                      selectedTP.tpId,
                      physicalPartA,
                      physicalPartB,
                      inspectionRecommendation,
                      'Admin'
                    );
                    alert(`Inspection recorded! Recommended: ${inspectionRecommendation}. Advanced to BAC.`);
                    setActiveActionModal(null);
                  }}
                  className="px-5 py-2 bg-[#0e5774] text-white rounded font-bold hover:bg-[#0a4258]"
                >
                  Submit Inspection Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL: STEP 6 - BAC FINAL VERIFICATION */}
      {activeActionModal === 'BAC' && selectedTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#0e5774] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Step 6: Business Advisory Committee (BAC) Verification</h3>
                <p className="text-xs text-cyan-100">{selectedTP.organizationName}</p>
              </div>
              <button onClick={() => setActiveActionModal(null)} className="text-white/80 font-bold">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600">
                Evaluate industry relevance of courses, fee structures, and detailed equipment lists found
                during physical inspection. Final approval enables M&E fee collection (Rs. 5,000) and unlocks training operations.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">BAC Committee Remarks *</label>
                <textarea
                  rows={3}
                  value={bacRemarks}
                  onChange={(e) => setBacRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    evaluateBAC(selectedTP.tpId, false, bacRemarks);
                    setActiveActionModal(null);
                  }}
                  className="px-4 py-2 bg-rose-600 text-white rounded font-bold hover:bg-rose-700"
                >
                  Reject Accreditation
                </button>
                <button
                  onClick={() => {
                    evaluateBAC(selectedTP.tpId, true, bacRemarks);
                    alert('Awarded "Accredited Training Partner"! TC validity set for 1 year. M&E fees triggered.');
                    setActiveActionModal(null);
                  }}
                  className="px-5 py-2 bg-emerald-700 text-white rounded font-bold hover:bg-emerald-800"
                >
                  Award "Accredited Training Partner"
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL: STEP 7 - CONTINUOUS MONITORING ERF (ANNEXURE B) */}
      {activeActionModal === 'MONITORING' && selectedTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#0e5774] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Step 7: Annexure B Excellence-Risk Framework (ERF)</h3>
                <p className="text-xs text-cyan-100">{selectedTP.organizationName}</p>
              </div>
              <button onClick={() => setActiveActionModal(null)} className="text-white/80 font-bold">✕</button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
              <p className="text-slate-600">
                Score against the 8 macro parameters. If the grade is D for two consecutive reviews,
                accreditation automatically becomes conditional pending Appellate Authority review.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-0.5 font-semibold">Training & Practical (Max 30)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={erfTraining}
                    onChange={(e) => setErfTraining(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-0.5 font-semibold">Industry Engagement (Max 15)</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={erfIndustry}
                    onChange={(e) => setErfIndustry(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-0.5 font-semibold">Financials (Max 15)</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={erfFinancials}
                    onChange={(e) => setErfFinancials(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-0.5 font-semibold">Governance & Manpower (Max 10)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={erfGov}
                    onChange={(e) => setErfGov(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-0.5 font-semibold">Qualifications & NSQF (Max 10)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={erfQual}
                    onChange={(e) => setErfQual(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-0.5 font-semibold">Assessments (Max 10)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={erfAssessment}
                    onChange={(e) => setErfAssessment(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-0.5 font-semibold">Future Plan (Max 5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={erfFuture}
                    onChange={(e) => setErfFuture(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-0.5 font-semibold">Grievance & POSH (Max 5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={erfGrievance}
                    onChange={(e) => setErfGrievance(parseInt(e.target.value) || 0)}
                    className="w-full p-1.5 border rounded"
                  />
                </div>
              </div>

              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg flex justify-between font-bold text-sm">
                <span>Calculated Total: {erfTraining + erfIndustry + erfFinancials + erfGov + erfQual + erfAssessment + erfFuture + erfGrievance}%</span>
                <span>
                  Grade:{' '}
                  {erfTraining + erfIndustry + erfFinancials + erfGov + erfQual + erfAssessment + erfFuture + erfGrievance >= 85
                    ? 'A (Excellent)'
                    : erfTraining + erfIndustry + erfFinancials + erfGov + erfQual + erfAssessment + erfFuture + erfGrievance >= 70
                    ? 'B (Good)'
                    : erfTraining + erfIndustry + erfFinancials + erfGov + erfQual + erfAssessment + erfFuture + erfGrievance >= 60
                    ? 'C (Needs Improvement)'
                    : 'D (Poor Performance)'}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auditor Evaluation Notes *</label>
                <textarea
                  rows={2}
                  value={erfNotes}
                  onChange={(e) => setErfNotes(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => {
                    evaluateERF(
                      selectedTP.tpId,
                      {
                        financials: { score: erfFinancials, remarks: 'Verified' },
                        governanceAndManpower: { score: erfGov, remarks: 'Verified' },
                        qualifications: { score: erfQual, remarks: 'Verified' },
                        training: { score: erfTraining, remarks: 'Verified' },
                        assessment: { score: erfAssessment, remarks: 'Verified' },
                        industryEngagement: { score: erfIndustry, remarks: 'Verified' },
                        futurePlan: { score: erfFuture, remarks: 'Verified' },
                        grievanceAndPOSH: { score: erfGrievance, remarks: 'Verified' },
                      },
                      erfNotes
                    );
                    alert('ERF evaluation recorded! Performance grade updated.');
                    setActiveActionModal(null);
                  }}
                  className="px-5 py-2 bg-[#0e5774] text-white rounded font-bold hover:bg-[#0a4258]"
                >
                  Save ERF Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MODAL: STEP 9 - PENALTIES, SUSPENSION & APPEALS DESK */}
      {activeActionModal === 'PENALTY' && selectedTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-rose-800 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Step 9: Penalties, Enforcement & Appeals Desk</h3>
                <p className="text-xs text-rose-200">{selectedTP.organizationName}</p>
              </div>
              <button onClick={() => setActiveActionModal(null)} className="text-white/80 font-bold">✕</button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs">
              {/* Immediate Fraud Action */}
              <div className="p-4 bg-red-50 border border-red-300 rounded-xl space-y-2">
                <div className="font-bold text-red-900 flex items-center gap-1.5">
                  <Ban className="w-4 h-4 text-red-600" />
                  <span>Immediate Misrepresentation / Fraud Action</span>
                </div>
                <p className="text-slate-700 text-[11px]">
                  Triggers immediate cancellation of accreditation & registration, 100% fine (₹10,000), and a
                  strict 2-year bar from re-applying, with legal referral.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to enforce immediate FRAUD cancellation and a 2-year ban?')) {
                      triggerImmediateFraudCancellation(selectedTP.tpId, 'Misrepresentation of trainer ToT certificates & fake attendance');
                      alert('TP de-accredited and banned for 2 years.');
                      setActiveActionModal(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white font-bold rounded text-[11px] transition"
                >
                  Enforce Immediate Fraud Cancellation & 2-Year Ban
                </button>
              </div>

              {/* Resolve Existing Appeals */}
              {selectedTP.penalties.some((p) => p.status === 'Under Appeal') && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3">
                  <h4 className="font-bold text-amber-900">Pending Appeals Under Review</h4>
                  {selectedTP.penalties
                    .filter((p) => p.status === 'Under Appeal')
                    .map((p) => (
                      <div key={p.id} className="p-3 bg-white rounded border border-slate-200 space-y-2">
                        <div className="font-bold text-slate-800">{p.title}</div>
                        <p className="text-slate-600 text-[11px]">Justification: "{p.appeal?.justification}"</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              resolveAppeal(selectedTP.tpId, p.id, 'Revoked & Refunded', 'Evidence accepted. Fee refunded in full.');
                              alert('Appeal upheld! Penalty revoked and 10% fee refunded.');
                            }}
                            className="px-3 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
                          >
                            Uphold Appeal (Revoke Penalty & Refund Fee)
                          </button>
                          <button
                            onClick={() => {
                              resolveAppeal(selectedTP.tpId, p.id, 'Upheld', 'Grounds insufficient to waive statutory penalty.');
                              alert('Appeal rejected. Penalty upheld.');
                            }}
                            className="px-3 py-1 bg-rose-600 text-white rounded font-bold hover:bg-rose-700"
                          >
                            Reject Appeal (Enforce Penalty)
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Issue New Penalty */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-800 uppercase">Issue Statutory Penalty Notice</h4>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Violation Category</label>
                  <select
                    value={penaltyType}
                    onChange={(e) => setPenaltyType(e.target.value as any)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="MONITORING_FAILURE">Monitoring Failure (10% Fee Fine / 3 Violations = Suspension)</option>
                    <option value="LATE_RENEWAL">Late Renewal Surcharge (10% per month, capped at 50%)</option>
                    <option value="POOR_PERFORMANCE_D">Poor Performance (Consecutive D Grade)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Penalty Title</label>
                  <input
                    type="text"
                    value={penaltyTitle}
                    onChange={(e) => setPenaltyTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fine Amount (INR)</label>
                  <input
                    type="number"
                    value={penaltyAmount}
                    onChange={(e) => setPenaltyAmount(parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description / Violation Evidence</label>
                  <textarea
                    rows={2}
                    value={penaltyDesc}
                    onChange={(e) => setPenaltyDesc(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      issuePenalty(selectedTP.tpId, penaltyType, penaltyTitle, penaltyDesc, penaltyAmount);
                      alert('Penalty notice issued. 15-day appeal window activated for TSP.');
                      setActiveActionModal(null);
                    }}
                    className="px-5 py-2 bg-rose-700 text-white rounded font-bold hover:bg-rose-800"
                  >
                    Issue Formal Penalty Notice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
