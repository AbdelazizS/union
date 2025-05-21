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
                <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle at center, var(--primary) 0.5px, transparent 0.5px)",
                    backgroundSize: "24px 24px",
                }}>
                    <motion.div
                        className="absolute inset-0"
                        animate={{ y: [0, 24, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                </div>
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

                {/* Values Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="relative bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 overflow-hidden"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

                                {/* Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 360 }}
                                    className={`w-16 h-16 rounded-xl bg-card flex items-center justify-center mb-6 ${value.iconColor} group-hover:bg-white/10 transition-colors duration-300`}
                                >
                                    <value.icon className="w-8 h-8" />
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>

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
        </section>
    );
} 