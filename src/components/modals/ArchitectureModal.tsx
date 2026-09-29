import React, { useState } from 'react';
import { X, Copy, Check, Server, Database, GitBranch, Layers, FileCode } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'folder' | 'schema' | 'api' | 'deployment'>('folder');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const folderStructureText = `kase-accreditation-portal/
├── prisma/
│   └── schema.prisma             # Relational schema (PostgreSQL)
├── src/
│   ├── app/                      # Next.js App Router or React Pages
│   │   ├── (auth)/
│   │   │   ├── admin-login/
│   │   │   └── tsp-login/
│   │   ├── admin/
│   │   │   ├── scrutiny/         # Step 3: DSDP Scrutiny & SPOC Assignment
│   │   │   ├── desktop-audit/    # Step 4b: IA Desktop Assessment
│   │   │   ├── inspection/       # Step 5b: Physical Inspection (Annexure A)
│   │   │   ├── bac-review/       # Step 6: Business Advisory Committee Verification
│   │   │   ├── monitoring/       # Step 7: Continuous Monitoring (Annexure B ERF)
│   │   │   ├── renewals/         # Step 8: Expiry & Renewal Management
│   │   │   └── penalties/        # Step 9: Penalties, Fraud Bans & Appeals
│   │   ├── tsp/
│   │   │   ├── registration/     # Step 1: Legal Entity & Org Details
│   │   │   ├── dsdp-proposal/    # Step 2: District Skill Plan Submission
│   │   │   ├── fee-payment/      # Step 4a: Accreditation & Affiliation Fees
│   │   │   ├── schedule-visit/   # Step 5a: Physical Inspection Date Booking
│   │   │   ├── annexure-c/       # Quality & Risk Mitigation Plans
│   │   │   └── appeals/          # Penalty Appeals (10% Fee Gateway)
│   │   └── api/
│   │       ├── auth/             # Session & Role Verification
│   │       ├── tp/               # TP Registration & Profile CRUD
│   │       ├── dsdp/             # Proposal Submission & DSC Scrutiny
│   │       ├── inspection/       # Desktop & Physical Annexure A Audits
│   │       ├── bac/              # Final BAC Verification & M&E Billing
│   │       ├── monitoring/       # Annexure B ERF Scoring & Grade Engine
│   │       └── penalties/        # Penalty Issuance & Appeals Workflow
│   ├── components/
│   │   ├── common/               # Header, Footer, StatusBadges, SPOCCard
│   │   ├── home/                 # Landing, PipelineFlow, FeeSchedule
│   │   ├── tsp/                  # Step Wizards, Dashboard Views, Receipts
│   │   └── admin/                # Role Switcher, ScrutinyDrawers, ERFMatrix
│   ├── context/                  # State Store (localStorage / Zustand / Context)
│   ├── data/                     # SPOC Directory, Seed Mock Records, Fees
│   └── types/                    # TypeScript interfaces for Steps 1-9 & Annexures
├── public/                       # KASE Emblems, Government Logos, Guidelines PDFs
├── .env.example                  # DATABASE_URL, NEXTAUTH_SECRET, PAYMENT_GATEWAY
├── package.json
└── README.md`;

  const dbSchemaText = `-- PostgreSQL / Prisma / Drizzle Schema for KASE Accreditation System

-- 1. Training Partner (TP) Entity
CREATE TABLE training_partners (
    tp_id VARCHAR(32) PRIMARY KEY, -- e.g. 'KASE-TP-2026-081'
    organization_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- Society, Trust, Proprietorship, Company, LLP, Govt Institute
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    incorporation_date DATE NOT NULL,
    pan_number VARCHAR(10) NOT NULL UNIQUE,
    gstin VARCHAR(15),
    head_office_address TEXT NOT NULL,
    district VARCHAR(50) NOT NULL, -- 14 Kerala districts
    website VARCHAR(255),
    login_username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    registration_valid_until DATE, -- 3-year validity once deemed ready / accredited
    current_stage VARCHAR(50) NOT NULL DEFAULT 'STEP_1_REGISTRATION',
    overall_status VARCHAR(50) NOT NULL DEFAULT 'Draft',
    assigned_spoc_id VARCHAR(50),
    is_suspended BOOLEAN DEFAULT FALSE,
    is_banned_until DATE, -- 2 years ban if fraud detected
    consecutive_d_grades INT DEFAULT 0,
    monitoring_deficiencies_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Training Centres (TC) under TP
CREATE TABLE training_centres (
    tc_id VARCHAR(32) PRIMARY KEY,
    tp_id VARCHAR(32) REFERENCES training_partners(tp_id) ON DELETE CASCADE,
    centre_name VARCHAR(255) NOT NULL,
    district VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    centre_head_name VARCHAR(150) NOT NULL,
    centre_head_phone VARCHAR(20) NOT NULL,
    centre_head_email VARCHAR(150) NOT NULL,
    total_area_sqft INT NOT NULL,
    courses_offered JSONB NOT NULL DEFAULT '[]',
    star_rating VARCHAR(30) DEFAULT 'Not Rated', -- 1-Star to 5-Star
    is_conditional BOOLEAN DEFAULT FALSE,
    accreditation_valid_until DATE, -- 1 year validity for TC
    status VARCHAR(50) NOT NULL DEFAULT 'DSDP Submitted'
);

-- 3. DSDP Proposals (District Skill Development Plan)
CREATE TABLE dsdp_proposals (
    proposal_id VARCHAR(32) PRIMARY KEY,
    tp_id VARCHAR(32) REFERENCES training_partners(tp_id) ON DELETE CASCADE,
    district VARCHAR(50) NOT NULL,
    submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    courses JSONB NOT NULL, -- courseName, sector, durationHours, proposedTrainees, fee
    targeted_sectors TEXT[] NOT NULL,
    intended_beneficiaries TEXT[] NOT NULL,
    infrastructure_readiness TEXT NOT NULL,
    industry_partners TEXT[] NOT NULL, -- min 2 tie-ups
    placement_commitment_pct INT NOT NULL, -- >= 70%
    apprenticeship_plan TEXT,
    scrutiny_feasibility_score INT, -- 0-25
    scrutiny_alignment_score INT, -- 0-25
    scrutiny_placement_score INT, -- 0-25
    scrutiny_infra_score INT, -- 0-25
    scrutiny_total_score INT, -- 0-100
    scrutiny_decision VARCHAR(30), -- Approved, Rejected, Clarification Requested
    scrutiny_remarks TEXT,
    scrutiny_date DATE,
    dsc_evaluator_name VARCHAR(150)
);

-- 4. Annexure A: Centre Accreditation Checklist (Inspection Agency & DSC)
CREATE TABLE annexure_a_inspections (
    inspection_id VARCHAR(32) PRIMARY KEY,
    tc_id VARCHAR(32) REFERENCES training_centres(tc_id) ON DELETE CASCADE,
    tp_id VARCHAR(32) REFERENCES training_partners(tp_id),
    inspection_type VARCHAR(30) NOT NULL, -- 'DESKTOP' (Step 4b) or 'PHYSICAL' (Step 5b)
    
    -- Part-A Mandatory Checklist (Must all be TRUE)
    part_a_classroom_capacity BOOLEAN NOT NULL DEFAULT FALSE,
    part_a_skill_lab_area BOOLEAN NOT NULL DEFAULT FALSE,
    part_a_placement_coordinator BOOLEAN NOT NULL DEFAULT FALSE,
    part_a_counsellor BOOLEAN NOT NULL DEFAULT FALSE,
    part_a_building_construction BOOLEAN NOT NULL DEFAULT FALSE,
    part_a_washrooms_gender_separated BOOLEAN NOT NULL DEFAULT FALSE,
    part_a_cleanliness_hygiene BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Part-B Scored Indicators (Max 50 pts, min 40% to qualify)
    part_b_internet_50mbps BOOLEAN NOT NULL DEFAULT FALSE,
    part_b_centre_area_points INT DEFAULT 0, -- 15, 12, 10, 5, 0
    part_b_building_type_points INT DEFAULT 0, -- 10, 8, 6
    part_b_ownership_points INT DEFAULT 0, -- 5, 3
    part_b_proximity_transport_points INT DEFAULT 0, -- 5, 3, 2, 0
    part_b_differently_abled_points INT DEFAULT 0, -- 7, 5, 3, 0
    part_b_cctv_points INT DEFAULT 0, -- 3, 2, 1, 0
    part_b_library_facility BOOLEAN DEFAULT FALSE,
    
    calculated_percentage INT NOT NULL DEFAULT 0,
    star_rating VARCHAR(30) NOT NULL,
    recommendation VARCHAR(50), -- Accreditation, Conditional, Rejected
    dsc_countersigned BOOLEAN DEFAULT FALSE,
    dsc_signatory_name VARCHAR(150),
    ia_evaluator_name VARCHAR(150),
    inspection_date DATE NOT NULL
);

-- 5. Annexure B: Excellence - Risk Framework (Continuous Monitoring)
CREATE TABLE annexure_b_erf_evaluations (
    erf_id VARCHAR(32) PRIMARY KEY,
    tp_id VARCHAR(32) REFERENCES training_partners(tp_id) ON DELETE CASCADE,
    financials_score INT NOT NULL, -- Max 15
    governance_manpower_score INT NOT NULL, -- Max 10
    qualifications_score INT NOT NULL, -- Max 10
    training_score INT NOT NULL, -- Max 30
    assessment_score INT NOT NULL, -- Max 10
    industry_engagement_score INT NOT NULL, -- Max 15
    future_plan_score INT NOT NULL, -- Max 5
    grievance_posh_score INT NOT NULL, -- Max 5
    total_percentage INT NOT NULL, -- 0-100
    grade VARCHAR(5) NOT NULL, -- A (85-100), B (70-84), C (60-69), D (<60)
    evaluator_notes TEXT,
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- 6. Annexure C: Quality Improvement & Risk Mitigation Plans
CREATE TABLE annexure_c_plans (
    plan_id VARCHAR(32) PRIMARY KEY,
    tp_id VARCHAR(32) REFERENCES training_partners(tp_id) ON DELETE CASCADE,
    plan_type VARCHAR(60) NOT NULL, -- 'Quality Improvement Plan' or 'Risk Mitigation Plan'
    submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted',
    items JSONB NOT NULL, -- gap, rootCause, actions, resources, timelineMonths, responsiblePerson, metrics
    admin_feedback TEXT
);

-- 7. Penalties, Violations & Appeals Desk (Step 9)
CREATE TABLE penalties_and_appeals (
    penalty_id VARCHAR(32) PRIMARY KEY,
    tp_id VARCHAR(32) REFERENCES training_partners(tp_id) ON DELETE CASCADE,
    tc_id VARCHAR(32),
    penalty_type VARCHAR(40) NOT NULL, -- LATE_RENEWAL, MONITORING_FAILURE, POOR_PERFORMANCE_D, FRAUD_MISREPRESENTATION
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    fine_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    appeal_deadline DATE NOT NULL, -- 15 days from issue
    status VARCHAR(40) NOT NULL DEFAULT 'Active',
    
    -- Appeal Sub-block
    appeal_justification TEXT,
    appeal_fee_paid DECIMAL(10, 2), -- 10% refundable
    appeal_date DATE,
    appeal_status VARCHAR(40), -- Pending Review, Upheld, Revoked & Refunded
    committee_remarks TEXT
);

-- 8. Payments & e-Treasury Receipts
CREATE TABLE fee_payments (
    receipt_no VARCHAR(32) PRIMARY KEY,
    tp_id VARCHAR(32) REFERENCES training_partners(tp_id),
    purpose VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_ref VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const apiEndpointsText = `// Next.js App Router / Express API Routes Specification:

POST   /api/auth/tp-register            # Step 1: Register legal entity, create TP, return credentials
POST   /api/auth/login                  # Dual auth for Admin officials and TSPs
POST   /api/dsdp/submit                 # Step 2: TSP submits DSDP proposal
POST   /api/dsdp/scrutinize             # Step 3: DSC evaluates matrix, assigns SPOC on shortfall
POST   /api/payments/create-order       # Step 4a, 5a, 6: Fee collection (Rs. 3000, Rs. 10000, Rs. 5000)
POST   /api/inspection/desktop-audit    # Step 4b: IA conducts desktop check (Annexure A Part A)
POST   /api/inspection/schedule         # Step 5a: Book physical inspection date
POST   /api/inspection/physical-audit   # Step 5b: Record physical score, calculate star rating
POST   /api/bac/verify                  # Step 6: BAC final approval & course affiliation
POST   /api/monitoring/evaluate-erf     # Step 7: Continuous monitoring Annexure B ERF scoring
POST   /api/monitoring/annexure-c       # TSP submits Quality or Risk plan
POST   /api/renewals/calculate-late-fee # Step 8: Compute 10%/month delay penalty (capped 50%)
POST   /api/penalties/issue             # Step 9: Issue monitoring fine or instant 2-year fraud ban
POST   /api/penalties/appeal            # Step 9: TSP files appeal within 15 days (10% fee)
POST   /api/penalties/resolve-appeal    # Accreditation Committee / BAC appeal adjudication`;

  const deploymentGuideText = `# Deploying to GitHub and Vercel

1. Initialize Git repository & Commit:
   git init
   git add .
   git commit -m "Initial commit: KASE TSP Registration and Accreditation Platform"

2. Push to GitHub:
   git remote add origin https://github.com/your-username/kase-accreditation-portal.git
   git branch -M main
   git push -u origin main

3. Deploy on Vercel:
   - Go to https://vercel.com/new
   - Import the GitHub repository
   - Set Framework Preset to "Vite" (or Next.js if converted)
   - Add Environment Variables if connecting PostgreSQL/Supabase:
     DATABASE_URL="postgresql://..."
     NEXTAUTH_SECRET="your-secret"
   - Click "Deploy"

Note: The current demo includes self-contained reactive mock state synced via localStorage, so it deploys seamlessly to Vercel without requiring an external database setup!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#0e5774] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Layers className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg">System Architecture & Database Schema Blueprint</h3>
              <p className="text-xs text-cyan-100">
                Production-ready blueprint for GitHub hosting & Vercel deployment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-3">
          <button
            onClick={() => setActiveTab('folder')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'folder'
                ? 'bg-white text-[#0e5774] border-[#0e5774] shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            Folder Structure
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'schema'
                ? 'bg-white text-[#0e5774] border-[#0e5774] shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            Database Schema (SQL / DDL)
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'api'
                ? 'bg-white text-[#0e5774] border-[#0e5774] shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            API Route Matrix
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 ${
              activeTab === 'deployment'
                ? 'bg-white text-[#0e5774] border-[#0e5774] shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            GitHub & Vercel Guide
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto bg-slate-950 text-slate-100 font-mono text-xs">
          {activeTab === 'folder' && (
            <div className="relative">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                <span className="text-cyan-400 font-sans font-semibold">Suggested Repository Architecture</span>
                <button
                  onClick={() => copyToClipboard(folderStructureText, 'folder')}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                >
                  {copied === 'folder' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'folder' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto leading-relaxed text-slate-300">{folderStructureText}</pre>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="relative">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                <span className="text-emerald-400 font-sans font-semibold">PostgreSQL Relational DDL (8 Tables covering Steps 1 to 9)</span>
                <button
                  onClick={() => copyToClipboard(dbSchemaText, 'schema')}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                >
                  {copied === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'schema' ? 'Copied' : 'Copy Schema'}
                </button>
              </div>
              <pre className="overflow-x-auto leading-relaxed text-emerald-200/90 whitespace-pre-wrap">{dbSchemaText}</pre>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="relative">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                <span className="text-amber-400 font-sans font-semibold">REST API Endpoint Specification</span>
                <button
                  onClick={() => copyToClipboard(apiEndpointsText, 'api')}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                >
                  {copied === 'api' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'api' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto leading-relaxed text-amber-200/90">{apiEndpointsText}</pre>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="relative">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                <span className="text-sky-400 font-sans font-semibold">GitHub & Vercel Deployment Commands</span>
                <button
                  onClick={() => copyToClipboard(deploymentGuideText, 'deployment')}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition"
                >
                  {copied === 'deployment' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'deployment' ? 'Copied' : 'Copy Guide'}
                </button>
              </div>
              <pre className="overflow-x-auto leading-relaxed text-sky-200/90 whitespace-pre-wrap">{deploymentGuideText}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0e5774] text-white rounded-lg text-xs font-semibold hover:bg-[#0a4258] transition"
          >
            Close Spec Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
