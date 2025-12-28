/**
 * LandingPage Component
 * Clean landing page matching CrediReader reference design
 */
import React, { useState } from 'react';

export default function LandingPage({ onAnalyze }) {
    const [inputText, setInputText] = useState('');
    const [activeTab, setActiveTab] = useState('text');
    const maxChars = 5000;

    const handleAnalyze = () => {
        if (inputText.trim().length >= 10) {
            onAnalyze(inputText.trim());
        }
    };

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
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px' }}>verified_user</span>
                    </div>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>CrediReader</span>
                </div>

                <nav style={{ display: 'flex', gap: '32px' }}>
                    <a href="#" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>About</a>
                    <a href="#" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>Methodology</a>
                    <a href="#" style={{ color: '#9ca3af', fontSize: '14px', textDecoration: 'none' }}>Privacy</a>
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ color: '#9ca3af', fontSize: '14px', cursor: 'pointer' }}>Sign In</span>
                    <button style={{
                        backgroundColor: '#1f2937',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #374151',
                        cursor: 'pointer'
                    }}>Get Extension</button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '60px 24px 40px'
            }}>
                {/* Badge */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    marginBottom: '24px'
                }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        AI-Powered Analysis
                    </span>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '8px',
                    lineHeight: 1.1
                }}>
                    Fake News
                </h1>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    textAlign: 'center',
                    marginBottom: '20px',
                    background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #5eead4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1
                }}>
                    CrediReader
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '16px',
                    color: '#9ca3af',
                    textAlign: 'center',
                    maxWidth: '480px',
                    lineHeight: 1.6,
                    marginBottom: '40px'
                }}>
                    Helping users think smarter, not censor content. We analyze patterns, sources, and tone to give you context.
                </p>

                {/* Card */}
                <div style={{
                    width: '100%',
                    maxWidth: '640px',
                    backgroundColor: '#111827',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <button
                            onClick={() => setActiveTab('text')}
                            style={{
                                flex: 1,
                                padding: '16px',
                                backgroundColor: activeTab === 'text' ? 'rgba(255,255,255,0.03)' : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                position: 'relative'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ color: activeTab === 'text' ? 'white' : '#6b7280', fontSize: '18px' }}>description</span>
                            <span style={{ color: activeTab === 'text' ? 'white' : '#6b7280', fontSize: '14px', fontWeight: '500' }}>Paste Text</span>
                            {activeTab === 'text' && (
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#3b82f6' }} />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('url')}
                            style={{
                                flex: 1,
                                padding: '16px',
                                backgroundColor: activeTab === 'url' ? 'rgba(255,255,255,0.03)' : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                position: 'relative'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ color: activeTab === 'url' ? 'white' : '#6b7280', fontSize: '18px' }}>link</span>
                            <span style={{ color: activeTab === 'url' ? 'white' : '#6b7280', fontSize: '14px', fontWeight: '500' }}>Paste URL</span>
                            {activeTab === 'url' && (
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#3b82f6' }} />
                            )}
                        </button>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ color: 'white', fontSize: '15px', fontWeight: '600', marginBottom: '6px' }}>
                            Paste News or URL
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '16px' }}>
                            Paste the article content below to verify its credibility.
                        </p>

                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value.slice(0, maxChars))}
                                placeholder="Paste the article text here to begin analysis..."
                                style={{
                                    width: '100%',
                                    height: '160px',
                                    backgroundColor: '#0d1117',
                                    color: 'white',
                                    fontSize: '14px',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    resize: 'none',
                                    outline: 'none'
                                }}
                            />
                            <span style={{
                                position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                fontSize: '12px',
                                color: '#4b5563',
                                fontFamily: 'monospace'
                            }}>
                                {inputText.length} / {maxChars}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                                <span>Your data is processed privately</span>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={inputText.trim().length < 10}
                                style={{
                                    backgroundColor: inputText.trim().length >= 10 ? '#3b82f6' : '#374151',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: inputText.trim().length >= 10 ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_awesome</span>
                                Analyze Credibility
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Notice */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginTop: '32px'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(59,130,246,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: '18px' }}>verified</span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        <span style={{ color: '#d1d5db', fontWeight: '500' }}>We do not block or delete content.</span>{' '}
                        We simply help users evaluate it.
                    </p>
                </div>
            </main>

            {/* Recent Checks */}
            <section style={{ padding: '0 24px 40px', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '20px'
                }}>
                    <div style={{ height: '1px', width: '40px', backgroundColor: '#374151' }} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Checks</span>
                    <div style={{ height: '1px', width: '40px', backgroundColor: '#374151' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                        { title: '"Miracle cure found in..."', status: 'Low Credibility • 2m ago', color: '#ef4444' },
                        { title: 'Global market trends report', status: 'High Credibility • 5m ago', color: '#22c55e' },
                        { title: 'Local election results...', status: 'Needs Context • 12m ago', color: '#eab308' }
                    ].map((item, i) => (
                        <div key={i} style={{
                            backgroundColor: 'rgba(17,24,39,0.6)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '10px',
                            padding: '14px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            cursor: 'pointer'
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, marginTop: '4px', flexShrink: 0 }} />
                            <div>
                                <p style={{ color: '#d1d5db', fontSize: '13px', fontWeight: '500' }}>{item.title}</p>
                                <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '4px' }}>{item.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
