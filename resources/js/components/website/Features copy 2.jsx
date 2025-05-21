import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Leaf, Clock, Shield } from 'lucide-react';

const features = [
    {
        id: 'home',
        title: 'Home Cleaning',
        description: 'Professional home cleaning services tailored to your needs. We bring our expertise and attention to detail to make your home sparkle.',
        highlights: [
            { icon: CheckCircle, text: 'Customized cleaning plans' },
            { icon: Sparkles, text: 'Eco-friendly cleaning products' },
            { icon: Clock, text: 'Flexible scheduling options' },
            { icon: Shield, text: 'Bonded and insured cleaners' },
        ],
        image: '/images/home-cleaning.png'
    },
    {
        id: 'office',
        title: 'Office Cleaning',
        description: 'Keep your workplace pristine with our comprehensive office cleaning services. We understand the importance of a clean, professional environment.',
        highlights: [
            { icon: CheckCircle, text: 'After-hours cleaning' },
            { icon: Sparkles, text: 'Sanitization services' },
            { icon: Clock, text: 'Regular maintenance plans' },
            { icon: Shield, text: 'Security-conscious staff' },
        ],
        image: '/images/office-cleaning.png'
    },
    {
        id: 'deep',
        title: 'Deep Cleaning',
        description: 'Thorough deep cleaning services that go beyond the surface. We tackle those hard-to-reach areas and stubborn stains.',
        highlights: [
            { icon: CheckCircle, text: 'Detailed attention to corners' },
            { icon: Sparkles, text: 'Specialized cleaning equipment' },
            { icon: Leaf, text: 'Green cleaning solutions' },
            { icon: Shield, text: 'Satisfaction guaranteed' },
        ],
        image: '/images/deep-cleaning.png'
    }
];

const Features = () => {
    const [activeTab, setActiveTab] = useState('home');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-2xl overflow-hidden shadow-lg"
                    >
                        <img
                            src={features.find(f => f.id === activeTab).image}
                            alt={features.find(f => f.id === activeTab).title}
                            className="w-full h-[600px] object-cover"
                        />
                    </motion.div>

                    {/* Right Column - Content */}
                    <div className="space-y-8">
                        {/* Tabs */}
                        <div className="flex space-x-4 border-b border-gray-200">
                            {features.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveTab(feature.id)}
                                    className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                                        activeTab === feature.id
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {feature.title}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl font-bold text-gray-900">
                                    {features.find(f => f.id === activeTab).title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {features.find(f => f.id === activeTab).description}
                                </p>
                                <motion.ul
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-4"
                                >
                                    {features.find(f => f.id === activeTab).highlights.map((highlight, index) => (
                                        <motion.li
                                            key={index}
                                            variants={itemVariants}
                                            className="flex items-center space-x-3"
                                        >
                                            <highlight.icon className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-700">{highlight.text}</span>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
