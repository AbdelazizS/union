import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { motion } from "framer-motion";
import { ChevronRight, Shield, FileText, AlertCircle, Clock, Users, Lock } from "lucide-react";

const termsSections = [
    {
        title: "1. Acceptance of Terms",
        content: "By accessing and using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
        icon: Shield
    },
    {
        title: "2. Description of Services",
        content: "We provide [Your Services Description]. Our services are subject to change, and we reserve the right to modify or discontinue any service at any time.",
        icon: FileText
    },
    {
        title: "3. User Responsibilities",
        content: "Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.",
        icon: Users
    },
    {
        title: "4. Intellectual Property",
        content: "All content, features, and functionality of our services are owned by us and are protected by international copyright, trademark, and other intellectual property laws.",
        icon: Lock
    },
    {
        title: "5. Limitation of Liability",
        content: "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.",
        icon: AlertCircle
    },
    {
        title: "6. Changes to Terms",
        content: "We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our website.",
        icon: Clock
    }
];

export default function Terms() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms and Conditions",
        "description": "Terms and Conditions for Professional Cleaning Services. Read our terms of service and understand your rights and responsibilities.",
        "publisher": {
            "@type": "Organization",
            "name": "Professional Cleaning Services"
        },
        "datePublished": "2024-01-01",
        "dateModified": "2024-01-01"
    };

    return (
        <WebsiteLayout
            title="Terms and Conditions | Professional Cleaning Services"
            description="Read our terms and conditions to understand the rules and guidelines for using our cleaning services. We ensure transparency and clear communication."
            canonical="https://yourwebsite.com/terms"
            ogImage="/images/terms-og.jpg"
            structuredData={structuredData}
            keywords="terms and conditions, service terms, cleaning service terms, legal terms, service agreement"
        >
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-primary/5 z-10">
                {/* Background Pattern */}
                <div className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
                </div>

                <div className="container mx-auto px-4 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <motion.h1 
                            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        >
                            Terms of Service
                        </motion.h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Introduction */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Welcome to our Terms of Service. This document outlines the rules, guidelines, and agreements that govern your use of our services. Please read these terms carefully before using our platform.
                            </p>
                        </motion.div>

                        {/* Terms Sections */}
                        <div className="space-y-12">
                            {termsSections.map((section, index) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-primary/10"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-primary/10">
                                            <section.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                                {section.title}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-12 p-8 bg-primary/5 rounded-2xl border border-primary/10"
                        >
                            <h3 className="text-xl font-semibold mb-4">Additional Information</h3>
                            <p className="text-muted-foreground mb-4">
                                If you have any questions about these Terms of Service, please contact us at:
                            </p>
                            <div className="flex items-center gap-2 text-primary">
                                <ChevronRight className="w-4 h-4" />
                                <a href="mailto:legal@company.com" className="hover:underline">
                                    legal@company.com
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </WebsiteLayout>
    );
} 