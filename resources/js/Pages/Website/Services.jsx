import { 
    Sparkles,
    DollarSign,
    ChevronRight,
    Clock
} from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import HeroSection from "@/components/website/Services/HeroSection";
import StatsSection from "@/components/website/Services/StatsSection";
import WhyChooseUsSection from "@/components/website/Services/WhyChooseUsSection";
import ProcessSection from "@/components/website/Services/ProcessSection";
import TestimonialsSection from "@/components/website/Services/TestimonialsSection";
import CTASection from "@/components/website/Services/CTASection";
import ServicesGrid from "@/components/website/Services/ServicesGrid";

export default function Services({ categories = [], testimonials = [] }) {
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://uniongate.uk';
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": categories.map((category, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Service",
                "name": category.name,
                "description": category.description,
                "url": `${baseUrl}/services/${category.slug}`,
                "image": `${baseUrl}${category.image}`,
                "provider": {
                    "@type": "Organization",
                    "name": "Union Gate",
                    "url": baseUrl,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "1 Lochside View",
                        "addressLocality": "Edinburgh",
                        "addressRegion": "Scotland",
                        "postalCode": "EH12 9DH",
                        "addressCountry": "United Kingdom"
                    },
                    "telephone": "+477 730 788 3811",
                    "email": "info@uniongate.uk"
                },
                "areaServed": {
                    "@type": "GeoCircle",
                    "geoMidpoint": {
                        "@type": "GeoCoordinates",
                        "latitude": "55.9361427",
                        "longitude": "-3.3185184"
                    },
                    "geoRadius": "50000"
                }
            }
        }))
    };

    const ref = useRef(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 15
            }
        }
    };

    return (
        <WebsiteLayout
            title="Commercial & Residential Cleaning Services Edinburgh | Union Gate"
            description="Discover Union Gate's comprehensive cleaning services in Edinburgh. From residential to commercial cleaning, our expert team delivers customized solutions with eco-friendly products and attention to detail. Serving Edinburgh and surrounding areas."
            canonical="/our-services"
          ogImage="/favicon.ico"
            structuredData={structuredData}
            keywords="Union Gate cleaning services Edinburgh, house cleaning Scotland, office cleaning Edinburgh, commercial cleaning EH12, residential cleaning Edinburgh, deep cleaning Scotland, move-in cleaning Edinburgh, move-out cleaning Scotland, eco-friendly cleaning UK, professional cleaners Edinburgh"
            author="Union Gate"
        >
            <HeroSection />
            <StatsSection />
            <ServicesGrid 
                categories={categories.map(category => ({
                    ...category,
                    services: category.services.map(service => ({
                        ...service
                    }))
                }))}
            />
            <WhyChooseUsSection />
            <ProcessSection />
            <TestimonialsSection testimonials={testimonials} />
            <CTASection />
        </WebsiteLayout>
    );
} 