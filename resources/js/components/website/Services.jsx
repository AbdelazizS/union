import { 
    Sparkles,
    ArrowRight,
    Clock,
    PoundSterling,
    ChevronRight
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

export default function Services({ services = [] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
        once: true, 
        margin: "-50px 0px",
        amount: 0.1
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
                duration: 0.45
            }
        }
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 70,
                damping: 17,
                duration: 0.45
            }
        }
    };

    // Get featured services (first 6 services across all categories)
    const featuredServices = services.reduce((acc, category) => {
        
        if(category.slug.includes('cleaning')) {
            const servicesWithAdjustedPrice = category.services.map(service => ({
                ...service,
                price: category.hourly_rate > service.price ? category.hourly_rate : service.price,
                category:category.slug 
            }));
            return acc.concat(servicesWithAdjustedPrice);
        }
        return acc;
    }, []).slice(0, 6);
    console.log(featuredServices);

    return (
        <section 
            ref={ref}
            className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-primary/5"
            aria-labelledby="services-heading"
        >
            <div className="container mx-auto">
                <motion.div 
                    className="text-center mb-16 overflow-visible"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ 
                        duration: 0.45,
                        ease: "easeOut",
                        delay: 0.2
                    }}
                >
                    <h2 
                        id="services-heading"
                        className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4"
                    >
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Our Cleaning Services
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Professional cleaning solutions tailored for every property type, ensuring excellence in every detail
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {featuredServices.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                        >
                            <Link 
                                href={`/our-services/${service.category}/${service.slug}`}
                                className="block"
                            >
                                <Card className="h-full relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <CardHeader className="!p-0"> 
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
                                        <div className="flex items-center gap-4 px-6 py-2">
                                            {/* <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                                                <Sparkles className="h-6 w-6" aria-hidden="true" />
                                            </div> */}
                                            <div>
                                                <CardTitle className="text-xl text- font-bold">{service.title}</CardTitle>
                                                {/* {service.badge && (
                                                    <Badge variant="link" className="mt-2">
                                                        {service.badge}
                                                    </Badge>
                                                )} */}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base whitespace-pre-line mb-4">
                                            {service.description}
                                        </CardDescription>
                                        {/* {service.options && service.options.length > 0 && (
                                            <div className="space-y-2 mb-4">
                                                {service.options.map((option, idx) => (
                                                    <div key={idx} className="text-sm text-muted-foreground">
                                                        {option.formatted_text}
                                                    </div>
                                                ))}
                                            </div>
                                        )} */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1.5 text-primary">
                                                    <PoundSterling className="h-4 w-4" />
                                                    <span className="font-medium">From £{service.price}</span>
                                                </div>
                                                {/* <div className="flex items-center gap-1.5 text-primary">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="font-medium">{service.duration}</span>
                                                </div> */}
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-primary transform group-hover:translate-x-1 transition-transform duration-300" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div 
                    className="mt-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ 
                        delay: 0.2,
                        duration: 0.45
                    }}
                >
                    <Link href="/our-services">
                        <Button 
                            size="lg" 
                            className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Explore All Services
                            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
