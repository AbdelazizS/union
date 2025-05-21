import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

const features = [
    'Professional & Trained Staff',
    'Eco-friendly Cleaning Products',
    '100% Satisfaction Guaranteed',
    'Flexible Scheduling',
    'Affordable Pricing',
    '24/7 Customer Support'
];

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

    return (
        <section ref={containerRef} className="py-20 relative overflow-hidden">
            {/* Background decorative elements */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.1 }}
                viewport={{ once: true }}
                // className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/20 via-transparent to-transparent"
            />
            
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <motion.div
                        style={{ opacity, scale }}
                        className="relative group"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden"
                        >
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                src="/images/about-cleaning.jpg"
                                alt="Professional cleaning team"
                                className="object-cover w-full h-full transition-all duration-300"
                            />
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"
                            />
                        </motion.div>
                        
                        {/* Experience Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="text-center relative"
                            >
                                <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-yellow-400 animate-pulse" />
                                <span className="block text-3xl font-bold bg-gradient-to-r from-white to-primary-foreground/80 bg-clip-text text-transparent">10+</span>
                                <span className="text-sm font-medium">Years Experience</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        style={{ opacity, scale }}
                        className="relative"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                        >
                            Your Trusted Cleaning Partner
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-muted-foreground mb-8 text-lg leading-relaxed"
                        >
                            With over a decade of experience in professional cleaning services, 
                            we've built our reputation on reliability, quality, and customer 
                            satisfaction. Our team of trained professionals is dedicated to 
                            providing exceptional cleaning services that exceed expectations.
                        </motion.p>

                        {/* Features List */}
                        <div className="grid sm:grid-cols-2 gap-6 mb-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                    </motion.div>
                                    <span className="font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button 
                                size="lg" 
                                className="group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300"
                            >
                                <motion.span
                                    initial={{ x: 0 }}
                                    whileHover={{ x: -5 }}
                                    className="relative z-10 flex items-center"
                                >
                                    Learn More About Us
                                    <motion.svg
                                        className="ml-2 h-5 w-5"
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 5 }}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </motion.svg>
                                </motion.span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.5 }}
                                />
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 