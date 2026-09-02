# Focus Wallet v0.9 — PWA

로그인, API, Prisma, PostgreSQL 없이 브라우저에서 바로 실행되는 개인용 집중 타이머 앱입니다.

## 기능
- 집중 타이머: 1분당 ₩100 적립
- 휴식권 구매: ₩200 = 휴식 1분
- 휴식권 사용/남은 시간 관리
- 오늘 목표 60분
- 콤보/연속 집중일/미션 진행도
- 최근 7일 기록
- localStorage 기반 저장
- PWA manifest + service worker
- GitHub Pages 정적 배포

## GitHub Pages 배포
1. 이 프로젝트를 GitHub repository에 올립니다.
2. Repository Settings → Pages → Source를 **GitHub Actions**로 선택합니다.
3. `main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 자동 배포합니다.
4. 일반적인 URL은 `https://사용자명.github.io/저장소명/` 입니다.

### 주의
- 데이터는 서버 DB가 아니라 **현재 브라우저의 localStorage**에 저장됩니다.
- 브라우저 데이터 삭제/시크릿 모드/기기 변경 시 기록이 사라질 수 있습니다.
- GitHub Pages에서는 로그인/API/Prisma가 사용되지 않습니다.
- 프로젝트 사이트 기준으로 workflow가 repository 이름을 base path로 자동 설정합니다.

## 모바일 앱처럼 사용
배포 URL을 휴대폰에서 열고 브라우저 메뉴의 **홈 화면에 추가 / 앱 설치**를 선택하면 독립 앱 형태로 실행할 수 있습니다.

## v0.9.1 — 모바일 반응형 + 사용자 목표 설정
- 모바일 화면(375~430px)을 기준으로 카드/상점/미션/통계를 반응형 재배치
- 오늘의 집중 목표를 사용자가 1~1,440분 범위에서 직접 설정
- 목표는 브라우저 `localStorage`에 저장되어 새로고침 후에도 유지
- 하루 휴식 사용량 제한 제거
- 구매한 휴식권의 남은 시간은 날짜가 바뀌어도 유지(사실상 이월)
