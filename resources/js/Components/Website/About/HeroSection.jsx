import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Award, Trophy, Users, Star, Shield } from "lucide-react";

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Mouse move effect
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const stats = [
        {
            icon: Trophy,
            value: "10+",
            label: "Years Experience"
        },
        {
            icon: Users,
            value: "5000+",
            label: "Happy Clients"
        },
        {
            icon: Star,
            value: "4.9",
            label: "Customer Rating"
        },
        {
            icon: Shield,
            value: "100%",
            label: "Satisfaction Rate"
        }
    ];

    return (
        <section 
            onMouseMove={handleMouseMove}
            className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden  bg-primary/5 z-10"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-primary-5 ">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <Badge 
                            variant="secondary" 
                            className="px-6 py-2 text-lg backdrop-blur-md bg-primary/10 border border-primary/20"
                        >
                            <Award className="w-5 h-5 mr-2" />
                            Scotland's Premier Cleaning Service
                        </Badge>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
                            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                About Our Legacy
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16"
                    >
                        Delivering exceptional cleaning services with professionalism, reliability, and attention to detail since 2008.
                    </motion.p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                                <div className="relative bg-background/50 backdrop-blur-md rounded-2xl p-6 border border-primary/10">
                                    <motion.div 
                                        className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    >
                                        <stat.icon className="w-6 h-6" />
                                    </motion.div>
                                    <motion.h3 
                                        className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                                        animate={{
                                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                        }}
                                        transition={{
                                            duration: 5,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        {stat.value}
                                    </motion.h3>
                                    <p className="text-muted-foreground">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            </section>
    );
} 