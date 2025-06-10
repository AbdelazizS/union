import WebsiteLayout from '@/Layouts/WebsiteLayout';
import HeroSection from '@/components/website/Hero';
import ServicesSection from '@/components/website/Services';
import AboutSection from '@/components/website/About';
import FeaturesSection from '@/components/website/Features';
import TestimonialsSection from '@/components/website/Testimonials';
import FAQSection from '@/components/website/FAQ';
import Partners from '@/components/website/Partners';

export default function Home({ auth, services, testimonials, partners, faqs }) {
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://uniongate.uk';
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Union Gate",
        "description": "Union Gate provides premium cleaning services for homes and offices in Edinburgh. Experience our eco-friendly solutions, expert staff, and commitment to excellence.",
        "image": `/favicon.ico`,
        "url": baseUrl,
        "telephone": "+477 730 788 3811",
        "email": "info@uniongate.uk",
        "priceRange": "££",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "1 Lochside View",
            "addressLocality": "Edinburgh",
            "addressRegion": "Scotland",
            "postalCode": "EH12 9DH",
            "addressCountry": "United Kingdom"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "55.9361427",
            "longitude": "-3.3185184"
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "08:00",
            "closes": "20:00"
        },
        // "sameAs": [
        //     "https://facebook.com/uniongate",
        //     "https://twitter.com/uniongate",
        //     "https://linkedin.com/company/uniongate"
        // ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": testimonials?.length?.toString() || "0"
        }
    };

    return (
        <WebsiteLayout
            title="Professional Cleaning Services in Edinburgh"
            description="Experience Union Gate's premium cleaning services in Edinburgh. Our expert team uses eco-friendly products to deliver exceptional results for homes and offices. Book your free consultation today!"
            canonical="/"
            ogImage="/favicon.ico"
            structuredData={structuredData}
            keywords="Union Gate Edinburgh, premium cleaning services Edinburgh, house cleaning Edinburgh, office cleaning Edinburgh, eco-friendly cleaning Scotland, commercial cleaning Edinburgh, professional cleaners Edinburgh, deep cleaning services Edinburgh"
            author="Union Gate"
        >
            <HeroSection />
            <ServicesSection services={services} />
            <AboutSection />
            <FeaturesSection />
            <TestimonialsSection testimonials={testimonials} />
            <FAQSection faqs={faqs} />
            <Partners partners={partners} />
        </WebsiteLayout>
    );
}
