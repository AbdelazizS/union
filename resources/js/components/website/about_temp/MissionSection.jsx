import { motion } from "framer-motion";
import { Target, Briefcase, Leaf, CheckCircle2, Users, ShieldCheck } from "lucide-react";

export default function MissionSection() {
    const missionPoints = [
        {
            icon: Target,
            title: "Our Mission",
            description: "To revolutionize the cleaning industry by delivering exceptional service that transforms spaces and exceeds expectations.",
            color: "from-blue-500/20 to-blue-600/20",
            iconColor: "text-blue-500",
            gradient: "from-blue-500 to-blue-600"
        },
        {
            icon: Briefcase,
            title: "Our Vision",
            description: "To be the most trusted name in professional cleaning services across Scotland, setting new standards of excellence.",
            color: "from-purple-500/20 to-purple-600/20",
            iconColor: "text-purple-500",
            gradient: "from-purple-500 to-purple-600"
        }
    ];

    const values = [
        {
            icon: CheckCircle2,
            title: "Excellence",
            description: "Committed to delivering superior quality in every task",
            gradient: "from-green-500 to-green-600"
        },
        {
            icon: Users,
            title: "Teamwork",
            description: "Collaborative approach for exceptional results",
            gradient: "from-orange-500 to-orange-600"
        },
        {
            icon: ShieldCheck,
            title: "Integrity",
            description: "Honest and transparent in all our dealings",
            gradient: "from-red-500 to-red-600"
        },
        {
            icon: Leaf,
            title: "Sustainability",
            description: "Eco-friendly practices for a better future",
            gradient: "from-emerald-500 to-emerald-600"
        }
    ];

    return (
        <section id="vision-section" className="py-24 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
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
                    style={{ opacity: 0.1 }}
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
                        Our Mission & Vision
                    </motion.h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Driving innovation and excellence in the cleaning industry with our forward-thinking approach.
                    </p>
                </motion.div>

                {/* Mission & Vision Cards */}
                <div className="grid md:grid-cols-2 gap-8 mb-24">
                    {missionPoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative"
                        >
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="relative bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 h-full overflow-hidden"
                            >
                                {/* Gradient Border */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-transparent transition-all duration-500" />
                                
                                {/* Icon */}
                                <motion.div 
                                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${point.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                    <point.icon className="w-6 h-6" />
                                </motion.div>

                                <h3 className="text-2xl font-bold mb-4">{point.title}</h3>
                                <p className="text-lg text-muted-foreground">{point.description}</p>

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
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="relative bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 overflow-hidden"
                            >
                                {/* Gradient Border */}
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-transparent transition-all duration-500" />

                                {/* Icon */}
                                <motion.div
                                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${value.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                                    whileHover={{ rotate: 360 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                    <value.icon className="w-6 h-6" />
                                </motion.div>

                                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>

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
    );
} 