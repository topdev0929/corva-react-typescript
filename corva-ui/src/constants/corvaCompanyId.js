import { isProdEnv, isBetaEnv } from '~/utils/env';

export const CORVA_COMPANY_ID = isProdEnv || isBetaEnv ? 3 : 1;
