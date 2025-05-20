import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/Components/ui/accordion';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Link } from '@inertiajs/react';

export default function FAQ({ faqs = [] }) {
    return (
        <section className="py-24 bg-primary/5 ">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block mb-4"
                    >
                        <HelpCircle className="w-12 h-12 text-primary" />
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Find answers to common questions about our cleaning services.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    <Card className="p-6 shadow-lg border-none bg-card/50 backdrop-blur-sm">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="border-b border-border/50 last:border-0"
                                >
                                    <AccordionTrigger className="text-left py-4 hover:no-underline group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-muted-foreground">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-lg font-medium group-hover:text-primary transition-colors">
                                                {faq.question}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground pl-12">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-muted-foreground text-lg mb-6">
                        Still have questions? We're here to help!
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="group relative overflow-hidden"
                    >
                        <Link
                            href={`contact}`}
                        >

                            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Contact Us
                            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </Link>

                    </Button>
                </motion.div>
            </div>
        </section>
    );
} 