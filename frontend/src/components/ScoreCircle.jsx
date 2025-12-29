/**
 * ScoreCircle Component
 * Animated circular progress indicator for credibility score
 */
import React, { useEffect, useState } from 'react';

export default function ScoreCircle({ score, statusColor }) {
    const [animatedScore, setAnimatedScore] = useState(0);

    // Circle properties
    const size = 220;
    const strokeWidth = 10;
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
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg
                width={size}
                height={size}
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 0.1s ease-out'
                    }}
                />
            </svg>

            {/* Score text */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <span style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: 'white',
                    letterSpacing: '-2px',
                    lineHeight: 1
                }}>
                    {animatedScore}
                </span>
                <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#6b7280',
                    marginTop: '4px'
                }}>
                    /100
                </span>
            </div>
        </div>
    );
}
