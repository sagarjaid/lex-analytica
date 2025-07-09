/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      'lh3.googleusercontent.com',
      'pbs.twimg.com',
      'images.unsplash.com',
      'logos-world.net',
      'randomuser.me',
      'wfxcjumayrusljhmfcvl.supabase.co',
    ],
  },
};

module.exports = nextConfig;
