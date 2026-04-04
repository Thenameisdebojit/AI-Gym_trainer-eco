/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "*.replit.dev",
    "*.repl.co",
    "*.replit.app",
    process.env.REPLIT_DEV_DOMAIN,
  ].filter(Boolean),
};

module.exports = nextConfig;
