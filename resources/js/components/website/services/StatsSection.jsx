import { motion } from "framer-motion";
import { Users, Trophy, ThumbsUp, Star } from "lucide-react";

export default function StatsSection() {
    const stats = [
        { icon: Users, value: "40+", label: "Happy Clients" },
        { icon: Trophy, value: "1+", label: "Years Experience" },
        { icon: ThumbsUp, value: "100%", label: "Satisfaction Rate" },
        { icon: Star, value: "5/5", label: "Average Rating" }
    ];

    return (
        <section className="relative py-16 bg-primary/5 overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0 opacity-10"
                    animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                        duration: 20, 
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: "24px 24px"
                    }}
                />
            </div>

            {/* Stats Container */}
            <div className="container mx-auto px-4 relative">
                <motion.div 
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            {/* Glassmorphism Card */}
                            <div className="relative p-6 rounded-2xl overflow-hidden">
                                {/* Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-white/[0.075] dark:from-white/[0.02] dark:to-white/[0.05] backdrop-blur-[6px] border border-white/10" />
                                
                                {/* Content */}
                                <div className="relative">
                                    {/* Icon */}
                                    <motion.div 
                                        className="inline-flex mb-4"
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 15,
                                            delay: index * 0.1 
                                        }}
                                    >
                                        <div className="relative">
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-500" />
                                            
                                            {/* Icon Container */}
                                            <div className="relative p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                                                <stat.icon className="h-8 w-8" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Value Counter */}
                                    <motion.div
                                        className="text-3xl font-bold mb-2"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                    >
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                            {stat.value}
                                        </span>
                                    </motion.div>

                                    {/* Label */}
                                    <motion.p
                                        className="text-muted-foreground"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        {stat.label}
                                    </motion.p>
                                </div>

                                {/* Hover Effect */}
                                <motion.div
                                    className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    initial={false}
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
} 