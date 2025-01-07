export * from './helpers';

export type BHA = {
  id: string;
  name: string;
  timestamp: number;
};

export type BHAOption = {
  value: string;
  label: string;
};

export type BHAsMap = Map<string, boolean>;
