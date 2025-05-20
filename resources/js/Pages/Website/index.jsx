import WebsiteLayout from '@/Layouts/WebsiteLayout';
import HeroSection from '@/Components/Website/Hero';
import ServicesSection from '@/Components/Website/Services';
import AboutSection from '@/Components/Website/About';
import FeaturesSection from '@/Components/Website/Features';
import TestimonialsSection from '@/Components/Website/Testimonials';
import FAQSection from '@/Components/Website/FAQ';
import Partners from '@/Components/Website/Partners';

export default function Home({ auth, services, testimonials, partners, faqs }) {
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://uniongate.com';
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Union Gate",
        "description": "Union Gate provides premium cleaning services for homes and offices. Experience our eco-friendly solutions, expert staff, and commitment to excellence.",
        "image": `${baseUrl}/images/og-image.jpg`,
        "url": baseUrl,
        "telephone": "+1234567890",
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Your Street Address",
            "addressLocality": "Your City",
            "addressRegion": "Your State",
            "postalCode": "Your Postal Code",
            "addressCountry": "Your Country"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "YOUR_LATITUDE",
            "longitude": "YOUR_LONGITUDE"
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            "opens": "09:00",
            "closes": "18:00"
        },
        "sameAs": [
            "https://facebook.com/uniongate",
            "https://twitter.com/uniongate",
            "https://linkedin.com/company/uniongate"
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150"
        }
    };

    return (
        <WebsiteLayout
            title="Professional Cleaning Services"
            description="Experience Union Gate's premium cleaning services for homes and offices. Our expert team uses eco-friendly products to deliver exceptional results. Book your free consultation today!"
            canonical="/"
            ogImage="/favicon.ico"
            structuredData={structuredData}
            keywords="Union Gate, premium cleaning services, house cleaning, office cleaning, eco-friendly cleaning, commercial cleaning, professional cleaners, deep cleaning services"
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
