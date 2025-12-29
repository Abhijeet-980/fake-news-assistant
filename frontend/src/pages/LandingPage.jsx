/**
 * LandingPage Component
 * Horizontal layout design with two-column hero and feature sections
 */
import React, { useState, useEffect } from 'react';

export default function LandingPage({ onAnalyze, onNavigate }) {
    const [inputText, setInputText] = useState('');
    const [activeTab, setActiveTab] = useState('text');
    const [isLoaded, setIsLoaded] = useState(false);
    const maxChars = 5000;

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleAnalyze = () => {
        if (inputText.trim().length >= 10) {
            onAnalyze(inputText.trim());
        }
    };

    const features = [
        {
            icon: 'psychology',
            title: 'AI-Powered Analysis',
            description: 'Advanced machine learning algorithms analyze content patterns and writing style',
            color: '#3b82f6'
        },
        {
            icon: 'fact_check',
            title: 'Source Verification',
            description: 'Cross-reference claims with trusted fact-checking databases',
            color: '#22c55e'
        },
        {
            icon: 'analytics',
            title: 'Sentiment Detection',
            description: 'Identify emotional manipulation and biased language patterns',
            color: '#a855f7'
        },
        {
            icon: 'security',
            title: 'Privacy First',
            description: 'Your data is processed securely and never stored on our servers',
            color: '#f59e0b'
        }
    ];

    const stats = [
        { value: '99%', label: 'Accuracy Rate' },
        { value: '50K+', label: 'Articles Analyzed' },
        { value: '<2s', label: 'Analysis Time' },
        { value: '24/7', label: 'Availability' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#080c14',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Animated background */}
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.08) 0%, transparent 50%)',
                pointerEvents: 'none'
            }} />

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
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
            `}</style>

            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 48px',
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
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
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
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '20px' }}>verified_user</span>
                    </div>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>CrediReader</span>
                </div>

                <nav style={{ display: 'flex', gap: '40px' }}>
                    {[{ label: 'About', page: 'about' }, { label: 'Methodology', page: 'methodology' }, { label: 'Privacy', page: 'privacy' }].map((item) => (
                        <span
                            key={item.label}
                            onClick={() => onNavigate && onNavigate(item.page)}
                            style={{
                                color: '#9ca3af',
                                fontSize: '14px',
                                cursor: 'pointer',
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
                            {item.label}
                        </span>
                    ))}
                </nav>

                <div style={{ width: '120px' }} />
            </header>

            {/* Hero Section - Two Column Layout */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '0 48px',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Hero Row */}
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '80px',
                    alignItems: 'center',
                    minHeight: '70vh',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                    padding: '40px 0'
                }}>
                    {/* Left Column - Text Content */}
                    <div style={{
                        animation: isLoaded ? 'fadeInLeft 0.8s ease-out' : 'none'
                    }}>
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '999px',
                            backgroundColor: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.2)',
                            marginBottom: '28px',
                            animation: isLoaded ? 'float 4s ease-in-out 0.6s infinite' : 'none',
                            boxShadow: '0 4px 20px rgba(34,197,94,0.15)'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#22c55e',
                                animation: 'pulse 2s ease-in-out infinite'
                            }} />
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                AI-Powered Analysis
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: '56px',
                            fontWeight: '800',
                            color: 'white',
                            marginBottom: '8px',
                            lineHeight: 1.1
                        }}>
                            Detect Fake News
                        </h1>
                        <h1 style={{
                            fontSize: '56px',
                            fontWeight: '800',
                            marginBottom: '24px',
                            background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #5eead4)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1.1,
                            animation: 'shimmer 4s linear infinite'
                        }}>
                            In Seconds
                        </h1>

                        {/* Subtitle */}
                        <p style={{
                            fontSize: '18px',
                            color: '#9ca3af',
                            lineHeight: 1.7,
                            marginBottom: '32px',
                            maxWidth: '500px'
                        }}>
                            Helping users think smarter, not censor content. We analyze patterns, sources,
                            and tone to give you the context you need to make informed decisions.
                        </p>

                        {/* Stats Row */}
                        <div style={{
                            display: 'flex',
                            gap: '40px',
                            marginTop: '20px'
                        }}>
                            {stats.map((stat, i) => (
                                <div key={i} style={{
                                    textAlign: 'center',
                                    animation: isLoaded ? `fadeInUp 0.6s ease-out ${0.3 + i * 0.1}s both` : 'none'
                                }}>
                                    <div style={{
                                        fontSize: '28px',
                                        fontWeight: '700',
                                        color: '#3b82f6',
                                        marginBottom: '4px'
                                    }}>{stat.value}</div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Input Card */}
                    <div style={{
                        animation: isLoaded ? 'fadeInRight 0.8s ease-out 0.2s both' : 'none'
                    }}>
                        <div style={{
                            backgroundColor: '#111827',
                            borderRadius: '20px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.1)',
                            transition: 'box-shadow 0.3s ease, transform 0.3s ease'
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0,0,0,0.6), 0 0 80px rgba(59,130,246,0.15)';
                                e.currentTarget.style.transform = 'translateY(-4px)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {/* Tabs */}
                            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
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
                                        padding: '18px',
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
                                        fontSize: '20px',
                                        transition: 'all 0.3s ease'
                                    }}>description</span>
                                    <span style={{
                                        color: activeTab === 'text' ? 'white' : '#6b7280',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}>Paste Text</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('url')}
                                    style={{
                                        flex: 1,
                                        padding: '18px',
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
                                        fontSize: '20px',
                                        transition: 'all 0.3s ease'
                                    }}>link</span>
                                    <span style={{
                                        color: activeTab === 'url' ? 'white' : '#6b7280',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}>Paste URL</span>
                                </button>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '28px' }}>
                                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                                    Verify News Credibility
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
                                    Paste the article content or URL below to analyze.
                                </p>

                                <div style={{ position: 'relative', marginBottom: '24px' }}>
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value.slice(0, maxChars))}
                                        placeholder="Paste the article text here to begin analysis..."
                                        style={{
                                            width: '100%',
                                            height: '180px',
                                            backgroundColor: '#0d1117',
                                            color: 'white',
                                            fontSize: '14px',
                                            padding: '18px',
                                            borderRadius: '14px',
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
                                        bottom: '14px',
                                        right: '14px',
                                        fontSize: '12px',
                                        color: inputText.length > maxChars * 0.9 ? '#f59e0b' : '#4b5563',
                                        fontFamily: 'monospace'
                                    }}>
                                        {inputText.length} / {maxChars}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lock</span>
                                        <span>Private & Secure</span>
                                    </div>

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={inputText.trim().length < 10}
                                        style={{
                                            backgroundColor: inputText.trim().length >= 10 ? '#3b82f6' : '#374151',
                                            color: 'white',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            padding: '14px 28px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            cursor: inputText.trim().length >= 10 ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: inputText.trim().length >= 10 ? '0 4px 20px rgba(59,130,246,0.4)' : 'none'
                                        }}
                                        onMouseOver={e => {
                                            if (inputText.trim().length >= 10) {
                                                e.currentTarget.style.backgroundColor = '#2563eb';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.5)';
                                            }
                                        }}
                                        onMouseOut={e => {
                                            if (inputText.trim().length >= 10) {
                                                e.currentTarget.style.backgroundColor = '#3b82f6';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.4)';
                                            }
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{
                                            fontSize: '20px',
                                            animation: inputText.trim().length >= 10 ? 'pulse 2s ease-in-out infinite' : 'none'
                                        }}>auto_awesome</span>
                                        Analyze Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Notice */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '24px',
                            padding: '0 8px'
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
                            <p style={{ color: '#6b7280', fontSize: '13px' }}>
                                <span style={{ color: '#d1d5db', fontWeight: '500' }}>We don't block content.</span>{' '}
                                We help you evaluate it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section - Horizontal Layout */}
                <section style={{
                    maxWidth: '1400px',
                    margin: '0 auto 60px',
                    width: '100%',
                    animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.4s both' : 'none'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        marginBottom: '40px'
                    }}>
                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, #374151)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            How It Works
                        </span>
                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, #374151)' }} />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '24px'
                    }}>
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: 'rgba(17,24,39,0.6)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '16px',
                                    padding: '28px',
                                    transition: 'all 0.3s ease',
                                    animation: isLoaded ? `fadeInUp 0.6s ease-out ${0.5 + i * 0.1}s both` : 'none'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.9)';
                                    e.currentTarget.style.borderColor = `${feature.color}40`;
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${feature.color}20`;
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.6)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: `${feature.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: feature.color, fontSize: '24px' }}>
                                        {feature.icon}
                                    </span>
                                </div>
                                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.6 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Checks - Horizontal */}
                <section style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                    paddingBottom: '60px',
                    animation: isLoaded ? 'fadeInUp 0.8s ease-out 0.6s both' : 'none'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '16px',
                        marginBottom: '30px'
                    }}>
                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, #374151)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Recent Checks
                        </span>
                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, #374151)' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {[
                            { title: '"Miracle cure found in..."', status: 'Low Credibility', time: '2m ago', color: '#ef4444' },
                            { title: 'Global market trends report', status: 'High Credibility', time: '5m ago', color: '#22c55e' },
                            { title: 'Local election results...', status: 'Needs Context', time: '12m ago', color: '#eab308' },
                            { title: 'Climate change study...', status: 'Verified Source', time: '18m ago', color: '#22c55e' }
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: 'rgba(17,24,39,0.6)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                    padding: '18px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
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
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: item.color,
                                    marginTop: '4px',
                                    flexShrink: 0,
                                    boxShadow: `0 0 10px ${item.color}50`
                                }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{item.title}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: item.color, fontSize: '12px', fontWeight: '500' }}>{item.status}</span>
                                        <span style={{ color: '#6b7280', fontSize: '11px' }}>{item.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '24px 48px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(8,12,20,0.9)'
            }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>
                    © 2024 CrediReader. Helping you think smarter.
                </span>
                <div style={{ display: 'flex', gap: '24px' }}>
                    {['Terms', 'Privacy', 'Contact'].map(link => (
                        <span
                            key={link}
                            style={{
                                color: '#6b7280',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = '#ffffff'}
                            onMouseOut={e => e.currentTarget.style.color = '#6b7280'}
                        >
                            {link}
                        </span>
                    ))}
                </div>
            </footer>
        </div>
    );
}
