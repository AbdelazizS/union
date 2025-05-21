import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
    Sparkles, 
    ArrowUpRight,
    Target,
    Eye,
    Heart,
    Award,
    CheckCircle,
    Clock,
    Star,
    MapPin,
    Calendar,
    // Spray,
    ThumbsUp,
    Leaf,
    Image as ImageIcon,
    Shield,
    BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function About() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

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

    // Keep existing sections (Hero, Mission & Vision, Why Choose Us)
    // ... existing code ...

    return (
        <WebsiteLayout>
            {/* Keep existing Hero section */}
            {/* Keep existing Mission & Vision section */}
            {/* Keep existing Why Choose Us section */}

            {/* Service Coverage Area */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/[0.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--primary)_0%,_transparent_60%)] opacity-[0.03]" />
                
                <div className="container mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                            Service Coverage Area
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Serving all major areas across Sudan
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-3xl overflow-hidden aspect-square"
                        >
                            <img 
                                src="/images/khartoum-map.jpg" 
                                alt="Service Coverage Map" 
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-semibold mb-6">We Cover All Major Areas:</h3>
                            {['Khartoum', 'Bahri', 'Omdurman'].map((area, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                                >
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <span className="text-lg">{area}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Certifications & Partners */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                            Our Certifications & Partners
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Trusted by leading brands and certified for excellence
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            { icon: Shield, title: "ISO Certified" },
                            { icon: BadgeCheck, title: "Health & Safety Certified" },
                            { icon: Leaf, title: "Green Cleaning Certified" },
                            { icon: Award, title: "Quality Assurance" }
                        ].map((cert, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group relative"
                            >
                                <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/20 transition-all duration-500 text-center">
                                    <div className="mb-4 inline-flex p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-500">
                                        <cert.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold">{cert.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Service Process */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/[0.02] relative overflow-hidden">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                            A Day in Our Service
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Experience our seamless cleaning process
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Progress Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/20" />
                        
                        <div className="grid md:grid-cols-4 gap-8 relative">
                            {[
                                { icon: Calendar, title: "Book", description: "Choose your preferred date and time" },
                                { icon: CheckCircle, title: "Confirm", description: "Receive booking confirmation" },
                                // { icon: Spray, title: "Clean", description: "Professional cleaning service" },
                                { icon: ThumbsUp, title: "Follow-Up", description: "Quality assurance check" }
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="relative"
                                >
                                    <div className="text-center">
                                        <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/10 text-primary relative">
                                            <step.icon className="h-8 w-8" />
                                            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Sustainability Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] opacity-[0.03]" />
                
                <div className="container mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                            <Leaf className="h-4 w-4 mr-2" />
                            <span>Eco-Friendly</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                            Our Commitment to Sustainability
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Making a difference through eco-conscious cleaning
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            {[
                                "Use of eco-friendly cleaning products",
                                "Waste reduction and recycling practices",
                                "Water conservation methods",
                                "Energy-efficient equipment"
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                                >
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <Leaf className="h-5 w-5" />
                                    </div>
                                    <p className="text-lg">{item}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative rounded-3xl overflow-hidden aspect-square"
                        >
                            <img 
                                src="/images/eco-friendly.jpg" 
                                alt="Eco-friendly Cleaning" 
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Photo Gallery */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/[0.02] relative overflow-hidden">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                            Our Work in Action
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Before & After transformations
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {[1, 2, 3, 4, 5, 6].map((item, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="group relative aspect-square rounded-3xl overflow-hidden"
                            >
                                <img 
                                    src={`/images/gallery-${item}.jpg`}
                                    alt={`Before & After ${item}`}
                                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto">
                    <div className="relative rounded-[2.5rem] bg-primary overflow-hidden">
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--primary-foreground)_0%,_transparent_60%)] opacity-10" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--primary-foreground)_0%,_transparent_60%)] opacity-10" />
                        </div>

                        <motion.div
                            className="absolute inset-0 opacity-[0.15]"
                            animate={{
                                backgroundPosition: ["0% 0%", "100% 100%"],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                backgroundSize: "30px 30px"
                            }}
                        />

                        <div className="relative px-8 py-20 sm:px-16 sm:py-28 text-center">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl md:text-5xl font-bold mb-6 text-primary-foreground"
                            >
                                Experience the Union Gate Difference
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto mb-10"
                            >
                                Join thousands of satisfied customers who trust us for their cleaning needs
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                            >
                                <Link href="/book-a-cleaner">
                                    <Button 
                                        size="lg" 
                                        variant="secondary" 
                                        className="rounded-full group px-8 hover:scale-105 transition-all duration-300"
                                    >
                                        Book Now
                                        <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </WebsiteLayout>
    );
}
