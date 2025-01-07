import { BHA } from '@/entities/bha';

const parseBHAFromJson = (obj: any): BHA => {
  return {
    id: obj._id,
    name: obj._id,
    timestamp: obj.timestamp,
  };
};

export const parseBHAsFromJson = (list: any[]): BHA[] => {
  return list.map(item => parseBHAFromJson(item));
};
