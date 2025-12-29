'use client';

import { useEffect } from 'react';
import { useInfluencerStore } from '@/store/useInfluencerStore';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import SortDropdown from '@/components/SortDropdown';
import InfluencerGrid from '@/components/InfluencerGrid';
import ActionBar from '@/components/ActionBar';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const loadData = useInfluencerStore((state) => state.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-pink-500 to-violet-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Influencer Finder
              </h1>
            </div>

            <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <CategoryFilter />
          <div className="ml-auto">
            <SortDropdown />
          </div>
        </div>

        {/* Grid */}
        <InfluencerGrid />

        {/* Floating Action Bar */}
        <ActionBar />

      </div>
    </main>
  );
}
