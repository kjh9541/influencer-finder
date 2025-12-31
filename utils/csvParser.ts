import Papa from 'papaparse';
import { Influencer } from '../types';

interface RawInfluencerData {
    // We can't rely on strict key names due to BOM or encoding.
    // We will cast to any and search for keys.
    [key: string]: string | undefined;
}

export const parseCSV = async (url: string): Promise<Influencer[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data = results.data as RawInfluencerData[];

                if (data.length === 0) {
                    resolve([]);
                    return;
                }

                // Find the key for "Account Name" (full-name)
                // It might be '계정(full-name)' or '\ufeff계정(full-name)' or similar.
                const sampleItem = data[0];
                const keys = Object.keys(sampleItem);
                const nameKey = keys.find(k => k.includes('계정') || k.includes('full-name'));
                const idKey = keys.find(k => k.includes('아이디') || k.toLowerCase().includes('id'));
                const categoryKey = keys.find(k => k.includes('카테고리'));
                const followersKey = keys.find(k => k.includes('팔로워'));

                const formattedData: Influencer[] = data.map((item) => {
                    const rawName = nameKey ? item[nameKey] : undefined;
                    const rawId = idKey ? item[idKey] : (item['아이디'] || item['id'] || '');

                    // If name is missing or empty, fallback to ID
                    const name = rawName && rawName.trim() !== '' ? rawName : rawId;

                    return {
                        name: name || 'Unknown',
                        instagram_id: rawId || '',
                        category: (categoryKey ? item[categoryKey] : item['카테고리']) || 'Uncategorized',
                        followers: Number(String((followersKey ? item[followersKey] : item['팔로워']) || '0').replace(/,/g, '')),
                        contact: '',
                    };
                }).filter(item => item.instagram_id);

                resolve(formattedData);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
