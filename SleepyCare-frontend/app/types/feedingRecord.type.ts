export type FeedingType = 'breastmilk' | 'formula' | 'solid';

export interface FeedingRecord {
  id: string;
  time: string; 
  amount: number;
  type: FeedingType;
}
