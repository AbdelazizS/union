import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Users, Star, Shield } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Mouse move effect
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const scrollToVision = () => {
        const visionSection = document.getElementById('vision-section');
        if (visionSection) {
            visionSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const stats = [
        {
            icon: Trophy,
            value: "2025",
            label: "Founded"
        },
        {
            icon: Users,
            value: "40+",
            label: "Active Clients"
        },
        {
            icon: Star,
            value: "5.0",
            label: "Perfect Rating"
        },
        {
            icon: Shield,
            value: "100%",
            label: "Quality Promise"
        }
    ];

    return (
        <section 
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/images/hero_2.jpeg')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Content */}
            <div className="container mx-auto p-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-left"
                    >
                        <Badge 
                            variant="secondary" 
                            className="px-6 py-2 text-lg backdrop-blur-md bg-white/10 border border-white/20 text-white mb-8"
                        >
                            <Award className="w-5 h-5 mr-2" />
                            Next-Gen Cleaning Solutions
                        </Badge>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                            Modern Cleaning, 
                            <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                Future Standards
                            </span>
                        </h1>

                        <p className="text-xl text-white/90 max-w-xl mb-8">
                            Pioneering the future of cleaning services with innovative technology and sustainable practices. We're setting new standards in Scotland's cleaning industry with our fresh approach and commitment to excellence.
                        </p>

                        <div className="flex gap-4">
                            <Link href="/book">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3 bg-primary text-white rounded-lg font-semibold"
                                >
                                    Start Today
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={scrollToVision}
                                className="px-8 py-3 bg-white/10 text-white rounded-lg font-semibold backdrop-blur-md border border-white/20"
                            >
                                Our Vision
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Column - Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <motion.div 
                                        className="inline-flex p-4 rounded-xl bg-white/10 text-white mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    >
                                        <stat.icon className="w-6 h-6" />
                                    </motion.div>
                                    <motion.h3 
                                        className="text-3xl font-bold mb-2 text-white"
                                    >
                                        {stat.value}
                                    </motion.h3>
                                    <p className="text-white/80">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            {/* <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white rounded-full mt-2"
                    />
                </div>
            </motion.div> */}
        </section>
    );
} 