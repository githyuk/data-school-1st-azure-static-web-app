import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // 👈 [핵심] 정적 파일 내보내기 설정
  eslint: {
    ignoreDuringBuilds: true, // 에러 무시하고 빌드 강행
  },
  images: {
    unoptimized: true, // 정적 모드에서는 이미지 최적화 끄기
  },
};

export default nextConfig;
