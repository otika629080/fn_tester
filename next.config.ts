import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    eslint: {
    ignoreDuringBuilds: true, // ビルド中にESLintエラーを無視する
  },
};

export default nextConfig;
