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
            // Extract individual categories from space-separated strings
            const allCategories = data.flatMap(i => i.category.split(/\s+/).filter(Boolean));
            const uniqueCategories = Array.from(new Set(allCategories)).sort();

            set({
                influencers: data,
                categories: ['All', ...uniqueCategories],
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
            result = result.filter((i) => i.category.split(/\s+/).includes(selectedCategory));
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
