import {
    Sparkles,
    ArrowLeft,
    Clock,
    PoundSterling,
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
    Calendar,
    LucidePoundSterling,
    Layers,
    Send,
    RefreshCw,
    MessageSquare
} from "lucide-react";

import WebsiteLayout from '@/Layouts/WebsiteLayout';
import { Head } from '@inertiajs/react';
import { Link, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Add this before the ServiceDetail component
const testimonialFormSchema = z.object({
    customer_name: z.string().min(2, "Name must be at least 2 characters"),
    customer_email: z.string().email("Invalid email address"),
    comment: z.string().min(10, "Comment must be at least 10 characters"),
    rating: z.number().min(1).max(5),
});

const defaultTestimonialValues = {
    customer_name: "",
    customer_email: "",
    comment: "",
    rating: 5,
};

// Rating feedback messages
const ratingFeedback = {
    1: { emoji: "😞", text: "Very Dissatisfied" },
    2: { emoji: "😕", text: "Dissatisfied" },
    3: { emoji: "😐", text: "Neutral" },
    4: { emoji: "😊", text: "Satisfied" },
    5: { emoji: "😍", text: "Very Satisfied" }
};

// Modern Star Rating Component
const StarRating = ({ value, onChange, size = "large" }) => {
    const [hover, setHover] = useState(null);
    const sizeClasses = {
        small: "h-4 w-4",
        default: "h-6 w-6",
        large: "h-8 w-8"
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(null)}
                        className="focus:outline-none transition-all duration-200 hover:scale-110"
                    >
                        <Star
                            className={`${sizeClasses[size]} ${
                                star <= (hover || value)
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                            }`}
                        />
                    </button>
                ))}
            </div>
            {(hover || value) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <span className="text-4xl">{ratingFeedback[hover || value].emoji}</span>
                    <p className="text-lg font-medium text-muted-foreground mt-2">
                        {ratingFeedback[hover || value].text}
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default function ServiceDetail({ service, category , relatedServices = [], testimonials = [] }) {
    // Debug logs to understand the data structure


    // Early return if data is missing
    if (!category || !service) {
        return (
            <WebsiteLayout
                title="Service Not Found"
                description="The requested service could not be found."
            >
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Service Not Found
                        </h1>
                    </div>
                </div>
            </WebsiteLayout>
        );
    }
    const [imageError, setImageError] = useState(false);
    const { url } = usePage();

    // Convert hourly_rate to number and handle undefined values
    const hourlyRate = category?.hourly_rate ? Number(category.hourly_rate) : 0;
    const basePrice = service?.base_price ? Number(service.base_price) : 0;
    const displayPrice = hourlyRate > basePrice ? hourlyRate : basePrice;


    const baseUrl = import.meta.env.VITE_APP_URL || 'https://uniongate.uk';

    // Filter related services from the same category, excluding current service
    const filteredRelatedServices = (relatedServices || [])
        .filter(s => s?.id !== service?.id)
        .map(s => ({
            ...s,
            // price: category.hourly_rate > s.base_price ? s.base_price:category.hourly_rate
        }))
        .slice(0, 3);

    

    // Get first 3 testimonials
    const displayedTestimonials = (testimonials || []).slice(0, 3);

    const handleImageError = () => {
        setImageError(true);
    };

    const ref = useRef(null);
    const isInView = useInView(ref, { 
        once: true, 
        margin: "-50px 0px",
        amount: 0.1
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
                duration: 0.45
            }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 70,
                damping: 17,
                duration: 0.45
            }
        }
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.title || '',
        "description": service.description || '',
        "image": service.image_url ? `${service.image_url}` : '',
        "url": `${baseUrl}/our-services/${category.slug}/${service.slug}`,
        "provider": {
            "@type": "LocalBusiness",
            "name": "Union Gate",
            "image": `${baseUrl}/images/logo.png`,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "1 Lochside View",
                "addressLocality": "Edinburgh",
                "addressRegion": "Scotland",
                "postalCode": "EH12 9DH",
                "addressCountry": "United Kingdom"
            },
            "telephone": "+477 730 788 3811",
            "email": "info@uniongate.uk",
            "url": baseUrl
        },
        "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "55.9361427",
                "longitude": "-3.3185184"
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
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": displayedTestimonials.length.toString()
        }
    };

    // Add these new states for the two-step form
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);
    const [hasSubmittedTestimonial, setHasSubmittedTestimonial] = useState(false);
    const testimonialForm = useForm({
        resolver: zodResolver(testimonialFormSchema),
        defaultValues: defaultTestimonialValues,
    });

    // Check if user has already submitted a testimonial
    useEffect(() => {
        const hasSubmitted = localStorage.getItem(`testimonial_submitted_${service.id}`);
        if (hasSubmitted) {
            setHasSubmittedTestimonial(true);
        }
    }, [service.id]);

    // Calculate average rating
    const averageRating = testimonials.length > 0
        ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
        : 0;

    // Get rating distribution
    const ratingDistribution = testimonials.reduce((acc, t) => {
        acc[t.rating] = (acc[t.rating] || 0) + 1;
        return acc;
    }, {});

    const onSubmitTestimonial = async (data) => {
        setIsSubmittingTestimonial(true);
        try {
            router.post("/admin/testimonials", {
                ...data,
                // service_id: service.id,
                is_approved: false,
                is_featured: false,
            }, {
                onSuccess: () => {
                    // Store in localStorage that user has submitted a testimonial
                    localStorage.setItem(`testimonial_submitted_${service.id}`, 'true');
                    setHasSubmittedTestimonial(true);
                    toast.success("Thank you for your testimonial! It will be reviewed and published soon.");
                    testimonialForm.reset(defaultTestimonialValues);
                    setCurrentStep(1);
                },
                onError: (errors) => {
                    toast.error(errors.message || "Something went wrong");
                },
                onFinish: () => {
                    setIsSubmittingTestimonial(false);
                }
            });
        } catch (error) {
            toast.error("Something went wrong");
            setIsSubmittingTestimonial(false);
        }
    };

    // Add this new function to reset the submission status
  

    return (
        <WebsiteLayout
        title={`${service.title || 'Service'} | ${category.name || 'Category'} Service`}
        description={`${service.description || ''} Experience Union Gate's premium ${(service.title || '').toLowerCase()} service. Book now for professional cleaning solutions.`}
        canonical={`/our-services/${category.slug}/${service.slug}`}
        ogImage={service.image_url}
        structuredData={structuredData}
        keywords={`Union Gate ${service.title || ''}, ${category.name || ''} cleaning, professional cleaning service, ${(service.title || '').toLowerCase()}, cleaning solutions, eco-friendly cleaning`}
        author="Union Gate"
        >

            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
                <div className="container mx-auto">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-muted-foreground mb-8">
                        <Link
                            href="/our-services"
                            className="hover:text-primary transition-colors duration-200"
                        >
                            Services
                        </Link>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        <Link
                            href={`/our-services`}
                            className="hover:text-primary transition-colors duration-200"
                        >
                            {category.name}
                        </Link>
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        <span className="text-foreground" aria-current="page">{service.title}</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                                {service.title}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                {service.description}
                            </p>
                            <div className="flex items-center gap-6 mb-8">
                                {/* <div className="flex items-center gap-2">
                                    <PoundSterling className="h-5 w-5 text-primary" aria-hidden="true" />
                                    <span className="text-lg font-semibold">{service.formatted_text}</span>
                                </div> */}
                                {service.options && service.options.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {service.options.map((option) => (
                                            <div key={option.id} className="flex items-center gap-2">
                                                <PoundSterling className="h-4 w-4 text-primary" />
                                                <span className="text-sm text-muted-foreground">{option.formatted_text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                                    <span className="text-lg">{service.duration}</span>
                                </div> */}
                                {/* {service.badge && (
                                    <Badge variant="secondary" className="text-base px-4 py-1">
                                        {service.badge}
                                    </Badge>
                                )} */}
                            </div>
                            <Link
                                href={`/book/${service.id}`}
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

                        {service.image_url && !imageError && (
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
                                    src={service.image_url}
                                    alt={`${service.title} - Union Gate Cleaning Service`}
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
                        <div className="flex items-center gap-3 mb-8 container mx-auto">
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
                    <div className="flex items-center gap-3 mb-12 container mx-auto">
                        <CheckCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                        <h2 className="text-2xl font-bold">How It Works</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8 container mx-auto">
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

                {/* Testimonial Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="mt-24 container mx-auto"
                    >
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Left Column - Social Proof */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                            <Star className="h-6 w-6 text-primary" aria-hidden="true" />
                                <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        </div>
                            
                            {/* Overall Rating */}
                            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-4xl font-bold">{averageRating}</div>
                                    <div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-5 w-5 ${
                                                        star <= averageRating
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Based on {testimonials.length} reviews
                                        </p>
                                    </div>
                                </div>

                                {/* Rating Distribution */}
                                <div className="space-y-2">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div key={rating} className="flex items-center gap-2">
                                            <span className="text-sm w-8">{rating} ★</span>
                                            <Progress
                                                value={(ratingDistribution[rating] || 0) / testimonials.length * 100}
                                                className="h-2"
                                            />
                                            <span className="text-sm text-muted-foreground w-12">
                                                {ratingDistribution[rating] || 0}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Testimonials Preview */}
                            {testimonials.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Recent Reviews</h3>
                                    {testimonials.slice(0, 2).map((testimonial) => (
                                        <div
                                    key={testimonial.id}
                                            className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-xl p-4"
                                        >
                                            <div className="flex gap-1 mb-2">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            ))}
                                        </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                "{testimonial.comment}"
                                            </p>
                                            <p className="text-sm font-medium mt-2">{testimonial.name}</p>
                                        </div>
                                    ))}
                                    </div>
                            )}
                        </div>

                        {/* Right Column - Review Form */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background/50 rounded-3xl blur-2xl" />
                            <Card className="relative bg-background/50 backdrop-blur-sm border-primary/10">
                                <CardContent className="pt-6">
                                    {hasSubmittedTestimonial ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="py-8"
                                        >
                                            <div className="text-center mb-8">
                                                <div className="relative w-20 h-20 mx-auto mb-6">
                                                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <CheckCircle2 className="h-10 w-10 text-primary" />
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-semibold mb-3">Thank You for Your Review!</h3>
                                                <p className="text-muted-foreground max-w-md mx-auto">
                                                    Your feedback is valuable to us and helps improve our services.
                                                </p>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                                                    <Clock className="h-5 w-5 text-primary mt-1" />
                                                    <div>
                                                        <h4 className="font-medium mb-1">What's Next?</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            Your review will be reviewed by our team within 24-48 hours.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                                                    <Shield className="h-5 w-5 text-primary mt-1" />
                                                    <div>
                                                        <h4 className="font-medium mb-1">Quality Check</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            We verify all reviews to maintain the quality of our feedback system.
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl">
                                                    <MessageSquare className="h-5 w-5 text-primary mt-1" />
                                                    <div>
                                                        <h4 className="font-medium mb-1">Stay Updated</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            You'll receive an email when your review is published.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                           
                                        </motion.div>
                                    ) : (
                                        <Form {...testimonialForm}>
                                            <form onSubmit={testimonialForm.handleSubmit(onSubmitTestimonial)} className="space-y-6">
                                                {/* Step Indicator */}
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                            currentStep === 1 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                                        }`}>
                                                            1
                                                        </div>
                                                        <span className={currentStep === 1 ? "font-medium" : "text-muted-foreground"}>
                                                            Rate & Review
                                                        </span>
                                                    </div>
                                                    <div className="h-[2px] flex-1 bg-primary/10 mx-4" />
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                            currentStep === 2 ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                                        }`}>
                                                            2
                                                        </div>
                                                        <span className={currentStep === 2 ? "font-medium" : "text-muted-foreground"}>
                                                            Additional Details
                                                        </span>
                                                    </div>
                                                </div>

                                                <AnimatePresence mode="wait">
                                                    {currentStep === 1 ? (
                                                        <motion.div
                                                            key="step1"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="space-y-6"
                                                        >
                                                            <FormField
                                                                control={testimonialForm.control}
                                                                name="rating"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className="text-lg">How would you rate your experience?</FormLabel>
                                                                        <FormControl>
                                                                            <StarRating
                                                                                value={field.value}
                                                                                onChange={field.onChange}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={testimonialForm.control}
                                                                name="comment"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Share your experience (optional)</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                placeholder="Tell others about your experience..."
                                                                                className="min-h-[120px]"
                                                                                {...field}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button
                                                                type="button"
                                                                className="w-full"
                                                                onClick={() => setCurrentStep(2)}
                                                            >
                                                                Continue
                                                                <ChevronRight className="ml-2 h-4 w-4" />
                                                            </Button>
                                </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            key="step2"
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -20 }}
                                                            className="space-y-6"
                                                        >
                                                            <FormField
                                                                control={testimonialForm.control}
                                                                name="customer_name"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Your Name</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Enter your name" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={testimonialForm.control}
                                                                name="customer_email"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Your Email</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="Enter your email" type="email" {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <div className="flex gap-4">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    className="flex-1"
                                                                    onClick={() => setCurrentStep(1)}
                                                                >
                                                                    Back
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    className="flex-1"
                                                                    disabled={isSubmittingTestimonial}
                                                                >
                                                                    {isSubmittingTestimonial ? (
                                                                        "Submitting..."
                                                                    ) : (
                                                                        <>
                                                                            Submit Review
                                                                            <Send className="ml-2 h-4 w-4" />
                                                                        </>
                                                                    )}
                                                                </Button>
                        </div>
                    </motion.div>
                )}
                                                </AnimatePresence>
                                            </form>
                                        </Form>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>

                {/* Related Services */}
                {filteredRelatedServices && filteredRelatedServices.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="mt-24 container mx-auto"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-3">
                                <Layers className="h-6 w-6 text-primary" aria-hidden="true" />
                                <h2 className="text-2xl font-bold">Related Services</h2>
                            </div>
                            <Link 
                                href={`/our-services?category=${category.slug}`}
                                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200"
                            >
                                View All
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredRelatedServices.map((relatedService, index) => (
                                <div
                                    key={relatedService.id}
                                    className="relative group"
                                >
                                    <Link 
                                        href={`/our-services/${category.slug}/${relatedService.slug}`}
                                        className="block h-full"
                                    >
                                        <Card className="h-full relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <CardHeader className="!p-0">
                                                {relatedService.image_url && (
                                                    <div className="relative w-full aspect-[16/9] mb-4 rounded-t-xl overflow-hidden">
                                                        <img 
                                                            src={relatedService.image_url} 
                                                            alt={relatedService.title}
                                                            className="absolute inset-0 w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 px-6 py-2">
                                                    <div>
                                                        <CardTitle className="text-xl font-bold">{relatedService.title}</CardTitle>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="text-base whitespace-pre-line mb-4">
                                                    {relatedService.description}
                                                </CardDescription>
                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <div className="flex flex-col gap-2">
                                                        {relatedService.options && relatedService.options.length > 0 ? (
                                                            relatedService.options.map((option) => (
                                                                <div key={option.id} className="flex items-center gap-1.5 text-primary">
                                                                    <PoundSterling className="h-4 w-4" />
                                                                    <span className="font-medium">{option.formatted_text}</span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-primary">
                                                                <PoundSterling className="h-4 w-4" />
                                                                <span className="font-medium">From £{relatedService.price}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-primary transform group-hover:translate-x-1 transition-transform duration-300" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </div>
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
                    className="mt-24 mb-12 container mx-auto"
                >
                    <div className="relative overflow-hidden rounded-3xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-90" />
                        <div className="relative px-8 py-12 md:p-16">
                            <div className="max-w-3xl mx-auto text-center text-white">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                                <p className="text-lg mb-8 opacity-90">Take the first step towards transforming your business with our professional services.</p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={`/book/${service.id}`}
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
                                            className="rounded-full  text-white bg-transparent"
                                        >
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

        </WebsiteLayout>
    );
}
