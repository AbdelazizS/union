import { Head } from '@inertiajs/react';
import PropTypes from 'prop-types';

const SEO = ({
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    structuredData,
    keywords,
    author,
    robots = 'index, follow',
    language = 'en',
}) => {
    const siteName = 'Union Gate';
    const fullTitle = title || `${siteName} - Professional Cleaning Services`;
    const defaultDescription = 'Union Gate provides premium cleaning services for homes and offices. Experience our eco-friendly solutions, expert staff, and commitment to excellence.';
    const defaultImage = '/images/og-image.jpg';
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://uniongate.com';

    return (
        <Head>
            {/* Essential Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author || siteName} />
            <meta name="robots" content={robots} />
            <meta httpEquiv="Content-Language" content={language} />
            
            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={`${baseUrl}${ogImage || defaultImage}`} />
            {canonical && <meta property="og:url" content={`${baseUrl}${canonical}`} />}
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={language} />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={`${baseUrl}${ogImage || defaultImage}`} />
            <meta name="twitter:site" content="@uniongate" />

            {/* Performance & Mobile Optimization */}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="theme-color" content="#ffffff" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}

            {/* Preconnect to important domains */}
            <link rel="preconnect" href={baseUrl} />
            <link rel="dns-prefetch" href={baseUrl} />
        </Head>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    canonical: PropTypes.string,
    ogImage: PropTypes.string,
    ogType: PropTypes.string,
    twitterCard: PropTypes.string,
    structuredData: PropTypes.object,
    keywords: PropTypes.string,
    author: PropTypes.string,
    robots: PropTypes.string,
    language: PropTypes.string,
};

export default SEO; 