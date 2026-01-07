import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/db", "nativewind", "react-native-css-interop", "react-native-reanimated", "@nozbe/watermelondb"],
  experimental: {
    // Enable decorators for WatermelonDB models
    swcPlugins: [],
  },
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
    
    // Add babel-loader for @repo/db to handle decorators
    config.module.rules.push({
      test: /\.tsx?$/,
      include: [path.resolve(__dirname, '../../packages/db')],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
          ],
        },
      },
    });
    
    return config;
  },
};

export default nextConfig;
