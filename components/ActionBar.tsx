'use client';

import { useInfluencerStore } from '@/store/useInfluencerStore';
import { Send, X } from 'lucide-react';

export default function ActionBar() {
    const { selectedIds, clearSelection } = useInfluencerStore();

    if (selectedIds.length === 0) return null;

    const handleSendDM = () => {
        // Collect all selected IDs
        // Instagram Direct Message Link: https://www.instagram.com/direct/t/{thread_id} 
        // But we don't have thread IDs. We can only open profile or use deep links via mobile if supported.
        // Web doesn't support "compose to multiple" easily via URL.
        // For now, we will open the first one or just alert, but usually "Send DM" means opening a generic inbox or trying to start a chat.
        // Actually, user standard behavior for these tools is often copying the list OR opening tabs.
        // "Send DM" to mulitple is not supported by IG web URL scheme directly as a batch.
        // I will construct a list or open the inbox.
        // Let's copy the IDs to clipboard for now as a useful action, OR open the inbox.
        // Wait, requirement is "Make checkbox area clickable to select influencers for batch actions... Send DM button functionality... check box area clickable to select...".
        // I will make it open the IG DM inbox for now, or maybe generate a list.
        // Let's stick to a simple action: Open IG Inbox.
        window.open('https://www.instagram.com/direct/inbox/', '_blank');
    };

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50 animate-fade-in-up">
            <div className="flex items-center gap-2">
                <span className="font-bold text-pink-500">{selectedIds.length}</span>
                <span className="text-sm">selected</span>
            </div>
            <div className="h-4 w-px bg-gray-700" />
            <button
                onClick={handleSendDM}
                className="flex items-center gap-2 hover:text-pink-400 transition-colors text-sm font-medium"
            >
                <Send className="w-4 h-4" />
                Send DM
            </button>
            <button
                onClick={clearSelection}
                className="ml-2 hover:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
