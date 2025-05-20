import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/Components/ui/button';
import { ArrowRight, Sparkles, Star, Shield, Award, Users, Clock, CheckCircle, Leaf, BadgeCheck } from 'lucide-react';

export default function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const stats = [
        { icon: Users, value: "500+", label: "Happy Clients", color: "text-blue-500" },
        { icon: Clock, value: "24/7", label: "Service Available", color: "text-green-500" },
        { icon: CheckCircle, value: "100%", label: "Satisfaction", color: "text-purple-500" },
        { icon: Star, value: "4.9", label: "Average Rating", color: "text-yellow-500" }
    ];

    const badges = [
        {
            icon: Shield,
            label: "Licensed & Insured",
            description: "Fully protected service",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            icon: Leaf,
            label: "Eco-Friendly",
            description: "Green cleaning certified",
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        }
    ];

    return (
        <section className="relative min-h-screen flex items-center py-12 md:py-16 lg:py-20 overflow-hidden">
            {/* Background Image with Parallax */}
            <motion.div 
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                <img
                    src="/images/hero-cleaning.jpg"
                    alt="Professional cleaning service"
                    className="object-cover w-full h-full"
                />
            </motion.div>
            
            {/* Content */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-left"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 hover:bg-primary/20 transition-colors"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            <span>Professional Cleaning Services</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                        >
                            Sparkling Clean,{' '}
                            <span className="text-primary">Every Time</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-muted-foreground mb-8"
                        >
                            Experience the difference with our professional cleaning services. 
                            We bring sparkle to your space with eco-friendly products and 
                            trained professionals.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 mb-12"
                        >
                            <Button size="lg" className="group">
                                Get a Free Quote
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button size="lg" variant="outline">
                                Our Services
                            </Button>
                        </motion.div>

                        {/* Social Proof Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-6"
                        >
                            {/* Ratings */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm font-medium">4.9/5 from 2,000+ reviews</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Enhanced Floating Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="absolute -bottom-6 -right-6 bg-background/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="grid grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className={`p-2 rounded-lg bg-background/50 ${stat.color}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold">{stat.value}</p>
                                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 