import { FeedingType } from './types/feedingRecord.type';

export const typeColors: Record<FeedingType, string> = {
  breastmilk: '#4EB6AC',
  formula: '#FFD700',
  solid: '#FF7F50',
};

export const typeLabels: Record<FeedingType, string> = {
  breastmilk: 'Breastfeeding',
  formula: 'Bottle (Formula)',
  solid: 'Solid Food',
};
