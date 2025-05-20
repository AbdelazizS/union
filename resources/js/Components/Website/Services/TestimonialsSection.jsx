import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export default function TestimonialsSection({ testimonials = [] }) {
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

    // Take only the first 3 testimonials
    const displayedTestimonials = testimonials.slice(0, 3);

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Read what our satisfied customers have to say about their experience
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {displayedTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id || index}
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="h-full p-8 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 hover:border-primary/30 transition-all duration-300">
                                {/* Glassmorphism Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Content */}
                                <div className="relative">
                                    {/* Quote Icon Container */}
                                    <div className="absolute -top-6 -left-4">
                                        <motion.div
                                            initial={{ rotate: -10, scale: 0.9, opacity: 0.5 }}
                                            whileHover={{ rotate: 0, scale: 1, opacity: 1 }}
                                            className="relative"
                                        >
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-500" />
                                            
                                            {/* Icon Container */}
                                            <div className="relative p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
                                                <Quote className="h-6 w-6 text-primary" />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Testimonial Content */}
                                    <div className="pt-6">
                                        <p className="text-muted-foreground mb-6">
                                            {testimonial.content || testimonial.message}
                                        </p>

                                        {/* Author Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <h4 className="font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                                    {testimonial.name || testimonial.client_name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {testimonial.role || testimonial.client_role}
                                                </p>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex gap-1">
                                                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className="h-4 w-4 fill-primary text-primary" 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
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