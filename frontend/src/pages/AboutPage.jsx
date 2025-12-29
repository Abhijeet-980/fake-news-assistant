/**
 * AboutPage Component
 * Information about CrediReader and our mission
 */
import React from 'react';

export default function AboutPage({ onBack }) {
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
                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease'
                }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                    Back to Home
                </button>
            </header>

            {/* Content */}
            <main style={{ flex: 1, padding: '60px 24px', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>About CrediReader</h1>
                    <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: 1.8, marginBottom: '40px' }}>
                        Empowering critical thinking in the age of information overload.
                    </p>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                {/* Mission Section */}
                <section style={{ marginBottom: '48px', animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#3b82f6' }}>flag</span>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>Our Mission</h2>
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.8 }}>
                        In today's digital landscape, misinformation spreads faster than ever. CrediReader was built to help users
                        navigate this complex information ecosystem by providing transparent, AI-powered analysis of news content.
                        <br /><br />
                        We believe in empowering users with context and tools to think critically, rather than censoring or blocking content.
                        Our goal is to foster informed decision-making, not to tell you what to believe.
                    </p>
                </section>

                {/* How It Works Section */}
                <section style={{ marginBottom: '48px', animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#22c55e' }}>settings</span>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>How It Works</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        {[
                            { icon: 'language', title: 'Language Analysis', desc: 'Detects emotional manipulation, sensationalism, and biased language patterns.' },
                            { icon: 'verified', title: 'Source Verification', desc: 'Cross-references sources against trusted and suspicious domain databases.' },
                            { icon: 'fact_check', title: 'Fact-Check Integration', desc: 'Searches major fact-checking organizations for related claims.' },
                            { icon: 'psychology', title: 'AI Classification', desc: 'Uses Google Gemini to identify satire, fiction, propaganda, and real news.' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                backgroundColor: '#111827', padding: '20px', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.3s ease'
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#60a5fa', marginBottom: '12px', display: 'block' }}>{item.icon}</span>
                                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#a78bfa' }}>group</span>
                        <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>Built With Purpose</h2>
                    </div>
                    <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.8 }}>
                        CrediReader is an open-source project designed to combat misinformation through transparency and technology.
                        We use a combination of rule-based analysis and AI to provide comprehensive credibility assessments.
                        <br /><br />
                        <span style={{ color: '#60a5fa' }}>Technologies:</span> React, Node.js, Google Gemini AI, Google Fact Check API
                    </p>
                </section>
            </main>
        </div>
    );
}
