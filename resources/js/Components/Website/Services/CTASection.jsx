import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function CTASection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-3xl overflow-hidden"
                >
                    {/* Animated Background */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60"
                        initial={{ opacity: 0.8 }}
                        whileInView={{ opacity: 0.9 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    />

                    {/* Animated Pattern */}
                    <motion.div
                        className="absolute inset-0 opacity-10"
                        animate={{
                            backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            repeatType: "reverse",
                        }}
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: "24px 24px"
                        }}
                    />

                    {/* Content */}
                    <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white"
                        >
                            Ready to Experience Our Professional Services?
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
                        >
                            Book your service today and let our experts take care of your needs. Satisfaction guaranteed!
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href={`/booking/create`}
                                >

                                    <Button size="lg" variant="secondary" className="rounded-full group">
                                        Book Now
                                        <motion.span
                                            initial={{ x: 0 }}
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </motion.span>
                                    </Button>
                                </Link>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href={`/contact`}
                                >

                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20"
                                    >
                                        Contact Us
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Glassmorphism Overlay */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-[.15px] pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
} 