// medi_care/src/app/index.tsx
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";

// CREATE_TABLES.sql 기반으로 정의한 타입 불러오기
import type {
  User,
  InbodyReport,
  Medication,
  AiDiagnosis,
} from "../../types/database";

import Constants from "expo-constants";

// 웹이면 localhost, 아이폰 앱이면 현재 Expo가 연결된 PC의 IP 주소를 자동으로 가져옴!
const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
const API_BASE_URL = debuggerHost
  ? `http://${debuggerHost}:3000`
  : "http://localhost:3000";

// 핵심 메뉴 아이콘 이미지
const ICONS = {
  heart: require("@/assets/images/icon-heart.png"),
  pill: require("@/assets/images/icon-pill.png"),
  receipt: require("@/assets/images/icon-receipt.png"),
  shield: require("@/assets/images/icon-shield.png"),
};

export default function HomeScreen() {
  const [loading, setLoading] = useState<boolean>(true);

  // 1. 회원 테이블 (users) 상태 데이터
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    user_id: 1,
    name: "김영희",
    managed_disease: "혈당·체성분 집중 케어",
    points: 1250,
    emr_linked: true,
    guardian_alert_yn: true,
  });

  // 2. 건강리포트 테이블 (inbody_reports) 상태 데이터
  const [latestReport, setLatestReport] = useState<Partial<InbodyReport>>({
    health_score: 92,
    weight: 64.5,
    est_hba1c: 5.3,
    monthly_adherence: 98,
  });

  // 3. 처방약등록 테이블 (medications) 상태 데이터
  const [nextMedication, setNextMedication] = useState<Partial<Medication>>({
    drug_name: "당뇨약 1정",
    dose_time: "12:30:00",
  });

  // 4. AI보장진단 테이블 (ai_diagnoses) 상태 데이터
  const [latestDiagnosis, setLatestDiagnosis] = useState<Partial<AiDiagnosis>>({
    saving_amount: 38000,
  });

  // 화면 진입 시 AWS RDS MariaDB에서 1번 회원 데이터 불러오기
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/home/1`);
        const data = await response.json();

        if (response.ok) {
          if (data.user) setCurrentUser(data.user);
          if (data.report) setLatestReport(data.report);
          if (data.medication) setNextMedication(data.medication);
          if (data.diagnosis) setLatestDiagnosis(data.diagnosis);
        }
      } catch (error) {
        console.error("AWS DB 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const formattedPoints = (currentUser.points ?? 1250).toLocaleString();
  const nextTime = nextMedication.dose_time
    ? nextMedication.dose_time.slice(0, 5)
    : "12:30";
  const nextDrug = nextMedication.drug_name || "당뇨약 1정";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 헤더 영역 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingTitle}>
              안녕하세요, {currentUser.name || "김영희"}님
            </Text>
            <Text style={styles.greetingSubtitle}>
              오늘도 건강한 하루를 시작해요
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.pointPill} activeOpacity={0.8}>
              <Text style={styles.pointPillText}>{formattedPoints}P</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.myButton} activeOpacity={0.8}>
              <Text style={styles.myButtonText}>MY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 오늘의 건강·복약 요약 카드 */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryLabel}>오늘의 건강·복약 요약</Text>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>2 / 3 완료</Text>
            </View>
          </View>

          <Text style={styles.summaryTitle}>
            오전 약 복용 · 아침 식단 기록 완료
          </Text>

          {/* 진행률 바 */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "66%" }]} />
          </View>

          <Text style={styles.summaryNextAlert}>
            다음 알림 {nextTime} · {nextDrug} 및 점심 칼로리 체크
          </Text>
        </View>

        {/* 핵심 메뉴 바로가기 (2x2 그리드) */}
        <Text style={styles.sectionTitle}>핵심 메뉴 바로가기</Text>

        <View style={styles.menuGrid}>
          <View style={styles.menuRow}>
            <TouchableOpacity style={styles.menuCard} activeOpacity={0.75}>
              <Image
                source={ICONS.heart}
                style={styles.menuIconImage}
                contentFit="contain"
              />
              <Text style={styles.menuCardTitle}>건강</Text>
              <Text style={styles.menuCardSub}>식단·칼로리·인바디</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} activeOpacity={0.75}>
              <Image
                source={ICONS.pill}
                style={styles.menuIconImage}
                contentFit="contain"
              />
              <Text style={styles.menuCardTitle}>복약</Text>
              <Text style={styles.menuCardSub}>캘린더·약 추가·부작용</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuRow}>
            <TouchableOpacity style={styles.menuCard} activeOpacity={0.75}>
              <Image
                source={ICONS.receipt}
                style={styles.menuIconImage}
                contentFit="contain"
              />
              <Text style={styles.menuCardTitle}>실비</Text>
              <Text style={styles.menuCardSub}>영수증 촬영·청구</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuCard} activeOpacity={0.75}>
              <Image
                source={ICONS.shield}
                style={styles.menuIconImage}
                contentFit="contain"
              />
              <Text style={styles.menuCardTitle}>보험</Text>
              <Text style={styles.menuCardSub}>AI 보장 진단·비교</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 오늘의 건강 리워드 미션 */}
        <View style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <Text style={styles.rewardTitle}>오늘의 건강 리워드 미션</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.rewardPointLink}>
                보유 {formattedPoints} P &gt;
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.missionItem}>
            <Text style={styles.missionItemText}>오전 복약 완료 (달성)</Text>
            <Text style={styles.missionDoneText}>+10P 적립됨</Text>
          </View>

          <TouchableOpacity style={styles.missionItem} activeOpacity={0.8}>
            <Text style={styles.missionItemText}>
              점심 식단 · 칼로리 기록하기
            </Text>
            <Text style={styles.missionActionText}>+10P 받기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rewardStoreBtn} activeOpacity={0.85}>
            <Text style={styles.rewardStoreBtnText}>
              포인트 지갑 · 리워드 스토어 바로가기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 하단 안내 문구 */}
        <Text style={styles.footerHint}>
          원하는 메뉴를 눌러 건강 관리를 시작하세요
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  pointPill: {
    backgroundColor: "#E6F6F2",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  pointPillText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F766E",
  },
  myButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  myButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  summaryCard: {
    backgroundColor: "#E6F7F2",
    borderRadius: 22,
    padding: 20,
    marginBottom: 26,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  summaryBadge: {
    backgroundColor: "#CBECE3",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  summaryBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F766E",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  progressTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "#CBECE3",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#14806C",
    borderRadius: 3,
  },
  summaryNextAlert: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  menuGrid: {
    gap: 12,
    marginBottom: 24,
  },
  menuRow: {
    flexDirection: "row",
    gap: 12,
  },
  menuCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  menuIconImage: {
    width: 40,
    height: 40,
    marginBottom: 14,
  },
  menuCardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  menuCardSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#94A3B8",
  },
  rewardCard: {
    backgroundColor: "#EAF2FD",
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
  },
  rewardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  rewardPointLink: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  missionItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  missionItemText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  missionDoneText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F766E",
  },
  missionActionText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#2563EB",
  },
  rewardStoreBtn: {
    backgroundColor: "#1D56D8",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  rewardStoreBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  footerHint: {
    fontSize: 12,
    fontWeight: "500",
    color: "#CBD5E1",
    textAlign: "center",
    marginTop: 4,
  },
});
