
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },
  
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON,
    NEXT_PUBLIC_NOTIF_PASS: process.env.NOTIF_PASS,
    NEXT_PUBLIC_NOTI_ADMIN_EMAIL: process.env.NOTI_ADMIN_EMAIL,
    NEXT_PUBLIC_SQUAD_KEY: process.env.SQUAD_KEY,
  }
})

module.exports = nextConfig
