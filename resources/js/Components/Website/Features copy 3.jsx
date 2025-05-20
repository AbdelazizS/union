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
        image: '/images/home-cleaning.png',
        gradient: 'from-blue-500 to-purple-600'
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
        image: '/images/office-cleaning.png',
        gradient: 'from-green-500 to-teal-600'
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
        image: '/images/deep-cleaning.png',
        gradient: 'from-orange-500 to-red-600'
    }
];

const Features = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [hoveredTab, setHoveredTab] = useState(null);

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
        <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto px-4 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column - Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative rounded-3xl overflow-hidden shadow-2xl group"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${features.find(f => f.id === activeTab).gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                        <img
                            src={features.find(f => f.id === activeTab).image}
                            alt={features.find(f => f.id === activeTab).title}
                            className="w-full h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    </motion.div>

                    {/* Right Column - Content */}
                    <div className="space-y-10">
                        {/* Tabs */}
                        <div className="flex space-x-4 border-b border-gray-200">
                            {features.map((feature) => (
                                <motion.button
                                    key={feature.id}
                                    onClick={() => setActiveTab(feature.id)}
                                    onHoverStart={() => setHoveredTab(feature.id)}
                                    onHoverEnd={() => setHoveredTab(null)}
                                    className={`relative px-6 py-3 text-sm font-medium transition-all duration-300 ${
                                        activeTab === feature.id
                                            ? 'text-blue-600'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {feature.title}
                                    {activeTab === feature.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {hoveredTab === feature.id && activeTab !== feature.id && (
                                        <motion.div
                                            layoutId="hoverTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
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
                                className="space-y-8"
                            >
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                        {features.find(f => f.id === activeTab).title}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        {features.find(f => f.id === activeTab).description}
                                    </p>
                                </div>
                                
                                <motion.ul
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-6"
                                >
                                    {features.find(f => f.id === activeTab).highlights.map((highlight, index) => (
                                        <motion.li
                                            key={index}
                                            variants={itemVariants}
                                            className="flex items-center space-x-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                <highlight.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{highlight.text}</span>
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
