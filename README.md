# 🌦️ 대구 날씨 (Daegu Weather App)

대구 및 주요 군/구의 날씨와 미세먼지 정보를 실시간으로 확인하고, 생동감 넘치는 동영상 배경으로 현지의 분위기를 느낄 수 있는 웹 애플리케이션입니다.

![App Screenshot](./public/images/daegu.png)

## ✨ 주요 기능 (Key Features)

### 1. 🎥 동영상 배경 (Video Backgrounds)
- **생동감 있는 화면:** 대구의 각 지역(수성구, 중구, 달서구 등)을 대표하는 고화질 영상을 배경으로 제공합니다.
- **제어 가능:** 좌측 하단의 토글 버튼을 통해 **동영상 모드**와 **정지 이미지 모드**를 자유롭게 전환할 수 있습니다.
- **자동 재생 & 음소거:** 앱 실행 시 자동으로 재생되며, 사용자 경험을 위해 기본적으로 소리는 꺼져 있습니다.

### 2. 📱 완전 반응형 디자인 (Isomorphic Responsive UI)
- **데스크탑:** 좌우 대칭의 균형 잡힌 정보 패널 레이아웃을 제공합니다.
- **모바일 (< 850px):** 화면 폭이 좁아지면 자동으로 **세로 스크롤 모드**로 전환됩니다. 정보 패널이 중앙 하단으로 이동하여, 작은 화면에서도 정보가 잘리지 않고 쾌적하게 볼 수 있습니다.

### 3. ☁️ 실시간 날씨 & 미세먼지 (Real-time Data)
- **상세 예보:** Open-Meteo API를 통해 **향후 4일간의 날씨 예보**를 제공합니다.
- **대기질 모니터링:** 미세먼지(PM10) 및 초미세먼지(PM2.5) 농도를 실시간으로 확인하고, 4단계(좋음~매우나쁨) 등급으로 표시합니다.
- **시각 효과:** 안개(Fog), 구름(Clouds) 등 날씨 상태에 따라 화면에 리얼한 오버레이 효과가 적용됩니다.

### 4. 🌙 나이트 모드 (Night Mode)
- **자동 감지:** 일몰 이후에는 배경이 자동으로 어두워져(60% Dimming) 눈의 피로를 덜어줍니다.

## 🛠️ 기술 스택 (Tech Stack)
- **Framework:** React, TypeScript, Vite
- **Styling:** CSS Modules, Framer Motion (Animations)
- **Data:** Open-Meteo API, Date-fns
- **Icons:** React Icons (Wi, Fa)

## 🚀 설치 및 실행 (Setup)

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 📂 프로젝트 구조 (Structure)

```
src/
├── components/      # UI 컴포넌트 (WeatherInfo, Sidebar, Badge 등)
├── hooks/           # 커스텀 훅 (useWeather, useTime, useMediaQuery 등)
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 (API 호출, 지역 데이터 등)
└── App.tsx          # 메인 앱 로직
public/
└── images/          # 지역별 배경 이미지 및 동영상 (.mp4)
```

## 📝 라이선스
This project is licensed under the MIT License.
