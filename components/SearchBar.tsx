'use client';

import { Search, Users } from 'lucide-react';
import { useInfluencerStore } from '@/store/useInfluencerStore';
import { useState, useEffect } from 'react';

export default function SearchBar() {
    const { searchQuery, setSearchQuery, minFollowers, setMinFollowers } = useInfluencerStore();

    // Local state to prevent debounce lag on UI
    const [localMin, setLocalMin] = useState<string>('');

    useEffect(() => {
        if (minFollowers > 0) {
            setLocalMin(minFollowers.toString());
        } else {
            setLocalMin('');
        }
    }, [minFollowers]);

    const handleMinFollowersChange = (val: string) => {
        setLocalMin(val);
        const num = Number(val.replace(/[^0-9]/g, ''));
        setMinFollowers(num);
    };

    return (
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-sm transition-all text-black shadow-sm"
                    placeholder="Search name, ID, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Min Followers Input */}
            <div className="relative w-full md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white text-sm transition-all text-black shadow-sm"
                    placeholder="Min Followers (e.g. 10000)"
                    value={localMin}
                    onChange={(e) => handleMinFollowersChange(e.target.value)}
                />
            </div>
        </div>
    );
}
