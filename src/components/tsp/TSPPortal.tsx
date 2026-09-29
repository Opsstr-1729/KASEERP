import React, { useState } from 'react';
import { useKase } from '../../context/KaseContext';
import {
  Building2,
  FileText,
  CreditCard,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Plus,
  Trash2,
  ShieldCheck,
  Send,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { KeralaDistrict, ApplicationStage } from '../../types/kase';
import { OFFICIAL_FEES } from '../../data/mockData';

export const TSPPortal: React.FC = () => {
  const {
    currentTP,
    submitDSDPProposal,
    makePayment,
    schedulePhysicalInspection,
    submitAnnexureC,
    appealPenalty,
  } = useKase();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'dsdp' | 'payments' | 'inspection' | 'annexureC' | 'penalties'
  >('overview');

  // DSDP Proposal Form State
  const [targetDistrict, setTargetDistrict] = useState<KeralaDistrict>(
    currentTP?.district || 'Ernakulam'
  );
  const [courses, setCourses] = useState<
    Array<{
      courseName: string;
      sector: string;
      durationHours: number;
      proposedTrainees: number;
      feePerCandidate: number;
    }>
  >([
    {
      courseName: 'Industrial Automation Specialist',
      sector: 'Electronics & Hardware',
      durationHours: 400,
      proposedTrainees: 60,
      feePerCandidate: 15000,
    },
  ]);
  const [targetedSectors, setTargetedSectors] = useState('Electronics, IT-ITeS, Automation');
  const [intendedBeneficiaries, setIntendedBeneficiaries] = useState(
    'Unemployed Youth, ITI/Diploma holders, Women candidates'
  );
  const [infrastructureReadiness, setInfrastructureReadiness] = useState(
    'Dedicated 2,800 sqft skill lab equipped with PLC trainers, simulation PCs, and smart classroom.'
  );
  const [industryPartners, setIndustryPartners] = useState(
    'Cochin Tech Solutions, Southern Automation Ltd.'
  );
  const [placementCommitment, setPlacementCommitment] = useState(75);
  const [apprenticeshipPlan, setApprenticeshipPlan] = useState(
    '6 months on-the-job training with partner industries upon course completion.'
  );

  // Inspection Booking Form
  const [preferredInspectionDate, setPreferredInspectionDate] = useState('');

  // Annexure C Form State
  const [gapDeficiency, setGapDeficiency] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [resourcesRequired, setResourcesRequired] = useState('');
  const [timelineMonths, setTimelineMonths] = useState(3);
  const [responsiblePerson, setResponsiblePerson] = useState(
    currentTP?.authorizedRep.name || ''
  );
  const [monitoringMetrics, setMonitoringMetrics] = useState('');

  // Appeal Form State
  const [selectedPenaltyId, setSelectedPenaltyId] = useState<string | null>(null);
  const [appealJustification, setAppealJustification] = useState('');

  if (!currentTP) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 text-center bg-white rounded-2xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">No TSP Session Active</h2>
        <p className="text-xs text-slate-500 mt-1">Please log in to your Training Provider account.</p>
      </div>
    );
  }

  // Handle DSDP Submission
  const handleDSDPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (courses.length === 0) {
      alert('Please add at least one course.');
      return;
    }
    if (placementCommitment < 70) {
      alert('Placement commitment must be at least 70% as per KASE SSDM norms.');
      return;
    }

    submitDSDPProposal(currentTP.tpId, {
      district: targetDistrict,
      courses,
      targetedSectors: targetedSectors.split(',').map((s) => s.trim()),
      intendedBeneficiaries: intendedBeneficiaries.split(',').map((s) => s.trim()),
      infrastructureReadiness,
      industryPartners: industryPartners.split(',').map((s) => s.trim()),
      placementCommitmentPercentage: placementCommitment,
      apprenticeshipPlan,
    });

    alert('DSDP Proposal successfully submitted to District Skill Committee (DSC) for scrutiny!');
    setActiveTab('overview');
  };

  // Add Course Row
  const addCourseRow = () => {
    setCourses([
      ...courses,
      {
        courseName: 'New Skill Job Role',
        sector: 'Healthcare',
        durationHours: 350,
        proposedTrainees: 40,
        feePerCandidate: 12000,
      },
    ]);
  };

  const removeCourseRow = (idx: number) => {
    setCourses(courses.filter((_, i) => i !== idx));
  };

  // Handle Inspection Booking
  const handleScheduleInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredInspectionDate) {
      alert('Please select an inspection date.');
      return;
    }

    schedulePhysicalInspection(currentTP.tpId, preferredInspectionDate, [
      'Admin Inspection Team',
    ]);

    alert('Physical Inspection date submitted! Inspection team assigned.');
  };

  // Handle Annexure C Submit
  const handleAnnexureCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gapDeficiency || !correctiveAction || !monitoringMetrics) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const isGradeD = currentTP.annexureB_ERF?.grade === 'D';
    submitAnnexureC(currentTP.tpId, {
      type: isGradeD ? 'Risk Mitigation Plan (D Grades)' : 'Quality Improvement Plan (B/C Grades)',
      items: [
        {
          id: `ITEM-${Date.now()}`,
          identifiedGapOrRisk: gapDeficiency,
          rootCauseOrSeverity: rootCause || 'Identified during periodic continuous monitoring audit',
          correctiveOrMitigationAction: correctiveAction,
          resourcesRequired: resourcesRequired || 'Dedicated budget allocation & staff training',
          timelineMonths,
          responsiblePerson: responsiblePerson || currentTP.authorizedRep.name,
          monitoringMetrics,
        },
      ],
    });

    alert('Annexure C Plan submitted to KASE Quality Directorate!');
    setGapDeficiency('');
    setCorrectiveAction('');
    setMonitoringMetrics('');
  };

  // Handle Appeal Submit
  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPenaltyId || !appealJustification.trim()) {
      alert('Please provide justification for your appeal.');
      return;
    }

    appealPenalty(currentTP.tpId, selectedPenaltyId, appealJustification);
    alert('Appeal lodged with Accreditation Committee! 10% appeal fee recorded.');
    setSelectedPenaltyId(null);
    setAppealJustification('');
  };

  // Stage indicator calculation
  const stageOrder: ApplicationStage[] = [
    'STEP_1_REGISTRATION',
    'STEP_2_DSDP_SUBMISSION',
    'STEP_3_DSDP_SCRUTINY',
    'STEP_4_ACCREDITATION_DESKTOP',
    'STEP_5_PHYSICAL_INSPECTION',
    'STEP_6_BAC_VERIFICATION',
    'STEP_7_CONTINUOUS_MONITORING',
    'STEP_8_RENEWAL',
  ];

  const currentStageIndex = stageOrder.indexOf(currentTP.currentStage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Organization Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0e5774]/10 text-[#0e5774] border border-[#0e5774]/20">
              {currentTP.entityType}
            </span>
            <span className="text-xs text-slate-500">
              Registration No: <span className="font-mono text-slate-700">{currentTP.registrationNumber}</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-700">{currentTP.district} District</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {currentTP.organizationName}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
            <span>
              TP ID: <strong className="font-mono text-[#0e5774]">{currentTP.tpId}</strong>
            </span>
            <span>•</span>
            <span>
              Authorized Rep: <strong>{currentTP.authorizedRep.name} ({currentTP.authorizedRep.designation})</strong>
            </span>
            <span>•</span>
            <span>
              Registered On: <strong>{currentTP.registrationDate}</strong>
            </span>
            {currentTP.registrationValidUntil && (
              <>
                <span>•</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  Validity: Until {currentTP.registrationValidUntil}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Current Status Badge */}
        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">Accreditation Status</div>
          <div
            className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs border ${
              currentTP.overallStatus === 'Accredited Training Partner'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : currentTP.overallStatus.includes('Clarification')
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : currentTP.overallStatus.includes('De-Accredited') || currentTP.overallStatus === 'Suspended'
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-cyan-50 text-[#0e5774] border-cyan-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span>{currentTP.overallStatus}</span>
          </div>

          {currentTP.annexureA?.starRating && currentTP.annexureA.starRating !== 'Not Rated' && (
            <div className="mt-2 text-xs font-bold text-amber-600 flex items-center justify-end gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{currentTP.annexureA.starRating} Training Centre</span>
            </div>
          )}
        </div>
      </div>

      {/* 9-Step Progress Pipeline */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mb-2">
            <span>Registration Roadmap</span>
            <span>Current Stage: <strong className="text-[#0e5774]">{currentTP.currentStage.replace(/_/g, ' ')}</strong></span>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {[
              { id: 'STEP_1_REGISTRATION', label: '1. Register', desc: 'TP Profile' },
              { id: 'STEP_2_DSDP_SUBMISSION', label: '2. DSDP Plan', desc: 'Proposal' },
              { id: 'STEP_3_DSDP_SCRUTINY', label: '3. Scrutiny', desc: 'DSC Review' },
              { id: 'STEP_4_ACCREDITATION_DESKTOP', label: '4. Desktop', desc: 'Annexure A' },
              { id: 'STEP_5_PHYSICAL_INSPECTION', label: '5. Inspection', desc: 'Centre Audit' },
              { id: 'STEP_6_BAC_VERIFICATION', label: '6. BAC Final', desc: 'Approval' },
              { id: 'STEP_7_CONTINUOUS_MONITORING', label: '7. Monitoring', desc: 'ERF Audit' },
              { id: 'STEP_8_RENEWAL', label: '8. Renewal', desc: 'Validity' },
            ].map((step, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;
              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    isPast
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : isCurrent
                      ? 'bg-[#0e5774] border-[#0e5774] text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] font-bold truncate">{step.label}</div>
                  <div className="text-[9px] opacity-80 truncate">{step.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assigned SPOC Notification Card (Highlighted if clarification requested or shortfalls exist) */}
      {currentTP.assignedSPOC && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            currentTP.overallStatus === 'DSDP Clarification Requested'
              ? 'bg-amber-50/80 border-amber-300'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0e5774] text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900">
                  District Admin Desk ({currentTP.district})
                </span>
                <span className="text-[10px] bg-[#0e5774]/10 text-[#0e5774] font-semibold px-2 py-0.5 rounded">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Official contact for guidance & shortfall clarification in {currentTP.district}.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-700 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#0e5774]" /> {currentTP.assignedSPOC.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#0e5774]" /> {currentTP.assignedSPOC.email}
                </span>
              </div>
            </div>
          </div>

          <a
            href={`tel:${currentTP.assignedSPOC.phone}`}
            className="px-3.5 py-1.5 rounded-lg bg-[#0e5774] hover:bg-[#0a4258] text-white font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact Admin</span>
          </a>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#0e5774] text-[#0e5774]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Overview & Audit Status
        </button>
        <button
          onClick={() => setActiveTab('dsdp')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'dsdp'
              ? 'border-[#0e5774] text-[#0e5774]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Step 2: DSDP Proposal</span>
          {currentTP.dsdpProposal && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'border-[#0e5774] text-[#0e5774]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fees & e-Receipts</span>
        </button>
        <button
          onClick={() => setActiveTab('inspection')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'inspection'
              ? 'border-[#0e5774] text-[#0e5774]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Step 5a: Physical Inspection</span>
        </button>
        <button
          onClick={() => setActiveTab('annexureC')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'annexureC'
              ? 'border-[#0e5774] text-[#0e5774]'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Annexure C (Quality & Risk Plans)</span>
        </button>
        <button
          onClick={() => setActiveTab('penalties')}
          className={`py-3 px-4 border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'penalties'
              ? 'border-rose-600 text-rose-700'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Penalties & Appeals ({currentTP.penalties.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Current Status & Feedback */}
            <div className="lg:col-span-8 space-y-6">
              {/* Clarification Alert */}
              {currentTP.overallStatus === 'DSDP Clarification Requested' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>District Skill Committee (DSC) Clarification Required</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Remarks: "{currentTP.dsdpProposal?.scrutinyRemarks}"
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Please contact your designated SPOC ({currentTP.assignedSPOC?.name}) or revise your DSDP proposal in Tab 2.
                  </p>
                </div>
              )}

              {/* Annexure A Inspection Results */}
              {currentTP.annexureA && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Annexure A: Accreditation Inspection Results
                      </h3>
                      <p className="text-xs text-slate-500">Evaluated by {currentTP.annexureA.evaluatedBy}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                      {currentTP.annexureA.starRating} ({currentTP.annexureA.calculatedScorePercentage}%)
                    </span>
                  </div>

                  {/* Part A Status */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase">Part-A: Mandatory Standards</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { label: 'Classroom Area (200 sqft)', val: currentTP.annexureA.partA.classroomAreaCapacity },
                        { label: 'Skill Lab (200 sqft)', val: currentTP.annexureA.partA.skillLabPracticalArea },
                        { label: 'Placement Coordinator', val: currentTP.annexureA.partA.placementCoordinatorAppointed },
                        { label: 'Dedicated Counsellor', val: currentTP.annexureA.partA.counsellorAppointed },
                        { label: 'Safe Construction', val: currentTP.annexureA.partA.buildingConstruction },
                        { label: 'Separate M/F Washrooms', val: currentTP.annexureA.partA.separateMaleFemaleWashrooms },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg border flex items-center justify-between text-[11px] ${
                            item.val ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}
                        >
                          <span>{item.label}</span>
                          <span className="font-bold">{item.val ? 'Yes' : 'No'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Countersigned */}
                  {currentTP.annexureA.dscCountersigned && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center justify-between">
                      <span>Admin Verification:</span>
                      <span className="font-bold text-slate-900">{currentTP.annexureA.dscSignatoryName || 'Admin'}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Continuous Monitoring ERF Grade (Annexure B) */}
              {currentTP.annexureB_ERF && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Annexure B: Excellence - Risk Framework Performance
                      </h3>
                      <p className="text-xs text-slate-500">
                        Audit Date: {currentTP.annexureB_ERF.evaluationDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-base font-extrabold px-3 py-1 rounded-xl ${
                          currentTP.annexureB_ERF.grade === 'A'
                            ? 'bg-emerald-100 text-emerald-800'
                            : currentTP.annexureB_ERF.grade === 'B'
                            ? 'bg-blue-100 text-blue-800'
                            : currentTP.annexureB_ERF.grade === 'C'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Grade {currentTP.annexureB_ERF.grade} ({currentTP.annexureB_ERF.totalPercentage}%)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    "{currentTP.annexureB_ERF.evaluatorNotes}"
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400">Training (30%)</div>
                      <div className="font-bold text-slate-800">{currentTP.annexureB_ERF.training.score} / 30</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400">Industry (15%)</div>
                      <div className="font-bold text-slate-800">{currentTP.annexureB_ERF.industryEngagement.score} / 15</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400">Financials (15%)</div>
                      <div className="font-bold text-slate-800">{currentTP.annexureB_ERF.financials.score} / 15</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400">Governance (10%)</div>
                      <div className="font-bold text-slate-800">{currentTP.annexureB_ERF.governanceAndManpower.score} / 10</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Centre info & Action quick links */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Associated Training Centres
                </h4>
                {currentTP.trainingCentres.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No centres attached yet. Submit DSDP proposal to register training centre.
                  </p>
                ) : (
                  currentTP.trainingCentres.map((tc) => (
                    <div key={tc.tcId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="font-bold text-slate-800 text-xs">{tc.centreName}</div>
                      <div className="text-[11px] text-slate-500 flex justify-between">
                        <span>TC ID: {tc.tcId}</span>
                        <span className="font-semibold text-[#0e5774]">{tc.district}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Total Area: {tc.totalAreaSqFt} sq. ft.
                      </div>
                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-amber-700 font-bold">{tc.starRating || 'Unrated'}</span>
                        <span className="text-slate-500">{tc.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-[#0e5774] text-white p-5 rounded-2xl shadow-sm space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-200">
                  Next Step Actions
                </h4>
                {currentTP.currentStage === 'STEP_1_REGISTRATION' || currentTP.currentStage === 'STEP_2_DSDP_SUBMISSION' ? (
                  <button
                    onClick={() => setActiveTab('dsdp')}
                    className="w-full py-2 bg-amber-400 text-slate-900 font-bold rounded-lg text-xs hover:bg-amber-300 transition"
                  >
                    Submit DSDP Proposal (Step 2)
                  </button>
                ) : currentTP.overallStatus === 'Deemed Ready' ? (
                  <button
                    onClick={() => setActiveTab('inspection')}
                    className="w-full py-2 bg-emerald-400 text-slate-900 font-bold rounded-lg text-xs hover:bg-emerald-300 transition"
                  >
                    Schedule Physical Inspection (Step 5a)
                  </button>
                ) : (
                  <p className="text-xs text-cyan-100">
                    Your application is being actively processed by KASE & DSC officials.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DSDP PROPOSAL TAB */}
        {activeTab === 'dsdp' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Step 2: District Skill Development Plan (DSDP) Proposal Submission
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The proposal must include course design, targeted sectors, intended beneficiaries,
                infrastructure readiness, and scope for industry alignment with minimum 70% placement target.
              </p>
            </div>

            {currentTP.dsdpProposal ? (
              <div className="space-y-4">
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0e5774]">Active DSDP Proposal:</span>
                    <span className="text-xs font-mono ml-2 font-bold">{currentTP.dsdpProposal.proposalId}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Submitted on {currentTP.dsdpProposal.submissionDate} • District: {currentTP.dsdpProposal.district}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-white text-[#0e5774] font-bold text-xs rounded-lg border border-cyan-300">
                    {currentTP.overallStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">Targeted Sectors & Beneficiaries</h4>
                    <p className="text-slate-600 mb-1">
                      <strong>Sectors:</strong> {currentTP.dsdpProposal.targetedSectors.join(', ')}
                    </p>
                    <p className="text-slate-600">
                      <strong>Beneficiaries:</strong> {currentTP.dsdpProposal.intendedBeneficiaries.join(', ')}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">Industry Tie-ups & Placements</h4>
                    <p className="text-slate-600 mb-1">
                      <strong>Partners:</strong> {currentTP.dsdpProposal.industryPartners.join(', ')}
                    </p>
                    <p className="text-slate-600">
                      <strong>Placement Target:</strong> {currentTP.dsdpProposal.placementCommitmentPercentage}%
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-800 mb-2">Proposed Job Roles & Courses</h4>
                  <div className="space-y-2">
                    {currentTP.dsdpProposal.courses.map((c, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded border border-slate-200">
                        <div>
                          <span className="font-bold text-slate-900">{c.courseName}</span>
                          <span className="text-[11px] text-slate-500 ml-2">({c.sector})</span>
                        </div>
                        <span className="font-mono font-semibold text-slate-700">
                          {c.durationHours} hrs • {c.proposedTrainees} Trainees • ₹{c.feePerCandidate.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {currentTP.overallStatus === 'DSDP Clarification Requested' && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        // Allow resubmission
                        alert('You can edit the form below and re-submit your updated proposal to the DSC.');
                      }}
                      className="px-4 py-2 bg-[#0e5774] text-white rounded-lg text-xs font-bold hover:bg-[#0a4258] transition"
                    >
                      Revise & Resubmit Proposal
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Form */}
            {(!currentTP.dsdpProposal || currentTP.overallStatus === 'DSDP Clarification Requested') && (
              <form onSubmit={handleDSDPSubmit} className="space-y-5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target District in Kerala *</label>
                  <select
                    value={targetDistrict}
                    onChange={(e) => setTargetDistrict(e.target.value as KeralaDistrict)}
                    className="w-full sm:w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
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
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Design */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-bold text-slate-800 uppercase tracking-wider">
                      Course Design & Job Roles *
                    </label>
                    <button
                      type="button"
                      onClick={addCourseRow}
                      className="flex items-center gap-1 text-[#0e5774] hover:underline font-bold text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Course</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {courses.map((course, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-5 gap-3 items-center"
                      >
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-500 mb-0.5">Course Name</label>
                          <input
                            type="text"
                            required
                            value={course.courseName}
                            onChange={(e) => {
                              const updated = [...courses];
                              updated[idx].courseName = e.target.value;
                              setCourses(updated);
                            }}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-500 mb-0.5">Sector</label>
                          <input
                            type="text"
                            required
                            value={course.sector}
                            onChange={(e) => {
                              const updated = [...courses];
                              updated[idx].sector = e.target.value;
                              setCourses(updated);
                            }}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-500 mb-0.5">Duration (Hours)</label>
                          <input
                            type="number"
                            required
                            min={50}
                            value={course.durationHours}
                            onChange={(e) => {
                              const updated = [...courses];
                              updated[idx].durationHours = parseInt(e.target.value) || 0;
                              setCourses(updated);
                            }}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-[11px] text-slate-500 mb-0.5">Trainees</label>
                            <input
                              type="number"
                              required
                              value={course.proposedTrainees}
                              onChange={(e) => {
                                const updated = [...courses];
                                updated[idx].proposedTrainees = parseInt(e.target.value) || 0;
                                setCourses(updated);
                              }}
                              className="w-full px-2 py-1.5 border border-slate-300 rounded bg-white"
                            />
                          </div>
                          {courses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCourseRow(idx)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded mt-3.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Targeted Sectors *</label>
                    <input
                      type="text"
                      required
                      value={targetedSectors}
                      onChange={(e) => setTargetedSectors(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Intended Beneficiaries *</label>
                    <input
                      type="text"
                      required
                      value={intendedBeneficiaries}
                      onChange={(e) => setIntendedBeneficiaries(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Infrastructure Readiness *</label>
                    <textarea
                      rows={2}
                      required
                      value={infrastructureReadiness}
                      onChange={(e) => setInfrastructureReadiness(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Industry Tie-up Partners (Min 2 required) *
                    </label>
                    <input
                      type="text"
                      required
                      value={industryPartners}
                      onChange={(e) => setIndustryPartners(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Placement Commitment Percentage (Min 70%) *
                    </label>
                    <input
                      type="number"
                      required
                      min={70}
                      max={100}
                      value={placementCommitment}
                      onChange={(e) => setPlacementCommitment(parseInt(e.target.value) || 70)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Apprenticeship & OJT Strategy</label>
                    <textarea
                      rows={2}
                      value={apprenticeshipPlan}
                      onChange={(e) => setApprenticeshipPlan(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0e5774] hover:bg-[#0a4258] text-white rounded-lg font-bold shadow-md transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit DSDP Proposal for Scrutiny</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* FEES & PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Applicable Fee Payments</h3>
                  <p className="text-xs text-slate-500">Pay required fees via simulated KASE e-Treasury gateway</p>
                </div>
              </div>

              {/* Action payment buttons depending on state */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Desktop trigger fee */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-800">Step 4a: Accreditation Application Fee</div>
                  <p className="text-slate-500 text-[11px]">
                    Pay applicable fees to trigger the Inspection Agency (IA) Desktop Assessment.
                  </p>
                  <button
                    onClick={() => {
                      makePayment(currentTP.tpId, 'TC_ACCREDITATION_FEE', OFFICIAL_FEES.TC_ACCREDITATION, 'e-Treasury NetBanking');
                      alert('Payment recorded! Desktop Assessment triggered.');
                    }}
                    className="w-full py-2 bg-[#0e5774] text-white font-bold rounded-lg hover:bg-[#0a4258] transition"
                  >
                    Pay TC Accreditation (₹10,000)
                  </button>
                </div>

                {/* Course Affiliation */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-800">Step 5a: Course Affiliation Fee</div>
                  <p className="text-slate-500 text-[11px]">
                    Pay ₹10,000 per course following Deemed Ready status to unlock physical inspection.
                  </p>
                  <button
                    onClick={() => {
                      makePayment(currentTP.tpId, 'COURSE_AFFILIATION_FEE', OFFICIAL_FEES.COURSE_AFFILIATION_PER_COURSE, 'SBI NetBanking');
                      alert('Course affiliation fee paid!');
                    }}
                    className="w-full py-2 bg-[#0e5774] text-white font-bold rounded-lg hover:bg-[#0a4258] transition"
                  >
                    Pay Course Affiliation (₹10,000)
                  </button>
                </div>

                {/* M&E Fee */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-800">Step 6: Monitoring & Evaluation Fee</div>
                  <p className="text-slate-500 text-[11px]">
                    Triggered after BAC approval to commence training operations under SSDM.
                  </p>
                  <button
                    onClick={() => {
                      makePayment(currentTP.tpId, 'MONITORING_EVALUATION_FEE', OFFICIAL_FEES.MONITORING_EVALUATION, 'UPI / BharatQR');
                      alert('M&E fee paid! TC authorized to commence operations.');
                    }}
                    className="w-full py-2 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition"
                  >
                    Pay M&E Fee (₹5,000)
                  </button>
                </div>
              </div>

              {/* Payment History Receipts */}
              <div className="pt-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                  Verified Payment Receipts
                </h4>
                <div className="overflow-hidden border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2.5">Receipt No</th>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Purpose</th>
                        <th className="px-4 py-2.5">Method / Ref</th>
                        <th className="px-4 py-2.5 text-right">Amount</th>
                        <th className="px-4 py-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      {currentTP.payments.map((p) => (
                        <tr key={p.receiptNo} className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-slate-900">{p.receiptNo}</td>
                          <td className="px-4 py-2">{p.date}</td>
                          <td className="px-4 py-2 font-semibold text-slate-800">{p.purpose.replace(/_/g, ' ')}</td>
                          <td className="px-4 py-2 text-[11px] text-slate-500">{p.paymentMethod} • {p.transactionRef}</td>
                          <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">
                            ₹{p.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5a: PHYSICAL INSPECTION BOOKING TAB */}
        {activeTab === 'inspection' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Step 5a: Schedule Physical Centre Inspection
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Once marked "Deemed Ready" and fees are paid, schedule physical inspection for Annexure A verification.
              </p>
            </div>

            {currentTP.inspectionScheduledDate ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Physical Inspection Date Confirmed</span>
                </div>
                <p className="text-slate-700">
                  Scheduled Inspection Date: <strong>{currentTP.inspectionScheduledDate}</strong>
                </p>
                <p className="text-slate-600">
                  Inspection Team: {currentTP.inspectionTeamMembers?.join(', ') || 'IA Panel & DSC Field Officer'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleScheduleInspection} className="max-w-lg space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Preferred Physical Inspection Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredInspectionDate}
                    onChange={(e) => setPreferredInspectionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Pre-inspection Checklist:</div>
                  <p>• Ensure minimum 200 sqft per lab and 10 sqft per trainee</p>
                  <p>• Keep appointment letters for Placement Coordinator & Counsellor ready</p>
                  <p>• Verify 50 Mbps broadband connection & CCTV recording status</p>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0e5774] text-white rounded-lg font-bold hover:bg-[#0a4258] transition"
                >
                  Confirm Inspection Booking
                </button>
              </form>
            )}
          </div>
        )}

        {/* ANNEXURE C TAB */}
        {activeTab === 'annexureC' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Annexure C: Quality Improvement & Risk Mitigation Plan
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Required within 30 days of evaluation if continuous monitoring grade is B/C (Quality Improvement)
                or D (Risk Mitigation).
              </p>
            </div>

            {/* Existing Submissions */}
            {currentTP.annexureC_Plans.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">Submitted Plans</h4>
                {currentTP.annexureC_Plans.map((plan) => (
                  <div key={plan.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{plan.type}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0e5774]/10 text-[#0e5774]">
                        {plan.status}
                      </span>
                    </div>
                    {plan.items.map((item) => (
                      <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                        <div className="font-semibold text-slate-800">{item.identifiedGapOrRisk}</div>
                        <div className="text-slate-600 text-[11px]">Corrective Action: {item.correctiveOrMitigationAction}</div>
                        <div className="text-slate-500 text-[10px]">Timeline: {item.timelineMonths} months • Target: {item.monitoringMetrics}</div>
                      </div>
                    ))}
                    {plan.adminFeedback && (
                      <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px]">
                        <strong>Admin Feedback:</strong> {plan.adminFeedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleAnnexureCSubmit} className="space-y-4 text-xs pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0e5774]">
                Submit New Quality Improvement / Risk Mitigation Plan
              </h4>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Identified Gap / Deficiency in Standards *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Placement rate short of 70% target, or inadequate lab space"
                  value={gapDeficiency}
                  onChange={(e) => setGapDeficiency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Root Cause Analysis</label>
                  <input
                    type="text"
                    placeholder="Underlying reason for the deficiency"
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corrective Action Planned *</label>
                  <input
                    type="text"
                    required
                    placeholder="Specific measures to address the gap"
                    value={correctiveAction}
                    onChange={(e) => setCorrectiveAction(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resources / Budget Required</label>
                  <input
                    type="text"
                    placeholder="Budget, personnel or tech needs"
                    value={resourcesRequired}
                    onChange={(e) => setResourcesRequired(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Timeline (Months)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={timelineMonths}
                    onChange={(e) => setTimelineMonths(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Measurable Monitoring Metric *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 75% placement within 90 days"
                    value={monitoringMetrics}
                    onChange={(e) => setMonitoringMetrics(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0e5774]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0e5774] text-white rounded-lg font-bold hover:bg-[#0a4258] transition"
              >
                Submit Annexure C Plan
              </button>
            </form>
          </div>
        )}

        {/* PENALTIES & APPEALS TAB */}
        {activeTab === 'penalties' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Step 9: Penalties & Compliance Desk</h3>
                <p className="text-xs text-slate-500">
                  Late renewal penalties, monitoring failure notices, performance warnings, and 15-day appeals.
                </p>
              </div>
            </div>

            {currentTP.penalties.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-xs">No active penalties or violations recorded.</p>
                <p className="text-[11px] text-slate-400">Your organization is fully compliant with KASE norms.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentTP.penalties.map((penalty) => (
                  <div
                    key={penalty.id}
                    className={`p-4 rounded-xl border space-y-2 text-xs ${
                      penalty.status === 'Active'
                        ? 'bg-rose-50/70 border-rose-200'
                        : penalty.status === 'Under Appeal'
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-slate-500">{penalty.id}</span>
                        <h4 className="font-bold text-slate-900 text-xs mt-0.5">{penalty.title}</h4>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          penalty.status === 'Active'
                            ? 'bg-rose-100 text-rose-800'
                            : penalty.status === 'Under Appeal'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {penalty.status}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed text-[11px]">{penalty.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                      <div className="text-[11px] text-slate-600">
                        Fine Amount: <strong className="font-mono text-slate-900">₹{penalty.fineAmount.toLocaleString('en-IN')}</strong> • Appeal Deadline: <strong className="text-rose-700">{penalty.appealDeadline}</strong>
                      </div>

                      {penalty.status === 'Active' && (
                        <button
                          onClick={() => setSelectedPenaltyId(penalty.id)}
                          className="px-3 py-1 bg-amber-600 text-white rounded text-[11px] font-bold hover:bg-amber-700 transition"
                        >
                          File Appeal (10% Fee)
                        </button>
                      )}
                    </div>

                    {/* Existing Appeal details */}
                    {penalty.appeal && (
                      <div className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] space-y-1 mt-2">
                        <div className="font-bold text-[#0e5774] flex justify-between">
                          <span>Appeal Status: {penalty.appeal.status}</span>
                          <span>Fee Paid: ₹{penalty.appeal.appealFeePaid}</span>
                        </div>
                        <p className="text-slate-600 italic">Justification: "{penalty.appeal.justification}"</p>
                        {penalty.appeal.committeeRemarks && (
                          <p className="text-emerald-700 font-semibold">Committee Decision: {penalty.appeal.committeeRemarks}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Appeal Form Modal / Expandable */}
            {selectedPenaltyId && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-3 text-xs">
                <div className="font-bold text-amber-900">
                  Lodge Penalty Appeal to Accreditation Committee
                </div>
                <p className="text-slate-600 text-[11px]">
                  As per Chapter 6 guidelines, appeals must be submitted within 15 days along with a 10% appeal fee (₹1,000). The fee is fully refundable if your appeal is upheld.
                </p>
                <form onSubmit={handleAppealSubmit} className="space-y-3">
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide grounds for appeal, supporting evidence, or force majeure explanations..."
                    value={appealJustification}
                    onChange={(e) => setAppealJustification(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPenaltyId(null)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#0e5774] text-white rounded text-xs font-bold hover:bg-[#0a4258]"
                    >
                      Submit Appeal & Pay ₹1,000 Fee
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
