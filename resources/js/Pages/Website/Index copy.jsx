import { motion, useScroll, useTransform } from "framer-motion";
import WebsiteLayout from "@/Layouts/WebsiteLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function About() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 100]);

    return (
        <WebsiteLayout>
            {/* Hero Section */}
            <section className="relative flex items-center justify-center py-16 md:py-20 lg:py-28 overflow-hidden">
                {/* Background with Parallax and Modern Gradient */}
                <motion.div 
                    style={{ y }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--primary)_0%,_transparent_35%)] opacity-10" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--primary)_0%,_transparent_35%)] opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
                    <div className="absolute inset-0" style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                        backgroundSize: '30px 30px'
                    }} />
                </motion.div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 hover:bg-primary/20 transition-colors backdrop-blur-sm"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            <span>About Union Gate</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60"
                        >
                            Elevating Cleaning Standards
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
                        >
                            Setting new benchmarks in professional cleaning services 
                            with innovation, expertise, and unwavering commitment to excellence.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link href="/book-a-cleaner">
                                <Button 
                                    size="lg" 
                                    className="rounded-full group bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                                >
                                    Get Started
                                    <ArrowUpRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </WebsiteLayout>
    );
}
