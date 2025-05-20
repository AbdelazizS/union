import { motion } from "framer-motion";
import { CalendarCheck, ClipboardCheck, Truck } from "lucide-react";

export default function ProcessSection() {
    const steps = [
        {
            title: "Book Appointment",
            description: "Choose your service and select a convenient time slot that works for you",
            icon: CalendarCheck,
            step: "01"
        },
        {
            title: "Service Confirmation",
            description: "Receive confirmation and detailed information about your upcoming service",
            icon: ClipboardCheck,
            step: "02"
        },
        {
            title: "Service Delivery",
            description: "Our professional team arrives and delivers exceptional service",
            icon: Truck,
            step: "03"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
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
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/5 overflow-hidden">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        How We Work
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Simple and efficient process to get started with our services
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative"
                        >
                            <div className="h-full p-8 rounded-2xl bg-background border shadow-sm group hover:shadow-lg transition-shadow duration-300">
                                {/* Step Number */}
                                <div className="absolute -top-4 right-8 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
                                    {step.step}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col items-center text-center gap-4">
                                    {/* Icon with Animation */}
                                    <motion.div 
                                        className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <step.icon className="h-8 w-8" />
                                    </motion.div>

                                    {/* Title with Gradient */}
                                    <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        {step.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>

                                {/* Glassmorphism Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-[.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Connecting Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-primary/30">
                                    <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-2 rounded-full bg-primary/50" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
} 