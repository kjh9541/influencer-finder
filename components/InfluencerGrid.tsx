'use client';

import { useInfluencerStore } from '@/store/useInfluencerStore';
import InfluencerCard from './InfluencerCard';

export default function InfluencerGrid() {
    const { filteredInfluencers, isLoading, error } = useInfluencerStore();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white h-64 rounded-xl animate-pulse shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4" />
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-20 bg-gray-200 rounded mb-4" />
                        <div className="h-6 w-16 bg-gray-200 rounded-full" />
                        <div className="mt-auto h-8 w-full bg-gray-200 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-black text-white rounded-lg">Retry</button>
            </div>
        );
    }

    if (filteredInfluencers.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No influencers found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20">
            {filteredInfluencers.map((influencer, idx) => (
                <InfluencerCard key={`${influencer.instagram_id}-${idx}`} data={influencer} />
            ))}
        </div>
    );
}
