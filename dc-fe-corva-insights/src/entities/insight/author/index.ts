import { User } from '@/entities/user';

export * from './helpers';

export type InsightAuthor = Omit<User, 'companyId'>;
