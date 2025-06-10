import { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Star, Users, Shield, Sparkles, Calendar, ArrowRight as ArrowRightIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Link } from '@inertiajs/react';

const slides = [
    {
        id: 1,
        title: "Scotland's Trusted Cleaning Partner",
        subtitle: "Professional cleaning services for homes and businesses across Scotland",
        cta: "Book Cleaner",
        ctaLink: "/book",
        secondaryCta: "Explore Services",
        secondaryCtaLink: "/our-services",
        image: "/images/hero_bg_1.webp",
        stats: [
            { icon: Star, value: "5/5", label: "Customer Rating" },
            { icon: Users, value: "40+", label: "Happy Clients" },
            { icon: Shield, value: "100%", label: "Satisfaction" }
        ]
    },
    {
        id: 2,
        title: "Tailored Cleaning Solutions",
        subtitle: "Customized packages for homes, offices, and commercial spaces",
        cta: "Book Cleaner",
        ctaLink: "/book",
        secondaryCta: "View Packages",
        secondaryCtaLink: "/our-services",
        image: "/images/hero_bg_1.webp",
        stats: [
            { icon: Star, value: "1+", label: "Years Experience" },
            { icon: Users, value: "40+", label: "Projects Completed" },
            { icon: Shield, value: "24/7", label: "Support" }
        ]
    },
    {
        id: 3,
        title: "Local Expertise, National Standards",
        subtitle: "Serving Scottish homes and businesses with professional cleaning excellence since 2008",
        cta: "Book Cleaner",
        ctaLink: "/book",
        secondaryCta: "Contact Us",
        secondaryCtaLink: "/contact",
        image: "/images/hero_bg_1.webp",
        stats: [
            { icon: Star, value: "10+", label: "Team Members" },
            { icon: Users, value: "100%", label: "Eco-Friendly" },
            { icon: Shield, value: "5-Star", label: "Service" }
        ]
    }
];

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    return (
        <div 
            className="relative min-h-[100vh] w-full overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                >
                    <motion.div
                        style={{ y }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                        <img
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                    </motion.div>

                    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4 sm:mb-8 hover:bg-white/20 transition-colors"
                        >
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            <span className="text-sm sm:text-base">Professional Cleaning Services</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 max-w-3xl"
                        >
                            {slides[currentSlide].title}
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-2xl text-gray-200"
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto"
                        >
                            <Link href={slides[currentSlide].ctaLink} className="w-full sm:w-auto">
                                <Button 
                                    size="lg" 
                                    className="group flex items-center justify-center gap-2 px-6 sm:px-8 w-full sm:w-auto"
                                >
                                    <Calendar className="h-4 w-4" />
                                    {slides[currentSlide].cta}
                                </Button>
                            </Link>
                            <Link href={slides[currentSlide].secondaryCtaLink} className="w-full sm:w-auto">
                                <Button 
                                    size="lg" 
                                    variant="secondary" 
                                    className="flex items-center justify-center gap-2 px-6 sm:px-8 w-full sm:w-auto"
                                >
                                    {slides[currentSlide].secondaryCta}
                                    <ArrowRightIcon className="h-4 w-4" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full max-w-4xl px-4 sm:px-0"
                        >
                            {slides[currentSlide].stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                                    className="flex flex-col items-center backdrop-blur-sm bg-white/5 p-2 sm:p-4 md:p-6 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <stat.icon className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 mb-1 sm:mb-2" />
                                    <div className="text-base sm:text-xl md:text-2xl font-bold">{stat.value}</div>
                                    <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                aria-label="Previous slide"
            >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            
            <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                aria-label="Next slide"
            >
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            currentSlide === index 
                                ? "bg-white scale-125" 
                                : "bg-white/50 hover:bg-white/70"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
