import React from 'react';

export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
            <div className="relative w-24 h-24">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                
                {/* Middle pulsing circle */}
                <div className="absolute inset-2 border-4 border-primary/20 rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                
                {/* Inner spinning dots */}
                <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-3 h-3 bg-primary rounded-full"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: `rotate(${i * 120}deg) translate(2rem) rotate(-${i * 120}deg)`,
                                animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
                            }}
                        />
                    ))}
                </div>
                
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 animate-[ping_1.5s_ease-in-out_infinite]"></div>
            </div>
        </div>
    );
}

// Add these custom animations to your tailwind.config.js:
/*
module.exports = {
    theme: {
        extend: {
            keyframes: {
                ping: {
                    '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
                    '50%': { transform: 'translate(-50%, -50%) scale(1.5)', opacity: '0.5' },
                }
            }
        }
    }
}
*/ 