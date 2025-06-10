import { motion, useInView } from "framer-motion";
import { Sparkles, Clock, PoundSterling, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ServicesGrid({ categories = [] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
        once: true, 
        margin: "-10%",
        amount: 0.2
    });

    // Framer Motion Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const categoryVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.5
            }
        },
        hover: {
            scale: 1.02,
            y: -5,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    return (
        <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
            <motion.div 
                className="container mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {categories.map((category, categoryIndex) => {
                    const servicesWithAdjustedPrice = category.services.map(service => ({
                        ...service,
                        price: category.hourly_rate > service.price ? category.hourly_rate : service.price
                    }));

                    return (
                        <motion.div
                            key={category.slug}
                            className="mb-32 last:mb-0"
                            variants={categoryVariants}
                        >
                            {/* Category Header */}
                            <div className="relative mb-12 flex items-center">
                                <motion.div 
                                    className="flex-1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h2 className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
                                        {category.name}
                                    </h2>
                                    <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
                                </motion.div>
                            </div>

                            {/* Services Grid */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {servicesWithAdjustedPrice.map((service, index) => (
                                    <motion.div
                                        key={service.slug}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        className="relative group"
                                    >
                                        <Link 
                                            href={`/our-services/${category.slug}/${service.slug}`}
                                            className="block"
                                        >
                                            {/* Glassmorphism Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl transform -rotate-1 scale-[1.02] opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                            
                                            {/* Card */}
                                            <Card className="relative h-full overflow-hidden rounded-2xl border border-white/10 group-hover:border-primary/30 transition-all duration-300 bg-gradient-to-b from-white/[0.03] to-white/[0.075] dark:from-white/[0.02] dark:to-white/[0.05] backdrop-blur-[6px] ">
                                                <CardHeader className="!p-0" > 
                                                    {/* Service Image */}
                                                    {service.image_url && (
                                                        <div className="relative w-full aspect-[16/9] mb-4 rounded-t-xl overflow-hidden">
                                                            <img 
                                                                src={service.image_url} 
                                                                alt={service.title}
                                                                className="absolute inset-0 w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex items-start gap-4 p-4">
                                                        {/* Icon with Glow */}
                                                        {/* <div className="relative">
                                                            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl transform group-hover:scale-150 transition-transform duration-500" />
                                                            <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary transform group-hover:scale-110 transition-transform duration-300">
                                                                <Sparkles className="h-6 w-6" aria-hidden="true" />
                                                            </div>
                                                        </div> */}
                                                        
                                                        {/* Title and Badge */}
                                                        <div className="space-y-2">
                                                            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                                                                {service.title}
                                                            </CardTitle>
                                                            {service.badge && (
                                                                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                                    {service.badge}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardHeader>

                                                <CardContent>
                                                    {/* Description */}
                                                    <CardDescription className="text-base whitespace-pre-line mb-6 line-clamp-3">
                                                        {service.description}
                                                    </CardDescription>

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-1.5 text-primary">
                                                                <PoundSterling className="h-4 w-4" />
                                                                <span className="font-medium">From {service.price}</span>
                                                            </div>
                                                            {/* <div className="flex items-center gap-1.5 text-primary">
                                                                <Clock className="h-4 w-4" />
                                                                <span className="font-medium">{service.duration}</span>
                                                            </div> */}
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-primary transform group-hover:translate-x-1 transition-transform duration-300" />
                                                    </div>

                                                    {/* Hover Gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
} 