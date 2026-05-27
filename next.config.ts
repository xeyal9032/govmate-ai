import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Playwright E2E (127.0.0.1) için dev kaynak erişimi
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
    ],
  },
};

const intlConfig = withNextIntl(nextConfig);

export default withSentryConfig(intlConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
