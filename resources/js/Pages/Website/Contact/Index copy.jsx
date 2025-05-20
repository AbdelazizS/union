import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "sonner";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    MessageSquare, 
    Send,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    MessageCircle,
    PhoneCall,
    ArrowRight,
    HelpCircle,
    Loader2,
    CheckCircle
} from "lucide-react";
import { useForm } from "@inertiajs/react";

// Form validation schema
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

export default function Index({ faqs }) {
    const { scrollYProgress } = useScroll();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [formData, setFormData] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Inertia form for submission
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // React Hook Form for validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset: resetHookForm
    } = useHookForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        }
    });

    const onSubmit = (data) => {
        setFormData(data);
        
        console.log(data);
        form.post(route('website.contact.submit'), {
            
            onSuccess: (reset) => {
                console.log(reset);
                setShowConfirmation(true);
                resetHookForm();
                form.reset();
            },
            onError: (reset) => {
                console.log(reset);
                toast.error("Failed to send message. Please try again.");
            }
        });
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Visit Us",
            details: ["123 Business Avenue", "Edinburgh, EH1 1AA", "Scotland, UK"],
            color: "from-blue-500/20 to-blue-600/20",
            iconColor: "text-blue-500"
        },
        {
            icon: Phone,
            title: "Call Us",
            details: ["+44 (0) 131 123 4567", "+44 (0) 131 123 4568"],
            color: "from-green-500/20 to-green-600/20",
            iconColor: "text-green-500",
            action: {
                mobile: "tel:+441311234567",
                desktop: "Click to call"
            }
        },
        {
            icon: Mail,
            title: "Email Us",
            details: ["info@uniongate.co.uk", "support@uniongate.co.uk"],
            color: "from-purple-500/20 to-purple-600/20",
            iconColor: "text-purple-500",
            action: {
                href: "mailto:info@uniongate.co.uk"
            }
        },
        {
            icon: Clock,
            title: "Working Hours",
            details: ["Monday - Friday: 8:00 - 18:00", "Saturday: 9:00 - 15:00"],
            color: "from-orange-500/20 to-orange-600/20",
            iconColor: "text-orange-500"
        }
    ];

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Linkedin, href: "#", label: "LinkedIn" }
    ];

    return (
        <WebsiteLayout>
            <Toaster position="top-right" />
            
            {/* Fixed Progress Bar */}
            <motion.div 
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
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
                            Get in Touch with Union Gate
                        </motion.h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            We're here to help with all your cleaning needs. Reach out — we respond fast!
                        </p>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button 
                                size="lg" 
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => window.open('https://wa.me/441311234567', '_blank')}
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Chat on WhatsApp
                            </Button>
                            <Button 
                                size="lg" 
                                variant="outline"
                                onClick={() => window.location.href = 'tel:+441311234567'}
                            >
                                <PhoneCall className="w-5 h-5 mr-2" />
                                Call Now
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Information Grid */}
            <section className="py-16 relative">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative"
                            >
                                <div className="relative bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 h-full">
                                    <motion.div
                                        className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}
                                    />
                                    
                                    <motion.div 
                                        className={`inline-flex p-4 rounded-xl bg-primary/10 ${info.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <info.icon className="w-6 h-6" />
                                    </motion.div>

                                    <h3 className="text-xl font-semibold mb-4">{info.title}</h3>
                                    {info.details.map((detail, idx) => (
                                        <p key={idx} className="text-muted-foreground">
                                            {info.action?.href ? (
                                                <a 
                                                    href={info.action.href}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {detail}
                                                </a>
                                            ) : info.action?.mobile && idx === 0 ? (
                                                <a 
                                                    href={info.action.mobile}
                                                    className="hover:text-primary transition-colors"
                                                >
                                                    {detail}
                                                </a>
                                            ) : detail}
                                        </p>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-16 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10">
                                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <Input 
                                                {...register('name')}
                                                type="text" 
                                                placeholder="John Doe"
                                                className={errors.name ? "border-red-500" : ""}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <Input 
                                                {...register('email')}
                                                type="email" 
                                                placeholder="john@example.com"
                                                className={errors.email ? "border-red-500" : ""}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <Input 
                                            {...register('phone')}
                                            type="tel" 
                                            placeholder="+44 123 456 7890"
                                            className={errors.phone ? "border-red-500" : ""}
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-500">{errors.phone.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Subject</label>
                                        <Input 
                                            {...register('subject')}
                                            type="text" 
                                            placeholder="How can we help?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <Textarea 
                                            {...register('message')}
                                            placeholder="Tell us about your inquiry..." 
                                            className={`min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-red-500">{errors.message.message}</p>
                                        )}
                                    </div>
                                    {showSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5" />
                                                <p>Message sent successfully! We'll get back to you soon.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                    <Button 
                                        type="submit" 
                                        disabled={form.processing}
                                        className="w-full"
                                    >
                                        {form.processing ? (
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
                                </form>
                            </div>
                        </motion.div>

                        {/* Additional Info & Social */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-primary/10 h-full">
                                <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
                                <p className="text-muted-foreground mb-8">
                                    Follow us on social media to stay updated with our latest news, promotions, and cleaning tips.
                                </p>
                                
                                {/* Social Links */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {socialLinks.map((social, index) => (
                                        <motion.a
                                            key={index}
                                            href={social.href}
                                            whileHover={{ scale: 1.05 }}
                                            className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors duration-300"
                                        >
                                            <social.icon className="w-5 h-5 text-primary" />
                                            <span>{social.label}</span>
                                        </motion.a>
                                    ))}
                                </div>

                                {/* FAQs Section */}
                                {faqs?.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                            <HelpCircle className="w-5 h-5" />
                                            Frequently Asked Questions
                                        </h3>
                                        <div className="space-y-4">
                                            {faqs.map((faq, index) => (
                                                <div 
                                                    key={index}
                                                    className="p-4 rounded-xl bg-primary/5 border border-primary/10"
                                                >
                                                    <h4 className="font-medium mb-2">{faq.question}</h4>
                                                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Response Info */}
                                <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/10">
                                    <div className="flex items-start gap-4">
                                        <MessageSquare className="w-6 h-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Quick Response</h3>
                                            <p className="text-muted-foreground">
                                                We typically respond within 2-3 business hours during our working hours.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Floating WhatsApp Button */}
            <motion.a
                href="https://wa.me/441311234567"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageCircle className="w-6 h-6" />
            </motion.a>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent className="sm:max-w-md">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                    >
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <DialogTitle className="text-xl font-semibold">Message Sent!</DialogTitle>
                        <DialogDescription className="mt-2">
                            Thank you for contacting us. We'll get back to you within 24 hours.
                        </DialogDescription>
                    </motion.div>
                    <div className="mt-4 space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">What's Next?</h4>
                            <ul className="text-sm space-y-2">
                                <li className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>We'll review your message</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>You'll receive a confirmation email</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Our team will respond within 24 hours</span>
                                </li>
                            </ul>
                        </div>
                        <Button 
                            className="w-full" 
                            onClick={() => setShowConfirmation(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </WebsiteLayout>
    );
} 