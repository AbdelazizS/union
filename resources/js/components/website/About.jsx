import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Sparkles, CheckCircle2, Leaf, ShieldCheck, Clock, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from '@inertiajs/react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
    amount: 0.15 // Standard trigger point
  });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [50, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Standard stagger time
        delayChildren: 0.2, // Standard initial delay
        duration: 0.45 // Standard duration
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
        duration: 0.45 // Updated to match container duration
      }
    }
  };

  const features = [
    {
      title: "Professional Cleaning",
      description: "Expert cleaning services tailored to your needs",
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />
    },
    {
      title: "Eco-Friendly",
      description: "Using sustainable and safe cleaning products",
      icon: <Leaf className="w-6 h-6 text-primary" />
    },
    {
      title: "Satisfaction Guaranteed",
      description: "100% satisfaction guarantee on all services",
      icon: <ShieldCheck className="w-6 h-6 text-primary" />
    }
  ];

  const stats = [
    { value: "10+", label: "Years Experience", icon: <Clock className="w-5 h-5 text-primary" /> },
    { value: "5000+", label: "Happy Clients", icon: <Star className="w-5 h-5 text-primary" /> },
    { value: "100%", label: "Satisfaction Rate", icon: <Sparkles className="w-5 h-5 text-primary" /> }
  ];

  return (
    <div ref={ref} className="relative  bg-background overflow-hidden">
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.45, // Updated to match standard duration
            ease: "easeOut",
            delay: 0.2
          }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Trusted by 5000+ Customers
          </Badge>
          <motion.h1
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              About Our Cleaning Service
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              delay: 0.2, // Updated to match standard delay
              duration: 0.45 // Updated to match standard duration
            }}
          >
            We provide exceptional cleaning services with a focus on quality, reliability, and customer satisfaction.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            variants={itemVariants}
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <img
                    src="/images/about-cleaning.jpg"
                    alt="Professional cleaning team"
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </CardContent>
            </Card>
            <motion.div
              className="absolute -top-4 -right-4 bg-background p-4 rounded-full shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-8"
          >
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-semibold mb-6 text-foreground">Why Choose Us?</h2>
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-4"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="p-2 bg-primary/10 rounded-full"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-medium text-foreground">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-card border rounded-lg shadow-sm"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/booking/create`}
              >

                <Button
                  size="lg"
                  className={cn(
                    "w-full py-6 text-lg font-semibold",
                    "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                    "text-primary-foreground shadow-lg hover:shadow-xl",
                    "transition-all duration-300"
                  )}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Book Your Cleaner Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
