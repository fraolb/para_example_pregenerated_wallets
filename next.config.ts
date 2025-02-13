import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@getpara/react-sdk", "@getpara/*"],
};

export default nextConfig;
