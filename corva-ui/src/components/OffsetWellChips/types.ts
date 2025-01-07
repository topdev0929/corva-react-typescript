import { MouseEvent } from 'react';

export interface ChipProps<T> {
  title: string;
  isSubject?: boolean;
  maxWidth?: number;
  onClick?: (e: MouseEvent<HTMLDivElement>, wellId: T) => void;
  markColor?: string;
  rigName?: string;
  wellId: T;
  onRemoveOffsetWell?: (wellId: T) => void;
  isShowMark?: boolean;
}
export interface ChipsContainerProps<T> {
  wells: ChipProps<T>[];
  maxWidth?: number;
  onRemoveOffsetWell?: (wellId: T) => void;
  isShowMark?: boolean;
  onChipClick: (e: MouseEvent<HTMLDivElement>, wellId: T) => void;
  chipsContainerClassName: string;
}

export interface StyleProps {
  markColor: string;
  isShowMark: boolean;
}
