/**
 * ScoreCircle Component
 * Animated circular progress indicator for credibility score
 */
import React, { useEffect, useState } from 'react';

export default function ScoreCircle({ score, statusColor }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    // Circle properties
    const size = 250;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    // Get color based on status
    const getColor = () => {
        switch (statusColor) {
            case 'green':
                return '#22c55e';
            case 'yellow':
                return '#fbbf24';
            case 'red':
                return '#ef4444';
            default:
                return '#3b82f6';
        }
    };

    // Animate score on mount
    useEffect(() => {
        const duration = 1500;
        const steps = 60;
        const increment = score / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= score) {
                setAnimatedScore(score);
                clearInterval(timer);
            } else {
                setAnimatedScore(Math.round(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [score]);

    const color = getColor();

    return (
        <div className="relative">
            {/* Glow effect */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
                style={{ backgroundColor: color }}
            />

            <svg
                className="transform"
                height={size}
                width={size}
            >
                {/* Background circle */}
                <circle
                    className="text-white/5"
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <circle
                    className="progress-ring__circle drop-shadow-lg"
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        filter: `drop-shadow(0 0 10px ${color}80)`
                    }}
                />
            </svg>

            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-white tracking-tighter">
                    {animatedScore}
                </span>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">
                    /100
                </span>
            </div>
        </div>
    );
}
