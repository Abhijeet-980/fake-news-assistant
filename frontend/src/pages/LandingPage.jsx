/**
 * LandingPage Component
 * Enhanced landing page with smooth animations while preserving layout and colors
 */
import React, { useState, useEffect } from 'react';

export default function LandingPage({ onAnalyze }) {
    const [inputText, setInputText] = useState('');
    const [activeTab, setActiveTab] = useState('text');
    const [isLoaded, setIsLoaded] = useState(false);
    const maxChars = 5000;

    useEffect(() => {
        // Trigger entrance animations
        setIsLoaded(true);
    }, []);

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
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Animated background gradient */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 50%)',
                animation: 'bgFloat 8s ease-in-out infinite',
                pointerEvents: 'none'
            }} />
            <style>{`
                @keyframes bgFloat {
                    0%, 100% { opacity: 0.5; transform: translateY(0); }
                    50% { opacity: 0.8; transform: translateY(-20px); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes glow {
                    0%, 100% { filter: drop-shadow(0 0 20px rgba(59,130,246,0.3)); }
                    50% { filter: drop-shadow(0 0 40px rgba(59,130,246,0.5)); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>

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
                zIndex: 50,
                animation: isLoaded ? 'fadeInDown 0.6s ease-out' : 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'glow 3s ease-in-out infinite',
                        transition: 'transform 0.3s ease'
                    }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                    >
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px' }}>verified_user</span>
                    </div>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>CrediReader</span>
                </div>

                <nav style={{ display: 'flex', gap: '32px' }}>
                    {['About', 'Methodology', 'Privacy'].map((item, i) => (
                        <a
                            key={item}
                            href="#"
                            style={{
                                color: '#9ca3af',
                                fontSize: '14px',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.color = '#ffffff';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.color = '#9ca3af';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                        style={{
                            color: '#9ca3af',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'color 0.3s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#ffffff'}
                        onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                    >
                        Sign In
                    </span>
                    <button style={{
                        backgroundColor: '#1f2937',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #374151',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = '#374151';
                            e.currentTarget.style.borderColor = '#4b5563';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = '#1f2937';
                            e.currentTarget.style.borderColor = '#374151';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >Get Extension</button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '60px 24px 40px',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Badge - Floating animation */}
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.2)',
                    marginBottom: '24px',
                    animation: isLoaded ? 'fadeInUp 0.6s ease-out, float 4s ease-in-out 0.6s infinite' : 'none',
                    boxShadow: '0 4px 20px rgba(34,197,94,0.15)'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                        animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        AI-Powered Analysis
                    </span>
                </div>

                {/* Title with staggered animation */}
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '8px',
                    lineHeight: 1.1,
                    animation: isLoaded ? 'fadeInUp 0.7s ease-out 0.1s both' : 'none'
                }}>
                    Fake News
                </h1>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: '800',
                    textAlign: 'center',
                    marginBottom: '20px',
                    background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #5eead4, #60a5fa)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1,
                    animation: isLoaded ? 'fadeInUp 0.7s ease-out 0.2s both, shimmer 4s linear infinite' : 'none'
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
                    marginBottom: '40px',
                    animation: isLoaded ? 'fadeInUp 0.7s ease-out 0.3s both' : 'none'
                }}>
                    Helping users think smarter, not censor content. We analyze patterns, sources, and tone to give you context.
                </p>

                {/* Card with scale animation */}
                <div style={{
                    width: '100%',
                    maxWidth: '640px',
                    backgroundColor: '#111827',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    animation: isLoaded ? 'scaleIn 0.7s ease-out 0.4s both' : 'none',
                    transition: 'box-shadow 0.3s ease, transform 0.3s ease'
                }}
                    onMouseOver={e => {
                        e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0,0,0,0.6), 0 0 40px rgba(59,130,246,0.1)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.5)';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    {/* Tabs with smooth indicator */}
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                        {/* Animated tab indicator */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: activeTab === 'text' ? '0' : '50%',
                            width: '50%',
                            height: '2px',
                            backgroundColor: '#3b82f6',
                            transition: 'left 0.3s ease',
                            boxShadow: '0 0 10px rgba(59,130,246,0.5)'
                        }} />

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
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{
                                color: activeTab === 'text' ? 'white' : '#6b7280',
                                fontSize: '18px',
                                transition: 'color 0.3s ease, transform 0.3s ease',
                                transform: activeTab === 'text' ? 'scale(1.1)' : 'scale(1)'
                            }}>description</span>
                            <span style={{
                                color: activeTab === 'text' ? 'white' : '#6b7280',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'color 0.3s ease'
                            }}>Paste Text</span>
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
                                transition: 'background-color 0.3s ease'
                            }}
                        >
                            <span className="material-symbols-outlined" style={{
                                color: activeTab === 'url' ? 'white' : '#6b7280',
                                fontSize: '18px',
                                transition: 'color 0.3s ease, transform 0.3s ease',
                                transform: activeTab === 'url' ? 'scale(1.1)' : 'scale(1)'
                            }}>link</span>
                            <span style={{
                                color: activeTab === 'url' ? 'white' : '#6b7280',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'color 0.3s ease'
                            }}>Paste URL</span>
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
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = 'rgba(59,130,246,0.5)';
                                    e.target.style.boxShadow = '0 0 20px rgba(59,130,246,0.15)';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <span style={{
                                position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                fontSize: '12px',
                                color: inputText.length > maxChars * 0.9 ? '#f59e0b' : '#4b5563',
                                fontFamily: 'monospace',
                                transition: 'color 0.3s ease'
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
                                    gap: '8px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: inputText.trim().length >= 10 ? '0 4px 15px rgba(59,130,246,0.3)' : 'none'
                                }}
                                onMouseOver={e => {
                                    if (inputText.trim().length >= 10) {
                                        e.currentTarget.style.backgroundColor = '#2563eb';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)';
                                    }
                                }}
                                onMouseOut={e => {
                                    if (inputText.trim().length >= 10) {
                                        e.currentTarget.style.backgroundColor = '#3b82f6';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,130,246,0.3)';
                                    }
                                }}
                            >
                                <span className="material-symbols-outlined" style={{
                                    fontSize: '18px',
                                    animation: inputText.trim().length >= 10 ? 'pulse 2s ease-in-out infinite' : 'none'
                                }}>auto_awesome</span>
                                Analyze Credibility
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Notice with fade in */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginTop: '32px',
                    animation: isLoaded ? 'fadeInUp 0.7s ease-out 0.6s both' : 'none'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(59,130,246,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: '18px' }}>verified</span>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        <span style={{ color: '#d1d5db', fontWeight: '500' }}>We do not block or delete content.</span>{' '}
                        We simply help users evaluate it.
                    </p>
                </div>
            </main>

            {/* Recent Checks with stagger animation */}
            <section style={{
                padding: '0 24px 40px',
                maxWidth: '640px',
                margin: '0 auto',
                width: '100%',
                animation: isLoaded ? 'fadeInUp 0.7s ease-out 0.7s both' : 'none'
            }}>
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
                        <div
                            key={i}
                            style={{
                                backgroundColor: 'rgba(17,24,39,0.6)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: '10px',
                                padding: '14px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                animation: isLoaded ? `slideInLeft 0.5s ease-out ${0.8 + i * 0.1}s both` : 'none'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.9)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.6)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: item.color,
                                marginTop: '4px',
                                flexShrink: 0,
                                boxShadow: `0 0 8px ${item.color}40`
                            }} />
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
