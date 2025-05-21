import { motion, useScroll, useSpring } from "framer-motion";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import HeroSection from "@/components/website/about/HeroSection";
import { MissionSection } from "@/components/website/about/MissionSection";
import ValuesSection from "@/components/website/about/ValuesSection";
import {
    CheckCircle2,
    Leaf,
    ShieldCheck,
    HeartHandshake,
    Calendar,
    ClipboardCheck,
    Sparkles,
    Star,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function About() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "mainEntity": {
            "@type": "Organization",
            "name": "Professional Cleaning Services",
            "description": "Professional cleaning services for homes and offices. Eco-friendly products, trained staff, and 100% satisfaction guaranteed.",
            "foundingDate": "YOUR_FOUNDING_DATE",
            "founders": [{
                "@type": "Person",
                "name": "Founder Name"
            }],
            "awards": [
                "Best Cleaning Service 2023",
                "Customer Satisfaction Award"
            ],
            "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "minValue": "10",
                "maxValue": "50"
            }
        }
    };

    // Scroll progress for the fixed progress bar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const whyChooseUs = [
        {
            icon: CheckCircle2,
            title: "Professional Staff",
            description: "Our highly trained and vetted cleaning professionals deliver consistent, exceptional service."
        },
        {
            icon: Leaf,
            title: "Eco-Friendly",
            description: "We use environmentally safe cleaning products and sustainable practices."
        },
        {
            icon: ShieldCheck,
            title: "Fully Insured",
            description: "Your property is protected with our comprehensive insurance coverage."
        },
        {
            icon: HeartHandshake,
            title: "Customer-Focused",
            description: "We prioritize your satisfaction with personalized service and attention to detail."
        }
    ];

    const bookingProcess = [
        {
            icon: Calendar,
            title: "Book Online",
            description: "Schedule your cleaning service through our easy-to-use online booking system."
        },
        {
            icon: ClipboardCheck,
            title: "Confirm Details",
            description: "Review and confirm your cleaning preferences and requirements."
        },
        {
            icon: Sparkles,
            title: "Get Serviced",
            description: "Our professional team arrives on time and delivers exceptional cleaning service."
        },
        {
            icon: Star,
            title: "Share Feedback",
            description: "Rate your experience and help us maintain our high service standards."
        }
    ];

    return (
        <WebsiteLayout
            title="About Us | Professional Cleaning Services"
            description="Learn about our professional cleaning company's history, mission, and commitment to excellence. Meet our team of dedicated cleaning professionals."
            canonical="https://yourwebsite.com/about"
            ogImage="/images/about-og.jpg"
            structuredData={structuredData}
            keywords="about cleaning company, cleaning service history, professional cleaners, cleaning company mission, cleaning team"
        >
            {/* Fixed Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
                style={{ scaleX }}
            />

            <div className="relative">
                {/* Hero Section with Mouse Follow Effect */}
                <HeroSection />

                {/* Mission Section with 3D Cards */}
                <MissionSection />

                {/* Values Section with Color Gradients */}
                <ValuesSection />

                {/* Why Choose Union Gate Section */}
                <section className="py-24 relative overflow-hidden">
                    {/* Animated Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                background: [
                                    "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
                                    "radial-gradient(circle at 100% 100%, var(--primary) 0%, transparent 50%)",
                                    "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
                                ],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{
                                opacity: 0.1,
                            }}
                        />
                    </div>

                    <div className="container mx-auto px-4 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <motion.h2
                                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                Why Choose Union Gate?
                            </motion.h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Experience the difference of working with a cleaning service that puts quality and customer satisfaction first.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {whyChooseUs.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative"
                                >
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        className="relative bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 overflow-hidden"
                                    >
                                        <motion.div
                                            className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                        >
                                            <item.icon className="w-6 h-6" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.description}</p>

                                        {/* Hover Glow Effect */}
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{
                                                background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
                                                opacity: 0.1,
                                            }}
                                        />
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Booking Process Section */}
                <section className="py-24 relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-primary/5">
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                backgroundPosition: ["0% 0%", "100% 100%"],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            style={{
                                backgroundImage: "radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)",
                                backgroundSize: "24px 24px",
                            }}
                        />
                    </div>

                    <div className="container mx-auto px-4 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <motion.h2
                                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                How It Works
                            </motion.h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Book your cleaning service in just a few simple steps
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            {/* Connection Lines */}
                            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-primary/10 -translate-y-1/2" />

                            {bookingProcess.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative text-center group"
                                >
                                    {/* Connection Arrow for all except last */}
                                    {index < bookingProcess.length - 1 && (
                                        <div className="hidden lg:block absolute top-12 -right-4 w-8 h-8 text-primary/40 z-10">
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.2 + 0.3 }}
                                            >
                                                {/* <ArrowRight className="w-8 h-8" /> */}
                                            </motion.div>
                                        </div>
                                    )}

                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        className="relative bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 h-full"
                                    >
                                        <motion.div
                                            className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <step.icon className="w-6 h-6" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>

                                        {/* Step Number */}
                                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                                            <span className="text-sm font-semibold text-primary">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 relative overflow-hidden">
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                        <motion.div
                            className="absolute inset-0"
                            animate={{
                                background: [
                                    "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
                                    "radial-gradient(circle at 100% 100%, var(--primary) 0%, transparent 50%)",
                                    "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
                                ],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{
                                opacity: 0.1,
                            }}
                        />
                    </div>

                    <div className="container mx-auto px-4 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <motion.h2
                                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                Ready to Experience Our Service?
                            </motion.h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                Join thousands of satisfied customers who trust us with their cleaning needs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={`/booking/create`}
                                >

                                <Button
                                    size="lg"
                                    className="relative overflow-hidden group bg-primary hover:bg-primary/90"
                                >
                                    <span className="relative z-10">Book Now</span>
                                    <motion.div
                                        className="absolute inset-0 bg-white/20"
                                        initial={{ x: "-100%" }}
                                        whileHover={{ x: "100%" }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                </Link>
                                <Link
                                    href={`/contact`}
                                >
                                    
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="group relative overflow-hidden"
                                >
                                    <span className="relative z-10">Contact Us</span>
                                    <motion.div
                                        className="absolute inset-0 bg-primary/10"
                                        initial={{ scale: 0 }}
                                        whileHover={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        />
                                </Button>
                                        </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>
        </WebsiteLayout>
    );
}
