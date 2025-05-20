import { motion } from "framer-motion";
import { Target, Briefcase, Leaf, CheckCircle2, Users, ShieldCheck } from "lucide-react";

export default function MissionSection() {
    const missionPoints = [
        {
            icon: Target,
            title: "Our Mission",
            description: "To revolutionize the cleaning industry by delivering exceptional service that transforms spaces and exceeds expectations.",
            color: "from-blue-500/20 to-blue-600/20",
            iconColor: "text-blue-500"
        },
        {
            icon: Briefcase,
            title: "Our Vision",
            description: "To be the most trusted name in professional cleaning services across Scotland, setting new standards of excellence.",
            color: "from-purple-500/20 to-purple-600/20",
            iconColor: "text-purple-500"
        }
    ];

    const values = [
        {
            icon: CheckCircle2,
            title: "Excellence",
            description: "Committed to delivering superior quality in every task"
        },
        {
            icon: Users,
            title: "Teamwork",
            description: "Collaborative approach for exceptional results"
        },
        {
            icon: ShieldCheck,
            title: "Integrity",
            description: "Honest and transparent in all our dealings"
        },
        {
            icon: Leaf,
            title: "Sustainability",
            description: "Eco-friendly practices for a better future"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
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
                {/* Mission & Vision Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {missionPoints.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative"
                        >
                            <div className="relative bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 h-full">
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                                />
                                
                                <motion.div 
                                    className={`inline-flex p-4 rounded-xl bg-primary/10 ${point.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <point.icon className="w-6 h-6" />
                                </motion.div>

                                <h3 className="text-2xl font-bold mb-4">{point.title}</h3>
                                <p className="text-lg text-muted-foreground">{point.description}</p>

                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-[120%] h-[120%] bg-gradient-to-br ${point.color} opacity-20 -rotate-45 transform origin-bottom-left group-hover:scale-110 transition-transform duration-300`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Values Grid */}
             
            </div>
        </section>
    );
} 