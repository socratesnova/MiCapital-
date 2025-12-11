import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    // A list of all locales that are supported
    locales: ['en', 'es'],

    // Used when no locale matches
    defaultLocale: 'en',

    // Always show locale prefix in URL (e.g., /en/dashboard, /es/dashboard)
    localePrefix: 'always',

    // Disable automatic locale detection - let user choose manually
    localeDetection: false
});

export const config = {
    // Match all pathnames except for:
    // - /api routes
    // - /_next (Next.js internals)
    // - /_static (inside /public)
    // - all files with extensions (e.g. /favicon.ico)
    matcher: ['/((?!api|_next|_static|.*\\..*).*)']
};
