import { motion } from 'framer-motion';
import { Phone, Mail, Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TopBar({ 
    phone = "+971 50 123 4567",
    email = "info@uniongate.com",
    isScrolled = false,
    className
}) {
    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: MessageCircle, href: "#", label: "WhatsApp" },
        { icon: Linkedin, href: "#", label: "LinkedIn" }
    ];

    return (
        <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
                duration: 0.2,
                ease: "easeOut"
            }}
            className={cn(
                "bg-primary/90 backdrop-blur-sm text-primary-foreground py-2.5",
                "sticky top-0 z-50 w-full",
                isScrolled && "shadow-sm",
                className
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between">
                    {/* Contact Info - Left Side */}
                    <div className="flex items-center space-x-4">
                        <a 
                            href={`tel:${phone.replace(/\s+/g, '')}`}
                            className="flex items-center text-sm font-medium hover:text-primary-foreground/80 transition-all duration-300 ease-in-out"
                        >
                            <Phone className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">{phone}</span>
                        </a>
                        <a 
                            href={`mailto:${email}`}
                            className="flex items-center text-sm font-medium hover:text-primary-foreground/80 transition-all duration-300 ease-in-out"
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">{email}</span>
                        </a>
                    </div>
                    
                    {/* Social Icons - Right Side */}
                    <div className="flex items-center space-x-4">
                        {socialLinks.map(({ icon: Icon, href, label }) => (
                            <motion.a
                                key={label}
                                href={href}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="hover:text-primary-foreground/80 transition-all duration-300 ease-in-out"
                                aria-label={label}
                            >
                                <Icon className="h-4 w-4" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </motion.header>
    );
} 