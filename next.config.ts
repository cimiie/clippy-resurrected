import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enable React Compiler for automatic component memoization
  reactCompiler: true,
};

export default nextConfig;
