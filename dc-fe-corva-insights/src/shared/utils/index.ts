import moment from 'moment';
import { DateRange } from '@/shared/types';

const MS_IN_SEC = 1000;
export const OFFICE_FILE_EXTENSIONS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

export const getDateFromStr = (datetime: string): moment.Moment => {
  return moment(datetime);
};

export const getDateFromMs = (timestampInMs: number): moment.Moment => {
  return moment(timestampInMs);
};

export const formatDate = (date: Date, format: string): string => {
  return moment(date).format(format);
};

export const getSecTimestamp = (): number => {
  return Math.floor(Date.now() / MS_IN_SEC);
};

export const getDaysInRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  const newStart = new Date(start);

  while (newStart <= end) {
    dates.push(new Date(newStart));
    newStart.setDate(newStart.getDate() + 1);
  }

  return dates;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isDayInRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export function getStartOfCalendarMonth(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  return new Date(year, month, 1 - firstDayOfMonth.getDay());
}

export function getEndOfCalendarMonth(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth();

  const lastDayOfMonth = new Date(year, month + 1, 0);
  return new Date(year, month + 1, 6 - lastDayOfMonth.getDay(), 23, 59, 59);
}

export const getDaysForCalendarMonth = (date: Date): Date[] => {
  const firstDayOfCalendarMonth = getStartOfCalendarMonth(date);
  const lastDayOfCalendarMonth = getEndOfCalendarMonth(date);
  return getDaysInRange(firstDayOfCalendarMonth, lastDayOfCalendarMonth);
};

export function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getEndOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}

export function addDays(date: Date, days: number): Date {
  if (days < 0) return date;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  );
}

export function isSameYear(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear();
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return isSameYear(date1, date2) && date1.getMonth() === date2.getMonth();
}

export function splitDateRangeInTwoByYears(range: DateRange): DateRange[] {
  const { start, end } = range;

  if (isSameYear(start, end)) {
    return [range];
  }

  const endOfPrevYear = new Date(start.getFullYear(), 11, 31, 23, 59, 59);
  const startOfNextYear = new Date(endOfPrevYear.getFullYear() + 1, 0, 1);

  return [
    { start, end: endOfPrevYear },
    { start: startOfNextYear, end },
  ];
}

export function getFileExtension(fileName: string): string {
  const separatedFileName = fileName.split('.');
  if (separatedFileName.length < 2) return '';
  return fileName.split('.').pop() ?? '';
}

export function getFileViewerLink(fileName: string, fileUrl: string): string {
  const extension = getFileExtension(fileName);
  const isOfficeFile = OFFICE_FILE_EXTENSIONS.includes(extension);

  return isOfficeFile
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${window.encodeURIComponent(fileUrl)}`
    : `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
}

export function getImageSize(src: string): Promise<{ width: number; height: number }> {
  const defaultSize = { width: 50, height: 50 };
  return new Promise(resolve => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve(defaultSize);
  });
}

export function getFileFromUrl(url: string): Promise<Blob> {
  return fetch(url).then(res => res.blob());
}

export function getTwoListsDifference<T extends { id: string | number }>(
  list1: T[],
  list2: T[]
): T[] {
  return list1.filter(item => !list2.some(listItem => listItem.id === item.id));
}

export function removeOpacityFromRGB(rgb: string): string {
  const isContainOpacity = rgb.split(',').length === 4;
  if (!isContainOpacity) return rgb;
  return rgb.replace('rgba', 'rgb').replace(/,\s?[\d.]+\)/, ')');
}

type User = {
  firstName: string;
  lastName: string;
};
function getUserName(user: User, modificator: (user: User) => string) {
  if (!user.firstName && !user.lastName) return 'Unknown User';
  if (!user.firstName) return user.lastName;
  if (!user.lastName) return user.firstName;
  return modificator(user);
}

export function getUserFullName(user: User): string {
  return getUserName(user, ({ firstName, lastName }) => `${firstName} ${lastName}`);
}

export function getUserShortName(user: User): string {
  return getUserName(user, ({ firstName, lastName }) => `${firstName.charAt(0)}.${lastName}`);
}

export async function asyncMap<Item>(list: Item[], callback: (insight: Item) => Promise<Item>) {
  return Promise.all(list.map(callback));
}
