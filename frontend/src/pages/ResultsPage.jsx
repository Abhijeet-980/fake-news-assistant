/**
 * ResultsPage Component
 * Clean results page with score left, details right
 * Shows URL fetch status and errors clearly
 */
import React, { useState } from 'react';
import ScoreCircle from '../components/ScoreCircle';

export default function ResultsPage({ result, inputText, onNewAnalysis }) {
    const { score, statusLabel, statusColor, summary, reasons, thinkingPrompts, recommendation, searchUrl, urlData, fetchedContent } = result;

    const getStatusIcon = () => statusColor === 'green' ? 'verified' : statusColor === 'yellow' ? 'warning' : 'error';
    const getReasonIcon = (type) => type === 'positive' ? 'check_circle' : type === 'warning' ? 'sentiment_worried' : type === 'negative' ? 'cancel' : 'schedule';
    const getReasonColor = (type) => type === 'positive' ? '#22c55e' : type === 'warning' ? '#eab308' : type === 'negative' ? '#ef4444' : '#3b82f6';

    const isUrl = urlData && urlData.originalUrl;
    const fetchFailed = urlData && urlData.fetchError;
    const fetchSucceeded = fetchedContent && fetchedContent.title;

    const getTextPreview = () => {
        if (fetchSucceeded && fetchedContent.title) {
            return fetchedContent.title.length <= 60 ? fetchedContent.title : fetchedContent.title.substring(0, 60) + '...';
        }
        return inputText.length <= 60 ? inputText : inputText.substring(0, 60) + '...';
    };

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span className="material-symbols-outlined" style={{ color: '#6b7280', fontSize: '18px' }}>{isUrl ? 'link' : 'article'}</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Analysis Result</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                            <span style={{ fontSize: '11px', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase' }}>New • Just Now</span>
                        </div>
                        {fetchSucceeded && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#3b82f6' }}>cloud_done</span>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase' }}>{fetchedContent.wordCount} words fetched</span>
                            </div>
                        )}
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>"{getTextPreview()}"</h1>
                    {isUrl && (
                        <a href={urlData.originalUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: '#3b82f6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                            {urlData.originalUrl.substring(0, 60)}{urlData.originalUrl.length > 60 ? '...' : ''}
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                        </a>
                    )}
                </div>

                {/* URL Fetch Error Banner */}
                {fetchFailed && (
                    <div style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.3)', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(251,146,60,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ color: '#fb923c', fontSize: '20px' }}>cloud_off</span>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fb923c', marginBottom: '4px' }}>Could Not Fetch Article Content</h4>
                            <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5, marginBottom: '8px' }}>
                                {urlData.fetchError}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                <strong>Tip:</strong> Try copying and pasting the article text directly for a more accurate analysis.
                            </p>
                        </div>
                    </div>
                )}

                {/* Fetched Content Info */}
                {fetchSucceeded && (
                    <div style={{ marginBottom: '24px', padding: '16px 20px', backgroundColor: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <span className="material-symbols-outlined" style={{ color: '#22c55e', fontSize: '18px' }}>check_circle</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e' }}>Article Content Retrieved Successfully</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                            <span><strong>Words:</strong> {fetchedContent.wordCount}</span>
                            {fetchedContent.author && <span><strong>Author:</strong> {fetchedContent.author}</span>}
                            {fetchedContent.publishedDate && <span><strong>Published:</strong> {fetchedContent.publishedDate}</span>}
                        </div>
                    </div>
                )}

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

                        {/* Fact-Check Section */}
                        {result.factChecks && (
                            <div style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ color: '#a855f7', fontSize: '18px' }}>fact_check</span>
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Fact-Check Resources</h3>
                                </div>

                                {/* Found Fact-Checks */}
                                {result.factChecks.results && result.factChecks.results.length > 0 && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#a855f7', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Related Fact-Checks Found</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {result.factChecks.results.slice(0, 3).map((fc, i) => (
                                                <a key={i} href={fc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '12px', backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                                                    <span className="material-symbols-outlined" style={{ color: fc.ratingColor || '#6b7280', fontSize: '20px', marginTop: '2px' }}>{fc.ratingIcon || 'info'}</span>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>{fc.claim?.substring(0, 100) || 'Related claim'}</p>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                            <span style={{ fontSize: '12px', fontWeight: '600', color: fc.ratingColor || '#6b7280', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>{fc.rating || 'View Rating'}</span>
                                                            <span style={{ fontSize: '12px', color: '#6b7280' }}>by {fc.publisher || 'Fact-checker'}</span>
                                                        </div>
                                                    </div>
                                                    <span className="material-symbols-outlined" style={{ color: '#6b7280', fontSize: '18px' }}>open_in_new</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Search Links */}
                                {result.factChecks.searchUrls && result.factChecks.searchUrls.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Search Fact-Checking Sites</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                            {result.factChecks.searchUrls.slice(0, 6).map((link, i) => (
                                                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#0d1117', border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', fontSize: '13px', color: '#9ca3af' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a855f7' }}>{link.icon}</span>
                                                    <span>{link.name}</span>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '14px', marginLeft: 'auto', color: '#4b5563' }}>open_in_new</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
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

                {/* Image Verification */}
                {result.imageAnalysis && result.imageAnalysis.enabled && (
                    <ImageVerification imageAnalysis={result.imageAnalysis} />
                )}

                {/* Share Card */}
                <ShareCard score={score} statusLabel={statusLabel} statusColor={statusColor} inputText={inputText} fetchedContent={fetchedContent} urlData={urlData} />
            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#4b5563' }}>
                    <span>© 2025 CrediReader. AI-powered analysis.</span>
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

// ShareCard Component
function ShareCard({ score, statusLabel, statusColor, inputText, fetchedContent, urlData }) {
    const [copied, setCopied] = useState(false);

    const getTitle = () => {
        if (fetchedContent?.title) return fetchedContent.title.substring(0, 100);
        return inputText.substring(0, 100);
    };

    const newsUrl = urlData?.originalUrl || '';
    const shareText = newsUrl
        ? `I just verified this news with CrediReader!\n\n📊 Score: ${score}/100 (${statusLabel})\n📰 "${getTitle()}..."\n🔗 News: ${newsUrl}\n\n🔍 Verify news at CrediReader!`
        : `I just verified this content with CrediReader!\n\n📊 Score: ${score}/100 (${statusLabel})\n📰 "${getTitle()}..."\n\n🔍 Verify content at CrediReader!`;
    const shareUrl = window.location.href;

    const shareLinks = [
        {
            name: 'Twitter',
            icon: '𝕏',
            color: '#000000',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'WhatsApp',
            icon: 'chat',
            color: '#25D366',
            url: `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`
        },
        {
            name: 'Facebook',
            icon: 'share',
            color: '#1877F2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
        },
        {
            name: 'LinkedIn',
            icon: 'work',
            color: '#0A66C2',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareText + '\n\n' + shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            marginTop: '24px',
            backgroundColor: '#111827',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '24px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: 'rgba(96,165,250,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span className="material-symbols-outlined" style={{ color: '#60a5fa', fontSize: '18px' }}>share</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Share This Analysis</h3>
            </div>

            {/* Share Preview Card */}
            <div style={{
                backgroundColor: '#0d1117',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '10px',
                        backgroundColor: statusColor === 'green' ? 'rgba(34,197,94,0.2)' : statusColor === 'red' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: statusColor === 'green' ? '#22c55e' : statusColor === 'red' ? '#ef4444' : '#eab308' }}>{score}</span>
                    </div>
                    <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: 'white' }}>Credibility Score: {score}/100</p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>{statusLabel}</p>
                    </div>
                </div>
                <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.5 }}>
                    "{getTitle()}..."
                </p>
            </div>

            {/* Share Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {shareLinks.map((link, i) => (
                    <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 16px', borderRadius: '10px',
                            backgroundColor: '#1f2937',
                            border: '1px solid rgba(255,255,255,0.08)',
                            textDecoration: 'none',
                            fontSize: '13px', fontWeight: '500',
                            color: 'white',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = link.color;
                            e.currentTarget.style.borderColor = link.color;
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = '#1f2937';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                        }}
                    >
                        {link.icon === '𝕏' ? (
                            <span style={{ fontWeight: '700', fontSize: '16px' }}>𝕏</span>
                        ) : (
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{link.icon}</span>
                        )}
                        {link.name}
                    </a>
                ))}

                {/* Copy Link Button */}
                <button
                    onClick={copyToClipboard}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 16px', borderRadius: '10px',
                        backgroundColor: copied ? '#22c55e' : '#1f2937',
                        border: '1px solid rgba(255,255,255,0.08)',
                        fontSize: '13px', fontWeight: '500',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {copied ? 'check' : 'content_copy'}
                    </span>
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>
        </div>
    );
}

// ImageVerification Component
function ImageVerification({ imageAnalysis }) {
    const { images, summary } = imageAnalysis;

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div style={{
            marginTop: '24px',
            backgroundColor: '#111827',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '24px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: summary.suspiciousCount > 0 ? 'rgba(239,68,68,0.1)' :
                        summary.recycledCount > 0 ? 'rgba(251,146,60,0.1)' :
                            summary.wirePhotoCount > 0 ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span className="material-symbols-outlined" style={{
                        color: summary.suspiciousCount > 0 ? '#ef4444' :
                            summary.recycledCount > 0 ? '#fb923c' :
                                summary.wirePhotoCount > 0 ? '#3b82f6' : '#22c55e',
                        fontSize: '18px'
                    }}>
                        {summary.suspiciousCount > 0 ? 'warning' :
                            summary.recycledCount > 0 ? 'image_search' :
                                summary.wirePhotoCount > 0 ? 'photo_camera' : 'verified'}
                    </span>
                </div>
                <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white' }}>Image Verification</h3>
                    <p style={{
                        fontSize: '12px', color: summary.suspiciousCount > 0 ? '#ef4444' :
                            summary.recycledCount > 0 ? '#fb923c' :
                                summary.wirePhotoCount > 0 ? '#3b82f6' : '#22c55e'
                    }}>
                        {summary.message}
                    </p>
                </div>
            </div>

            {/* Image List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {images.map((img, i) => (
                    <div key={i} style={{
                        backgroundColor: '#0d1117',
                        borderRadius: '12px',
                        padding: '14px',
                        border: img.isRecycled ? '1px solid rgba(251,146,60,0.3)' : '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ display: 'flex', gap: '14px' }}>
                            {/* Thumbnail */}
                            <img
                                src={img.imageUrl}
                                alt="Article image"
                                style={{
                                    width: '80px', height: '60px',
                                    objectFit: 'cover', borderRadius: '8px',
                                    backgroundColor: '#1f2937'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />

                            <div style={{ flex: 1 }}>
                                {/* Status Badge - Context aware */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                    {img.context === 'suspicious' ? (
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            backgroundColor: 'rgba(239,68,68,0.2)',
                                            padding: '4px 10px', borderRadius: '6px',
                                            fontSize: '11px', fontWeight: '600', color: '#ef4444'
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
                                            Suspicious
                                        </span>
                                    ) : img.context === 'wire_photo' ? (
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            backgroundColor: 'rgba(59,130,246,0.2)',
                                            padding: '4px 10px', borderRadius: '6px',
                                            fontSize: '11px', fontWeight: '600', color: '#3b82f6'
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>photo_camera</span>
                                            Wire/Agency Photo
                                        </span>
                                    ) : img.context === 'recycled' ? (
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            backgroundColor: 'rgba(251,146,60,0.2)',
                                            padding: '4px 10px', borderRadius: '6px',
                                            fontSize: '11px', fontWeight: '600', color: '#fb923c'
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>refresh</span>
                                            Reused Image
                                        </span>
                                    ) : (
                                        <span style={{
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            backgroundColor: 'rgba(34,197,94,0.2)',
                                            padding: '4px 10px', borderRadius: '6px',
                                            fontSize: '11px', fontWeight: '600', color: '#22c55e'
                                        }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                                            Original
                                        </span>
                                    )}

                                    {img.bestGuessLabels && img.bestGuessLabels.length > 0 && (
                                        <span style={{ fontSize: '11px', color: '#6b7280' }}>
                                            {img.bestGuessLabels[0]}
                                        </span>
                                    )}
                                </div>

                                {/* Warning message */}
                                {img.recycleWarning && (
                                    <p style={{ fontSize: '13px', color: '#fb923c', marginBottom: '8px' }}>
                                        {img.recycleWarning}
                                    </p>
                                )}

                                {/* Pages where image appeared */}
                                {img.pagesWithMatchingImages && img.pagesWithMatchingImages.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>Also found on:</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {img.pagesWithMatchingImages.slice(0, 3).map((page, j) => (
                                                <a
                                                    key={j}
                                                    href={page.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        fontSize: '11px',
                                                        color: '#60a5fa',
                                                        textDecoration: 'none',
                                                        backgroundColor: 'rgba(96,165,250,0.1)',
                                                        padding: '3px 8px',
                                                        borderRadius: '4px'
                                                    }}
                                                >
                                                    {page.title || new URL(page.url).hostname}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Manual Search Links */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>Manual reverse image search:</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                        href={`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(images[0]?.imageUrl || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: '12px', color: '#9ca3af',
                            textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            backgroundColor: '#1f2937',
                            padding: '6px 10px', borderRadius: '6px'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>search</span>
                        Google Lens
                    </a>
                    <a
                        href={`https://tineye.com/search?url=${encodeURIComponent(images[0]?.imageUrl || '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: '12px', color: '#9ca3af',
                            textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            backgroundColor: '#1f2937',
                            padding: '6px 10px', borderRadius: '6px'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>image_search</span>
                        TinEye
                    </a>
                </div>
            </div>
        </div>
    );
}
