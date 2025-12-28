/**
 * AnalyzingPage Component
 * Clean analyzing page with radar animation and 3 step cards
 */
import React, { useState, useEffect } from 'react';

const analysisSteps = [
    { id: 1, title: 'Source History', description: 'Cross-referenced with 50+ trusted databases.', icon: 'storage' },
    { id: 2, title: 'Language Patterns', description: 'Detecting emotional manipulation markers.', icon: 'sync' },
    { id: 3, title: 'Final Verdict', description: 'Generating credibility score and summary.', icon: 'gavel' },
];

export default function AnalyzingPage({ onCancel }) {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => prev >= 95 ? 95 : prev + Math.random() * 4);
        }, 80);
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => prev >= 2 ? 2 : prev + 1);
        }, 1000);
        return () => { clearInterval(progressInterval); clearInterval(stepInterval); };
    }, []);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#080c14', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px' }}>verified_user</span>
                    </div>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>CrediReader</span>
                </div>
                <nav style={{ display: 'flex', gap: '32px' }}>
                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>Dashboard</span>
                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>History</span>
                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>Settings</span>
                </nav>
                <button style={{ backgroundColor: '#3b82f6', color: 'white', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>account_circle</span>
                    Profile
                </button>
            </header>

            {/* Main */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
                <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>

                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Analysis</span>
                    </div>

                    {/* Title */}
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '12px' }}>Verification in Progress</h1>
                        <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '400px' }}>Our AI is currently analyzing patterns across thousands of sources to determine credibility.</p>
                    </div>

                    {/* Radar */}
                    <div style={{ position: 'relative', width: '280px', height: '280px' }}>
                        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <div style={{ position: 'absolute', inset: '20px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.08)' }} />
                        <div style={{ position: 'absolute', inset: '50px', borderRadius: '50%', border: '1px solid rgba(59,130,246,0.2)' }} />

                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#3b82f6' }}>radar</span>
                            </div>
                        </div>

                        <div style={{ position: 'absolute', top: '20px', right: '-10px', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '20px' }}>check_circle</span>
                            <div><p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Source</p><p style={{ fontSize: '12px', color: 'white', fontWeight: '500' }}>Verified</p></div>
                        </div>
                        <div style={{ position: 'absolute', bottom: '20px', left: '-10px', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '20px' }}>warning</span>
                            <div><p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Tone</p><p style={{ fontSize: '12px', color: 'white', fontWeight: '500' }}>Emotive</p></div>
                        </div>

                        <p style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '1px' }}>Scanning</p>
                        <p style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '1px' }}>Processing</p>
                    </div>

                    {/* Progress */}
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px', color: '#9ca3af' }}>Analysis Status</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>{Math.round(progress)}%</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#1f2937', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#3b82f6', borderRadius: '3px', transition: 'width 0.2s' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#4b5563', fontFamily: 'monospace' }}>
                            <span>START: {new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
                            <span>EST. REMAINING: {Math.max(0, Math.round((100 - progress) / 15))}s</span>
                        </div>
                    </div>

                    {/* Steps */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%' }}>
                        {analysisSteps.map((step, index) => {
                            const isCompleted = index < currentStep;
                            const isActive = index === currentStep;
                            return (
                                <div key={step.id} style={{
                                    padding: '20px',
                                    borderRadius: '14px',
                                    backgroundColor: '#111827',
                                    border: isActive ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.06)',
                                    opacity: index > currentStep ? 0.5 : 1
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: isCompleted ? 'rgba(34,197,94,0.1)' : isActive ? 'rgba(59,130,246,0.1)' : '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isCompleted ? '#22c55e' : isActive ? '#3b82f6' : '#6b7280' }}>{step.icon}</span>
                                        </div>
                                        {isCompleted && <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '18px' }}>check</span>}
                                        {isActive && <span style={{ fontSize: '10px', fontWeight: '700', color: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', padding: '4px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>Active</span>}
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
                        <button onClick={onCancel} style={{ fontSize: '14px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>Cancel Analysis</button>
                    </div>
                </div>
            </main>
        </div>
    );
}
