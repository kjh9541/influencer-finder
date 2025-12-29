'use client';

import { useInfluencerStore } from '@/store/useInfluencerStore';
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';

export default function SortDropdown() {
    const { sortBy, setSortBy } = useInfluencerStore();

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
            <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                <button
                    onClick={() => setSortBy('followers-desc')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${sortBy === 'followers-desc' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    title="Most Followers"
                >
                    <ArrowDownWideNarrow className="w-4 h-4" />
                    <span className="hidden sm:inline">High</span>
                </button>
                <button
                    onClick={() => setSortBy('followers-asc')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${sortBy === 'followers-asc' ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    title="Least Followers"
                >
                    <ArrowUpNarrowWide className="w-4 h-4" />
                    <span className="hidden sm:inline">Low</span>
                </button>
            </div>
        </div>
    );
}
