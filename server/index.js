// medi_care/server/index.js
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. AWS RDS MariaDB 연결 설정
const pool = mysql.createPool({
  host: "medicare.cdsi00om0dpl.ap-southeast-2.rds.amazonaws.com", // 예: medicare-db.xxxx.ap-northeast-2.rds.amazonaws.com
  port: 3306,
  user: "ctrlz", // RDS 마스터 사용자 이름
  password: "!medicare4", // RDS 비밀번호
  database: "medicare", // 생성한 데이터베이스(스키마) 이름
  waitForConnections: true,
  connectionLimit: 10,
});

// 2. DB 연결 확인용 테스트 API
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");
    res.json({
      status: "OK",
      message: "AWS MariaDB 연결 성공!",
      dbTime: rows[0].currentTime,
    });
  } catch (error) {
    console.error("DB 연결 에러:", error);
    res.status(500).json({ status: "ERROR", message: error.message });
  }
});

// 3. 메인 화면 통합 데이터 조회 API (users, inbody_reports, medications, ai_diagnoses)
app.get("/api/home/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1) 회원 정보 조회
    const [users] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);
    if (users.length === 0) {
      return res.status(404).json({ message: "회원을 찾을 수 없습니다." });
    }

    // 2) 최신 건강리포트 1건 조회
    const [reports] = await pool.query(
      "SELECT * FROM inbody_reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId],
    );

    // 3) 처방약 스케줄 1건 조회
    const [medications] = await pool.query(
      "SELECT * FROM medications WHERE user_id = ? LIMIT 1",
      [userId],
    );

    // 4) 최신 AI 보장진단 1건 조회
    const [diagnoses] = await pool.query(
      "SELECT * FROM ai_diagnoses WHERE user_id = ? ORDER BY diagnosed_at DESC LIMIT 1",
      [userId],
    );

    // 프론트엔드로 한 번에 묶어서 응답
    res.json({
      user: users[0],
      report: reports[0] || null,
      medication: medications[0] || null,
      diagnosis: diagnoses[0] || null,
    });
  } catch (error) {
    console.error("메인 데이터 조회 에러:", error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(
    `🚀 MEDI:CARE 백엔드 서버가 http://localhost:${PORT} 에서 실행 중입니다.`,
  );
});
