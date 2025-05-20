import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)`,
                        backgroundSize: "24px 24px",
                    }}
                />
            </div>

            {/* Content */}
            <div className="container mx-auto text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 hover:bg-primary/20 transition-colors"
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span>Professional Services</span>
                    </motion.div>

                    {/* Title with Gradient */}
                    <motion.h1 
                        className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Our Professional{" "}
                        <span className="relative">
                            <span className="absolute -inset-1 bg-primary/5 blur-xl rounded-lg" />
                            <span className="relative bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Services
                            </span>
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p 
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Discover our comprehensive range of professional cleaning services tailored to meet your specific needs
                    </motion.p>

                    {/* Floating Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                                initial={{
                                    x: Math.random() * 100 - 50,
                                    y: Math.random() * 100 - 50,
                                }}
                                animate={{
                                    x: Math.random() * 100 - 50,
                                    y: Math.random() * 100 - 50,
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 