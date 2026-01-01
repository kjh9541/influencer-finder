'use client';

import { useState, useEffect } from 'react';
import { User, Instagram, ExternalLink, Check } from 'lucide-react';
import { Influencer } from '@/types';
import { useInfluencerStore } from '@/store/useInfluencerStore';

interface Props {
    data: Influencer;
}

const formatFollowers = (num: number) => {
    if (num >= 10000) {
        // Format to 1 decimal place, convert to '만' (ten thousand)
        // Remove trailing .0 if present (e.g., 6.0만 -> 6만) - optional but cleaner
        // User example '6.8만' suggests keeping decimal.
        return (num / 10000).toFixed(1).replace(/\.0$/, '') + '만';
    }
    return num.toLocaleString();
};

export default function InfluencerCard({ data }: Props) {
    // Use local image path directly
    const imagePath = `/images/profiles/${data.instagram_id}.jpg`;
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const { selectedIds, toggleSelection } = useInfluencerStore();
    const isSelected = selectedIds.includes(data.instagram_id);

    // Reset state when data changes
    useEffect(() => {
        setImageError(false);
        setImageLoaded(false);
    }, [data.instagram_id]);

    const handleIdClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Link navigation happens naturally or via window.open if needed, 
        // but since it is an anchor tag, browser handles it.
    };

    return (
        <div
            className={`relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center border group cursor-pointer ${isSelected ? 'border-pink-500 ring-2 ring-pink-500 ring-opacity-10' : 'border-gray-100'
                }`}
            onClick={() => toggleSelection(data.instagram_id)}
        >
            <div className="absolute top-3 right-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-pink-500 border-pink-500' : 'border-gray-200 bg-white'
                    }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
            </div>

            <div className="relative w-24 h-24 mb-4">
                <div className={`w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-transparent group-hover:border-pink-500 transition-colors duration-300`}>
                    {!imageError ? (
                        <>
                            {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-gray-200" />}
                            <img
                                src={imagePath}
                                alt={data.name}
                                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                            />
                        </>
                    ) : (
                        <User className="w-10 h-10 text-gray-400" />
                    )}
                </div>
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm border border-gray-100">
                    <Instagram className="w-4 h-4 text-pink-500" />
                </div>
            </div>

            <h3 className="font-bold text-lg text-gray-800 text-center mb-1">{data.name}</h3>
            <a
                href={`https://instagram.com/${data.instagram_id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleIdClick}
                className="text-sm text-gray-500 hover:text-pink-600 flex items-center gap-1 mb-3 transition-colors z-10"
            >
                @{data.instagram_id}
                <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                {data.category.split(/\s+/).filter(Boolean).map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="w-full flex justify-between items-center border-t pt-4 mt-auto">
                <div className="text-center w-full">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Followers</p>
                    <p className="font-bold text-gray-800">{formatFollowers(data.followers)}</p>
                </div>
            </div>
        </div>
    );
}
