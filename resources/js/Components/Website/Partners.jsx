import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Award, Star } from "lucide-react";

const Partners = ({ partners = [] }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { 
            y: 20, 
            opacity: 0,
            scale: 0.95,
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99],
            },
        },
    };

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
            <div className="container mx-auto px-4">
                <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-items-center"
                >
                    {partners.map((partner) => (
                        <motion.div
                            key={partner.id}
                            variants={itemVariants}
                            className="w-full max-w-[320px]"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100/50 shadow-md hover:shadow-lg transition-all duration-500 border">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <div className="p-6 space-y-4">
                                    <div className="relative">
                                        <motion.img
                                            src={partner.image}
                                            alt={partner.name}
                                            className="w-full h-auto object-contain transition-all duration-500"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <motion.div
                                            className="absolute -top-2 -right-2"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                                                <Star className="w-3 h-3 mr-1" />
                                                Premium
                                            </Badge>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-gray-50">
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                {partner.category}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Partners;
