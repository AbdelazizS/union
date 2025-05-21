import { motion } from "framer-motion";
import { Trophy, CheckCircle, DollarSign, Clock, Users, Sparkles } from "lucide-react";

export default function WhyChooseUsSection() {
    const features = [
        {
            title: "Professional Expertise",
            description: "Our team consists of highly trained and certified professionals with years of experience",
            icon: Trophy
        },
        {
            title: "Quality Guaranteed",
            description: "We stand behind our work with a 100% satisfaction guarantee on all services",
            icon: CheckCircle
        },
        {
            title: "Competitive Pricing",
            description: "Transparent pricing with no hidden fees, offering the best value for your money",
            icon: DollarSign
        },
        {
            title: "Reliable & Punctual",
            description: "We respect your time and always arrive as scheduled, completing work efficiently",
            icon: Clock
        },
        {
            title: "Customer-Centric",
            description: "Your satisfaction is our priority, with personalized service tailored to your needs",
            icon: Users
        },
        {
            title: "Modern Solutions",
            description: "Using the latest technology and methods to deliver superior results",
            icon: Sparkles
        }
    ];

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

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Why Choose Our Services?
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Experience excellence in every service with our professional team
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="h-full p-8 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 hover:border-primary/30 transition-colors duration-300">
                                {/* Glassmorphism Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Content */}
                                <div className="relative">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
} 