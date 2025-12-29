import Papa from 'papaparse';
import { Influencer } from '../types';

interface RawInfluencerData {
    아이디: string;
    태그: string;
    카테고리: string;
    팔로워: string;
    URL?: string; // Optional as it might be missing or different
}

export const parseCSV = async (url: string): Promise<Influencer[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as RawInfluencerData[];

                const formattedData: Influencer[] = data.map((item) => {
                    // Normalize Category (take first if multiple, or keep all?) 
                    // User data has "문구/완구 일상", I will keep it as is or maybe format it better later.
                    // For now, mapping directly.

                    return {
                        name: item.아이디, // Use ID as name for now as there is no separate name
                        instagram_id: item.아이디,
                        category: item.카테고리 || 'Uncategorized',
                        followers: Number(String(item.팔로워).replace(/,/g, '')),
                        contact: '', // Not in data
                        // Extra fields if we want them later
                    };
                }).filter(item => item.instagram_id); // Filter out empty rows if any

                resolve(formattedData);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
