import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Basic',
        price: '99',
        description: 'Perfect for small homes and apartments',
        features: [
            'General cleaning',
            'Bathroom cleaning',
            'Kitchen cleaning',
            'Dusting',
            'Vacuuming',
            'Mopping floors',
        ],
        popular: false,
    },
    {
        name: 'Premium',
        price: '149',
        description: 'Ideal for medium-sized homes',
        features: [
            'Everything in Basic',
            'Deep cleaning',
            'Window cleaning',
            'Fridge cleaning',
            'Oven cleaning',
            'Cabinet organization',
        ],
        popular: true,
    },
    {
        name: 'Ultimate',
        price: '199',
        description: 'Complete cleaning solution for large homes',
        features: [
            'Everything in Premium',
            'Move-in/out cleaning',
            'Carpet cleaning',
            'Upholstery cleaning',
            'Wall cleaning',
            'Garage cleaning',
        ],
        popular: false,
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

export default function Pricing() {
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
                        Transparent Pricing
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Choose the perfect cleaning plan for your needs. All plans include our satisfaction guarantee.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {plans.map((plan) => (
                        <motion.div key={plan.name} variants={itemVariants}>
                            <Card className={`relative ${plan.popular ? 'border-primary' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-center">
                                        {plan.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center mb-6">
                                        <span className="text-4xl font-bold">${plan.price}</span>
                                        <span className="text-muted-foreground">/visit</span>
                                    </div>
                                    <p className="text-center text-muted-foreground mb-6">
                                        {plan.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center">
                                                <Check className="h-5 w-5 text-primary mr-2" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? 'default' : 'outline'}
                                    >
                                        Get Started
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-muted-foreground">
                        Need a custom plan? Contact us for a personalized quote.
                    </p>
                    <Button variant="link" className="mt-4">
                        Contact Sales
                    </Button>
                </motion.div>
            </div>
        </section>
    );
} 