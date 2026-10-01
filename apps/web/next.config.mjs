/** @type {import('next').NextConfig} */

function warnApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    return;
  }
  if (!/\/api\/v\d+\/?$/i.test(url.trim())) {
    console.warn(
      '[SAD-ILA] NEXT_PUBLIC_API_URL deve incluir /api/v1 (ex.: http://localhost:3001/api/v1). ' +
        'Valor legado será normalizado em runtime via lib/api-config.ts.',
    );
  }
}

warnApiUrl();

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
};

export default nextConfig;
