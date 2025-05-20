import { useState, useEffect } from 'react';
import Navbar from '@/Components/Website/Navbar';
import TopBar from '@/Components/Website/TopBar';
import FooterSection from '@/Components/Website/Footer';
import LoadingSpinner from '@/Components/Website/LoadingSpinner';
import SEO from '@/Components/SEO';

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