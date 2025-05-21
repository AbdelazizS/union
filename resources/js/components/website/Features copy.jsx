import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Shield, 
    Leaf, 
    Clock, 
    Users, 
    Star, 
    Phone 
} from 'lucide-react';

const features = [
    {
        id: 'quality',
        title: 'Quality Service',
        icon: Shield,
        description: 'We maintain the highest standards of cleaning quality, ensuring every detail is perfect.',
        image: '/images/hero-cleaning.jpg',
        benefits: [
            'Trained professionals',
            'Quality control checks',
            'Detailed cleaning protocols',
            'Regular quality audits'
        ]
    },
    {
        id: 'eco-friendly',
        title: 'Eco-Friendly',
        icon: Leaf,
        description: 'Our cleaning products are environmentally friendly and safe for your family and pets.',
        image: '/images/hero-cleaning.jpg',
        benefits: [
            'Green cleaning products',
            'Sustainable practices',
            'Reduced environmental impact',
            'Safe for all surfaces'
        ]
    },
    {
        id: 'reliable',
        title: 'Reliable Service',
        icon: Clock,
        description: 'Count on us for punctual, consistent, and reliable cleaning services every time.',
        image: '/images/hero-cleaning.jpg',
        benefits: [
            'On-time service',
            'Consistent quality',
            'Regular scheduling',
            'Flexible timing'
        ]
    },
    {
        id: 'professional',
        title: 'Professional Team',
        icon: Users,
        description: 'Our team consists of trained and experienced cleaning professionals.',
        image: '/images/professional-team.jpg',
        benefits: [
            'Background checked staff',
            'Regular training',
            'Professional equipment',
            'Uniformed cleaners'
        ]
    },
    {
        id: 'satisfaction',
        title: '100% Satisfaction',
        icon: Star,
        description: 'We guarantee your complete satisfaction with our cleaning services.',
        image: '/images/satisfaction.jpg',
        benefits: [
            'Satisfaction guarantee',
            'Free re-cleaning',
            'Customer feedback system',
            'Quality assurance'
        ]
    },
    {
        id: 'support',
        title: '24/7 Support',
        icon: Phone,
        description: 'Our customer support team is available round the clock to assist you.',
        image: '/images/customer-support.jpg',
        benefits: [
            '24/7 availability',
            'Quick response time',
            'Multiple contact options',
            'Emergency support'
        ]
    }
];

export default function Features() {
    const [activeTab, setActiveTab] = useState('quality');

    return (
        <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Choose Us
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We provide exceptional cleaning services with a focus on quality, 
                        reliability, and customer satisfaction.
                    </p>
                </motion.div>

                <Tabs defaultValue="quality" className="w-full">
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
                        {features.map((feature) => (
                            <TabsTrigger
                                key={feature.id}
                                value={feature.id}
                                className="flex flex-col items-center gap-2 py-4"
                            >
                                <feature.icon className="h-6 w-6" />
                                <span className="text-sm">{feature.title}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {features.map((feature) => (
                        <TabsContent key={feature.id} value={feature.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid lg:grid-cols-2 gap-8 items-center"
                            >
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6">
                                        {feature.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {feature.benefits.map((benefit, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center space-x-2"
                                            >
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                <span>{benefit}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
} 




<div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
<img
  src="/images/hero-cleaning.jpg"
  alt="Professional cleaning service"
  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
/>
</div>