import { motion } from 'framer-motion';
import { 
    Sparkles, 
    Home, 
    Building2, 
    Car, 
    Bath, 
    Sofa,
    UtensilsCrossed
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
    {
        icon: Home,
        title: 'Residential Cleaning',
        description: 'Comprehensive cleaning solutions for your home, ensuring every corner sparkles.',
    },
    {
        icon: Building2,
        title: 'Commercial Cleaning',
        description: 'Professional cleaning services for offices and commercial spaces.',
    },
    {
        icon: Car,
        title: 'Car Detailing',
        description: 'Expert car cleaning and detailing services for a spotless vehicle.',
    },
    {
        icon: Bath,
        title: 'Deep Cleaning',
        description: 'Thorough deep cleaning services for a healthier living environment.',
    },
    {
        icon: Sofa,
        title: 'Furniture Cleaning',
        description: 'Specialized cleaning for all types of furniture and upholstery.',
    },
    {
        icon: UtensilsCrossed,
        title: 'Kitchen Cleaning',
        description: 'Professional kitchen cleaning and sanitization services.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export default function Services() {
    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
                    >
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span>Our Services</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Professional Cleaning Solutions
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We offer a wide range of cleaning services tailored to meet your specific needs.
                        Our trained professionals use eco-friendly products to ensure the best results.
                    </p>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {services.map((service, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="h-full hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <service.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        {service.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
} 