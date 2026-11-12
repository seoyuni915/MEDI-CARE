// medi_care/types/database.ts
// CREATE_TABLES.sql 물리 스키마와 100% 일치하는 TypeScript 인터페이스 정의

// 2. 회원 테이블 (users) - 중심 엔티티
export interface User {
  user_id: number;
  name: string;
  birth_date: string; // DATE ('YYYY-MM-DD')
  phone: string;
  login_id: string;
  password?: string; // 보안상 조회 시 제외될 수 있으므로 optional 처리
  blood_type?: string | null;
  allergy?: string | null;
  managed_disease?: string | null;
  guardian_name?: string | null;
  guardian_relation?: string | null;
  guardian_phone?: string | null;
  guardian_alert_yn: boolean | number; // MariaDB BOOLEAN (TINYINT(1) 호환)
  widget_config?: string | null;
  points: number;
  emr_linked: boolean | number;
  created_at: string;
  updated_at: string; // DATETIME
}

// 3. 건강리포트 테이블 (inbody_reports)
export interface InbodyReport {
  report_id: number;
  user_id: number;
  health_score?: number | null;
  weight?: number | null; // DECIMAL(5,2)
  skeletal_muscle?: number | null; // 골격근(kg)
  body_fat?: number | null; // 체지방(kg)
  est_hba1c?: number | null; // 당화혈색소추정치
  monthly_adherence?: number | null; // 월간복약순응도(%)
  created_at: string; // DATETIME
}

// 4. 식단기록 테이블 (diet_logs)
export interface DietLog {
  diet_id: number;
  user_id: number;
  meal_type: string; // 식사구분 (예: 아침, 점심, 저녁, 간식)
  menu_summary?: string | null;
  intake_kcal?: number | null;
  nutrition_info?: string | null;
  recorded_at: string; // DATETIME
}

// 5. 실비청구 테이블 (insurance_claims)
export interface InsuranceClaim {
  claim_id: number;
  user_id: number;
  facility_name: string; // 병원약국명
  claim_amount: number; // 청구금액
  claim_status: string; // 기본값 'REQ'
  supplement_reason?: string | null; // 보완사유
  is_masked: boolean | number; // 마스킹여부
  claimed_at: string; // DATETIME
}

// 6. 리워드내역 테이블 (reward_logs)
export interface RewardLog {
  reward_id: number;
  user_id: number;
  usage_detail?: string | null; // 사용내역
  earn_detail?: string | null; // 적립내역
  category: string; // 카테고리
  point_delta: number; // 변동포인트
  processed_at: string; // DATETIME
}

// 7. 처방약등록 테이블 (medications)
export interface Medication {
  medication_id: number;
  user_id: number;
  drug_name: string; // 약품명
  dose_time: string; // 복용시간 TIME ('HH:MM:SS')
  reg_method: string; // 등록방식
}

// 8. 복약이력 AR인증 테이블 (medi_logs) - 복합키 (med_log_id, medication_id)
export interface MediLog {
  med_log_id: number;
  medication_id: number;
  ar_match_rate?: number | null; // AR일치율(%)
  discomfort_memo?: string | null; // 불편증상메모
  earned_points: number; // 적립포인트
  dosed_at: string; // 복용일시 DATETIME
}

// 9. AI보장진단 테이블 (ai_diagnoses)
export interface AiDiagnosis {
  diagnosis_id: number;
  user_id: number;
  current_premium?: number | null; // 현재월보험료
  saving_amount?: number | null; // 절감가능금액
  over_coverage_items?: string | null; // 과잉보장항목
  coverage_gap_items?: string | null; // 보장공백항목
  analysis_basis?: string | null; // 분석근거
  diagnosed_at: string; // 진단일시 DATETIME
}

// 10. 맞춤상품비교 테이블 (recommended_plans)
export interface RecommendedPlan {
  plan_id: number;
  diagnosis_id: number;
  insurer_name: string; // 보험사명
  plan_name: string; // 상품명
  curation_tag?: string | null; // 큐레이션태그
  monthly_premium: number; // 월보험료
  tm_blocked: boolean | number; // 전화영업차단여부
}
