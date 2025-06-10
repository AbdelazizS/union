import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Shield, Sparkles, Users } from "lucide-react";
import { useRef } from "react";

export default function ValuesSection() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const values = [
        {
            icon: Heart,
            title: "Passion",
            description: "We're passionate about delivering excellence in every cleaning task we undertake.",
            color: "from-red-500/20 to-red-600/20",
            iconColor: "text-red-500",
        },
        {
            icon: Shield,
            title: "Trust",
            description: "Building trust through reliability, integrity, and consistent quality service.",
            color: "from-blue-500/20 to-blue-600/20",
            iconColor: "text-blue-500",
        },
        {
            icon: Sparkles,
            title: "Excellence",
            description: "Striving for excellence in every detail of our cleaning services.",
            color: "from-yellow-500/20 to-yellow-600/20",
            iconColor: "text-yellow-500",
        },
        {
            icon: Users,
            title: "Community",
            description: "Creating positive impact in our community through our services.",
            color: "from-green-500/20 to-green-600/20",
            iconColor: "text-green-500",
        },
    ];

    return (
        <section ref={containerRef} className="py-24 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(circle at center, var(--primary) 0%, transparent 70%)",
                        opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 0]),
                    }}
                />
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Section Header */}
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
                        Our Core Values
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        The principles that guide us in delivering exceptional cleaning services
                    </motion.p>
                </motion.div>

                {/* Split Layout */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative h-[600px] rounded-2xl overflow-hidden group"
                    >
                        <motion.div
                            className="absolute inset-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src="/images/hero3.jpeg"
                                alt="Professional Cleaning Service"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </motion.div>

                        {/* Floating Stats */}
                        <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20"
                            >
                                <div className="text-3xl font-bold text-white mb-1">500+</div>
                                <div className="text-white/80">Happy Clients</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20"
                            >
                                <div className="text-3xl font-bold text-white mb-1">5.0</div>
                                <div className="text-white/80">Service Rating</div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Column - Values */}
                    <div className="grid grid-cols-1 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    className="relative bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-primary/10 overflow-hidden"
                                >
                                    <div className="flex items-start gap-6">
                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 360 }}
                                            className={`w-14 h-14 rounded-xl bg-card flex items-center justify-center shrink-0 ${value.iconColor} group-hover:bg-white/10 transition-colors duration-300`}
                                        >
                                            <value.icon className="w-7 h-7" />
                                        </motion.div>

                                        {/* Content */}
                                        <div>
                                            <h3 className="text-2xl font-semibold mb-2">{value.title}</h3>
                                            <p className="text-muted-foreground">{value.description}</p>
                                        </div>
                                    </div>

                                    {/* Hover Effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl"
                                        initial={false}
                                        whileHover={{
                                            boxShadow: "0 0 30px rgba(var(--primary), 0.2)",
                                        }}
                                    />
                                </motion.div>

                                {/* Decorative Elements */}
                                <div className="absolute -inset-4 -z-10">
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
} 