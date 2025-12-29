'use client';

import { useInfluencerStore } from '@/store/useInfluencerStore';


export default function CategoryFilter() {
    const { categories, selectedCategory, setCategory } = useInfluencerStore();

    if (categories.length === 0) return null;

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                        ? 'bg-black text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
