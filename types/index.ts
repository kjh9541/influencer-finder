export interface Influencer {
  name: string;
  instagram_id: string;
  category: string;
  followers: number;
  contact: string;
}

export interface InfluencerData {
  name: string;
  instagram_id: string;
  category: string;
  followers: string | number; // CSV might read as string initially
  contact: string;
}
