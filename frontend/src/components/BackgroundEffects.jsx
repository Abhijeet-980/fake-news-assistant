/**
 * BackgroundEffects Component
 * Subtle ambient glow effects
 */
import React from 'react';

export default function BackgroundEffects() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Top center subtle blue glow */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />

            {/* Bottom corners subtle purple/teal */}
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
            <div className="absolute top-[30%] left-[-10%] w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px]" />
        </div>
    );
}
