import { Link } from '@inertiajs/react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const navigation = {
    services: [
        { name: 'Our Services', href: '/our-services' },
        { name: 'Book a Service', href: '/booking/create' },
        // { name: 'Service Categories', href: '/our-services' },
        // { name: 'Service Details', href: '/our-services' },
    ],
    company: [
        { name: 'About Us', href: '/about' },
        // { name: 'Contact Us', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ],
    support: [
        { name: 'FAQ', href: '/about' },
        // { name: 'Privacy Policy', href: '/privacy' },
        // { name: 'Terms of Service', href: '/terms' },
        { name: 'Contact Support', href: '/contact' },
    ],
    social: [
        {
            name: 'Facebook',
            href: '#',
            icon: Facebook,
        },
        {
            name: 'Twitter',
            href: '#',
            icon: Twitter,
        },
        {
            name: 'Instagram',
            href: '#',
            icon: Instagram,
        },
        {
            name: 'LinkedIn',
            href: '#',
            icon: Linkedin,
        },
    ],
};

export default function Footer() {
    return (
        <footer className=" bg-primary/5 border-t border-border" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="container mx-auto px-4 py-16">
                <div className="xl:grid xl:grid-cols-3 xl:gap-12">
                    <div className="space-y-8">
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="text-2xl font-bold">
                            <img src="/images/logo.png" alt="Union Gate Logo" className="h-auto w-64" />
                                
                            </Link>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                            Professional cleaning services for your home and business.
                            Quality, reliability, and satisfaction guaranteed.
                        </p>
                        <div className="flex space-x-6">
                            {navigation.social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-12 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-12">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Services</h3>
                                <ul className="mt-6 space-y-4">
                                    {navigation.services.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Company</h3>
                                <ul className="mt-6 space-y-4">
                                    {navigation.company.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-12">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Support</h3>
                                <ul className="mt-6 space-y-4">
                                    {navigation.support.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact</h3>
                                <ul className="mt-6 space-y-4">
                                    <li>
                                        <a
                                            href="tel:+1234567890"
                                            className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                                        >
                                            <Phone className="h-5 w-5 mr-3" />
                                            (123) 456-7890
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:info@cleanpro.com"
                                            className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                                        >
                                            <Mail className="h-5 w-5 mr-3" />
                                            info@cleanpro.com
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                                        >
                                            <MapPin className="h-5 w-5 mr-3" />
                                            123 Cleaning Street, City, State 12345
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
               
                </div>
            </div>
                <div className="mt-16 border-t border-border pt-8 p-4">
                    <p className="text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Union Gate. All rights reserved.
                    </p>
                </div>
        </footer>
    );
} 