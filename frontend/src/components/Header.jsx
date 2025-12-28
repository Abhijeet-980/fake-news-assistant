/**
 * Header Component
 * Clean navigation header matching CrediReader design
 */
import React from 'react';

export default function Header({ onNewAnalysis, showNewButton = false }) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0a0e17]/90 backdrop-blur-md">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6 max-w-5xl mx-auto w-full">
                {/* Logo */}
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                        <span className="material-symbols-outlined text-white text-lg">verified_user</span>
                    </div>
                    <span className="text-white text-base font-bold tracking-tight">CrediReader</span>
                </div>

                {/* Navigation - Hidden on mobile */}
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">About</a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Methodology</a>
                    <a href="#" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Privacy</a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {showNewButton ? (
                        <>
                            <button className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors">
                                <span className="material-symbols-outlined text-lg">history</span>
                                History
                            </button>
                            <button
                                onClick={onNewAnalysis}
                                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span className="hidden sm:inline">New Analysis</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="hidden sm:block text-gray-400 hover:text-white text-sm font-medium transition-colors">
                                Sign In
                            </button>
                            <button className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors border border-gray-700">
                                Get Extension
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
