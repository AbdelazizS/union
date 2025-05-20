import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star , Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";

const Rating = ({ rating }) => {
    return (
        <div className="flex gap-1">
            {[...Array(rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
        </div>
    );
};

export default function Testimonials({ testimonials = [] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps"
    });
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            },
        },
    };

    return (
        <section className="py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center mb-16"
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-block mb-4"
                    >
                        <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm">
                            <Quote className="w-4 h-4 mr-2" />
                            Testimonials
                        </Badge>
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4"
                    >
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                            Client Success Stories
                        </span>
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Discover what our clients say about our cleaning services and dedication to excellence.
                    </motion.p>
                </motion.div>

                <div className="relative max-w-6xl mx-auto px-12">
                    <div className="overflow-y-visible py-2 overflow-x-hidden" ref={emblaRef}>
                        <div className="flex">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_50%] pr-8"
                                >
                                    <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-8  shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                        <div className="flex justify-between items-start mb-6">
                                            <Rating rating={testimonial.rating} />
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {testimonial.date}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                                            "{testimonial.content}"
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {testimonial.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        </section>
    );
}
