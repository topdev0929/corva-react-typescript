import { useContext } from 'react';

import { CalendarContext } from './context';

export const useCalendarStore = () => {
  return useContext(CalendarContext);
};
