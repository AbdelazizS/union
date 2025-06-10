import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { motion } from "framer-motion";
import { ChevronRight, Shield, Database, Cookie, Eye, Lock, Mail, Server } from "lucide-react";

const privacySections = [
    {
        title: "1. Information We Collect",
        content: "We collect information that you provide directly to us, including your name, email address, and any other information you choose to provide. We also collect information about your use of our services.",
        icon: Database
    },
    {
        title: "2. How We Use Your Information",
        content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users and the public.",
        icon: Eye
    },
    {
        title: "3. Information Sharing",
        content: "We do not share your personal information with third parties except as described in this policy. We may share information with service providers who assist us in operating our services.",
        icon: Server
    },
    {
        title: "4. Data Security",
        content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
        icon: Lock
    },
    {
        title: "5. Cookies and Tracking",
        content: "We use cookies and similar tracking technologies to track activity on our services and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
        icon: Cookie
    },
    {
        title: "6. Your Rights",
        content: "You have the right to access, correct, or delete your personal information. You can also object to our processing of your data or request that we restrict our processing of your data.",
        icon: Shield
    },
    {
        title: "7. Contact Us",
        content: "If you have any questions about this Privacy Policy, please contact us at privacy@company.com. We will respond to your request within a reasonable timeframe.",
        icon: Mail
    }
];

export default function Privacy() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy | Union Gate",
        "description": "Privacy Policy for Union Gate's Professional Cleaning Services in Edinburgh. Learn how we collect, use, and protect your personal information.",
        "publisher": {
            "@type": "Organization",
            "name": "Union Gate",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "1 Lochside View",
                "addressLocality": "Edinburgh",
                "addressRegion": "Scotland",
                "postalCode": "EH12 9DH",
                "addressCountry": "United Kingdom"
            },
            "telephone": "+477 730 788 3811",
            "email": "info@uniongate.uk",
            "url": "https://uniongate.uk"
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0]
    };

    return (
        <WebsiteLayout
            title="Privacy Policy | Union Gate Cleaning Services Edinburgh"
            description="Read Union Gate's privacy policy to understand how we collect, use, and protect your personal information. We are committed to maintaining your privacy and data security in Edinburgh."
            canonical="/privacy"
           ogImage="/favicon.ico"
            structuredData={structuredData}
            keywords="Union Gate privacy policy, Edinburgh cleaning service data protection, personal information protection Scotland, cleaning service privacy Edinburgh, data security UK"
        >
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden  bg-primary/5 z-10">
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
                            Privacy Policy
                        </motion.h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Privacy Content */}
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
                                Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. Please read this privacy policy carefully.
                            </p>
                        </motion.div>

                        {/* Privacy Sections */}
                        <div className="space-y-12">
                            {privacySections.map((section, index) => (
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
                            <h3 className="text-xl font-semibold mb-4">Your Privacy Rights</h3>
                            <p className="text-muted-foreground mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to data processing</li>
                                <li>Data portability</li>
                            </ul>
                            <div className="mt-6 flex items-center gap-2 text-primary">
                                <ChevronRight className="w-4 h-4" />
                                <a href="mailto:info@uniongate.uk" className="hover:underline">
                                    Contact our Privacy Team
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </WebsiteLayout>
    );
} 