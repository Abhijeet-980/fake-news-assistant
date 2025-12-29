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

export default function AnalyzingPage({ onCancel }) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [dots, setDots] = useState('');

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => prev >= 95 ? 95 : prev + Math.random() * 3);
        }, 100);
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => prev >= 2 ? 2 : prev + 1);
        }, 1200);
        const dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
            clearInterval(dotsInterval);
        };
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#080c14', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Animated background gradient */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 50%)',
                animation: 'bgPulse 4s ease-in-out infinite'
            }} />
            <style>{`
                @keyframes bgPulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
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
                        backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'logoGlow 2s ease-in-out infinite'
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
                        backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                        animation: 'badgePulse 2s ease-in-out infinite'
                    }}>
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            backgroundColor: '#3b82f6',
                            animation: 'dotBlink 1s infinite'
                        }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Live Analysis
                        </span>
                    </div>
                    <style>{`
                        @keyframes badgePulse {
                            0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
                            50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
                        }
                        @keyframes dotBlink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.3; }
                        }
                    `}</style>

                    {/* Title with typing effect */}
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '12px',
                            animation: 'fadeInUp 0.6s ease-out'
                        }}>
                            Verification in Progress{dots}
                        </h1>
                        <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '400px' }}>
                            Our AI is currently analyzing patterns across thousands of sources to determine credibility.
                        </p>
                    </div>

                    {/* Enhanced Radar */}
                    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                        {/* Pulsing rings */}
                        <PulsingRings />

                        {/* Static circles */}
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <div style={{ position: 'absolute', inset: '25px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)' }} />
                        <div style={{ position: 'absolute', inset: '55px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.3)' }} />
                        <div style={{ position: 'absolute', inset: '85px', borderRadius: '50%', border: '1px dashed rgba(59,130,246,0.2)' }} />

                        {/* Radar sweep */}
                        <RadarSweep />

                        {/* Particles */}
                        <Particles />

                        {/* Center icon */}
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{
                                width: '90px', height: '90px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1))',
                                border: '2px solid rgba(59,130,246,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: 'centerPulse 2s ease-in-out infinite',
                                boxShadow: '0 0 30px rgba(59,130,246,0.3)'
                            }}>
                                <span className="material-symbols-outlined" style={{
                                    fontSize: '44px', color: '#3b82f6',
                                    animation: 'iconRotate 8s linear infinite'
                                }}>radar</span>
                            </div>
                        </div>
                        <style>{`
                            @keyframes centerPulse {
                                0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(59,130,246,0.3); }
                                50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(59,130,246,0.5); }
                            }
                            @keyframes iconRotate {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                        `}</style>

                        {/* Floating badges */}
                        <FloatingBadge
                            position={{ top: '10px', right: '-30px' }}
                            icon="check_circle"
                            iconColor="#22c55e"
                            label="Source"
                            value="Verified"
                            delay={0}
                        />
                        <FloatingBadge
                            position={{ bottom: '10px', left: '-30px' }}
                            icon="psychology"
                            iconColor="#f59e0b"
                            label="Tone"
                            value="Analyzing..."
                            delay={0.5}
                        />
                        <FloatingBadge
                            position={{ top: '50%', left: '-50px', transform: 'translateY(-50%)' }}
                            icon="fact_check"
                            iconColor="#8b5cf6"
                            label="Facts"
                            value="Checking"
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
                                fontSize: '16px', fontWeight: '700', color: '#3b82f6',
                                textShadow: '0 0 10px rgba(59,130,246,0.5)'
                            }}>{Math.round(progress)}%</span>
                        </div>
                        <div style={{
                            height: '8px', backgroundColor: '#1f2937', borderRadius: '4px', overflow: 'hidden',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                borderRadius: '4px',
                                transition: 'width 0.3s ease-out',
                                boxShadow: '0 0 15px rgba(59,130,246,0.5)',
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
                        <style>{`
                            @keyframes progressShine {
                                0%, 100% { opacity: 0; }
                                50% { opacity: 1; }
                            }
                        `}</style>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#4b5563', fontFamily: 'monospace' }}>
                            <span>START: {new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
                            <span style={{ color: '#3b82f6' }}>EST. REMAINING: {Math.max(0, Math.round((100 - progress) / 12))}s</span>
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
                                    backgroundColor: isActive ? 'rgba(59,130,246,0.1)' : '#111827',
                                    border: isActive ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.06)',
                                    opacity: index > currentStep ? 0.5 : 1,
                                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                                    transition: 'all 0.3s ease-out',
                                    animation: `stepFadeIn 0.5s ease-out ${index * 0.15}s both`
                                }}>
                                    <style>{`
                                        @keyframes stepFadeIn {
                                            from { opacity: 0; transform: translateY(20px); }
                                            to { opacity: 1; transform: translateY(0); }
                                        }
                                    `}</style>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '44px', height: '44px', borderRadius: '12px',
                                            backgroundColor: isCompleted ? 'rgba(34,197,94,0.15)' : isActive ? 'rgba(59,130,246,0.15)' : '#1f2937',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.3s ease-out'
                                        }}>
                                            <span className="material-symbols-outlined" style={{
                                                fontSize: '22px',
                                                color: isCompleted ? '#22c55e' : isActive ? '#3b82f6' : '#6b7280',
                                                animation: isActive ? 'iconSpin 2s linear infinite' : 'none'
                                            }}>{isCompleted ? 'check_circle' : step.icon}</span>
                                        </div>
                                        <style>{`
                                            @keyframes iconSpin {
                                                from { transform: rotate(0deg); }
                                                to { transform: rotate(360deg); }
                                            }
                                        `}</style>
                                        {isCompleted && <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '20px' }}>check</span>}
                                        {isActive && <span style={{ fontSize: '10px', fontWeight: '700', color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.15)', padding: '4px 10px', borderRadius: '999px', textTransform: 'uppercase', animation: 'activePulse 1.5s ease-in-out infinite' }}>Active</span>}
                                        <style>{`
                                            @keyframes activePulse {
                                                0%, 100% { opacity: 1; }
                                                50% { opacity: 0.6; }
                                            }
                                        `}</style>
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
