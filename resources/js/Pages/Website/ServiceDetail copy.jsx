import { 
    Sparkles,
    ArrowLeft,
    Clock,
    DollarSign,
    CheckCircle2,
    ChevronRight,
    ScrollText,
    Lightbulb,
    Zap,
    HelpCircle,
    Shield,
    Wallet,
    Headphones,
    Star,
    Users,
    ArrowRight,
    BarChart,
    CheckCheck,
    Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { useState } from "react";
import PropTypes from 'prop-types';

export default function ServiceDetail({ category, service, relatedServices = [], testimonials = [] }) {
    const [imageError, setImageError] = useState(false);
    const { url } = usePage();
    
    // Convert hourly_rate to number and handle undefined values
    const hourlyRate = category?.hourly_rate ? Number(category.hourly_rate) : 0;
    const basePrice = service?.base_price ? Number(service.base_price) : 0;
    const displayPrice = hourlyRate > basePrice ? hourlyRate : basePrice;
    
    const baseUrl = import.meta.env.VITE_APP_URL || 'https://uniongate.com';

    // Filter related services from the same category, excluding current service
    const filteredRelatedServices = (relatedServices || [])
        .filter(s => s?.id !== service?.id)
        .slice(0, 3);

    // Get first 3 testimonials
    const displayedTestimonials = (testimonials || []).slice(0, 3);

    const handleImageError = () => {
        setImageError(true);
    };

    // Early return if required data is missing
    if (!service || !category) {
        return (
            <WebsiteLayout
                title="Service Not Found"
                description="The requested service could not be found."
            >
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
                        <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist or has been removed.</p>
                        <Link href="/services">
                            <Button variant="outline">
                                Return to Services
                            </Button>
                        </Link>
                    </div>
                </div>
            </WebsiteLayout>
        );
    }

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name || '',
        "description": service.description || '',
        "image": service.image ? `${baseUrl}${service.image}` : '',
        "url": `${baseUrl}/services/${category.slug}/${service.slug}`,
        "provider": {
            "@type": "LocalBusiness",
            "name": "Union Gate",
            "image": `${baseUrl}/images/logo.png`,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Your Street Address",
                "addressLocality": "Your City",
                "addressRegion": "Your State",
                "postalCode": "Your Postal Code",
                "addressCountry": "Your Country"
            },
            "telephone": "+1234567890",
            "priceRange": "$$",
            "url": baseUrl
        },
        "offers": {
            "@type": "Offer",
            "price": displayPrice,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString(),
            "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            "url": `${baseUrl}/services/${category.slug}/${service.slug}`
        },
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "YOUR_LATITUDE",
                "longitude": "YOUR_LONGITUDE"
            },
            "geoRadius": "50000"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": category.name || '',
            "itemListElement": (service.features || []).map((feature, index) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": feature
                }
            }))
        },
        "review": displayedTestimonials.map(testimonial => ({
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": testimonial.rating || 0,
                "bestRating": "5"
            },
            "author": {
                "@type": "Person",
                "name": testimonial.name || 'Anonymous'
            },
            "reviewBody": testimonial.comment || '',
            "datePublished": testimonial.created_at || new Date().toISOString()
        })),
        "duration": `PT${service.duration_minutes || 60}M`,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": displayedTestimonials.length.toString()
        }
    };

    return (
        <WebsiteLayout
            title={`${service.name || 'Service'} - ${category.name || 'Category'} Cleaning Service`}
            description={`${service.description || ''} Experience Union Gate's premium ${(service.name || '').toLowerCase()} service. Book now for professional cleaning solutions.`}
            canonical={`/services/${category.slug}/${service.slug}`}
            ogImage={service.image}
            structuredData={structuredData}
            keywords={`Union Gate ${service.name || ''}, ${category.name || ''} cleaning, professional cleaning service, ${(service.name || '').toLowerCase()}, cleaning solutions, eco-friendly cleaning`}
            author="Union Gate"
        >
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
                    <div className="container mx-auto">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-muted-foreground mb-8">
                            <Link 
                                href="/services"
                                className="hover:text-primary transition-colors duration-200"
                            >
                                Services
                            </Link>
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            <Link 
                                href={`/services/${category.slug}`}
                                className="hover:text-primary transition-colors duration-200"
                            >
                                {category.name}
                            </Link>
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            <span className="text-foreground" aria-current="page">{service.name}</span>
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid md:grid-cols-2 gap-12 items-center"
                        >
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                                    {service.name}
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8">
                                    {service.description}
                                </p>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" aria-hidden="true" />
                                        <span className="text-lg font-semibold">${displayPrice}/hr</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                                        <span className="text-lg">{service.duration}</span>
                                    </div>
                                    {service.badge && (
                                        <Badge variant="secondary" className="text-base px-4 py-1">
                                            {service.badge}
                                        </Badge>
                                    )}
                                </div>
                                <Link
                                    href={`/booking/create?service_id=${service.id}`}
                                >
                                    <Button 
                                        size="lg"
                                        className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                    >
                                        Book Now
                                        <ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" />
                                    </Button>
                                </Link>
                            </div>

                            {service.image && !imageError && (
                                <motion.div 
                                    className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                    />
                                    <motion.img 
                                        src={service.image} 
                                        alt={`${service.name} - Union Gate Cleaning Service`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                        onError={handleImageError}
                                    />
                                    <motion.div 
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </section>

                {/* Details Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
                    <div className="container mx-auto relative">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="grid md:grid-cols-2 gap-12"
                        >
                            {/* Service Overview */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <ScrollText className="h-6 w-6 text-primary" aria-hidden="true" />
                                        <h2 className="text-2xl font-bold">Service Overview</h2>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-background/50 rounded-3xl blur-2xl" />
                                        <div className="relative bg-background/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                            <div className="prose prose-gray max-w-none">
                                                {service.description}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Key Benefits */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <Lightbulb className="h-6 w-6 text-primary" aria-hidden="true" />
                                        <h2 className="text-2xl font-bold">Key Benefits</h2>
                                    </div>
                                    <div className="grid gap-4">
                                        {[
                                            {
                                                title: 'Expert Solutions',
                                                description: 'Benefit from our years of expertise and industry-leading practices',
                                                icon: 'Shield'
                                            },
                                            {
                                                title: 'Time Efficiency',
                                                description: 'Quick turnaround times without compromising on quality',
                                                icon: 'Clock'
                                            },
                                            {
                                                title: 'Cost-Effective',
                                                description: 'Competitive pricing with maximum value for your investment',
                                                icon: 'Wallet'
                                            },
                                            {
                                                title: 'Dedicated Support',
                                                description: '24/7 customer support and continuous assistance',
                                                icon: 'HeadSet'
                                            }
                                        ].map((benefit, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ x: -20, opacity: 0 }}
                                                whileInView={{ x: 0, opacity: 1 }}
                                                viewport={{ once: true, margin: "-100px" }}
                                                transition={{ delay: index * 0.1 }}
                                                className="relative group"
                                            >
                                                <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl transition-all duration-300 group-hover:bg-primary/10" />
                                                <div className="relative bg-background/50 backdrop-blur-sm border border-primary/10 rounded-xl p-4 transition-all duration-300 hover:transform hover:scale-[1.02]">
                                                    <div className="flex items-start gap-3">
                                                        {benefit.icon === 'Shield' && <Shield className="h-5 w-5 text-primary mt-1" aria-hidden="true" />}
                                                        {benefit.icon === 'Clock' && <Clock className="h-5 w-5 text-primary mt-1" aria-hidden="true" />}
                                                        {benefit.icon === 'Wallet' && <Wallet className="h-5 w-5 text-primary mt-1" aria-hidden="true" />}
                                                        {benefit.icon === 'HeadSet' && <Headphones className="h-5 w-5 text-primary mt-1" aria-hidden="true" />}
                                                        <div>
                                                            <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                                                            <p className="text-muted-foreground text-sm">{benefit.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Features */}
                            <div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
                                        <h2 className="text-2xl font-bold">Features</h2>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background/50 rounded-3xl blur-2xl" />
                                        <Card className="relative bg-background/50 backdrop-blur-sm border-primary/10 overflow-hidden">
                                            <CardContent className="pt-6">
                                                <ul className="space-y-4">
                                                    {service.features?.map((feature, index) => (
                                                        <motion.li
                                                            key={index}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            whileInView={{ opacity: 1, x: 0 }}
                                                            viewport={{ once: true, margin: "-100px" }}
                                                            transition={{ delay: index * 0.1 }}
                                                            whileHover={{ x: 10 }}
                                                            className="flex items-start gap-3 group"
                                                        >
                                                            <div className="relative">
                                                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-md transition-all duration-300 group-hover:bg-primary/30" />
                                                                <CheckCircle2 className="h-6 w-6 text-primary relative transition-all duration-300 group-hover:scale-110" aria-hidden="true" />
                                                            </div>
                                                            <span className="transition-colors duration-300 group-hover:text-primary">{feature}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FAQs with enhanced styling */}
                {service.faqs && service.faqs.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="mt-24"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <HelpCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background/50 rounded-3xl blur-2xl" />
                            <Accordion type="single" collapsible className="w-full max-w-3xl relative">
                                {service.faqs.map((faq, index) => (
                                    <AccordionItem 
                                        key={index} 
                                        value={`faq-${index}`}
                                        className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg mb-4 overflow-hidden"
                                    >
                                        <AccordionTrigger className="text-left px-6 py-4 hover:bg-primary/5 transition-all duration-300">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground px-6 py-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {faq.answer}
                                            </motion.div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </motion.div>
                )}

                {/* Process Steps */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mt-24"
                >
                    <div className="flex items-center gap-3 mb-12">
                        <CheckCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                        <h2 className="text-2xl font-bold">How It Works</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Book Consultation',
                                description: 'Schedule your initial consultation with our experts',
                                icon: Calendar
                            },
                            {
                                step: '02',
                                title: 'Requirements Analysis',
                                description: 'We analyze your needs and create a tailored plan',
                                icon: BarChart
                            },
                            {
                                step: '03',
                                title: 'Service Delivery',
                                description: 'Our team executes the service with precision',
                                icon: Zap
                            },
                            {
                                step: '04',
                                title: 'Review & Support',
                                description: 'Continuous support and satisfaction guarantee',
                                icon: CheckCheck
                            }
                        ].map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl transition-all duration-300 group-hover:bg-primary/10" />
                                <div className="relative bg-background/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 h-full">
                                    <div className="text-4xl font-bold text-primary/20 mb-4">{step.step}</div>
                                    <step.icon className="h-8 w-8 text-primary mb-4" aria-hidden="true" />
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Testimonials */}
                {displayedTestimonials.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="mt-24"
                    >
                        <div className="flex items-center gap-3 mb-12">
                            <Star className="h-6 w-6 text-primary" aria-hidden="true" />
                            <h2 className="text-2xl font-bold">Client Testimonials</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {displayedTestimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl transition-all duration-300 group-hover:bg-primary/10" />
                                    <div className="relative bg-background/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6">
                                        <div className="flex gap-1 mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" aria-hidden="true" />
                                            ))}
                                        </div>
                                        <blockquote className="text-muted-foreground mb-4">"{testimonial.comment}"</blockquote>
                                        <div>
                                            <div className="font-semibold">{testimonial.name}</div>
                                            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Related Services */}
                {filteredRelatedServices.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="mt-24"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                                <h2 className="text-2xl font-bold">Related Services</h2>
                            </div>
                            <Link 
                                href={`/services/${category.slug}`}
                                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
                            >
                                View All
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {filteredRelatedServices.map((relatedService, index) => (
                                <motion.div
                                    key={relatedService.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    <Link 
                                        href={`/services/${category.slug}/${relatedService.slug}`}
                                        className="block h-full"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-2xl transition-all duration-300 group-hover:bg-primary/10" />
                                        <div className="relative bg-background/50 backdrop-blur-sm border border-primary/10 rounded-2xl transition-all duration-300 hover:border-primary/30 h-full flex flex-col">
                                            {relatedService.image && (
                                                <div className="relative w-full aspect-[16/9] mb-4 rounded-t-xl overflow-hidden">
                                                    <img 
                                                        src={relatedService.image} 
                                                        alt={relatedService.name}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/images/placeholder.jpg';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                </div>
                                            )}
                                            {!relatedService.image && (
                                                <div className="bg-primary/5 rounded-xl p-4 mb-4 w-16 h-16 flex items-center justify-center">
                                                    {relatedService.icon ? (
                                                        <img 
                                                            src={relatedService.icon} 
                                                            alt={relatedService.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/images/placeholder.jpg';
                                                            }}
                                                        />
                                                    ) : (
                                                        <Sparkles className="w-8 h-8 text-primary" aria-hidden="true" />
                                                    )}
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold mb-2">{relatedService.name}</h3>
                                                <p className="text-muted-foreground mb-4 flex-grow">{relatedService.description}</p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <span className="text-lg font-semibold">
                                                        ${relatedService.base_price}
                                                    </span>
                                                    <Link
                                                        href={`/services/${category.slug}/${relatedService.slug}`}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mt-24 mb-12"
                >
                    <div className="relative overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-90" />
                        <div className="relative px-8 py-12 md:p-16">
                            <div className="max-w-3xl mx-auto text-center text-white">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                                <p className="text-lg mb-8 opacity-90">Take the first step towards transforming your business with our professional services.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={`/booking/create?service_id=${service.id}`}
                                    >
                                        <Button 
                                            size="lg" 
                                            variant="secondary"
                                            className="rounded-full bg-white text-primary hover:bg-white/90"
                                        >
                                            Book Consultation
                                            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                                        </Button>
                                    </Link>
                                    <Link href="/contact">
                                        <Button 
                                            size="lg"
                                            variant="outline" 
                                            className="rounded-full border-white text-white hover:bg-white/20"
                                        >
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </WebsiteLayout>
    );
}

ServiceDetail.propTypes = {
    category: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        slug: PropTypes.string,
        hourly_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
    service: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        slug: PropTypes.string,
        description: PropTypes.string,
        base_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        duration: PropTypes.string,
        duration_minutes: PropTypes.number,
        image: PropTypes.string,
        badge: PropTypes.string,
        features: PropTypes.arrayOf(PropTypes.string),
        faqs: PropTypes.arrayOf(PropTypes.shape({
            question: PropTypes.string,
            answer: PropTypes.string,
        })),
    }),
    relatedServices: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        slug: PropTypes.string,
        description: PropTypes.string,
        base_price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        image: PropTypes.string,
        icon: PropTypes.string,
    })),
    testimonials: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        comment: PropTypes.string,
        rating: PropTypes.number,
        role: PropTypes.string,
        created_at: PropTypes.string,
    })),
}; 