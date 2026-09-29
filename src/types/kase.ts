export type LegalEntityType =
  | 'Society'
  | 'Trust'
  | 'Proprietorship'
  | 'Company'
  | 'LLP'
  | 'Government Institute';

export type KeralaDistrict =
  | 'Thiruvananthapuram'
  | 'Kollam'
  | 'Pathanamthitta'
  | 'Alappuzha'
  | 'Kottayam'
  | 'Idukki'
  | 'Ernakulam'
  | 'Thrissur'
  | 'Palakkad'
  | 'Malappuram'
  | 'Kozhikode'
  | 'Wayanad'
  | 'Kannur'
  | 'Kasaragod';

export type ApplicationStage =
  | 'STEP_1_REGISTRATION'
  | 'STEP_2_DSDP_SUBMISSION'
  | 'STEP_3_DSDP_SCRUTINY'
  | 'STEP_4_ACCREDITATION_DESKTOP'
  | 'STEP_5_PHYSICAL_INSPECTION'
  | 'STEP_6_BAC_VERIFICATION'
  | 'STEP_7_CONTINUOUS_MONITORING'
  | 'STEP_8_RENEWAL'
  | 'SUSPENDED'
  | 'DEACCREDITED';

export type OverallStatus =
  | 'Draft'
  | 'DSDP Submitted'
  | 'DSDP Clarification Requested'
  | 'DSDP Approved'
  | 'DSDP Rejected'
  | 'Desktop Assessment Pending'
  | 'Deemed Ready'
  | 'Deemed Not Ready'
  | 'Physical Inspection Scheduled'
  | 'Inspection Completed'
  | 'Accreditation Recommended'
  | 'Conditional Accreditation Recommended'
  | 'Accredited Training Partner'
  | 'Accreditation Rejected'
  | 'Renewal Pending'
  | 'Suspended'
  | 'De-Accredited / Banned';

export type StarRating =
  | '5 Star' // 85-100%
  | '4 Star' // 70-84%
  | '3 Star' // 60-69%
  | '2 Star (Provisional)' // 50-59%
  | '1 Star' // 40-49%
  | 'Not Rated';

export type PerformanceGrade = 'A' | 'B' | 'C' | 'D' | 'Pending';

export interface SPOCContact {
  id: string;
  name: string;
  designation: string;
  district: KeralaDistrict;
  phone: string;
  email: string;
  officeAddress: string;
}

export interface DSDPProposal {
  proposalId: string;
  submissionDate: string;
  district: KeralaDistrict;
  courses: Array<{
    courseName: string;
    sector: string;
    durationHours: number;
    proposedTrainees: number;
    feePerCandidate: number;
  }>;
  targetedSectors: string[];
  intendedBeneficiaries: string[]; // e.g. Unemployed Youth, SHG Members, Transgender, Fisherfolk, SC/ST
  infrastructureReadiness: string;
  industryPartners: string[]; // At least two industry tie-ups
  placementCommitmentPercentage: number; // e.g. 75% (must be >= 70%)
  apprenticeshipPlan: string;
  scrutinyScore?: {
    feasibility: number; // 0-25
    districtAlignment: number; // 0-25
    placementCredibility: number; // 0-25
    infrastructureAdequacy: number; // 0-25
    total: number; // 0-100
  };
  scrutinyRemarks?: string;
  scrutinyDate?: string;
}

export interface AnnexureAChecklist {
  // Part-A: Mandatory standards
  partA: {
    classroomAreaCapacity: boolean; // Min 200 sqft / 10 sqft per trainee
    skillLabPracticalArea: boolean; // Min 200 sqft / 10 sqft per trainee
    placementCoordinatorAppointed: boolean; // Dedicated coordinator
    counsellorAppointed: boolean; // Dedicated counsellor
    buildingConstruction: boolean; // Plastered walls, tiled/cemented floor, proper ventilation & wiring
    separateMaleFemaleWashrooms: boolean; // Separate washroom facilities
    cleanlinessAndHygiene: boolean; // Dedicated staff
  };
  partADocuments: {
    floorPlanUrl?: string;
    placementCoordinatorProofUrl?: string;
    counsellorProofUrl?: string;
    buildingPhotosUrl?: string;
    washroomPhotosUrl?: string;
    housekeepingProofUrl?: string;
  };
  // Part-B: Scored indicators (predefined points)
  partB: {
    internetFacility50Mbps: boolean; // Min 50 Mbps
    centreAreaPoints: number; // 3000+ sqft: 15, 2000-3000: 12, 1500-2000: 10, 1200-1500: 5, <1200: 0
    typeOfBuildingPoints: number; // Stand-alone: 10, Exclusive in industry: 8, Demarcated built-up: 6
    ownershipPoints: number; // Owned: 5, Rented/Leased: 3
    proximityToTransportPoints: number; // <500m: 5, 500m-1km: 3, 1-3km: 2, >3km: 0
    differentlyAbledFriendlyPoints: number; // Ramps, lifts, washrooms: 7, Two facilities/ground: 5, One: 3, None: 0
    cctvCamerasPoints: number; // All rooms: 3, Classrooms & labs: 2, 50%: 1, None: 0
    libraryFacilityWithRegister: boolean; // Library with >= 5 books & register (5 pts bonus / qualifying)
  };
  calculatedScorePercentage: number;
  starRating: StarRating;
  overallPartACompliant: boolean;
  evaluatedBy?: string;
  evaluationDate?: string;
  inspectionRecommendation?: 'Accreditation' | 'Conditional Accreditation' | 'Rejected';
  dscCountersigned?: boolean;
  dscSignatoryName?: string;
}

export interface AnnexureB_ERF {
  financials: { score: number; max: 15; remarks: string }; // 15%
  governanceAndManpower: { score: number; max: 10; remarks: string }; // 10%
  qualifications: { score: number; max: 10; remarks: string }; // 10%
  training: { score: number; max: 30; remarks: string }; // 30%
  assessment: { score: number; max: 10; remarks: string }; // 10%
  industryEngagement: { score: number; max: 15; remarks: string }; // 15%
  futurePlan: { score: number; max: 5; remarks: string }; // 5%
  grievanceAndPOSH: { score: number; max: 5; remarks: string }; // 5%
  totalPercentage: number; // 0-100
  grade: PerformanceGrade; // A: 85-100, B: 70-84, C: 60-69, D: <60
  evaluationDate: string;
  evaluatorNotes: string;
  consecutiveDGradesCount: number;
}

export interface AnnexureC_Plan {
  id: string;
  type: 'Quality Improvement Plan (B/C Grades)' | 'Risk Mitigation Plan (D Grades)';
  submissionDate: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Revision Needed';
  items: Array<{
    id: string;
    identifiedGapOrRisk: string;
    rootCauseOrSeverity: string;
    correctiveOrMitigationAction: string;
    preventiveMeasures?: string;
    resourcesRequired: string;
    timelineMonths: number;
    responsiblePerson: string;
    monitoringMetrics: string;
  }>;
  quarterlyMISUpdate?: string;
  adminFeedback?: string;
}

export interface PenaltyRecord {
  id: string;
  tpId: string;
  tcId?: string;
  type:
    | 'LATE_RENEWAL'
    | 'MONITORING_FAILURE'
    | 'POOR_PERFORMANCE_D'
    | 'FRAUD_MISREPRESENTATION';
  title: string;
  description: string;
  fineAmount: number;
  issueDate: string;
  appealDeadline: string; // 15 days from issueDate
  status: 'Active' | 'Under Appeal' | 'Appeal Approved (Waived)' | 'Appeal Rejected' | 'Paid' | 'Suspended';
  violationsCount?: number;
  appeal?: {
    appealId: string;
    appealDate: string;
    justification: string;
    appealFeePaid: number; // 10% of fine or accreditation fee
    status: 'Pending Review' | 'Upheld' | 'Revoked & Refunded';
    reviewDate?: string;
    committeeRemarks?: string;
  };
}

export interface PaymentReceipt {
  receiptNo: string;
  date: string;
  purpose:
    | 'TP_REGISTRATION_FEE'
    | 'TC_ACCREDITATION_FEE'
    | 'COURSE_AFFILIATION_FEE'
    | 'MONITORING_EVALUATION_FEE'
    | 'RE_INSPECTION_FEE'
    | 'APPEAL_FEE'
    | 'PENALTY_PAYMENT';
  amount: number;
  paymentMethod: string;
  transactionRef: string;
  status: 'Completed' | 'Pending';
}

export interface TrainingCentre {
  tcId: string;
  tpId: string;
  centreName: string;
  district: KeralaDistrict;
  address: string;
  centreHeadName: string;
  centreHeadPhone: string;
  centreHeadEmail: string;
  totalAreaSqFt: number;
  coursesOffered: string[];
  accreditationValidUntil?: string; // 1 year validity from approval
  starRating?: StarRating;
  isConditional?: boolean;
  status: OverallStatus;
}

export interface TrainingPartner {
  tpId: string;
  organizationName: string;
  entityType: LegalEntityType;
  registrationNumber: string;
  incorporationDate: string;
  panNumber: string;
  gstin: string;
  headOfficeAddress: string;
  district: KeralaDistrict;
  website: string;
  
  // Authorized Representative
  authorizedRep: {
    name: string;
    designation: string;
    phone: string;
    email: string;
    aadhaarOrIdNumber: string;
  };

  // Primary Contact
  primaryContact: {
    name: string;
    phone: string;
    email: string;
  };

  // Credentials
  loginUsername: string;
  loginPasswordHash: string; // mock password
  registrationDate: string;
  registrationValidUntil?: string; // 3 years validity from approval

  // Current Process State
  currentStage: ApplicationStage;
  overallStatus: OverallStatus;

  // Single Point of Contact (SPOC)
  assignedSPOC?: SPOCContact;

  // Documents and Submissions
  dsdpProposal?: DSDPProposal;
  trainingCentres: TrainingCentre[];
  annexureA?: AnnexureAChecklist;
  annexureB_ERF?: AnnexureB_ERF;
  annexureC_Plans: AnnexureC_Plan[];

  // Inspection Scheduling
  inspectionScheduledDate?: string;
  inspectionTeamMembers?: string[];

  // BAC Approval details
  bacApprovalDate?: string;
  bacReviewerRemarks?: string;

  // Finance & Penalties
  payments: PaymentReceipt[];
  penalties: PenaltyRecord[];
  
  // Compliance tracking
  consecutiveDGrades: number;
  monitoringDeficiencyCount: number;
  isBannedUntil?: string; // 2 years ban if fraud
  isSuspended?: boolean;
}

export type AdminRole = 'KASE_ADMIN' | 'DSC_OFFICIAL' | 'INSPECTION_AGENCY' | 'BAC_MEMBER';

export interface AdminUser {
  id: string;
  name: string;
  role: AdminRole;
  district?: KeralaDistrict;
  email: string;
  department: string;
}
