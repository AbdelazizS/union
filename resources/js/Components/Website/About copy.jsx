import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';

const features = [
    'Professional & Trained Staff',
    'Eco-friendly Cleaning Products',
    '100% Satisfaction Guaranteed',
    'Flexible Scheduling',
    'Affordable Pricing',
    '24/7 Customer Support'
];

export default function About() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            <img
                                src="/images/about-cleaning.jpg"
                                alt="Professional cleaning team"
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        </div>
                        
                        {/* Experience Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg"
                        >
                            <div className="text-center">
                                <span className="block text-2xl font-bold">10+</span>
                                <span className="text-sm">Years Experience</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Your Trusted Cleaning Partner
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            With over a decade of experience in professional cleaning services, 
                            we've built our reputation on reliability, quality, and customer 
                            satisfaction. Our team of trained professionals is dedicated to 
                            providing exceptional cleaning services that exceed expectations.
                        </p>

                        {/* Features List */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                    className="flex items-center space-x-2"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span>{feature}</span>
                                </motion.div>
                            ))}
                        </div>

                        <Button size="lg" className="group">
                            Learn More About Us
                            <svg
                                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
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
                            </svg>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 