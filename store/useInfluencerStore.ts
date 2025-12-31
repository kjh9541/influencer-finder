import { create } from 'zustand';
import { Influencer } from '../types';
import { parseCSV } from '../utils/csvParser';

interface StoreState {
    influencers: Influencer[];
    filteredInfluencers: Influencer[];
    categories: string[];
    searchQuery: string;
    selectedCategory: string;
    minFollowers: number;
    sortBy: 'followers-desc' | 'followers-asc';
    isLoading: boolean;
    error: string | null;

    loadData: () => Promise<void>;
    setSearchQuery: (query: string) => void;
    setCategory: (category: string) => void;
    setMinFollowers: (min: number) => void;
    setSortBy: (sort: 'followers-desc' | 'followers-asc') => void;
    filterAndSort: () => void;
    selectedIds: string[];
    toggleSelection: (id: string) => void;
    clearSelection: () => void;
}

// User specified fixed categories
const FIXED_CATEGORIES = [
    '일상', '식품', '육아', '리빙', '패션',
    '다이어트', '뷰티', '여행', '피트니스', '교육'
];

export const useInfluencerStore = create<StoreState>((set, get) => ({
    influencers: [],
    filteredInfluencers: [],
    categories: [],
    searchQuery: '',
    selectedCategory: 'All',
    minFollowers: 0,
    sortBy: 'followers-desc',
    isLoading: false,
    error: null,
    selectedIds: [],

    toggleSelection: (id) => {
        set((state) => {
            const isSelected = state.selectedIds.includes(id);
            return {
                selectedIds: isSelected
                    ? state.selectedIds.filter(item => item !== id)
                    : [...state.selectedIds, id]
            };
        });
    },

    clearSelection: () => set({ selectedIds: [] }),

    loadData: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await parseCSV('/data.csv');

            // Ignore dynamic categories, use fixed list
            set({
                influencers: data,
                categories: ['All', ...FIXED_CATEGORIES],
                filteredInfluencers: sortData(data, get().sortBy) // Initial sort
            });
        } catch (err: any) {
            set({ error: err.message || 'Failed to load data' });
        } finally {
            set({ isLoading: false });
        }
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterAndSort();
    },

    setCategory: (category) => {
        set({ selectedCategory: category });
        get().filterAndSort();
    },

    setMinFollowers: (min) => {
        set({ minFollowers: min });
        get().filterAndSort();
    },

    setSortBy: (sort) => {
        set({ sortBy: sort });
        get().filterAndSort();
    },

    // Helper to apply all filters and sort
    filterAndSort: () => {
        const { influencers, searchQuery, selectedCategory, minFollowers, sortBy } = get();

        let result = influencers;

        // Filter by Min Followers
        if (minFollowers > 0) {
            result = result.filter((i) => i.followers >= minFollowers);
        }

        // Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter((i) => {
                const catStr = i.category;
                // Special mappings or keyword matching
                if (selectedCategory === '식품') {
                    // Match 식품, F&B, 푸드
                    return catStr.includes('식품') || catStr.includes('F&B') || catStr.includes('푸드');
                }
                if (selectedCategory === '리빙') {
                    return catStr.includes('리빙') || catStr.includes('홈');
                }

                // Fallback: check if the selected category keyword is contained in the influencer's category string
                return catStr.includes(selectedCategory);
            });
        }

        // Filter by Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter((i) =>
                i.name.toLowerCase().includes(lowerQuery) ||
                i.instagram_id.toLowerCase().includes(lowerQuery) ||
                i.category.toLowerCase().includes(lowerQuery)
            );
        }

        // Sort
        result = sortData(result, sortBy);

        set({ filteredInfluencers: result });
    }
}));

// Helper function to sort
const sortData = (data: Influencer[], sortBy: string) => {
    const sorted = [...data];
    if (sortBy === 'followers-desc') {
        sorted.sort((a, b) => b.followers - a.followers);
    } else if (sortBy === 'followers-asc') {
        sorted.sort((a, b) => a.followers - b.followers);
    }
    return sorted;
};
