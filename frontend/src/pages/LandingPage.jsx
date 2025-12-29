/**
 * LandingPage Component
 * Responsive horizontal layout design with two-column hero and feature sections
 */
import React, { useState, useEffect } from 'react';

export default function LandingPage({ onAnalyze, onNavigate }) {
    const [inputText, setInputText] = useState('');
    const [activeTab, setActiveTab] = useState('text');
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const maxChars = 5000;

    useEffect(() => {
        setIsLoaded(true);

        // Responsive breakpoint detection
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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

    const recentChecks = [
        { title: '"Miracle cure found in..."', status: 'Low Credibility', time: '2m ago', color: '#ef4444' },
        { title: 'Global market trends report', status: 'High Credibility', time: '5m ago', color: '#22c55e' },
        { title: 'Local election results...', status: 'Needs Context', time: '12m ago', color: '#eab308' },
        { title: 'Climate change study...', status: 'Verified Source', time: '18m ago', color: '#22c55e' }
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

            {/* Header - Enhanced Navbar */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: isMobile ? '12px 16px' : '16px 48px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: 'rgba(8,12,20,0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                animation: isLoaded ? 'fadeInDown 0.6s ease-out' : 'none',
                boxShadow: '0 4px 30px rgba(0,0,0,0.3)'
            }}>
                {/* Logo Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer'
                }}
                    onClick={() => onNavigate && onNavigate('home')}
                >
                    <div style={{
                        width: isMobile ? '36px' : '40px',
                        height: isMobile ? '36px' : '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(59,130,246,0.4), inset 0 1px 1px rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = 'scale(1.05) rotate(5deg)';
                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(59,130,246,0.5), inset 0 1px 1px rgba(255,255,255,0.2)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(59,130,246,0.4), inset 0 1px 1px rgba(255,255,255,0.2)';
                        }}
                    >
                        <span className="material-symbols-outlined" style={{
                            color: 'white',
                            fontSize: isMobile ? '20px' : '22px',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}>verified_user</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: isMobile ? '17px' : '19px',
                            letterSpacing: '-0.3px',
                            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>CrediReader</span>
                        {!isMobile && (
                            <span style={{
                                fontSize: '10px',
                                color: '#6b7280',
                                letterSpacing: '0.5px',
                                marginTop: '-2px'
                            }}>FAKE NEWS DETECTOR</span>
                        )}
                    </div>
                </div>

                {/* Navigation - Desktop/Tablet */}
                {!isMobile && (
                    <nav style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        padding: '6px 8px',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                        {[
                            { label: 'About', page: 'about', icon: 'info' },
                            { label: 'Methodology', page: 'methodology', icon: 'science' },
                            { label: 'Privacy', page: 'privacy', icon: 'shield' }
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => onNavigate && onNavigate(item.page)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: isTablet ? '8px 14px' : '10px 18px',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.15)';
                                    e.currentTarget.querySelector('span:first-child').style.color = '#60a5fa';
                                    e.currentTarget.querySelector('span:last-child').style.color = '#ffffff';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.querySelector('span:first-child').style.color = '#6b7280';
                                    e.currentTarget.querySelector('span:last-child').style.color = '#9ca3af';
                                }}
                            >
                                <span className="material-symbols-outlined" style={{
                                    fontSize: '18px',
                                    color: '#6b7280',
                                    transition: 'color 0.2s ease'
                                }}>{item.icon}</span>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#9ca3af',
                                    transition: 'color 0.2s ease'
                                }}>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                )}

                {/* CTA Button - Desktop only */}
                {!isMobile && !isTablet && (
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(59,130,246,0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.4)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,130,246,0.3)';
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'white' }}>rocket_launch</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Get Started</span>
                    </button>
                )}

                {/* Mobile menu button */}
                {isMobile && (
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
                            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
                            e.currentTarget.style.color = '#60a5fa';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.color = '#9ca3af';
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>menu</span>
                    </button>
                )}

                {/* Spacer for tablet */}
                {isTablet && <div style={{ width: '40px' }} />}
            </header>

            {/* Main Content */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: isMobile ? '0 16px' : isTablet ? '0 32px' : '0 48px',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Hero Section - Responsive Grid */}
                <section style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '40px' : isTablet ? '40px' : '80px',
                    alignItems: 'center',
                    minHeight: isMobile ? 'auto' : '70vh',
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                    padding: isMobile ? '40px 0' : '40px 0'
                }}>
                    {/* Left Column - Text Content */}
                    <div style={{
                        animation: isLoaded ? 'fadeInLeft 0.8s ease-out' : 'none',
                        textAlign: isMobile ? 'center' : 'left'
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
                            marginBottom: isMobile ? '20px' : '28px',
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
                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                AI-Powered Analysis
                            </span>
                        </div>

                        {/* Title */}
                        <h1 style={{
                            fontSize: isMobile ? '36px' : isTablet ? '44px' : '56px',
                            fontWeight: '800',
                            color: 'white',
                            marginBottom: '8px',
                            lineHeight: 1.1
                        }}>
                            Detect Fake News
                        </h1>
                        <h1 style={{
                            fontSize: isMobile ? '36px' : isTablet ? '44px' : '56px',
                            fontWeight: '800',
                            marginBottom: isMobile ? '16px' : '24px',
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
                            fontSize: isMobile ? '15px' : '18px',
                            color: '#9ca3af',
                            lineHeight: 1.7,
                            marginBottom: isMobile ? '24px' : '32px',
                            maxWidth: isMobile ? '100%' : '500px',
                            margin: isMobile ? '0 auto 24px' : undefined
                        }}>
                            Helping users think smarter, not censor content. We analyze patterns, sources,
                            and tone to give you the context you need to make informed decisions.
                        </p>

                        {/* Stats Row */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, auto)',
                            gap: isMobile ? '20px' : '40px',
                            marginTop: isMobile ? '0' : '20px',
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}>
                            {stats.map((stat, i) => (
                                <div key={i} style={{
                                    textAlign: 'center',
                                    animation: isLoaded ? `fadeInUp 0.6s ease-out ${0.3 + i * 0.1}s both` : 'none'
                                }}>
                                    <div style={{
                                        fontSize: isMobile ? '24px' : '28px',
                                        fontWeight: '700',
                                        color: '#3b82f6',
                                        marginBottom: '4px'
                                    }}>{stat.value}</div>
                                    <div style={{
                                        fontSize: isMobile ? '10px' : '12px',
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
                                if (!isMobile) {
                                    e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0,0,0,0.6), 0 0 80px rgba(59,130,246,0.15)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }
                            }}
                            onMouseOut={e => {
                                if (!isMobile) {
                                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 60px rgba(59,130,246,0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }
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
                                        padding: isMobile ? '14px' : '18px',
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
                                        padding: isMobile ? '14px' : '18px',
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
                            <div style={{ padding: isMobile ? '20px' : '28px' }}>
                                <h3 style={{ color: 'white', fontSize: isMobile ? '15px' : '16px', fontWeight: '600', marginBottom: '8px' }}>
                                    Verify News Credibility
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: isMobile ? '13px' : '14px', marginBottom: isMobile ? '16px' : '20px' }}>
                                    Paste the article content or URL below to analyze.
                                </p>

                                <div style={{ position: 'relative', marginBottom: isMobile ? '20px' : '24px' }}>
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value.slice(0, maxChars))}
                                        placeholder="Paste the article text here to begin analysis..."
                                        style={{
                                            width: '100%',
                                            height: isMobile ? '140px' : '180px',
                                            backgroundColor: '#0d1117',
                                            color: 'white',
                                            fontSize: '14px',
                                            padding: isMobile ? '14px' : '18px',
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

                                <div style={{
                                    display: 'flex',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    alignItems: isMobile ? 'stretch' : 'center',
                                    justifyContent: 'space-between',
                                    gap: isMobile ? '16px' : '0'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#6b7280',
                                        fontSize: '13px',
                                        justifyContent: isMobile ? 'center' : 'flex-start'
                                    }}>
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
                                            padding: isMobile ? '14px 24px' : '14px 28px',
                                            borderRadius: '12px',
                                            border: 'none',
                                            cursor: inputText.trim().length >= 10 ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: inputText.trim().length >= 10 ? '0 4px 20px rgba(59,130,246,0.4)' : 'none',
                                            width: isMobile ? '100%' : 'auto'
                                        }}
                                        onMouseOver={e => {
                                            if (inputText.trim().length >= 10 && !isMobile) {
                                                e.currentTarget.style.backgroundColor = '#2563eb';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.5)';
                                            }
                                        }}
                                        onMouseOut={e => {
                                            if (inputText.trim().length >= 10 && !isMobile) {
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
                            padding: '0 8px',
                            justifyContent: isMobile ? 'center' : 'flex-start'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(59,130,246,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: '18px' }}>verified</span>
                            </div>
                            <p style={{ color: '#6b7280', fontSize: '13px', textAlign: isMobile ? 'center' : 'left' }}>
                                <span style={{ color: '#d1d5db', fontWeight: '500' }}>We don't block content.</span>{' '}
                                We help you evaluate it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section - Responsive Grid */}
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
                        marginBottom: isMobile ? '30px' : '40px'
                    }}>
                        <div style={{ height: '1px', width: isMobile ? '40px' : '60px', background: 'linear-gradient(to right, transparent, #374151)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            How It Works
                        </span>
                        <div style={{ height: '1px', width: isMobile ? '40px' : '60px', background: 'linear-gradient(to left, transparent, #374151)' }} />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                        gap: isMobile ? '16px' : '24px'
                    }}>
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: 'rgba(17,24,39,0.6)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '16px',
                                    padding: isMobile ? '20px' : '28px',
                                    transition: 'all 0.3s ease',
                                    animation: isLoaded ? `fadeInUp 0.6s ease-out ${0.5 + i * 0.1}s both` : 'none'
                                }}
                                onMouseOver={e => {
                                    if (!isMobile) {
                                        e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.9)';
                                        e.currentTarget.style.borderColor = `${feature.color}40`;
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${feature.color}20`;
                                    }
                                }}
                                onMouseOut={e => {
                                    if (!isMobile) {
                                        e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.6)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                }}
                            >
                                <div style={{
                                    width: isMobile ? '40px' : '48px',
                                    height: isMobile ? '40px' : '48px',
                                    borderRadius: '12px',
                                    backgroundColor: `${feature.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: isMobile ? '16px' : '20px'
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: feature.color, fontSize: isMobile ? '20px' : '24px' }}>
                                        {feature.icon}
                                    </span>
                                </div>
                                <h3 style={{ color: 'white', fontSize: isMobile ? '15px' : '16px', fontWeight: '600', marginBottom: '10px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: '#9ca3af', fontSize: isMobile ? '13px' : '14px', lineHeight: 1.6 }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recent Checks - Responsive Grid */}
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
                        <div style={{ height: '1px', width: isMobile ? '40px' : '60px', background: 'linear-gradient(to right, transparent, #374151)' }} />
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Recent Checks
                        </span>
                        <div style={{ height: '1px', width: isMobile ? '40px' : '60px', background: 'linear-gradient(to left, transparent, #374151)' }} />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                        gap: '16px'
                    }}>
                        {recentChecks.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: 'rgba(17,24,39,0.6)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                    padding: isMobile ? '14px' : '18px',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={e => {
                                    if (!isMobile) {
                                        e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.9)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                                    }
                                }}
                                onMouseOut={e => {
                                    if (!isMobile) {
                                        e.currentTarget.style.backgroundColor = 'rgba(17,24,39,0.6)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
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

            {/* Footer - Responsive */}
            <footer style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: isMobile ? '20px 16px' : '24px 48px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: isMobile ? '16px' : '0',
                backgroundColor: 'rgba(8,12,20,0.9)'
            }}>
                <span style={{ color: '#6b7280', fontSize: '13px', textAlign: isMobile ? 'center' : 'left' }}>
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
