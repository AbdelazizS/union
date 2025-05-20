import WebsiteLayout from '@/Layouts/WebsiteLayout';

export default function Booking() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Book Cleaning Service",
        "description": "Book professional cleaning services online. Choose from our range of cleaning services and schedule at your convenience.",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Professional Cleaning Services"
        },
        "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock"
        },
        "potentialAction": {
            "@type": "ReserveAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://yourwebsite.com/booking",
                "inLanguage": "en-US",
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                ]
            }
        }
    };

    return (
        <WebsiteLayout
            title="Book Cleaning Service | Professional Cleaning Services"
            description="Book your professional cleaning service online. Easy scheduling, instant quotes, and flexible service options. Book now for a spotless environment!"
            canonical="https://yourwebsite.com/booking"
            ogImage="/images/booking-og.jpg"
            structuredData={structuredData}
            keywords="book cleaning service, schedule cleaning, online booking, cleaning appointment, cleaning service booking"
        >
            {/* Your existing booking page content */}
        </WebsiteLayout>
    );
} 