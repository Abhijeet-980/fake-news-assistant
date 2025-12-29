/**
 * PrivacyPage Component
 * Privacy policy and data handling information
 */
import React from 'react';

export default function PrivacyPage({ onBack }) {
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
                    <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>Privacy Policy</h1>
                    <p style={{ fontSize: '18px', color: '#9ca3af', lineHeight: 1.8, marginBottom: '40px' }}>
                        Your privacy matters. Here's how we handle your data.
                    </p>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                {/* Key Points */}
                <section style={{ marginBottom: '48px', animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
                    <div style={{
                        backgroundColor: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '32px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '24px' }}>shield</span>
                            <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '16px' }}>Privacy First</span>
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.6 }}>
                            We do not store, log, or retain any content you submit for analysis. Your data is processed in real-time and immediately discarded.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        {[
                            { icon: 'delete_forever', title: 'No Data Storage', desc: 'Analyzed content is never saved to any database.' },
                            { icon: 'visibility_off', title: 'No Tracking', desc: 'We don\'t use cookies or analytics to track users.' },
                            { icon: 'cloud_off', title: 'No Third-Party Sharing', desc: 'Your content is never shared with advertisers or third parties.' },
                            { icon: 'lock', title: 'Encrypted Transfer', desc: 'All data is transmitted securely via HTTPS.' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                backgroundColor: '#111827', padding: '20px', borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.06)'
                            }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#3b82f6', marginBottom: '12px', display: 'block' }}>{item.icon}</span>
                                <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{item.title}</h3>
                                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* API Usage */}
                <section style={{ marginBottom: '48px', animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '28px' }}>api</span>
                        Third-Party Services
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px' }}>
                        To provide our analysis, we use the following third-party APIs:
                    </p>
                    <ul style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 2, paddingLeft: '24px' }}>
                        <li><strong style={{ color: '#d1d5db' }}>Google Gemini AI</strong> - For content classification (subject to Google's privacy policy)</li>
                        <li><strong style={{ color: '#d1d5db' }}>Google Fact Check API</strong> - For fact-check database queries (subject to Google's privacy policy)</li>
                    </ul>
                    <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '16px' }}>
                        Note: Content submitted for analysis may be processed by these services. Please review their respective privacy policies.
                    </p>
                </section>

                {/* Contact */}
                <section style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#a78bfa', fontSize: '28px' }}>mail</span>
                        Questions?
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.7 }}>
                        If you have any questions about our privacy practices, please reach out to us at{' '}
                        <span style={{ color: '#60a5fa' }}>privacy@credireader.com</span>
                    </p>
                    <p style={{ color: '#4b5563', fontSize: '13px', marginTop: '24px' }}>
                        Last updated: December 2025
                    </p>
                </section>
            </main>
        </div>
    );
}
