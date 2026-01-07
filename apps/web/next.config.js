import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "nativewind", "react-native-css-interop", "react-native-reanimated"],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "react-native": path.resolve(__dirname, 'node_modules/react-native-web'),
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
};

export default nextConfig;
