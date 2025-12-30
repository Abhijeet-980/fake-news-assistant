/**
 * AnalyzingPage Component
 * Enhanced analyzing page with radar animation, rotating sweep, floating badges, and particles
 */
import React, { useState, useEffect } from 'react';

const analysisSteps = [
    { id: 1, title: 'Source History', description: 'Cross-referenced with 50+ trusted databases.', icon: 'storage' },
    { id: 2, title: 'Language Patterns', description: 'Detecting emotional manipulation markers.', icon: 'sync' },
    { id: 3, title: 'Final Verdict', description: 'Generating credibility score and summary.', icon: 'gavel' },
];

// Animated particles around radar
function Particles() {
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i * 30) * (Math.PI / 180),
        delay: i * 0.15,
        size: 3 + Math.random() * 3
    }));

    return (
        <>
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${p.angle}rad) translateX(130px)`,
                        opacity: 0.6,
                        animation: `particlePulse 2s ease-in-out ${p.delay}s infinite`
                    }}
                />
            ))}
            <style>{`
                @keyframes particlePulse {
                    0%, 100% { opacity: 0.2; transform: rotate(${0}rad) translateX(130px) scale(0.5); }
                    50% { opacity: 0.8; transform: rotate(${0}rad) translateX(130px) scale(1.2); }
                }
            `}</style>
        </>
    );
}

// Radar sweep animation
function RadarSweep() {
    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '50%',
                height: '4px',
                transformOrigin: 'left center',
                background: 'linear-gradient(90deg, rgba(59,130,246,0.8), transparent)',
                animation: 'radarSweep 2s linear infinite',
                boxShadow: '0 0 20px rgba(59,130,246,0.5)'
            }} />
            <style>{`
                @keyframes radarSweep {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// Pulsing ring animation
function PulsingRings() {
    return (
        <>
            {[0, 1, 2].map(i => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: '2px solid rgba(59,130,246,0.3)',
                        animation: `ringPulse 3s ease-out ${i * 1}s infinite`
                    }}
                />
            ))}
            <style>{`
                @keyframes ringPulse {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </>
    );
}

// Floating badge component
function FloatingBadge({ position, icon, iconColor, label, value, delay = 0 }) {
    return (
        <div style={{
            position: 'absolute',
            ...position,
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: 'rgba(26, 31, 46, 0.9)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: `floatBadge 3s ease-in-out ${delay}s infinite`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
            <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: '22px' }}>
                {icon}
            </span>
            <div>
                <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '2px' }}>
                    {label}
                </p>
                <p style={{ fontSize: '13px', color: 'white', fontWeight: '600' }}>{value}</p>
            </div>
            <style>{`
                @keyframes floatBadge {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
            `}</style>
        </div>
    );
}

// Scanning text animation
function ScanningText({ text, position }) {
    return (
        <p style={{
            position: 'absolute',
            ...position,
            fontSize: '10px',
            color: '#3b82f6',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: '600',
            animation: 'textGlow 2s ease-in-out infinite'
        }}>
            {text}
            <style>{`
                @keyframes textGlow {
                    0%, 100% { opacity: 0.5; text-shadow: 0 0 10px transparent; }
                    50% { opacity: 1; text-shadow: 0 0 10px rgba(59,130,246,0.5); }
                }
            `}</style>
        </p>
    );
}

export default function AnalyzingPage({ onCancel, progress: externalProgress, statusText }) {
    const [progress, setProgress] = useState(0);
    const [dots, setDots] = useState('');

    // Determine the current step index based on progress
    // Step 0: Initial/Source (0-30%)
    // Step 1: Language (30-70%)
    // Step 2: Final Verdict (70-100%)
    const currentStep = externalProgress < 30 ? 0 : externalProgress < 70 ? 1 : 2;

    useEffect(() => {
        // Smooth out the progress visualization
        if (externalProgress !== undefined) {
            setProgress(externalProgress);
        }
    }, [externalProgress]);

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(dotsInterval);
    }, []);

    // Dynamic radar speed: faster when progress is moving
    const radarSpeed = externalProgress > 0 && externalProgress < 100 ? '1s' : '2.5s';

    // Dynamic color based on progress stage
    const activeColor = externalProgress < 30 ? '#3b82f6' : externalProgress < 70 ? '#8b5cf6' : '#22c55e';

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#080c14', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Animated background gradient */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: `radial-gradient(circle at 50% 50%, ${activeColor}15 0%, transparent 50%)`,
                transition: 'background 1s ease',
                animation: 'bgPulse 4s ease-in-out infinite'
            }} />
            <style>{`
                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
            `}</style>

            {/* Scanning Line Animation */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
                boxShadow: `0 0 10px ${activeColor}`,
                zIndex: 2,
                opacity: 0.3,
                animation: 'scanningLine 4s linear infinite'
            }} />
            <style>{`
                @keyframes scanningLine {
                    0% { top: 0% }
                    100% { top: 100% }
                }
            `}</style>

            {/* Header */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(10px)',
                position: 'relative', zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        backgroundColor: activeColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'logoGlow 2s ease-in-out infinite',
                        transition: 'background-color 0.5s ease'
                    }}>
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px' }}>verified_user</span>
                    </div>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>CrediReader</span>
                </div>
                <style>{`
                    @keyframes logoGlow {
                        0%, 100% { box-shadow: 0 0 10px rgba(59,130,246,0.3); }
                        50% { box-shadow: 0 0 20px rgba(59,130,246,0.6); }
                    }
                `}</style>
            </header>

            {/* Main */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 5 }}>
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>

                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '6px 14px', borderRadius: '999px',
                        backgroundColor: `${activeColor}20`, border: `1px solid ${activeColor}50`,
                        transition: 'all 0.5s ease',
                        animation: 'badgePulse 2s ease-in-out infinite'
                    }}>
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            backgroundColor: activeColor,
                            animation: 'dotBlink 1s infinite'
                        }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: activeColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {statusText || 'Initializing Analysis'}
                        </span>
                    </div>
                    <style>{`
                        @keyframes badgePulse {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.2); }
                            50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
                        }
                        @keyframes dotBlink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.3; }
                        }
                    `}</style>

                    {/* Title */}
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '12px',
                            animation: 'fadeInUp 0.6s ease-out'
                        }}>
                            {externalProgress === 100 ? 'Analysis Complete' : `Verification in Progress${dots}`}
                        </h1>
                        <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '400px', margin: '0 auto' }}>
                            {statusText ? `Current step: ${statusText}` : "Our AI is currently analyzing patterns across thousands of sources to determine credibility."}
                        </p>
                    </div>

                    {/* Enhanced Radar */}
                    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                        {/* Pulsing rings */}
                        <PulsingRings />

                        {/* Static circles */}
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <div style={{ position: 'absolute', inset: '25px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)' }} />
                        <div style={{ position: 'absolute', inset: '55px', borderRadius: '50%', border: `1px solid ${activeColor}40` }} />
                        <div style={{ position: 'absolute', inset: '85px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.1)' }} />

                        {/* Radar sweep */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '50%',
                                height: '4px',
                                transformOrigin: 'left center',
                                background: `linear-gradient(90deg, ${activeColor}CC, transparent)`,
                                animation: `radarSweep ${radarSpeed} linear infinite`,
                                boxShadow: `0 0 20px ${activeColor}80`,
                                transition: 'background 0.5s ease'
                            }} />
                        </div>

                        {/* Particles */}
                        <Particles />

                        {/* Center icon */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{
                                width: '90px', height: '90px', borderRadius: '50%',
                                background: `linear-gradient(135deg, ${activeColor}40, ${activeColor}10)`,
                                border: `2px solid ${activeColor}80`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: 'centerPulse 2s ease-in-out infinite',
                                boxShadow: `0 0 30px ${activeColor}40`,
                                transition: 'all 0.5s ease'
                            }}>
                                <span className="material-symbols-outlined" style={{
                                    fontSize: '44px', color: activeColor,
                                    animation: 'iconRotate 8s linear infinite'
                                }}>radar</span>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <FloatingBadge
                            position={{ top: '10px', right: '-30px' }}
                            icon="check_circle"
                            iconColor={externalProgress >= 30 ? "#22c55e" : "#6b7280"}
                            label="Domain"
                            value={externalProgress >= 30 ? "Checked" : "Waiting"}
                            delay={0}
                        />
                        <FloatingBadge
                            position={{ bottom: '10px', left: '-30px' }}
                            icon="psychology"
                            iconColor={externalProgress >= 70 ? "#8b5cf6" : externalProgress >= 40 ? "#f59e0b" : "#6b7280"}
                            label="AI Deep"
                            value={externalProgress >= 70 ? "Complete" : externalProgress >= 40 ? "Analyzing" : "Queued"}
                            delay={0.5}
                        />
                        <FloatingBadge
                            position={{ top: '50%', left: '-50px', transform: 'translateY(-50%)' }}
                            icon="fact_check"
                            iconColor={externalProgress >= 60 ? "#8b5cf6" : "#6b7280"}
                            label="Facts"
                            value={externalProgress >= 60 ? "Verified" : "Connecting"}
                            delay={1}
                        />

                        {/* Scanning labels */}
                        <ScanningText text="● Scanning" position={{ top: '-30px', left: '50%', transform: 'translateX(-50%)' }} />
                        <ScanningText text="● Processing" position={{ bottom: '-30px', left: '50%', transform: 'translateX(-50%)' }} />
                    </div>

                    {/* Enhanced Progress */}
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: '500' }}>Analysis Status</span>
                            <span style={{
                                fontSize: '16px', fontWeight: '700', color: activeColor,
                                textShadow: `0 0 10px ${activeColor}80`,
                                transition: 'color 0.5s ease'
                            }}>{Math.round(progress)}%</span>
                        </div>
                        <div style={{
                            height: '8px', backgroundColor: '#1f2937', borderRadius: '4px', overflow: 'hidden',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${activeColor}, ${activeColor}aa)`,
                                borderRadius: '4px',
                                transition: 'width 0.5s ease-out, background-color 0.5s ease',
                                boxShadow: `0 0 15px ${activeColor}80`,
                                position: 'relative'
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '20px',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3))',
                                    animation: 'progressShine 1s ease-in-out infinite'
                                }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#4b5563', fontFamily: 'monospace' }}>
                            <span>START: {new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
                            <span style={{ color: activeColor, transition: 'color 0.5s ease' }}>
                                {externalProgress === 100 ? "COMPLETE" : `EST. REMAINING: ${Math.max(0, Math.round((100 - progress) / 8))}s`}
                            </span>
                        </div>
                    </div>

                    {/* Steps with stagger animation */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
                        {analysisSteps.map((step, index) => {
                            const isCompleted = index < currentStep;
                            const isActive = index === currentStep;
                            return (
                                <div key={step.id} style={{
                                    padding: '20px',
                                    borderRadius: '14px',
                                    backgroundColor: isActive ? `${activeColor}15` : '#111827',
                                    border: isActive ? `1px solid ${activeColor}80` : '1px solid rgba(255,255,255,0.06)',
                                    opacity: index > currentStep ? 0.5 : 1,
                                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                    transition: 'all 0.4s ease-out',
                                    animation: `stepFadeIn 0.5s ease-out ${index * 0.15}s both`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '12px',
                                            backgroundColor: isCompleted ? 'rgba(34,197,94,0.15)' : isActive ? `${activeColor}20` : '#1f2937',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.3s ease-out'
                                        }}>
                                            <span className="material-symbols-outlined" style={{
                                                fontSize: '22px',
                                                color: isCompleted ? '#22c55e' : isActive ? activeColor : '#6b7280',
                                                animation: isActive ? 'iconSpin 2s linear infinite' : 'none',
                                                transition: 'color 0.3s ease'
                                            }}>{isCompleted ? 'check_circle' : step.icon}</span>
                                        </div>
                                        {isCompleted && <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '20px' }}>check</span>}
                                        {isActive && <span style={{ fontSize: '10px', fontWeight: '700', color: activeColor, backgroundColor: `${activeColor}20`, padding: '4px 10px', borderRadius: '999px', textTransform: 'uppercase', animation: 'activePulse 1.5s ease-in-out infinite' }}>Active</span>}
                                    </div>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '6px' }}>{step.title}</h3>
                                    <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>{step.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>Our AI analyzes patterns, not opinions.</p>
                        <button
                            onClick={onCancel}
                            style={{
                                fontSize: '14px', color: '#6b7280', background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                                padding: '8px 20px', borderRadius: '8px', cursor: 'pointer',
                                transition: 'all 0.2s ease-out'
                            }}
                            onMouseOver={e => { e.target.style.borderColor = 'rgba(255,255,255,0.3)'; e.target.style.color = '#9ca3af'; }}
                            onMouseOut={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = '#6b7280'; }}
                        >
                            Cancel Analysis
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub-components need to be updated to use common animations (already defined globally in original file)
