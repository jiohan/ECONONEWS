# 📚 JavaScript 경제 뉴스 백엔드 완전 초보자 로드맵
**최종 업데이트**: 2025년 12월 9일 (v2.0 - 보안/버전 최신화)  
**대상**: JavaScript 초보자, 프로그래밍 경험 최소  
**소요 기간**: 약 3-4주 (매일 2-3시간)

---

## 🚀 Phase 0: 개발 환경 설정 (기초 구축) - 1-2일

### 0.1 필수 도구 설치

```bash
# 1️⃣ Node.js 설치 (LTS 버전 22.x 이상 권장)
# 2024년 10월 이후 최신 LTS 버전 (Node.js 20.x는 단종됨)
# macOS: brew install node@22
# Windows: choco install nodejs-lts (또는 공식 사이트에서 직접 다운로드)
# Linux: sudo apt install nodejs npm

# 2️⃣ VS Code 설치 (공식 사이트)

# 3️⃣ Git 설치 및 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 4️⃣ Docker Desktop 설치 (로컬 PostgreSQL 실행용)
# 공식 사이트: docker.com

# 5️⃣ 터미널에서 버전 확인 (모두 설치 완료 확인)
node --version    # v22.x.x 이상 필수
npm --version     # v10.x.x 이상
git --version     # git version 2.x
docker --version  # Docker version 24.x 이상
```

### 0.2 프로젝트 초기화

```bash
# 1️⃣ 작업 폴더 생성
mkdir ai-news-backend
cd ai-news-backend

# 2️⃣ Git 레포지토리 초기화 (GitHub 원격 연결)
git init
git remote add origin https://github.com/YOUR_USERNAME/ai-news-backend.git

# 3️⃣ .gitignore 파일 생성 (민감한 파일 제외)
cat > .gitignore << 'EOF'
# Node modules
node_modules/
package-lock.json

# 환경 변수 (⚠️ .env 는 절대 GitHub에 올리면 안됨)
.env
.env.local
.env.*.local

# 에디터
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# 로그 파일
logs/
*.log
npm-debug.log*

# Build 폴더
dist/
build/

# Prisma
prisma/dev.db
prisma/migrations
EOF

# 4️⃣ npm 초기화
npm init -y

# 5️⃣ 필수 패키지 설치 (최신 버전)
npm install express@^4.21.0 dotenv@^16.4.5 cors@^2.8.5 prisma@^6.2.0 @prisma/client@^6.2.0 winston@^3.17.0

# 6️⃣ 개발용 패키지 설치
npm install --save-dev nodemon@^3.1.7

# 버전 확인
cat package.json
```

### 0.3 프로젝트 폴더 구조 만들기

```bash
# 다음 폴더와 파일을 수동으로 생성
# 또는 다음 스크립트로 자동 생성

mkdir -p src/models src/routes src/controllers src/middleware src/utils src/config
mkdir -p prisma
mkdir -p logs
touch src/server.js
touch src/config/database.js
touch src/config/logger.js
touch src/routes/newsRoutes.js
touch src/controllers/newsController.js
touch src/middleware/errorHandler.js
touch src/middleware/validation.js
touch docker-compose.yml
touch Dockerfile
touch .env
touch .env.example

# 폴더 구조 최종 확인
tree -L 2  # 또는 find . -type d | head -20
```

**최종 구조:**
```
ai-news-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Prisma 싱글톤
│   │   └── logger.js            # Winston 설정
│   ├── routes/
│   │   └── newsRoutes.js        # API 라우트 정의
│   ├── controllers/
│   │   └── newsController.js    # 비즈니스 로직 (CRUD)
│   ├── middleware/
│   │   ├── errorHandler.js      # 에러 처리
│   │   └── validation.js        # 입력 데이터 검증
│   ├── utils/                   # 유틸리티 함수 (나중에 추가)
│   └── server.js                # 메인 애플리케이션
├── prisma/
│   ├── schema.prisma            # DB 스키마 정의
│   └── migrations/              # DB 마이그레이션 히스토리 (자동 생성)
├── logs/                        # Winston 로그 저장 위치
├── docker-compose.yml           # Docker 설정
├── Dockerfile                   # Node.js 컨테이너 정의
├── .env                         # 환경 변수 (Git에 올리지 않음)
├── .env.example                 # 환경 변수 템플릿 (GitHub에 올림)
├── .gitignore                   # Git 무시 목록
├── package.json                 # 프로젝트 메타데이터
├── package-lock.json
└── README.md                    # 프로젝트 설명
```

### 0.4 .env 파일 생성 (환경 변수 설정)

```bash
# .env 파일 (Git 무시 목록에 있음 - 로컬에만 존재)
# 절대 GitHub에 올리면 안 됨!
cat > .env << 'EOF'
# 서버 설정
NODE_ENV=development
PORT=3000

# PostgreSQL 데이터베이스
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_news_db"

# API 인증 (나중에 추가할 n8n API Key)
API_KEY=your_secret_api_key_here

# API 키 (필요시 추가)
GEMINI_API_KEY=your_gemini_key_here
PERPLEXITY_API_KEY=your_perplexity_key_here

# CORS 설정 (프론트엔드 주소)
CORS_ORIGIN=http://localhost:3001

# 로그 레벨
LOG_LEVEL=info
EOF

# .env.example 파일 (GitHub에 올림 - 다른 개발자가 참고용)
# 실제 값은 없고 형식만 표시
cat > .env.example << 'EOF'
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_news_db"
API_KEY=your_secret_api_key_here
GEMINI_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
CORS_ORIGIN=http://localhost:3001
LOG_LEVEL=info
EOF
```

### 0.5 package.json 수정 (npm 스크립트 설정)

```json
{
  "name": "ai-news-backend",
  "version": "1.0.0",
  "description": "AI-powered economic news analysis backend",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "db:init": "prisma migrate dev --name init",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset --force",
    "db:seed": "node prisma/seed.js"
  },
  "dependencies": {
    "express": "^4.21.0",
    "dotenv": "^16.4.5",
    "cors": "^2.8.5",
    "prisma": "^6.2.0",
    "@prisma/client": "^6.2.0",
    "winston": "^3.17.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

---

## 🗄️ Phase 1: 데이터베이스 설계 (DB 중심 사고) - 2-3일

### 1.1 Docker로 PostgreSQL 실행하기

```bash
# docker-compose.yml 파일 생성
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # 🐘 PostgreSQL 데이터베이스 (최신 LTS 버전 17)
  postgres:
    image: postgres:17-alpine
    container_name: ai-news-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ai_news_db
    ports:
      - "5432:5432"
    volumes:
      # ⚠️ volumes 중요: 컨테이너 재시작해도 데이터 보존
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - ai-news-network

volumes:
  postgres_data:

networks:
  ai-news-network:
    driver: bridge
EOF

# PostgreSQL 컨테이너 시작
docker-compose up -d

# 실행 확인 (HEALTHY 상태가 나올 때까지 대기, 10-20초)
docker-compose ps

# 로그 확인 (문제 발생 시)
docker-compose logs postgres
```

### 1.2 Prisma 초기화 및 스키마 설계

```bash
# Prisma 초기화 (prisma/schema.prisma 자동 생성)
npx prisma init

# 기본 DATABASE_URL이 .env에 추가됨 (이미 있으면 그대로 둠)
```

**prisma/schema.prisma** - 최종 버전 (수정됨):

```prisma
// Prisma 스키마: DB 테이블 정의

// 데이터베이스: PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ORM 생성기
generator client {
  provider = "prisma-client-js"
}

// ============================================
// News 모델: 경제 뉴스 저장 테이블
// ============================================
model News {
  // 기본 필드
  id              Int     @id @default(autoincrement())
  title           String  // ⭐ 제목 (유니크 제약 제거됨 - 같은 제목도 여러 개 저장 가능)
  url             String  @unique  // ⭐ URL은 중복 제거 (유니크 키) - 가장 중요한 중복 방지
  date            DateTime         // 뉴스 발행 날짜
  
  // 뉴스 내용
  summary         String  @db.Text  // 기사 요약 (긴 텍스트는 @db.Text)
  keyMetrics      String?           // 주요 지표 (선택사항: NULL 가능)
  sourceUrl       String?           // 원문 링크
  
  // ⭐ 경제 용어 설명 (JSON으로 저장 - 개수 제한 없음)
  // 나중에 별도 테이블로 분리 가능 (리팩토링 용이)
  // 현재는 JSON으로 저장하되, 필수 필드는 아님
  terms           Json?    // [{name: "...", definition: "...", explanation: "..."}, ...]
  
  // 타임스탬프 (자동 관리)
  createdAt       DateTime @default(now())  // 생성 시간 (자동 기록)
  updatedAt       DateTime @updatedAt       // 수정 시간 (자동 업데이트)
  
  // 인덱싱: 빠른 조회를 위해 자주 검색하는 필드
  @@index([date])          // 날짜로 자주 검색
  @@index([createdAt])     // 생성 시간으로 정렬
}

// ============================================
// User 모델: 사용자 정보 (나중에 추가)
// ============================================
model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique          // 이메일은 유니크 (중복 불가)
  password  String                   // ⚠️ 절대 평문 저장 금지! bcrypt로 해시해야 함
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // 관계 정의 (나중에 추가 예정)
  // savedNews SavedNews[]
  
  @@index([email])
}

// ============================================
// SavedNews 모델: 사용자가 저장한 뉴스 (나중에 추가)
// ============================================
// model SavedNews {
//   id        Int     @id @default(autoincrement())
//   userId    Int
//   newsId    Int
//   
//   user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
//   news      News    @relation(fields: [newsId], references: [id], onDelete: Cascade)
//   
//   createdAt DateTime @default(now())
//   
//   // 중복 저장 방지 (같은 뉴스를 2번 저장 못하도록)
//   @@unique([userId, newsId])
// }
```

**주요 변경사항:**
- ✅ `title`에서 `@unique` 제거 (같은 제목 여러 개 저장 가능)
- ✅ `url`만 `@unique` 유지 (n8n 중복 방지)
- ✅ 경제 용어를 `Json` 필드로 변경 (개수 제한 없음)
- ✅ 나중에 별도 테이블로 리팩토링 가능

### 1.3 데이터베이스 마이그레이션 실행

```bash
# 스키마를 PostgreSQL에 적용
npx prisma migrate dev --name init

# 결과:
# ✔ Successfully created migrations folder
# ✔ Created database
# ✔ Prisma Migrate created the following database tables:
# ✔ Done!

# ⭐ Prisma Studio 실행 (웹 UI로 DB 관리)
npx prisma studio

# ⚠️ Docker에서는 자동으로 브라우저가 안 열림
# 수동으로 http://localhost:5555 접속

# Docker 컨테이너 내에서 실행하는 경우
docker-compose exec backend npx prisma studio
```

### 1.4 샘플 데이터 입력 (테스트용)

```bash
# prisma/seed.js 파일 생성 (샘플 데이터)
cat > prisma/seed.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 기존 데이터 삭제 (테스트할 때)
  await prisma.news.deleteMany({});

  // 샘플 뉴스 3개 생성
  const news1 = await prisma.news.create({
    data: {
      title: "미국 연방준비제도가 기준금리 0.25% 인하",
      url: "https://example.com/news/fed-rate-cut-2025-12",
      date: new Date("2025-12-08"),
      summary: "미 연방준비제도(Fed)가 12월 정책위원회에서 기준금리를 4.25~4.50%로 인하했다. 이는 인플레이션 완화와 경기 둔화를 고려한 결정이다.",
      keyMetrics: "기준금리 0.25% 인하, S&P 500 +1.5%, 달러 약세",
      sourceUrl: "https://example.com/news/fed-rate-cut-2025-12",
      terms: [
        {
          name: "기준금리(Base Rate)",
          definition: "중앙은행이 정하는 기본 금리",
          explanation: "은행들이 돈을 빌려줄 때 참고하는 기본 금리. 낮으면 대출이 쉬워져 경기가 활성화되고, 높으면 대출이 어려워져 물가가 안정된다."
        },
        {
          name: "인플레이션(Inflation)",
          definition: "물가 상승률",
          explanation: "시간이 지남에 따라 같은 제품의 가격이 올라가는 현상. 예: 1년 전에 빵이 3000원이었는데 지금 3300원이면 10% 인플레이션."
        }
      ]
    },
  });

  const news2 = await prisma.news.create({
    data: {
      title: "삼성전자 3분기 영업이익 22조 원대 기대",
      url: "https://example.com/news/samsung-earnings-2025-q3",
      date: new Date("2025-12-07"),
      summary: "삼성전자가 3분기 영업이익 22조 원대를 기록할 것으로 예상된다. 반도체 가격 상승과 AI 칩 수요 증가가 주요 요인이다.",
      keyMetrics: "영업이익 22조 원, 반도체 매출 +30%, AI 칩 수요 250% 증가",
      sourceUrl: "https://example.com/news/samsung-earnings-2025-q3",
      terms: [
        {
          name: "영업이익(Operating Profit)",
          definition: "본업으로 버는 순수 이익",
          explanation: "회사가 물건을 팔아서 벌고, 생산 비용을 뺀 것. 순수하게 본업으로 번 돈을 의미한다."
        },
        {
          name: "반도체(Semiconductor)",
          definition: "스마트폰, 컴퓨터 등의 핵심 부품",
          explanation: "전자 제품의 '뇌' 역할. 반도체 가격이 올라가면 컴퓨터, 휴대폰 가격도 올라간다."
        }
      ]
    },
  });

  const news3 = await prisma.news.create({
    data: {
      title: "한국 4분기 GDP 성장률 전망 상향",
      url: "https://example.com/news/korea-gdp-forecast-2025",
      date: new Date("2025-12-06"),
      summary: "한국은행이 올해 4분기 GDP 성장률을 2.5%로 전망했다. 수출 호조와 정부 투자 확대가 견인할 것으로 예상된다.",
      keyMetrics: "GDP 성장률 2.5%, 수출 +5%, 정부 투자 확대",
      sourceUrl: "https://example.com/news/korea-gdp-forecast-2025",
      terms: [
        {
          name: "GDP(국내총생산)",
          definition: "한 나라에서 1년간 생산된 모든 상품과 서비스의 총합",
          explanation: "국가 경제 규모를 측정하는 가장 중요한 지표. GDP가 높으면 그 나라 경제가 잘 돌아가고 있다는 의미."
        }
      ]
    },
  });

  console.log('✅ 샘플 데이터 삽입 완료');
  console.log('📰 생성된 뉴스:');
  console.log(`   1. ${news1.title}`);
  console.log(`   2. ${news2.title}`);
  console.log(`   3. ${news3.title}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# seed 스크립트 실행
npm run db:seed

# 결과:
# ✅ 샘플 데이터 삽입 완료
```

---

## 🛠️ Phase 2: 백엔드 로직 구현 (안정성 강화) - 3-5일

### 2.1 설정 파일 만들기

**src/config/database.js** - Prisma 싱글톤 (중복 생성 방지):

```javascript
// Prisma Client 싱글톤 패턴
// 여러 번 생성되지 않도록 방지 (메모리 누수 방지)

const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  // 프로덕션: 새로 생성
  prisma = new PrismaClient();
} else {
  // 개발 모드: 전역 변수에 저장해서 재사용
  // (nodemon으로 재시작할 때 연결이 중복되지 않도록)
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['info', 'warn', 'error'],  // 로그 레벨 설정
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;
```

**src/config/logger.js** - Winston 로깅 (파일 저장):

```javascript
// Winston: 서버 로그를 파일로 저장하는 라이브러리
// 콘솔 + 파일 동시 기록

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// 로그 파일 저장 경로
const logsDir = path.join(__dirname, '../../logs');

// logs 디렉토리가 없으면 자동 생성
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// 로그 포맷 설정 (언제, 어디서, 뭐가 실패했는지 기록)
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Winston logger 생성
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // 1️⃣ 콘솔에 출력 (터미널에서 바로 보기)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}] ${message}`;
        })
      ),
    }),
    // 2️⃣ 에러 로그 파일에 저장 (logs/error.log)
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880,  // 5MB 이상이면 새 파일로
      maxFiles: 5,       // 최대 5개 파일 유지
    }),
    // 3️⃣ 모든 로그 파일에 저장 (logs/combined.log)
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;
```

### 2.2 뉴스 데이터 처리 로직 (개선됨)

**src/controllers/newsController.js** - CRUD 로직:

```javascript
// Controller: 뉴스 데이터를 받아서 처리하고, DB에 저장/조회하는 로직

const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * 🟢 GET /api/news
 * 저장된 뉴스 모두 조회 (최신순 정렬, 페이지네이션)
 */
const getAllNews = async (req, res, next) => {
  try {
    // 쿼리 파라미터에서 페이지 정보 받기
    const page = Math.max(1, parseInt(req.query.page) || 1);  // 최소값: 1
    const limit = 10;                                          // 한 번에 10개씩
    const skip = (page - 1) * limit;                          // 스킵할 데이터 개수

    // 전체 뉴스 개수 확인 (페이지 계산용)
    const total = await prisma.news.count();

    // 뉴스 조회 (날짜 내림차순, 최신순으로 정렬)
    const news = await prisma.news.findMany({
      orderBy: {
        date: 'desc',  // 최신 뉴스가 먼저
      },
      skip: skip,
      take: limit,
    });

    // 성공 응답
    res.json({
      success: true,
      data: news,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });

    logger.info(`📰 뉴스 조회 성공: 페이지 ${page}, ${news.length}개 항목`);
  } catch (error) {
    logger.error(`❌ 뉴스 조회 실패: ${error.message}`);
    next(error);  // 에러 핸들러로 전달
  }
};

/**
 * 🟡 POST /api/news
 * n8n에서 보낸 뉴스를 DB에 저장 (중복 방지)
 * ⭐ API Key 검증 필요 (향후 추가)
 */
const createNews = async (req, res, next) => {
  try {
    const {
      title,
      url,
      date,
      summary,
      keyMetrics,
      sourceUrl,
      terms,  // 배열로 들어옴: [{name, definition, explanation}, ...]
    } = req.body;

    // 필수 필드 검증 (middleware에서도 하지만, 여기서 한 번 더)
    if (!title || !url || !date || !summary) {
      return res.status(400).json({
        success: false,
        error: '필수 필드 누락',
        required: ['title', 'url', 'date', 'summary'],
      });
    }

    // ⭐ Upsert 사용: URL이 이미 있으면 업데이트, 없으면 생성
    // 이렇게 하면 n8n에서 중복 뉴스를 여러 번 보내도 DB에는 1번만 저장됨
    const newsData = {
      title,
      url,
      date: new Date(date),
      summary,
      keyMetrics: keyMetrics || null,
      sourceUrl: sourceUrl || null,
      // JSON 필드로 저장 (개수 제한 없음)
      terms: terms && Array.isArray(terms) ? terms : null,
    };

    // Upsert: URL을 기준으로 중복 체크
    const news = await prisma.news.upsert({
      where: { url },  // ⭐ URL이 유니크하므로, 이것을 기준으로 검색
      update: {
        // 기존 데이터 업데이트 (제목은 제외)
        summary: newsData.summary,
        keyMetrics: newsData.keyMetrics,
        terms: newsData.terms,
        date: newsData.date,
      },
      create: newsData,  // 없으면 새로 생성
    });

    res.status(201).json({
      success: true,
      message: '뉴스 저장 성공',
      data: news,
    });

    logger.info(`✅ 뉴스 저장: "${news.title}" (ID: ${news.id})`);
  } catch (error) {
    logger.error(`❌ 뉴스 저장 실패: ${error.message}`);
    next(error);  // 에러 핸들러로 전달
  }
};

/**
 * 🔵 GET /api/news/:id
 * 특정 뉴스 1개 조회
 */
const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ID 유효성 확인
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 뉴스 ID',
      });
    }

    const news = await prisma.news.findUnique({
      where: { id: parseInt(id) },
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        error: '뉴스를 찾을 수 없습니다',
        id: parseInt(id),
      });
    }

    res.json({
      success: true,
      data: news,
    });

    logger.info(`🔍 뉴스 조회: ID ${id}`);
  } catch (error) {
    logger.error(`❌ 뉴스 조회 실패: ${error.message}`);
    next(error);
  }
};

/**
 * 🔴 DELETE /api/news/:id
 * 뉴스 삭제
 */
const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ID 유효성 확인
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: '유효하지 않은 뉴스 ID',
      });
    }

    const deletedNews = await prisma.news.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: '뉴스 삭제 완료',
      data: deletedNews,
    });

    logger.info(`🗑️ 뉴스 삭제: "${deletedNews.title}" (ID: ${deletedNews.id})`);
  } catch (error) {
    logger.error(`❌ 뉴스 삭제 실패: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getAllNews,
  createNews,
  getNewsById,
  deleteNews,
};
```

### 2.3 API 라우트 정의

**src/routes/newsRoutes.js** - 뉴스 API 엔드포인트:

```javascript
// Routes: API URL 경로와 해당 Controller를 연결

const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { validateNewsInput } = require('../middleware/validation');

// 📰 뉴스 관련 API
// GET: 모든 뉴스 조회
router.get('/news', newsController.getAllNews);

// POST: 뉴스 생성 (n8n에서 호출) - 입력 검증 미들웨어 추가
router.post('/news', validateNewsInput, newsController.createNews);

// GET: 특정 뉴스 1개 조회
router.get('/news/:id', newsController.getNewsById);

// DELETE: 뉴스 삭제
router.delete('/news/:id', newsController.deleteNews);

module.exports = router;
```

### 2.4 에러 처리 미들웨어 (개선됨)

**src/middleware/errorHandler.js** - Prisma 에러 자동 감지:

```javascript
// 모든 에러를 한 곳에서 처리하는 미들웨어
// Prisma 특정 에러를 자동으로 감지하고 적절한 HTTP 상태 코드 반환

const logger = require('../config/logger');

/**
 * Express 에러 미들웨어
 * 4개 파라미터를 받으면 Express가 자동으로 에러 핸들러로 인식
 * @param {Error} err - 에러 객체
 * @param {Object} req - 요청 객체
 * @param {Object} res - 응답 객체
 * @param {Function} next - 다음 미들웨어
 */
const errorHandler = (err, req, res, next) => {
  // Prisma 에러 감지 (Prisma 에러는 err.code 필드 사용)
  const isPrismaError = err.code?.startsWith('P');

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || '서버 에러 발생';

  // Prisma 특정 에러 처리
  if (isPrismaError) {
    if (err.code === 'P2002') {
      // 유니크 제약 조건 위반
      statusCode = 400;
      message = '중복된 데이터입니다 (URL이 이미 존재합니다)';
    } else if (err.code === 'P2025') {
      // 레코드를 찾을 수 없음 (DELETE, UPDATE 시)
      statusCode = 404;
      message = '찾을 수 없는 데이터입니다';
    } else if (err.code === 'P1000') {
      // 데이터베이스 연결 실패
      statusCode = 503;
      message = '데이터베이스에 연결할 수 없습니다';
    }
  }

  // 발생한 에러 로깅
  logger.error(`🚨 [${statusCode}] ${message}`, {
    code: isPrismaError ? err.code : undefined,
    method: req.method,
    path: req.path,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // 에러 응답 포맷 통일
  res.status(statusCode).json({
    success: false,
    error: message,
    code: isPrismaError ? err.code : undefined,
    timestamp: new Date().toISOString(),
    path: req.path,
    // 개발 환경에서만 스택 트레이스 포함
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

### 2.5 입력 데이터 검증 미들웨어 (강화됨)

**src/middleware/validation.js** - n8n 데이터 검증:

```javascript
// n8n에서 보낸 데이터가 올바른 형식인지 확인

const logger = require('../config/logger');

/**
 * 뉴스 생성 시 필수 필드 검증 미들웨어
 * POST /api/news 요청 전에 실행됨
 */
const validateNewsInput = (req, res, next) => {
  const { title, url, date, summary } = req.body;

  // 1️⃣ 필수 필드 존재 여부 확인
  if (!title || !url || !date || !summary) {
    logger.warn(`⚠️ 뉴스 생성 요청에 필수 필드 누락`, {
      received: Object.keys(req.body),
      missing: [],
    });

    return res.status(400).json({
      success: false,
      error: '필수 필드 누락',
      required: ['title', 'url', 'date', 'summary'],
      received: Object.keys(req.body),
    });
  }

  // 2️⃣ 유효한 URL 형식 확인
  try {
    new URL(url);  // URL 생성자로 검증
  } catch {
    logger.warn(`⚠️ 잘못된 URL 형식: ${url}`);
    return res.status(400).json({
      success: false,
      error: 'URL 형식이 잘못되었습니다',
      example: 'https://example.com/news',
      received: url,
    });
  }

  // 3️⃣ 유효한 날짜 확인
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    logger.warn(`⚠️ 잘못된 날짜 형식: ${date}`);
    return res.status(400).json({
      success: false,
      error: '날짜 형식이 잘못되었습니다',
      example: '2025-12-08 또는 2025-12-08T12:00:00Z',
      received: date,
    });
  }

  // 4️⃣ 문자열 길이 확인 (매우 긴 입력 방지)
  if (title.length > 500) {
    return res.status(400).json({
      success: false,
      error: '제목이 너무 깁니다 (최대 500자)',
      received: title.length,
    });
  }

  if (summary.length > 10000) {
    return res.status(400).json({
      success: false,
      error: '요약이 너무 깁니다 (최대 10000자)',
      received: summary.length,
    });
  }

  // ✅ 모든 검증 통과
  next();
};

module.exports = {
  validateNewsInput,
};
```

---

## 🚀 Phase 3: Express 서버 구축 - 1-2일

### 3.1 메인 서버 파일 (개선됨)

**src/server.js** - Express 애플리케이션 (CORS 보안 강화):

```javascript
// Express 서버: 모든 미들웨어, 라우트, 에러 핸들링을 연결하는 진입점

require('dotenv').config();  // ⭐ .env 파일 로드 (반드시 맨 위에!)

const express = require('express');
const cors = require('cors');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');
const newsRoutes = require('./routes/newsRoutes');
const { validateNewsInput } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 1️⃣ CORS 설정 (프론트엔드 접근 제어)
// ============================================

// 허용할 도메인 목록
const allowedOrigins = (
  process.env.CORS_ORIGIN || 'http://localhost:3001'
).split(',').map(origin => origin.trim());

// CORS 미들웨어 (환경별로 다르게 설정)
app.use(cors({
  origin: (origin, callback) => {
    // origin이 없으면 (curl, Postman 등) 허용
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // 허용되지 않은 도메인
      logger.warn(`⚠️ CORS 거부: ${origin}`);
      callback(new Error(`CORS not allowed: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  optionsSuccessStatus: 200,
}));

// ============================================
// 2️⃣ 기본 미들웨어
// ============================================

// JSON 요청 바디 파싱 (n8n에서 JSON으로 보내는 데이터를 읽기 위함)
app.use(express.json({ limit: '10mb' }));  // 최대 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// ============================================
// 3️⃣ 헬스 체크 엔드포인트
// ============================================
// Docker / 로드 밸런서가 서버 상태를 확인할 때 사용

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ============================================
// 4️⃣ API 라우트 등록
// ============================================

// 뉴스 API 라우트
app.use('/api', newsRoutes);

// ============================================
// 5️⃣ 404 처리 (정의되지 않은 라우트)
// ============================================

app.use((req, res, next) => {
  logger.warn(`⚠️ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: '찾을 수 없는 엔드포인트',
    method: req.method,
    path: req.path,
    availableEndpoints: [
      'GET /health',
      'GET /api/news',
      'POST /api/news',
      'GET /api/news/:id',
      'DELETE /api/news/:id',
    ],
  });
});

// ============================================
// 6️⃣ 글로벌 에러 핸들러
// ============================================
// (모든 라우트 등록 후 마지막에 추가)

app.use(errorHandler);

// ============================================
// 7️⃣ 서버 시작
// ============================================

const server = app.listen(PORT, () => {
  logger.info(`✅ Express 서버 시작됨: http://localhost:${PORT}`);
  logger.info(`🔍 헬스 체크: http://localhost:${PORT}/health`);
  logger.info(`📚 API 문서: http://localhost:${PORT}/api/news`);
  logger.info(`🌍 CORS 허용 도메인: ${allowedOrigins.join(', ')}`);
  logger.info(`📝 환경: ${process.env.NODE_ENV}`);
});

// ============================================
// 8️⃣ 에러 처리 (비동기 에러, 미처리 rejection)
// ============================================

// Promise Rejection 처리
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`🚨 처리되지 않은 Promise Rejection`, {
    reason: String(reason),
    promise: promise.toString(),
  });
});

// Exception 처리 (즉시 프로세스 종료)
process.on('uncaughtException', (error) => {
  logger.error(`🚨 처리되지 않은 Exception: ${error.message}`, {
    stack: error.stack,
  });
  process.exit(1);  // 심각한 에러면 프로세스 종료
});

// 서버 종료 시 정리
process.on('SIGTERM', async () => {
  logger.info('📴 SIGTERM 신호 수신, 서버를 종료합니다');
  server.close(async () => {
    logger.info('✅ 서버 종료 완료');
    process.exit(0);
  });
});

module.exports = app;
```

### 3.2 로컬 테스트 실행

```bash
# 1️⃣ 터미널에서 개발 서버 시작
npm run dev

# 결과:
# ✅ Express 서버 시작됨: http://localhost:3000
# 🔍 헬스 체크: http://localhost:3000/health

# 2️⃣ 다른 터미널에서 API 테스트
# 헬스 체크
curl http://localhost:3000/health

# 뉴스 조회
curl http://localhost:3000/api/news

# 뉴스 생성 (n8n이 보낼 데이터 형식으로)
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 뉴스",
    "url": "https://example.com/test-news-001",
    "date": "2025-12-08",
    "summary": "이것은 테스트 요약입니다",
    "keyMetrics": "테스트 지표",
    "terms": [
      {
        "name": "테스트 용어",
        "definition": "정의입니다",
        "explanation": "설명입니다"
      }
    ]
  }'

# 특정 뉴스 조회
curl http://localhost:3000/api/news/1

# 뉴스 삭제
curl -X DELETE http://localhost:3000/api/news/1
```

### 3.3 추천 테스트 도구 (GUI 방식)

**로컬에서 API를 쉽게 테스트하는 방법:**

1. **Postman** (가장 유명)
   - 다운로드: https://www.postman.com/downloads
   - 무료 버전으로 충분함

2. **Insomnia** (가볍고 빠름)
   - 다운로드: https://insomnia.rest

3. **VS Code Thunder Client** (확장 프로그램)
   - VS Code에서 바로 설치 가능
   - 매우 가벼움

4. **REST Client** (VS Code 확장)
   - `.http` 파일로 요청 저장 가능
   - 가장 가볍고 빠름

---

## 📱 Phase 4: 프론트엔드 연결 (선택사항) - 2-3일

**⭐ Phase 0-3까지 완료하면 백엔드는 완전히 끝남**
- n8n과 자동으로 연결 가능
- Phase 4는 "웹 UI가 필요하면" 진행

### 4.1 React + Vite 프로젝트 생성

```bash
# 백엔드 폴더 바깥에서 프론트엔드 생성
cd ..
npm create vite@latest ai-news-frontend -- --template react
cd ai-news-frontend
npm install

# 데이터 페칭 라이브러리 설치
npm install @tanstack/react-query axios

# 스타일링 라이브러리 (선택)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 4.2 API 호출 훅

**src/hooks/useNews.js** - React Query로 데이터 관리:

```javascript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * 모든 뉴스 조회 훅
 */
export const useGetNews = (page = 1) => {
  return useQuery({
    queryKey: ['news', page],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/news?page=${page}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,  // 5분 동안 캐시
  });
};

/**
 * 특정 뉴스 1개 조회 훅
 */
export const useGetNewsById = (id) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/news/${id}`);
      return response.data;
    },
    enabled: !!id,  // id가 있을 때만 요청
  });
};
```

### 4.3 뉴스 컴포넌트

**src/components/NewsList.jsx** - 뉴스 목록 표시:

```javascript
import { useGetNews } from '../hooks/useNews';
import { useState } from 'react';

export const NewsList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetNews(page);

  if (isLoading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">에러: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">경제 뉴스</h1>
      
      {/* 뉴스 목록 */}
      <div className="space-y-4">
        {data?.data.map((news) => (
          <article key={news.id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">{news.title}</h2>
            <p className="text-gray-600 mt-2">{news.summary}</p>
            
            {/* 경제 용어 표시 */}
            {news.terms && news.terms.length > 0 && (
              <div className="mt-4 bg-gray-50 p-3 rounded">
                <h3 className="font-semibold text-sm">경제 용어</h3>
                {news.terms.map((term, idx) => (
                  <div key={idx} className="mt-2 text-sm">
                    <span className="font-medium">{term.name}</span>: {term.definition}
                  </div>
                ))}
              </div>
            )}
            
            <small className="text-gray-400 mt-2 block">
              {new Date(news.date).toLocaleDateString()}
            </small>
          </article>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          이전
        </button>
        <span className="px-4 py-2">
          페이지 {page} / {data?.pagination.totalPages}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= data?.pagination.totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          다음
        </button>
      </div>
    </div>
  );
};
```

---

## 🐳 Phase 5: Docker 배포 (완전 자동화) - 2-3일

### 5.1 Node.js Dockerfile

**Dockerfile** - 멀티 스테이지 빌드 (용량 최소화):

```dockerfile
# Step 1: 빌드 단계 (의존성 설치)
FROM node:22-alpine AS builder

WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# Step 2: 실행 단계 (최종 이미지)
FROM node:22-alpine

WORKDIR /app

# 실행 권한을 가진 사용자 추가 (보안)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 빌드 이미지에서 node_modules 복사
COPY --from=builder /app/node_modules ./node_modules

# 소스코드 복사
COPY src ./src
COPY prisma ./prisma
COPY .env.example ./.env

# 소유권 변경
RUN chown -R nodejs:nodejs /app

# Node 사용자로 전환
USER nodejs

# 포트 노출
EXPOSE 3000

# 헬스 체크 설정 (Docker가 주기적으로 확인)
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 서버 시작
CMD ["node", "src/server.js"]
```

### 5.2 Docker Compose 최종 설정 (완벽함)

**docker-compose.yml** - 완전한 설정:

```yaml
version: '3.8'

services:
  # 🐘 PostgreSQL 데이터베이스
  postgres:
    image: postgres:17-alpine
    container_name: ai-news-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
      POSTGRES_DB: ai_news_db
      POSTGRES_INITDB_ARGS: "--encoding=UTF8"
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      # 데이터 영구 보존
      - postgres_data:/var/lib/postgresql/data
      # 초기화 SQL 스크립트 (옵션)
      # - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d ai_news_db"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s
    networks:
      - ai-news-network
    restart: unless-stopped
    # 로그 설정
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # 🟢 Node.js 백엔드
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ai-news-backend
    environment:
      NODE_ENV: ${NODE_ENV:-production}
      PORT: 3000
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD:-password}@postgres:5432/ai_news_db
      CORS_ORIGIN: ${CORS_ORIGIN:-http://localhost:3001}
      API_KEY: ${API_KEY:-your_secret_key}
      LOG_LEVEL: ${LOG_LEVEL:-info}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      # 로그 파일 마운트 (호스트에서도 접근 가능)
      - ./logs:/app/logs
    networks:
      - ai-news-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

# 볼륨 정의
volumes:
  postgres_data:
    driver: local

# 네트워크 정의
networks:
  ai-news-network:
    driver: bridge
```

### 5.3 Docker로 배포하기

```bash
# 1️⃣ Docker 이미지 빌드
docker build -t ai-news-backend:latest .
docker build -t ai-news-backend:1.0 .  # 버전 태그

# 2️⃣ Docker Compose로 전체 스택 시작
docker-compose up -d

# 결과:
# ✔ Service postgres Pulled                          
# ✔ Service backend Built
# Starting ai-news-db      ... done
# Starting ai-news-backend ... done

# 3️⃣ 실행 상태 확인
docker-compose ps

# 예상 결과:
# NAME                COMMAND                  SERVICE      STATUS       PORTS
# ai-news-backend     "node src/server.js"     backend      Up (healthy) 0.0.0.0:3000->3000/tcp
# ai-news-db          "postgres"               postgres     Up (healthy) 0.0.0.0:5432->5432/tcp

# 4️⃣ 로그 확인 (실시간)
docker-compose logs -f backend

# 백엔드 로그만 보기
docker-compose logs -f backend

# 데이터베이스 로그만 보기
docker-compose logs -f postgres

# 5️⃣ API 테스트
curl http://localhost:3000/health

# 결과:
# {
#   "status": "ok",
#   "timestamp": "2025-12-09T22:46:00.000Z",
#   "uptime": 5.234,
#   "environment": "production"
# }

# 6️⃣ 데이터베이스 접속 (필요시)
docker-compose exec postgres psql -U postgres -d ai_news_db

# 7️⃣ 서버 중지
docker-compose down

# 데이터까지 삭제 (초기화) - ⚠️ 주의!
docker-compose down -v
```

### 5.4 환경 변수 설정 (.env)

**프로덕션용 .env 예시:**

```bash
# .env (배포 시 실제 값 입력)
NODE_ENV=production
PORT=3000
DB_PASSWORD=your_secure_password_here
DATABASE_URL="postgresql://postgres:your_secure_password_here@postgres:5432/ai_news_db"
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
API_KEY=your_very_secret_api_key_min_32_chars_long
LOG_LEVEL=info
```

---

## 🔗 Phase 6: n8n과 백엔드 연결 - 1일

### 6.1 n8n에서 백엔드로 데이터 보내기

**n8n Workflow에서 "HTTP Request" 노드 설정:**

#### 상황 1: 로컬 테스트 (n8n도 Docker, 백엔드도 Docker)

```
Method: POST
URL: http://backend:3000/api/news
(Docker 컴포즈 네트워크에서 서비스명으로 직접 접근 가능)

Headers:
- Content-Type: application/json
- X-API-Key: {{ env.API_KEY }}  (나중에 인증 추가 시)

Body (JSON):
{
  "title": "{{ $json.title }}",
  "url": "{{ $json.source_url }}",
  "date": "{{ $json.published_date }}",
  "summary": "{{ $json.content }}",
  "keyMetrics": "{{ $json.key_metrics }}",
  "sourceUrl": "{{ $json.source_url }}",
  "terms": [
    {
      "name": "{{ $json.term1_name }}",
      "definition": "{{ $json.term1_definition }}",
      "explanation": "{{ $json.term1_explanation }}"
    }
  ]
}
```

#### 상황 2: Mac/Windows Docker Desktop (로컬)

```
URL: http://host.docker.internal:3000/api/news
(Mac/Windows Docker Desktop에서만 지원)
```

#### 상황 3: Linux 호스트

```
URL: http://172.17.0.1:3000/api/news
또는 docker-compose 네트워크 사용
```

#### 상황 4: 원격 서버 배포

```
URL: http://your-domain.com:3000/api/news
또는 https://your-domain.com/api/news (Nginx 리버스 프록시 사용)
```

### 6.2 n8n 데이터 매핑 예시

**n8n에서 받은 데이터를 백엔드로 보낼 때:**

```javascript
// n8n의 데이터 예시
{
  "title": "Fed, 금리 인상 결정",
  "source_url": "https://example.com/news/123",
  "published_date": "2025-12-08T12:00:00Z",
  "content": "미 연방준비제도가 기준금리를 0.25% 인상했다...",
  "key_metrics": "금리 +0.25%, S&P 500 -1.2%",
  "term1_name": "기준금리",
  "term1_definition": "중앙은행이 정하는 기본 금리",
  "term1_explanation": "은행들이 돈을 빌려줄 때 참고하는 기본 금리..."
}

// 이를 HTTP Request 노드에서 매핑
→ 백엔드로 전송되는 데이터
{
  "title": "Fed, 금리 인상 결정",
  "url": "https://example.com/news/123",
  "date": "2025-12-08T12:00:00Z",
  "summary": "미 연방준비제도가 기준금리를 0.25% 인상했다...",
  "keyMetrics": "금리 +0.25%, S&P 500 -1.2%",
  "terms": [
    {
      "name": "기준금리",
      "definition": "중앙은행이 정하는 기본 금리",
      "explanation": "은행들이 돈을 빌려줄 때 참고하는 기본 금리..."
    }
  ]
}
```

### 6.3 n8n 응답 처리

**백엔드 응답:**
```json
{
  "success": true,
  "message": "뉴스 저장 성공",
  "data": {
    "id": 1,
    "title": "Fed, 금리 인상 결정",
    "url": "https://example.com/news/123",
    "date": "2025-12-08T12:00:00Z",
    "createdAt": "2025-12-09T22:46:00.000Z"
  }
}
```

**n8n에서 이 응답을 받아서:**
- ✅ 다음 단계로 진행
- ❌ 에러면 알림 전송
- 📊 결과를 Notion/Google Sheets에 저장

---

## 📚 JavaScript 기본 문법 (참고용)

### 자주 쓰는 패턴들

```javascript
// 1️⃣ 환경 변수 읽기
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// 2️⃣ 파일 시스템 접근
const fs = require('fs');
const path = require('path');
const logsDir = path.join(__dirname, '../../logs');

// 3️⃣ 모듈 내보내기
module.exports = { function1, function2 };
module.exports = singleExport;

// 4️⃣ 모듈 불러오기
const express = require('express');
const { function1 } = require('./file');

// 5️⃣ 비동기 함수 정의
const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('에러:', error);
    throw error;
  }
};

// 6️⃣ 미들웨어 패턴
const myMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();  // 다음 미들웨어로 전달
};

// 7️⃣ 에러 처리 미들웨어
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
};

// 8️⃣ Prisma 쿼리
const user = await prisma.user.create({
  data: { email: 'user@example.com' }
});

const users = await prisma.user.findMany({
  where: { age: { gte: 18 } },
  orderBy: { createdAt: 'desc' },
  take: 10,
});

// 9️⃣ 에러 감지
if (err.code === 'P2002') {
  // Prisma 유니크 제약 위반
}

// 🔟 로깅
logger.info('정보 메시지');
logger.warn('경고 메시지');
logger.error('에러 메시지');
```

---

## ✅ 최종 체크리스트

**Phase 0: 개발 환경**
- [ ] Node.js 22.x 설치 확인
- [ ] Docker Desktop 설치 확인
- [ ] 프로젝트 폴더 구조 생성
- [ ] npm 패키지 설치 완료
- [ ] .env, .env.example 파일 생성

**Phase 1: 데이터베이스**
- [ ] PostgreSQL 17 Docker 컨테이너 실행
- [ ] Prisma 초기화 완료
- [ ] schema.prisma 작성 (JSON 필드 포함)
- [ ] DB 마이그레이션 성공 (`npx prisma migrate dev`)
- [ ] Prisma Studio에서 테이블 확인 (http://localhost:5555)
- [ ] 샘플 데이터 삽입 완료

**Phase 2: 백엔드 로직**
- [ ] config/database.js (Prisma 싱글톤)
- [ ] config/logger.js (Winston)
- [ ] controllers/newsController.js (CRUD)
- [ ] routes/newsRoutes.js (라우트)
- [ ] middleware/errorHandler.js (Prisma 에러 처리)
- [ ] middleware/validation.js (입력 검증)

**Phase 3: Express 서버**
- [ ] src/server.js 작성 완료
- [ ] `npm run dev` 실행 성공
- [ ] http://localhost:3000/health 응답 확인
- [ ] curl로 API 테스트 성공
- [ ] 에러 핸들링 확인

**Phase 4: 프론트엔드 (선택)**
- [ ] React + Vite 프로젝트 생성 (필요 시)
- [ ] React Query 설치 (필요 시)
- [ ] API 훅 작성 (필요 시)

**Phase 5: Docker 배포**
- [ ] Dockerfile 작성 완료
- [ ] docker-compose.yml 작성 완료 (v1.1)
- [ ] `docker-compose up -d` 성공
- [ ] `docker-compose ps` 에서 HEALTHY 확인
- [ ] Docker 환경에서 API 테스트 성공

**Phase 6: n8n 연결**
- [ ] n8n에서 HTTP Request 노드 설정
- [ ] 올바른 엔드포인트 주소 입력 (docker/localhost/domain)
- [ ] 테스트 요청 성공
- [ ] 데이터베이스에 저장 확인

---

## 🚨 자주 발생하는 오류 및 해결법

### 1️⃣ EADDRINUSE: Port 3000 already in use

```bash
# 3000번 포트를 사용 중인 프로세스 확인
lsof -i :3000

# 프로세스 강제 종료
kill -9 <PID>

# 또는 다른 포트로 변경
PORT=3001 npm run dev
```

### 2️⃣ PostgreSQL 연결 실패

```bash
# Docker 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs postgres

# 컨테이너 재시작
docker-compose restart postgres

# 전체 초기화 (⚠️ 데이터 삭제됨)
docker-compose down -v
docker-compose up -d
```

### 3️⃣ Prisma 마이그레이션 실패

```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 수동 초기화 (주의: 데이터 삭제)
npx prisma migrate reset

# 또는 특정 마이그레이션 롤백
npx prisma migrate resolve --rolled-back "<migration_name>"
```

### 4️⃣ npm install 에러

```bash
# npm 캐시 정리
npm cache clean --force

# package-lock.json 삭제 후 재설치
rm package-lock.json
npm install

# Node 버전 확인
node --version  # 22.x.x 필수
```

### 5️⃣ Docker 이미지 빌드 실패

```bash
# 캐시 무시하고 다시 빌드
docker build --no-cache -t ai-news-backend:latest .

# 불필요한 이미지 정리
docker system prune -a
```

### 6️⃣ CORS 에러 (브라우저에서 API 접근 거부)

```bash
# CORS_ORIGIN 확인
echo $CORS_ORIGIN

# .env 파일에서 확인
cat .env | grep CORS_ORIGIN

# 수정 후 서버 재시작
npm run dev
```

### 7️⃣ 데이터베이스 연결 타임아웃

```bash
# DATABASE_URL 확인
echo $DATABASE_URL

# 데이터베이스 상태 확인
docker-compose ps postgres

# 헬스 체크 실행
docker-compose exec postgres pg_isready -U postgres
```

---

## 📖 추천 학습 자료

- **Express 공식 문서**: https://expressjs.com
- **Prisma 공식 문서**: https://www.prisma.io/docs
- **JavaScript 기초**: https://javascript.info
- **Docker 입문**: https://docs.docker.com/get-started
- **Node.js 가이드**: https://nodejs.org/docs
- **PostgreSQL 튜토리얼**: https://www.postgresql.org/docs

---

## 🎯 다음 단계

1. **Phase 0부터 차근차근 진행** (환경 설정부터)
2. **각 단계별로 테스트** (진행하면서 검증)
3. **막히는 부분 있으면 상세 설명 요청**
4. **완료 후 n8n과 통합** (실제 뉴스 자동 저장)

**이 로드맵을 따라가면 완전한 경제 뉴스 백엔드가 완성됩니다! 🚀**
