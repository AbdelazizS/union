import { useState, useEffect } from 'react';
import Navbar from '@/components/website/Navbar';
import TopBar from '@/components/website/TopBar';
import FooterSection from '@/components/website/Footer';
import LoadingSpinner from '@/components/website/LoadingSpinner';
import SEO from '@/components/SEO';

export default function WebsiteLayout({ children, title, description, canonical, ogImage, structuredData }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Shorter loading time (700ms instead of 1700ms)
        const timer = setTimeout(() => {
            setLoading(false);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <SEO
                title={title}
                description={description}
                canonical={canonical}
                ogImage={ogImage}
                structuredData={structuredData}
            />

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="bg-background">
                    <TopBar />
                    <Navbar />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <FooterSection />
                </div>
            )}
        </>
    );
} 