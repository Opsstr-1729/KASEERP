import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  TrainingPartner,
  AdminRole,
  KeralaDistrict,
  DSDPProposal,
  AnnexureAChecklist,
  AnnexureB_ERF,
  AnnexureC_Plan,
  PenaltyRecord,
  PaymentReceipt,
  StarRating,
  PerformanceGrade,
  TrainingCentre,
  OverallStatus,
  ApplicationStage,
} from '../types/kase';
import { INITIAL_TRAINING_PARTNERS, DISTRICT_SPOCS, OFFICIAL_FEES } from '../data/mockData';

export type UserSession =
  | { type: 'TSP'; tpId: string }
  | { type: 'ADMIN'; role: AdminRole; name: string; district?: KeralaDistrict }
  | null;

interface KaseContextType {
  userSession: UserSession;
  trainingPartners: TrainingPartner[];
  currentTP: TrainingPartner | null;
  activeRole: AdminRole;
  setActiveRole: (role: AdminRole) => void;
  selectedDistrictFilter: KeralaDistrict | 'ALL';
  setSelectedDistrictFilter: (dist: KeralaDistrict | 'ALL') => void;
  
  // Auth
  loginAsTSP: (username: string, password: string) => { success: boolean; message?: string; tp?: TrainingPartner };
  loginAsAdmin: (role: AdminRole, name: string, district?: KeralaDistrict) => void;
  quickLoginTSP: (tpId: string) => void;
  logout: () => void;

  // Step 1: TP Registration
  registerTP: (data: {
    organizationName: string;
    entityType: TrainingPartner['entityType'];
    registrationNumber: string;
    incorporationDate: string;
    panNumber: string;
    gstin: string;
    headOfficeAddress: string;
    district: KeralaDistrict;
    website: string;
    authorizedRep: TrainingPartner['authorizedRep'];
    primaryContact: TrainingPartner['primaryContact'];
  }) => { success: boolean; credentials: { username: string; passwordHash: string; tpId: string } };

  // Step 2: DSDP Proposal Submission
  submitDSDPProposal: (
    tpId: string,
    proposal: Omit<DSDPProposal, 'proposalId' | 'submissionDate'>
  ) => void;

  // Step 3: Scrutiny and Inclusion in DSDP
  scrutinizeDSDP: (
    tpId: string,
    decision: 'Approved' | 'Rejected' | 'Clarification Requested',
    remarks: string,
    scores?: DSDPProposal['scrutinyScore']
  ) => void;

  // Step 4a, 5a, 6 Payments
  makePayment: (
    tpId: string,
    purpose: PaymentReceipt['purpose'],
    amount: number,
    paymentMethod: string
  ) => PaymentReceipt;

  // Step 4b: Desktop Assessment
  evaluateDesktopAssessment: (
    tpId: string,
    isDeemedReady: boolean,
    partA: AnnexureAChecklist['partA'],
    remarks?: string
  ) => void;

  // Step 5a: Schedule Physical Inspection
  schedulePhysicalInspection: (
    tpId: string,
    date: string,
    teamMembers: string[]
  ) => void;

  // Step 5b: Physical Centre Inspection
  evaluatePhysicalInspection: (
    tpId: string,
    partA: AnnexureAChecklist['partA'],
    partB: AnnexureAChecklist['partB'],
    recommendation: 'Accreditation' | 'Conditional Accreditation' | 'Rejected',
    dscSignatory: string
  ) => void;

  // Step 6: Final Verification (BAC)
  evaluateBAC: (
    tpId: string,
    approved: boolean,
    remarks: string
  ) => void;

  // Step 7: Continuous Monitoring (ERF Annexure B)
  evaluateERF: (
    tpId: string,
    scores: {
      financials: { score: number; remarks: string };
      governanceAndManpower: { score: number; remarks: string };
      qualifications: { score: number; remarks: string };
      training: { score: number; remarks: string };
      assessment: { score: number; remarks: string };
      industryEngagement: { score: number; remarks: string };
      futurePlan: { score: number; remarks: string };
      grievanceAndPOSH: { score: number; remarks: string };
    },
    evaluatorNotes: string
  ) => void;

  // Annexure C
  submitAnnexureC: (
    tpId: string,
    plan: Omit<AnnexureC_Plan, 'id' | 'submissionDate' | 'status'>
  ) => void;
  reviewAnnexureC: (
    tpId: string,
    planId: string,
    status: AnnexureC_Plan['status'],
    feedback: string
  ) => void;

  // Step 8 & 9: Penalty & Compliance Logic
  issuePenalty: (
    tpId: string,
    type: PenaltyRecord['type'],
    title: string,
    description: string,
    fineAmount: number
  ) => void;
  appealPenalty: (
    tpId: string,
    penaltyId: string,
    justification: string
  ) => void;
  resolveAppeal: (
    tpId: string,
    penaltyId: string,
    decision: 'Upheld' | 'Revoked & Refunded',
    committeeRemarks: string
  ) => void;
  triggerImmediateFraudCancellation: (tpId: string, reason: string) => void;
  applyRenewalWithLatePenalty: (
    tpId: string,
    tcId: string,
    monthsOverdue: number
  ) => { penaltyAmount: number; totalDue: number; isDeaccredited: boolean };

  // Utilities
  resetToDemoData: () => void;
}

const STORAGE_KEY = 'kase_accreditation_data_v3';
const SESSION_KEY = 'kase_user_session_v3';

const KaseContext = createContext<KaseContextType | undefined>(undefined);

export const KaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainingPartners, setTrainingPartners] = useState<TrainingPartner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading KASE state from storage', e);
    }
    return INITIAL_TRAINING_PARTNERS;
  });

  const [userSession, setUserSession] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading session', e);
    }
    return null;
  });

  const [activeRole, setActiveRole] = useState<AdminRole>('KASE_ADMIN');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<KeralaDistrict | 'ALL'>('ALL');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trainingPartners));
    } catch (e) {
      console.error('Error persisting KASE data', e);
    }
  }, [trainingPartners]);

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
    } catch (e) {
      console.error('Error persisting session', e);
    }
  }, [userSession]);

  const currentTP = userSession?.type === 'TSP'
    ? trainingPartners.find((tp) => tp.tpId === userSession.tpId) || null
    : null;

  // Auth Handlers
  const loginAsTSP = (username: string, password: string) => {
    const trimmedUser = username.trim().toLowerCase();
    const tp = trainingPartners.find(
      (p) =>
        (p.loginUsername.toLowerCase() === trimmedUser || p.tpId.toLowerCase() === trimmedUser) &&
        (p.loginPasswordHash === password || password === 'kase123')
    );

    if (tp) {
      const session: UserSession = { type: 'TSP', tpId: tp.tpId };
      setUserSession(session);
      return { success: true, tp };
    }
    return { success: false, message: 'Invalid TP ID/Username or Password. (Hint: Try demo credentials or use kase123)' };
  };

  const loginAsAdmin = (role: AdminRole = 'KASE_ADMIN', name: string = 'Admin', district?: KeralaDistrict) => {
    const session: UserSession = { type: 'ADMIN', role, name: 'Admin', district };
    setUserSession(session);
    setActiveRole(role);
    if (district) setSelectedDistrictFilter(district);
  };

  const quickLoginTSP = (tpId: string) => {
    const session: UserSession = { type: 'TSP', tpId };
    setUserSession(session);
  };

  const logout = () => {
    setUserSession(null);
  };

  // Step 1: TP Registration
  const registerTP = (data: {
    organizationName: string;
    entityType: TrainingPartner['entityType'];
    registrationNumber: string;
    incorporationDate: string;
    panNumber: string;
    gstin: string;
    headOfficeAddress: string;
    district: KeralaDistrict;
    website: string;
    authorizedRep: TrainingPartner['authorizedRep'];
    primaryContact: TrainingPartner['primaryContact'];
  }) => {
    const count = trainingPartners.length + 1;
    const year = new Date().getFullYear();
    const tpId = `KASE-TP-${year}-${String(count).padStart(3, '0')}`;
    const cleanName = data.organizationName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
    const username = `${cleanName}_tp`;
    const passwordHash = `kase${Math.floor(100 + Math.random() * 900)}`;

    const newTP: TrainingPartner = {
      ...data,
      tpId,
      loginUsername: username,
      loginPasswordHash: passwordHash,
      registrationDate: new Date().toISOString().split('T')[0],
      currentStage: 'STEP_1_REGISTRATION',
      overallStatus: 'Draft',
      assignedSPOC: DISTRICT_SPOCS[data.district],
      trainingCentres: [],
      annexureC_Plans: [],
      payments: [
        {
          receiptNo: `RCP-${year}-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          purpose: 'TP_REGISTRATION_FEE',
          amount: OFFICIAL_FEES.TP_REGISTRATION,
          paymentMethod: 'KASE Portal e-Gateway',
          transactionRef: `ETR-${data.district.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
          status: 'Completed',
        },
      ],
      penalties: [],
      consecutiveDGrades: 0,
      monitoringDeficiencyCount: 0,
    };

    setTrainingPartners((prev) => [newTP, ...prev]);
    return {
      success: true,
      credentials: { username, passwordHash, tpId },
    };
  };

  // Step 2: DSDP Proposal Submission
  const submitDSDPProposal = (
    tpId: string,
    proposal: Omit<DSDPProposal, 'proposalId' | 'submissionDate'>
  ) => {
    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;
        const proposalId = `DSDP-${new Date().getFullYear()}-${tp.district.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        const submissionDate = new Date().toISOString().split('T')[0];

        // Create default Training Centre record based on proposal
        const defaultTC: TrainingCentre = {
          tcId: `TC-KL-${tp.district.slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
          tpId: tp.tpId,
          centreName: `${tp.organizationName} Training Centre, ${tp.district}`,
          district: tp.district,
          address: `${tp.headOfficeAddress}, ${tp.district}`,
          centreHeadName: tp.authorizedRep.name,
          centreHeadPhone: tp.authorizedRep.phone,
          centreHeadEmail: tp.authorizedRep.email,
          totalAreaSqFt: 2500,
          coursesOffered: proposal.courses.map((c) => c.courseName),
          status: 'DSDP Submitted',
        };

        return {
          ...tp,
          currentStage: 'STEP_3_DSDP_SCRUTINY',
          overallStatus: 'DSDP Submitted',
          trainingCentres: tp.trainingCentres.length > 0 ? tp.trainingCentres : [defaultTC],
          dsdpProposal: {
            ...proposal,
            proposalId,
            submissionDate,
          },
        };
      })
    );
  };

  // Step 3: Scrutiny and Inclusion in DSDP
  const scrutinizeDSDP = (
    tpId: string,
    decision: 'Approved' | 'Rejected' | 'Clarification Requested',
    remarks: string,
    scores?: DSDPProposal['scrutinyScore']
  ) => {
    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;
        const currentProposal = tp.dsdpProposal;
        if (!currentProposal) return tp;

        let nextStage = tp.currentStage;
        let nextStatus = tp.overallStatus;

        if (decision === 'Approved') {
          nextStage = 'STEP_4_ACCREDITATION_DESKTOP';
          nextStatus = 'DSDP Approved';
        } else if (decision === 'Clarification Requested') {
          nextStage = 'STEP_3_DSDP_SCRUTINY';
          nextStatus = 'DSDP Clarification Requested';
        } else {
          nextStage = 'STEP_3_DSDP_SCRUTINY';
          nextStatus = 'DSDP Rejected';
        }

        // Auto assign designated SPOC for district if clarification requested
        const assignedSPOC = DISTRICT_SPOCS[tp.district];

        return {
          ...tp,
          currentStage: nextStage,
          overallStatus: nextStatus,
          assignedSPOC,
          dsdpProposal: {
            ...currentProposal,
            scrutinyRemarks: remarks,
            scrutinyScore: scores || currentProposal.scrutinyScore,
            scrutinyDate: new Date().toISOString().split('T')[0],
          },
        };
      })
    );
  };

  // Step 4a, 5a, 6: Make Payments
  const makePayment = (
    tpId: string,
    purpose: PaymentReceipt['purpose'],
    amount: number,
    paymentMethod: string
  ): PaymentReceipt => {
    const receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: PaymentReceipt = {
      receiptNo,
      date: new Date().toISOString().split('T')[0],
      purpose,
      amount,
      paymentMethod,
      transactionRef: `TXN-${purpose.slice(0, 3)}-${Date.now().toString().slice(-6)}`,
      status: 'Completed',
    };

    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;

        let nextStage = tp.currentStage;
        let nextStatus = tp.overallStatus;

        if (purpose === 'TC_ACCREDITATION_FEE' || purpose === 'COURSE_AFFILIATION_FEE') {
          nextStatus = 'Desktop Assessment Pending';
          nextStage = 'STEP_4_ACCREDITATION_DESKTOP';
        } else if (purpose === 'MONITORING_EVALUATION_FEE') {
          nextStatus = 'Accredited Training Partner';
          nextStage = 'STEP_7_CONTINUOUS_MONITORING';
        }

        return {
          ...tp,
          currentStage: nextStage,
          overallStatus: nextStatus,
          payments: [newReceipt, ...tp.payments],
        };
      })
    );

    return newReceipt;
  };

  // Step 4b: Desktop Assessment
  const evaluateDesktopAssessment = (
    tpId: string,
    isDeemedReady: boolean,
    partA: AnnexureAChecklist['partA'],
    remarks?: string
  ) => {
    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;

        const nextStage = isDeemedReady ? 'STEP_5_PHYSICAL_INSPECTION' : 'STEP_4_ACCREDITATION_DESKTOP';
        const nextStatus = isDeemedReady ? 'Deemed Ready' : 'Deemed Not Ready';

        // 3-year registration validity from date of approval
        const now = new Date();
        const validUntil = new Date(now.getFullYear() + 3, now.getMonth(), now.getDate()).toISOString().split('T')[0];

        const updatedAnnexureA: AnnexureAChecklist = {
          partA,
          partADocuments: tp.annexureA?.partADocuments || {},
          partB: tp.annexureA?.partB || {
            internetFacility50Mbps: true,
            centreAreaPoints: 12,
            typeOfBuildingPoints: 8,
            ownershipPoints: 5,
            proximityToTransportPoints: 5,
            differentlyAbledFriendlyPoints: 5,
            cctvCamerasPoints: 2,
            libraryFacilityWithRegister: true,
          },
          calculatedScorePercentage: tp.annexureA?.calculatedScorePercentage || 75,
          starRating: tp.annexureA?.starRating || '4 Star',
          overallPartACompliant: isDeemedReady,
          evaluatedBy: 'KASE Desktop Inspection Agency Cell',
          evaluationDate: new Date().toISOString().split('T')[0],
        };

        return {
          ...tp,
          currentStage: nextStage,
          overallStatus: nextStatus,
          registrationValidUntil: isDeemedReady ? validUntil : tp.registrationValidUntil,
          annexureA: updatedAnnexureA,
        };
      })
    );
  };

  // Step 5a: Schedule Physical Inspection
  const schedulePhysicalInspection = (
    tpId: string,
    date: string,
    teamMembers: string[]
  ) => {
    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;
        return {
          ...tp,
          inspectionScheduledDate: date,
          inspectionTeamMembers: teamMembers,
          overallStatus: 'Physical Inspection Scheduled',
          currentStage: 'STEP_5_PHYSICAL_INSPECTION',
        };
      })
    );
  };

  // Step 5b: Physical Centre Inspection Scoring (Annexure A)
  const evaluatePhysicalInspection = (
    tpId: string,
    partA: AnnexureAChecklist['partA'],
    partB: AnnexureAChecklist['partB'],
    recommendation: 'Accreditation' | 'Conditional Accreditation' | 'Rejected',
    dscSignatory: string
  ) => {
    // Check Part-A compliance (all mandatory must be true)
    const partAValues = Object.values(partA);
    const isPartACompliant = partAValues.every((val) => val === true);

    // Part-B Maximum Points available:
    // Centre area (15) + Building type (10) + Ownership (5) + Proximity (5) + Differently-abled (7) + CCTV (3) + Library (5) = 50 pts
    const libraryPts = partB.libraryFacilityWithRegister ? 5 : 0;
    const internetBonus = partB.internetFacility50Mbps ? 0 : -5;
    const totalPartBScore =
      partB.centreAreaPoints +
      partB.typeOfBuildingPoints +
      partB.ownershipPoints +
      partB.proximityToTransportPoints +
      partB.differentlyAbledFriendlyPoints +
      partB.cctvCamerasPoints +
      libraryPts +
      internetBonus;

    const maxPartB = 50;
    const percentage = Math.min(100, Math.max(0, Math.round((totalPartBScore / maxPartB) * 100)));

    let starRating: StarRating = 'Not Rated';
    if (percentage >= 85) starRating = '5 Star';
    else if (percentage >= 70) starRating = '4 Star';
    else if (percentage >= 60) starRating = '3 Star';
    else if (percentage >= 50) starRating = '2 Star (Provisional)';
    else if (percentage >= 40) starRating = '1 Star';
    else starRating = 'Not Rated';

    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;

        let nextStatus: OverallStatus = tp.overallStatus;
        let nextStage: ApplicationStage = tp.currentStage;

        if (recommendation === 'Accreditation') {
          nextStatus = 'Accreditation Recommended';
          nextStage = 'STEP_6_BAC_VERIFICATION';
        } else if (recommendation === 'Conditional Accreditation') {
          nextStatus = 'Conditional Accreditation Recommended';
          nextStage = 'STEP_6_BAC_VERIFICATION';
        } else {
          nextStatus = 'Accreditation Rejected';
          nextStage = 'STEP_5_PHYSICAL_INSPECTION';
        }

        const updatedTCs = tp.trainingCentres.map((tc) => ({
          ...tc,
          starRating,
          isConditional: recommendation === 'Conditional Accreditation',
          status: nextStatus,
        }));

        const updatedAnnexureA: AnnexureAChecklist = {
          partA,
          partADocuments: tp.annexureA?.partADocuments || {},
          partB,
          calculatedScorePercentage: percentage,
          starRating,
          overallPartACompliant: isPartACompliant,
          evaluatedBy: 'Joint Inspection Agency & DSC Field Committee',
          evaluationDate: new Date().toISOString().split('T')[0],
          inspectionRecommendation: recommendation,
          dscCountersigned: true,
          dscSignatoryName: dscSignatory,
        };

        return {
          ...tp,
          currentStage: nextStage,
          overallStatus: nextStatus,
          annexureA: updatedAnnexureA,
          trainingCentres: updatedTCs,
        };
      })
    );
  };

  // Step 6: Final Verification (BAC)
  const evaluateBAC = (tpId: string, approved: boolean, remarks: string) => {
    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;

        const nextStage: ApplicationStage = approved ? 'STEP_7_CONTINUOUS_MONITORING' : 'STEP_6_BAC_VERIFICATION';
        const nextStatus: OverallStatus = approved ? 'Accredited Training Partner' : 'Accreditation Rejected';

        const now = new Date();
        const tcValidUntil = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().split('T')[0];

        const updatedTCs = tp.trainingCentres.map((tc) => ({
          ...tc,
          status: nextStatus,
          accreditationValidUntil: approved ? tcValidUntil : tc.accreditationValidUntil,
        }));

        return {
          ...tp,
          currentStage: nextStage,
          overallStatus: nextStatus,
          bacApprovalDate: approved ? new Date().toISOString().split('T')[0] : undefined,
          bacReviewerRemarks: remarks,
          trainingCentres: updatedTCs,
        };
      })
    );
  };

  // Step 7: Continuous Monitoring (ERF Annexure B)
  const evaluateERF = (
    tpId: string,
    scores: {
      financials: { score: number; remarks: string };
      governanceAndManpower: { score: number; remarks: string };
      qualifications: { score: number; remarks: string };
      training: { score: number; remarks: string };
      assessment: { score: number; remarks: string };
      industryEngagement: { score: number; remarks: string };
      futurePlan: { score: number; remarks: string };
      grievanceAndPOSH: { score: number; remarks: string };
    },
    evaluatorNotes: string
  ) => {
    // Total sum = sum of scores (max 100)
    const totalPercentage =
      scores.financials.score +
      scores.governanceAndManpower.score +
      scores.qualifications.score +
      scores.training.score +
      scores.assessment.score +
      scores.industryEngagement.score +
      scores.futurePlan.score +
      scores.grievanceAndPOSH.score;

    let grade: PerformanceGrade = 'D';
    if (totalPercentage >= 85) grade = 'A';
    else if (totalPercentage >= 70) grade = 'B';
    else if (totalPercentage >= 60) grade = 'C';
    else grade = 'D';

    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;

        let consecutiveD = tp.consecutiveDGrades;
        if (grade === 'D') {
          consecutiveD += 1;
        } else {
          consecutiveD = 0;
        }

        let isConditionalNow = tp.overallStatus === 'Conditional Accreditation Recommended';
        let newStatus = tp.overallStatus;
        const newPenalties = [...tp.penalties];

        // Step 9 Rule: Two consecutive 'D' grades trigger "Conditional" accreditation pending Appellate Authority review
        if (consecutiveD >= 2) {
          isConditionalNow = true;
          newStatus = 'Conditional Accreditation Recommended';
          newPenalties.unshift({
            id: `PEN-${Date.now().toString().slice(-4)}`,
            tpId: tp.tpId,
            type: 'POOR_PERFORMANCE_D',
            title: `Two Consecutive 'D' Performance Reviews (${totalPercentage}%)`,
            description: `Consecutive D grades recorded under Annexure B Excellence-Risk Framework. Status downgraded to Conditional pending Appellate Authority (BAC) review. Mandatory Annexure C Risk Mitigation Plan must be submitted within 30 days.`,
            fineAmount: 0,
            issueDate: new Date().toISOString().split('T')[0],
            appealDeadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            status: 'Active',
          });
        }

        const updatedERF: AnnexureB_ERF = {
          financials: { ...scores.financials, max: 15 },
          governanceAndManpower: { ...scores.governanceAndManpower, max: 10 },
          qualifications: { ...scores.qualifications, max: 10 },
          training: { ...scores.training, max: 30 },
          assessment: { ...scores.assessment, max: 10 },
          industryEngagement: { ...scores.industryEngagement, max: 15 },
          futurePlan: { ...scores.futurePlan, max: 5 },
          grievanceAndPOSH: { ...scores.grievanceAndPOSH, max: 5 },
          totalPercentage,
          grade,
          evaluationDate: new Date().toISOString().split('T')[0],
          evaluatorNotes,
          consecutiveDGradesCount: consecutiveD,
        };

        return {
          ...tp,
          overallStatus: newStatus,
          consecutiveDGrades: consecutiveD,
          annexureB_ERF: updatedERF,
          penalties: newPenalties,
          trainingCentres: tp.trainingCentres.map((tc) => ({
            ...tc,
            isConditional: isConditionalNow,
          })),
        };
      })
    );
  };

  // Annexure C Submission & Review
  const submitAnnexureC = (
    tpId: string,
    plan: Omit<AnnexureC_Plan, 'id' | 'submissionDate' | 'status'>
  ) => {
    const newPlan: AnnexureC_Plan = {
      ...plan,
      id: `PLAN-${Date.now().toString().slice(-5)}`,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Submitted',
    };

    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;
        return {
          ...tp,
          annexureC_Plans: [newPlan, ...tp.annexureC_Plans],
        };
      })
    );
  };

  const reviewAnnexureC = (
    tpId: string,
    planId: string,
    status: AnnexureC_Plan['status'],
    feedback: string
  ) => {
    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;
        return {
          ...tp,
          annexureC_Plans: tp.annexureC_Plans.map((p) =>
            p.id === planId ? { ...p, status, adminFeedback: feedback } : p
          ),
        };
      })
    );
  };

  // Step 9: Penalties & Compliance
  const issuePenalty = (
    tpId: string,
    type: PenaltyRecord['type'],
    title: string,
    description: string,
    fineAmount: number
  ) => {
    const issueDate = new Date();
    const appealDeadline = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];

    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;

        let nextStatus = tp.overallStatus;
        let isSuspended = tp.isSuspended;
        let monitoringDeficiencyCount = tp.monitoringDeficiencyCount;

        if (type === 'MONITORING_FAILURE') {
          monitoringDeficiencyCount += 1;
          // Step 9 Rule: 3 violations in a year = suspension of affiliation
          if (monitoringDeficiencyCount >= 3) {
            isSuspended = true;
            nextStatus = 'Suspended';
          }
        }

        const newPenalty: PenaltyRecord = {
          id: `PEN-${Date.now().toString().slice(-4)}`,
          tpId,
          type,
          title,
          description,
          fineAmount,
          issueDate: issueDate.toISOString().split('T')[0],
          appealDeadline,
          status: 'Active',
          violationsCount: monitoringDeficiencyCount,
        };

        return {
          ...tp,
          overallStatus: nextStatus,
          isSuspended,
          monitoringDeficiencyCount,
          penalties: [newPenalty, ...tp.penalties],
        };
      })
    );
  };

  const appealPenalty = (tpId: string, penaltyId: string, justification: string) => {
    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;
        const penalty = tp.penalties.find((p) => p.id === penaltyId);
        if (!penalty) return tp;

        // 10% appeal fee (refundable if successful)
        const appealFee = Math.max(1000, Math.round(OFFICIAL_FEES.TC_ACCREDITATION * 0.1));

        // Auto record payment for appeal
        const appealReceipt: PaymentReceipt = {
          receiptNo: `RCP-APP-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          purpose: 'APPEAL_FEE',
          amount: appealFee,
          paymentMethod: 'KASE Grievance & Appeal Gateway',
          transactionRef: `APP-TXN-${Date.now().toString().slice(-5)}`,
          status: 'Completed',
        };

        const updatedPenalties = tp.penalties.map((p) => {
          if (p.id !== penaltyId) return p;
          return {
            ...p,
            status: 'Under Appeal' as const,
            appeal: {
              appealId: `APP-${Date.now().toString().slice(-4)}`,
              appealDate: new Date().toISOString().split('T')[0],
              justification,
              appealFeePaid: appealFee,
              status: 'Pending Review' as const,
            },
          };
        });

        return {
          ...tp,
          penalties: updatedPenalties,
          payments: [appealReceipt, ...tp.payments],
        };
      })
    );
  };

  const resolveAppeal = (
    tpId: string,
    penaltyId: string,
    decision: 'Upheld' | 'Revoked & Refunded',
    committeeRemarks: string
  ) => {
    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;
        return {
          ...tp,
          penalties: tp.penalties.map((p) => {
            if (p.id !== penaltyId) return p;
            return {
              ...p,
              status: decision === 'Revoked & Refunded' ? 'Appeal Approved (Waived)' : 'Appeal Rejected',
              appeal: p.appeal
                ? {
                    ...p.appeal,
                    status: decision,
                    reviewDate: new Date().toISOString().split('T')[0],
                    committeeRemarks,
                  }
                : undefined,
            };
          }),
        };
      })
    );
  };

  // Step 9: Fraud / Misrepresentation Instant Cancellation
  const triggerImmediateFraudCancellation = (tpId: string, reason: string) => {
    const twoYearsLater = new Date();
    twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);

    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;

        const fraudPenalty: PenaltyRecord = {
          id: `PEN-FRAUD-${Date.now().toString().slice(-4)}`,
          tpId,
          type: 'FRAUD_MISREPRESENTATION',
          title: 'Immediate Cancellation & 2-Year Bar for Fraud / Misrepresentation',
          description: `${reason}. 100% fine applied. Barred from re-applying until ${twoYearsLater.toISOString().split('T')[0]}. Case escalated to legal authorities.`,
          fineAmount: OFFICIAL_FEES.TC_ACCREDITATION, // 100% fee fine
          issueDate: new Date().toISOString().split('T')[0],
          appealDeadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          status: 'Active',
        };

        return {
          ...tp,
          currentStage: 'DEACCREDITED',
          overallStatus: 'De-Accredited / Banned',
          isSuspended: true,
          isBannedUntil: twoYearsLater.toISOString().split('T')[0],
          penalties: [fraudPenalty, ...tp.penalties],
          trainingCentres: tp.trainingCentres.map((tc) => ({
            ...tc,
            status: 'De-Accredited / Banned',
          })),
        };
      })
    );
  };

  // Step 8 & 9: Renewal Management with Late Penalty calculation
  const applyRenewalWithLatePenalty = (
    tpId: string,
    tcId: string,
    monthsOverdue: number
  ) => {
    const baseRenewalFee = OFFICIAL_FEES.TC_ACCREDITATION; // Rs. 10,000

    let penaltyRate = 0;
    let penaltyAmount = 0;
    let isDeaccredited = false;

    if (monthsOverdue > 6) {
      // Step 9 Rule: Failure to renew within 6 months results in automatic de-accreditation, full re-application required (Rs. 10,000 TP, Rs. 13,000+ per job role)
      isDeaccredited = true;
      penaltyAmount = OFFICIAL_FEES.TC_REAPPLICATION_BASE;
    } else if (monthsOverdue > 0) {
      // 10% penalty per month of delay, capped at 50%
      penaltyRate = Math.min(0.5, monthsOverdue * 0.1);
      penaltyAmount = Math.round(baseRenewalFee * penaltyRate);
    }

    const totalDue = isDeaccredited ? penaltyAmount : baseRenewalFee + penaltyAmount;

    setTrainingPartners((prev) =>
      prev.map((tp) => {
        if (tp.tpId !== tpId) return tp;

        let nextStatus = tp.overallStatus;
        let nextStage = tp.currentStage;
        const newPenalties = [...tp.penalties];

        if (isDeaccredited) {
          nextStatus = 'De-Accredited / Banned';
          nextStage = 'DEACCREDITED';
          newPenalties.unshift({
            id: `PEN-REN-DEAC-${Date.now().toString().slice(-4)}`,
            tpId,
            tcId,
            type: 'LATE_RENEWAL',
            title: 'Automatic De-Accreditation: Renewal Expired >6 Months',
            description: `Renewal was not submitted within 6 months of expiry. Centre de-accredited. Full re-application required (Rs. 10,000 TP fee + Rs. 13,000+ TC fee).`,
            fineAmount: OFFICIAL_FEES.TC_REAPPLICATION_BASE,
            issueDate: new Date().toISOString().split('T')[0],
            appealDeadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            status: 'Active',
          });
        } else if (penaltyAmount > 0) {
          newPenalties.unshift({
            id: `PEN-REN-LATE-${Date.now().toString().slice(-4)}`,
            tpId,
            tcId,
            type: 'LATE_RENEWAL',
            title: `Late Renewal Surcharge (${monthsOverdue} Month${monthsOverdue > 1 ? 's' : ''} Delay: ${Math.round(penaltyRate * 100)}%)`,
            description: `Submitted after the 3-month pre-expiry deadline. 10% penalty per month of delay capped at 50% applied on renewal fee.`,
            fineAmount: penaltyAmount,
            issueDate: new Date().toISOString().split('T')[0],
            appealDeadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            status: 'Active',
          });
        }

        return {
          ...tp,
          overallStatus: nextStatus,
          currentStage: nextStage,
          penalties: newPenalties,
        };
      })
    );

    return { penaltyAmount, totalDue, isDeaccredited };
  };

  const resetToDemoData = () => {
    setTrainingPartners(INITIAL_TRAINING_PARTNERS);
    setUserSession(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <KaseContext.Provider
      value={{
        userSession,
        trainingPartners,
        currentTP,
        activeRole,
        setActiveRole,
        selectedDistrictFilter,
        setSelectedDistrictFilter,
        loginAsTSP,
        loginAsAdmin,
        quickLoginTSP,
        logout,
        registerTP,
        submitDSDPProposal,
        scrutinizeDSDP,
        makePayment,
        evaluateDesktopAssessment,
        schedulePhysicalInspection,
        evaluatePhysicalInspection,
        evaluateBAC,
        evaluateERF,
        submitAnnexureC,
        reviewAnnexureC,
        issuePenalty,
        appealPenalty,
        resolveAppeal,
        triggerImmediateFraudCancellation,
        applyRenewalWithLatePenalty,
        resetToDemoData,
      }}
    >
      {children}
    </KaseContext.Provider>
  );
};

export const useKase = () => {
  const ctx = useContext(KaseContext);
  if (!ctx) {
    throw new Error('useKase must be used within a KaseProvider');
  }
  return ctx;
};
