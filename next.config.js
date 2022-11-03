/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig

require('dotenv').config()

module.exports ={
  env: {
    // Reference a variable that was defined in the .env file and make it available at Build Time
    STAGING_API_KEY: process.env.STAGING_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
  },
  experimental: {
    scrollRestoration: true,
    esmExternals: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  }
}
