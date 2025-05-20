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
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://uniongate.com';
    
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
                    "url": baseUrl
                },
                "offers": {
                    "@type": "Offer",
                    "price": category.hourly_rate > category.services[0].price ? category.hourly_rate : category.services[0].price,
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                },
                "areaServed": {
                    "@type": "City",
                    "name": "Your City"
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
            title="Commercial & Residential Cleaning Services"
            description="Discover Union Gate's comprehensive cleaning services. From residential to commercial cleaning, our expert team delivers customized solutions with eco-friendly products and attention to detail."
            canonical="/services"
            ogImage="/images/services-og.jpg"
            structuredData={structuredData}
            keywords="Union Gate cleaning services, house cleaning, office cleaning, commercial cleaning, residential cleaning, deep cleaning, move-in cleaning, move-out cleaning, eco-friendly cleaning, professional cleaners"
            author="Union Gate"
        >
            <HeroSection />
            <StatsSection />
            <ServicesGrid 
                categories={categories.map(category => ({
                    ...category,
                    services: category.services.map(service => ({
                        ...service,
                        price: category.hourly_rate > service.price ? category.hourly_rate : service.price
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