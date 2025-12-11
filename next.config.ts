import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: "@svgr/webpack",
        options: {
          exportType: "named",
          namedExport: "default",
          svgoConfig: {
            plugins: [{
              name: 'removeViewBox',
              active: false
            }]
          }
        }
      }],
    });
    return config;
  },

  async rewrites() {
    return [
      {
        source: '/supabase/auth/:path*',
        destination: 'http://gotrue:9999/:path*',
      },
      {
        source: '/supabase/rest/:path*',
        destination: 'http://postgrest:3000/:path*',
      },
    ]
  },
};

export default withNextIntl(nextConfig);
