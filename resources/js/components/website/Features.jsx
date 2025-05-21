import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, Leaf, ShieldCheck, Clock, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from '@inertiajs/react';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px",
    amount: 0.15
  });

  const [activeTab, setActiveTab] = useState('home');
  const [hoveredCard, setHoveredCard] = useState(null);

  const services = {
    home: {
      title: "Home Cleaning",
      description: "Professional cleaning services tailored to your home's unique needs. We ensure every corner shines with our attention to detail.",
      highlights: [
        { icon: <CheckCircle2 className="w-5 h-5 text-primary" />, text: "Customized cleaning plans" },
        { icon: <Leaf className="w-5 h-5 text-primary" />, text: "Eco-friendly products" },
        { icon: <ShieldCheck className="w-5 h-5 text-primary" />, text: "Trained professionals" },
        { icon: <Clock className="w-5 h-5 text-primary" />, text: "Flexible scheduling" }
      ]
    },
    office: {
      title: "Office Cleaning",
      description: "Keep your workplace spotless and professional with our comprehensive office cleaning services.",
      highlights: [
        { icon: <CheckCircle2 className="w-5 h-5 text-primary" />, text: "After-hours cleaning" },
        { icon: <Sparkles className="w-5 h-5 text-primary" />, text: "Sanitization services" },
        { icon: <ShieldCheck className="w-5 h-5 text-primary" />, text: "Security protocols" },
        { icon: <Star className="w-5 h-5 text-primary" />, text: "Quality assurance" }
      ]
    },
    deep: {
      title: "Deep Cleaning",
      description: "Transform your space with our thorough deep cleaning services that reach every nook and cranny.",
      highlights: [
        { icon: <CheckCircle2 className="w-5 h-5 text-primary" />, text: "Detailed attention" },
        { icon: <Leaf className="w-5 h-5 text-primary" />, text: "Natural solutions" },
        { icon: <ShieldCheck className="w-5 h-5 text-primary" />, text: "Satisfaction guaranteed" },
        { icon: <Clock className="w-5 h-5 text-primary" />, text: "Efficient service" }
      ]
    }
  };

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
    hidden: { y: 20, opacity: 0 },
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

  return (
    <div ref={ref} className="relative bg-background overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
      </div>

      <div className="container mx-auto px-4 py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Our Features
            </span>
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience excellence with our innovative cleaning solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            {/* Modern Tab Navigation */}
            <div className="flex space-x-4 p-1 bg-background/50 backdrop-blur-sm rounded-2xl border border-primary/10">
              {Object.keys(services).map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium transition-all duration-300 rounded-xl",
                    "hover:text-primary hover:bg-primary/5",
                    activeTab === tab
                      ? "text-primary bg-primary/10 shadow-lg shadow-primary/5"
                      : "text-muted-foreground"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {services[tab].title}
                </motion.button>
              ))}
            </div>

            {/* Tab Content with Glassmorphism */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 bg-background/50 backdrop-blur-sm p-8 rounded-2xl border border-primary/10"
              >
                <h3 className="text-3xl font-semibold text-foreground">
                  {services[activeTab].title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {services[activeTab].description}
                </p>
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {services[activeTab].highlights.map((highlight, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      className="flex items-start space-x-3 group"
                      onHoverStart={() => setHoveredCard(index)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      <motion.div
                        className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {highlight.icon}
                      </motion.div>
                      <span className="text-foreground group-hover:text-primary transition-colors text-lg">
                        {highlight.text}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                <Link
                                        href={`/booking/create`}
                                    >
                <motion.button
                                      
                                      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(var(--primary), 0.3)" }}
                                      whileTap={{ scale: 0.98 }}
                                      className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300"
                                      >
                  Book Cleaner <ArrowRight className="w-5 h-5" />
                </motion.button>
                  </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Column - Image with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            <Card className="overflow-hidden backdrop-blur-sm bg-background/50 border-primary/10 transform-gpu hover:rotate-y-5 transition-transform duration-500">
              <CardContent className="p-0">
              <div className="aspect-w-16 aspect-h-9 rounded-3xl overflow-hidden">
                  <motion.img
                    src="/images/hero-cleaning.jpg"
                    alt="Professional cleaning service"
                    className="object-cover w-full h-full"
                    whileHover={{ 
                      scale: 1.1,
                      filter: "brightness(1.1) contrast(1.1)"
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Floating Elements with Enhanced Animation */}
            <motion.div
              className="absolute -top-4 -right-4 bg-background/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-primary/10"
              whileHover={{ rotate: 360, scale: 1.1, boxShadow: "0 0 30px rgba(var(--primary), 0.2)" }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 bg-background/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-primary/10"
              whileHover={{ rotate: -360, scale: 1.1, boxShadow: "0 0 30px rgba(var(--primary), 0.2)" }}
              transition={{ duration: 0.5 }}
            >
              <Star className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Features;
