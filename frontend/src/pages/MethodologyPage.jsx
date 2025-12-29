/**
 * MethodologyPage Component
 * Explains how CrediReader analyzes content
 */
import React from 'react';

export default function MethodologyPage({ onBack }) {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#080c14',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(8,12,20,0.9)',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={onBack}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px' }}>verified_user</span>
                    </div>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>CrediReader</span>
                </div>
                <button onClick={onBack} style={{
                    backgroundColor: '#1f2937', color: 'white', fontSize: '14px', fontWeight: '500',
                    padding: '8px 16px', borderRadius: '8px', border: '1px solid #374151', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                    Back to Home
                </button>
            </header>

            {/* Content */}
            <main style={{ flex: 1, padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>Methodology</h1>
                    <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: 1.8, marginBottom: '40px' }}>
                        Understanding how we calculate credibility scores.
                    </p>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                {/* Scoring Breakdown */}
                <section style={{ marginBottom: '48px', animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: '28px' }}>calculate</span>
                        Scoring Breakdown
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
                        Our credibility score is calculated from multiple independent factors, each contributing to a maximum of 100 points:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { name: 'Source Trust', points: '30 pts', color: '#3b82f6', desc: 'Based on domain reputation - trusted sources get full points, unknown domains get partial.' },
                            { name: 'Emotional Tone', points: '25 pts', color: '#22c55e', desc: 'Measures emotional language intensity - neutral writing scores higher.' },
                            { name: 'Sensationalism', points: '20 pts', color: '#f59e0b', desc: 'Detects clickbait, exaggeration, and dramatic language patterns.' },
                            { name: 'Evidence Quality', points: '25 pts', color: '#a78bfa', desc: 'Analyzes specificity of sources - named studies and experts score higher than vague claims.' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                backgroundColor: '#111827', padding: '16px 20px', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.06)'
                            }}>
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '10px',
                                    backgroundColor: `${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: item.color, fontWeight: '700', fontSize: '14px'
                                }}>{item.points}</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{item.name}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* AI Analysis */}
                <section style={{ marginBottom: '48px', animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '28px' }}>psychology</span>
                        AI Classification
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>
                        We use Google Gemini AI to classify content into categories, applying score adjustments:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {[
                            { label: 'Real News', adj: '+15', color: '#22c55e' },
                            { label: 'Satire', adj: '-45', color: '#f59e0b' },
                            { label: 'Fiction', adj: '-50', color: '#ef4444' },
                            { label: 'Misleading', adj: '-35', color: '#f97316' },
                            { label: 'Propaganda', adj: '-40', color: '#ef4444' },
                            { label: 'Opinion', adj: '-10', color: '#8b5cf6' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                backgroundColor: '#111827', padding: '12px 16px', borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.06)'
                            }}>
                                <span style={{ color: '#d1d5db', fontSize: '14px' }}>{item.label}</span>
                                <span style={{ color: item.color, fontWeight: '700', fontSize: '14px' }}>{item.adj} pts</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Score Ranges */}
                <section style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '28px' }}>speed</span>
                        Score Interpretation
                    </h2>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        {[
                            { range: '60-100', label: 'Credible', color: '#22c55e', desc: 'Content appears trustworthy based on sources and language.' },
                            { range: '40-59', label: 'Needs Caution', color: '#eab308', desc: 'Some concerns detected - verify before sharing.' },
                            { range: '0-39', label: 'Suspicious', color: '#ef4444', desc: 'Multiple red flags detected - approach with skepticism.' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                flex: 1, backgroundColor: '#111827', padding: '20px', borderRadius: '12px',
                                border: `2px solid ${item.color}30`, textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: item.color, marginBottom: '8px' }}>{item.range}</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>{item.label}</div>
                                <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
