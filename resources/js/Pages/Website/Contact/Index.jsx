import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Mail, Phone, MapPin, Clock, CheckCircle2, MessageCircle, PhoneCall, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email must not exceed 100 characters"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must not exceed 20 characters")
        .regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Please enter a valid phone number"),
    subject: z.string()
        .max(100, "Subject must not exceed 100 characters")
        .optional(),
    message: z.string()
        .min(10, "Message must be at least 10 characters")
        .max(1000, "Message must not exceed 1000 characters"),
});

const contactInfo = [
    {
        icon: <Phone className="h-6 w-6" />,
        title: "Phone",
        content: "+44 730 788 3811 ",
        description: "Available 24/7 for urgent inquiries",
        color: "from-green-500/20 to-green-600/20",
        iconColor: "text-green-500",
        action: {
            href: "tel:+447307883811"
        },
        gradient: "bg-gradient-to-br from-green-500/10 to-green-600/10",
        hoverGradient: "hover:from-green-500/20 hover:to-green-600/20",
        iconBg: "bg-green-500/10",
        iconHover: "group-hover:bg-green-500/20"
    },
    {
        icon: <Mail className="h-6 w-6" />,
        title: "Email",
        content: "info@uniongate.uk",
        description: "We'll respond within 24 hours",
        color: "from-blue-500/20 to-blue-600/20",
        iconColor: "text-blue-500",
        action: {
            href: "mailto:info@uniongate.uk"
        },
        gradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
        hoverGradient: "hover:from-blue-500/20 hover:to-blue-600/20",
        iconBg: "bg-blue-500/10",
        iconHover: "group-hover:bg-blue-500/20"
    },
    {
        icon: <MapPin className="h-6 w-6" />,
        title: "Office",
        content: "1 Lochside View, Edinburgh EH12 9DH",
        description: "Visit us during business hours",
        color: "from-purple-500/20 to-purple-600/20",
        iconColor: "text-purple-500",
        gradient: "bg-gradient-to-br from-purple-500/10 to-purple-600/10",
        hoverGradient: "hover:from-purple-500/20 hover:to-purple-600/20",
        iconBg: "bg-purple-500/10",
        iconHover: "group-hover:bg-purple-500/20"
    },
    {
        icon: <Clock className="h-6 w-6" />,
        title: "Hours",
        content: "Mon - Fri: 8:00 AM - 6:00 PM",
        description: "Sat - Sun: 9:00 AM - 4:00 PM",
        color: "from-orange-500/20 to-orange-600/20",
        iconColor: "text-orange-500",
        gradient: "bg-gradient-to-br from-orange-500/10 to-orange-600/10",
        hoverGradient: "hover:from-orange-500/20 hover:to-orange-600/20",
        iconBg: "bg-orange-500/10",
        iconHover: "group-hover:bg-orange-500/20"
    }
];

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
];

export default function Contact() {
    const { scrollYProgress } = useScroll();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        },
    });

    const onSubmit = async (data) => {
        setIsProcessing(true);
        try {
            await router.post(route('contact.submit'), data, {
                onSuccess: () => {
                    form.reset();
                    setShowSuccessDialog(true);
                    // toast.success("Message sent successfully!");
                },
                onError: (errors) => {
                    console.error('Form submission error:', errors);
                    if (errors.message) {
                        toast.error(errors.message);
                    } else {
                        Object.keys(errors).forEach((key) => {
                            form.setError(key, { message: errors[key] });
                        });
                        toast.error("Failed to send message. Please check the form for errors.");
                    }
                },
                onFinish: () => {
                    setIsProcessing(false);
                },
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            toast.error("An unexpected error occurred. Please try again.");
            setIsProcessing(false);
        }
    };

    const isSubmitting = form.formState.isSubmitting || isProcessing;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "mainEntity": {
            "@type": "Organization",
            "name": "Union Gate",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+477 730 788 3811",
                "contactType": "customer service",
                "email": "info@uniongate.uk",
                "availableLanguage": ["English"]
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "1 Lochside View",
                "addressLocality": "Edinburgh",
                "addressRegion": "Scotland",
                "postalCode": "EH12 9DH",
                "addressCountry": "United Kingdom"
            },
            "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "08:00",
                "closes": "20:00"
            }
        }
    };

    return (
        <WebsiteLayout
            title="Contact Union Gate | Professional Cleaning Services Edinburgh"
            description="Get in touch with Union Gate's professional cleaning team in Edinburgh. We're here to answer your questions and provide a free quote for your cleaning needs. Available 24/7 for urgent inquiries."
            canonical="/contact"
    ogImage="/favicon.ico"
            structuredData={structuredData}
            keywords="Union Gate contact Edinburgh, cleaning service phone number Scotland, cleaning service email Edinburgh, cleaning service address EH12 9DH, get cleaning quote Edinburgh"
        >
            <Toaster position="top-right" />
            
            {/* Progress Bar */}
            {/* <motion.div 
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
                style={{ scaleX: scrollYProgress }}
            /> */}

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-primary/5 z-10">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            background: [
                                "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
                                "radial-gradient(circle at 100% 100%, var(--primary) 0%, transparent 50%)",
                                "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
                            ],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{ opacity: 0.1 }}
                    />
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
                            Get in Touch
                        </motion.h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            We're here to help and answer any questions you might have. We look forward to hearing from you.
                        </p>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button 
                                size="lg" 
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => window.open('https://wa.me/441231234567', '_blank')}
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor" 
                                    className="w-5 h-5 mr-2"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                Chat on WhatsApp
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline"
                                onClick={() => window.location.href = 'tel:+441231234567'}
                            >
                                <PhoneCall className="w-5 h-5 mr-2" />
                                Call Now
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mb-4">
                            Contact Information
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Choose your preferred way to reach us. We're here to help and answer any questions you might have.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className={cn(
                                    "relative bg-white dark:bg-gray-900 p-8 rounded-2xl border border-primary/10 h-full transition-all duration-300 shadow-lg hover:shadow-xl",
                                    info.gradient,
                                    info.hoverGradient
                                )}>
                                    {/* Icon Container */}
                                    <motion.div 
                                        className={cn(
                                            "inline-flex p-4 rounded-xl mb-6 transition-all duration-300",
                                            info.iconBg,
                                            info.iconHover
                                        )}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            className={info.iconColor}
                                        >
                                            {info.icon}
                                        </motion.div>
                                    </motion.div>

                                    <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                        {info.title}
                                    </h3>

                                    {info.action?.href ? (
                                        <motion.a 
                                            href={info.action.href}
                                            className="text-lg font-medium mb-2 hover:text-primary transition-colors block group-hover:translate-x-1 transition-transform"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            {info.content}
                                        </motion.a>
                                    ) : (
                                        <p className="text-lg font-medium mb-2">{info.content}</p>
                                    )}

                                    <motion.p 
                                        className="text-sm text-muted-foreground"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {info.description}
                                    </motion.p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-primary/10 shadow-lg">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mb-8"
                                >
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                        Send us a Message
                    </h2>
                                    <p className="text-muted-foreground mt-2">
                                        We'll get back to you within 24 hours
                                    </p>
                                </motion.div>
                    
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                    Full Name <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                <Input 
                                    placeholder="John Doe"
                                                                {...field}
                                                                disabled={isSubmitting}
                                                                className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-colors"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">
                                    Email <span className="text-destructive">*</span>
                                                        </FormLabel>
                                                        <FormControl>
                                <Input 
                                    type="email" 
                                    placeholder="john@example.com"
                                                                {...field}
                                                                disabled={isSubmitting}
                                                                className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-colors"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                        </div>

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">
                                Phone Number <span className="text-destructive">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                            <Input 
                                type="tel" 
                                placeholder="+44 123 456 7890"
                                                            {...field}
                                                            disabled={isSubmitting}
                                                            className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="subject"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">Subject</FormLabel>
                                                    <FormControl>
                            <Input 
                                placeholder="How can we help?"
                                                            {...field}
                                                            disabled={isSubmitting}
                                                            className="bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-colors"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium">
                                Message <span className="text-destructive">*</span>
                                                    </FormLabel>
                                                    <FormControl>
                            <Textarea 
                                placeholder="Tell us about your inquiry..." 
                                                            className="min-h-[150px] bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-colors"
                                                            {...field}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                        <Button 
                            type="submit" 
                                                disabled={isSubmitting}
                                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
                        >
                                                {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </>
                            )}
                        </Button>
                                        </motion.div>
                    </form>
                                </Form>
                            </div>
                        </motion.div>

                        {/* Map & Social Links */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            {/* Map */}
                            <div className="bg-white dark:bg-gray-900 p-5 lg:p-8 rounded-2xl border border-primary/10 shadow-lg">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mb-4"
                                >
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                        Our Location
                                    </h3>
                                    <p className="text-muted-foreground mt-1">
                                        Visit us at our office
                                    </p>
                                </motion.div>

                                <motion.div 
                                    className="h-[360px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2234.7632130528577!2d-3.3185184000000003!3d55.936142700000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4887c53f24352aed%3A0xb008fad15cefbe40!2zMSBMb2Noc2lkZSBWaWV3LCBFZGluYnVyZ2ggRUgxMiA5REjYjCDYp9mE2YXZhdmE2YPYqSDYp9mE2YXYqtit2K_YqQ!5e0!3m2!1sar!2s!4v1748953611763!5m2!1sar!2s"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="rounded-lg"
                                    />
                                </motion.div>

                                <motion.div 
                                    className="mt-4 space-y-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <p>1 Lochside View, Edinburgh EH12 9DH</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <p>Mon - Fri: 8:00 AM - 6:00 PM | Sat - Sun: 9:00 AM - 4:00 PM</p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Social Links */}
                            {/* <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-primary/10 shadow-lg">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mb-6"
                                >
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                        Connect With Us
                                    </h3>
                                    <p className="text-muted-foreground mt-1">
                                        Follow us on social media
                                    </p>
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.href}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300 group"
                                        >
                                            <motion.div
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <social.icon className="w-5 h-5 text-primary group-hover:text-primary/80" />
                                            </motion.div>
                                            <span className="font-medium group-hover:text-primary/80 transition-colors">
                                                {social.label}
                                            </span>
                                        </motion.a>
                                    ))}
                                </div>
                            </div> */}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Floating WhatsApp Button */}
            <motion.a
                href="https://wa.me/4777307883811 "
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-6 h-6"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
            </motion.a>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-4">
                            Thank you for contacting us. We'll get back to you within 24 hours.
                        </p>
                        <Button
                            onClick={() => setShowSuccessDialog(false)}
                            className="w-full"
                        >
                            Close
                        </Button>
                    </motion.div>
                </DialogContent>
            </Dialog>
        </WebsiteLayout>
    );
}
