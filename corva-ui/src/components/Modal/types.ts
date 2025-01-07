import { ReactNode } from 'react';
import { ModalProps as MUIModalProps } from '@material-ui/core/Modal/Modal';

export enum MOBILE_MODAL_TYPES {
  FILTERS = 'filters',
  SETTINGS = 'settings',
}
export interface ModalProps extends Omit<MUIModalProps, 'type' | 'onClose' | 'title' | 'children'> {
  actions?: ReactNode;
  actionsClassName?: string;
  children: ReactNode;
  contentClassName?: string;
  contentContainerClassName?: string;
  isCloseIconHidden?: boolean;
  isMobile?: boolean;
  isNative?: boolean;
  modalTitleClassName?: string;
  closeIconClassName?: string;
  onClose: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void;
  rootClassName?: string;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  stickyFooter?: boolean;
  stickyFooterClassName?: string;
  title?: string | ReactNode;
  type?: MOBILE_MODAL_TYPES;
  'data-testid'?: string;
}
