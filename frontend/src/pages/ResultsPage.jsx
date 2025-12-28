/**
 * ResultsPage Component
 * Clean results page with score left, details right
 */
import React from 'react';
import ScoreCircle from '../components/ScoreCircle';

export default function ResultsPage({ result, inputText, onNewAnalysis }) {
    const { score, statusLabel, statusColor, summary, reasons, thinkingPrompts, recommendation, searchUrl } = result;

    const getStatusIcon = () => statusColor === 'green' ? 'verified' : statusColor === 'yellow' ? 'warning' : 'error';
    const getReasonIcon = (type) => type === 'positive' ? 'check_circle' : type === 'warning' ? 'sentiment_worried' : type === 'negative' ? 'cancel' : 'schedule';
    const getReasonColor = (type) => type === 'positive' ? '#22c55e' : type === 'warning' ? '#eab308' : type === 'negative' ? '#ef4444' : '#3b82f6';
    const getTextPreview = () => inputText.length <= 60 ? inputText : inputText.substring(0, 60) + '...';
    const statusColors = { green: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' }, yellow: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', text: '#eab308' }, red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' } };
    const sc = statusColors[statusColor] || statusColors.yellow;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#080c14', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(8,12,20,0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '18px' }}>verified_user</span>
                    </div>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>CrediReader</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>history</span>History
                    </button>
                    <button onClick={onNewAnalysis} style={{ backgroundColor: '#3b82f6', color: 'white', fontSize: '14px', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>New Analysis
                    </button>
                </div>
            </header>

            {/* Main */}
            <main style={{ flex: 1, padding: '32px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                {/* Header Meta */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#6b7280', fontSize: '18px' }}>article</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Analysis Result</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase' }}>New • Just Now</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>"{getTextPreview()}"</h1>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
                    {/* Left - Score */}
                    <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <ScoreCircle score={score} statusColor={statusColor} />
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '999px', backgroundColor: sc.bg, border: `1px solid ${sc.border}`, marginTop: '20px', marginBottom: '16px' }}>
                            <span className="material-symbols-outlined" style={{ color: sc.text, fontSize: '18px' }}>{getStatusIcon()}</span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: sc.text }}>{statusLabel}</span>
                        </div>
                        <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.6, maxWidth: '280px' }}>{summary}</p>
                    </div>

                    {/* Right - Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Why */}
                        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#3b82f6', fontSize: '18px' }}>psychology</span>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Why We Think This</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {reasons.map((r, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span className="material-symbols-outlined" style={{ color: getReasonColor(r.type), fontSize: '20px', marginTop: '2px' }}>{getReasonIcon(r.type)}</span>
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>{r.title}</p>
                                            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5 }}>{r.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Think */}
                        <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(234,179,8,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#eab308', fontSize: '18px' }}>lightbulb</span>
                                </div>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Think Before You Share</h3>
                            </div>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: 0, padding: 0, listStyle: 'none' }}>
                                {thinkingPrompts.map((p, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', color: '#9ca3af' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#eab308', marginTop: '7px', flexShrink: 0 }} />
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Recommendation */}
                <div style={{ marginTop: '24px', background: 'linear-gradient(90deg, rgba(30,64,175,0.3), rgba(59,130,246,0.15))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: 'white', fontSize: '24px' }}>verified_user</span>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginBottom: '6px' }}>Our Recommendation</h4>
                            <p style={{ fontSize: '14px', color: '#9ca3af', maxWidth: '500px', lineHeight: 1.5 }}>{recommendation}</p>
                        </div>
                    </div>
                    <a href={searchUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: 'white', color: '#111827', fontSize: '14px', fontWeight: '600', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                        Search Google News <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
                    </a>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#4b5563' }}>
                    <span>© 2024 CrediReader. AI-powered analysis.</span>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Methodology</a>
                        <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: '#4b5563', textDecoration: 'none' }}>Feedback</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
