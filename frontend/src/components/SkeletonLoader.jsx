/**
 * SkeletonLoader Component
 * Displays animated skeleton placeholders during loading
 */
import React from 'react';

export function SkeletonText({ width = '100%', height = '16px' }) {
    return (
        <div
            className="skeleton"
            style={{ width, height, marginBottom: '8px' }}
        />
    );
}

export function SkeletonCircle({ size = 80 }) {
    return (
        <div
            className="skeleton skeleton-circle"
            style={{ width: size, height: size }}
        />
    );
}

export function SkeletonCard({ children }) {
    return (
        <div className="skeleton-card skeleton-pulse">
            {children}
        </div>
    );
}

/**
 * Results Page Skeleton - Shows while waiting for analysis
 */
export function ResultsSkeleton() {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#080c14',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Header Skeleton */}
            <div style={{ width: '100%', maxWidth: '900px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SkeletonText width="200px" height="32px" />
                    <SkeletonText width="120px" height="40px" />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{
                width: '100%',
                maxWidth: '900px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px'
            }}>
                {/* Left Column - Score */}
                <SkeletonCard>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <SkeletonCircle size={140} />
                        <SkeletonText width="60%" height="24px" />
                        <SkeletonText width="80%" height="16px" />
                        <SkeletonText width="70%" height="16px" />
                    </div>
                </SkeletonCard>

                {/* Right Column - Details */}
                <SkeletonCard>
                    <SkeletonText width="40%" height="20px" />
                    <div style={{ marginTop: '16px' }}>
                        <SkeletonText width="100%" height="14px" />
                        <SkeletonText width="90%" height="14px" />
                        <SkeletonText width="95%" height="14px" />
                        <SkeletonText width="70%" height="14px" />
                    </div>
                </SkeletonCard>

                {/* Analysis Breakdown */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <SkeletonCard>
                        <SkeletonText width="30%" height="20px" />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                    <SkeletonText width="60%" height="16px" />
                                    <SkeletonText width="40%" height="24px" />
                                </div>
                            ))}
                        </div>
                    </SkeletonCard>
                </div>

                {/* Reasons Section */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <SkeletonCard>
                        <SkeletonText width="25%" height="20px" />
                        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <SkeletonCircle size={32} />
                                    <div style={{ flex: 1 }}>
                                        <SkeletonText width="30%" height="14px" />
                                        <SkeletonText width="80%" height="12px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SkeletonCard>
                </div>
            </div>

            {/* Loading message */}
            <div style={{
                marginTop: '32px',
                textAlign: 'center',
                color: '#6b7280'
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '999px',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        animation: 'pulse 1s infinite'
                    }} />
                    <span style={{ fontSize: '13px', color: '#3b82f6' }}>
                        Preparing your analysis results...
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ResultsSkeleton;
