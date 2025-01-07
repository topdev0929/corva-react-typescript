import classNames from 'classnames';
import { noop } from 'lodash';
import { Modal as MUIModal } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

import { isMobileDetected, isNativeDetected } from '~/utils/mobileDetect';
import { MOBILE_MODAL_TYPES, ModalProps } from '~/components/Modal/types';
import IconButton from '~/components/IconButton';

import styles from './CorvaModal.css';

const DEFAULT_TITLES = {
  [MOBILE_MODAL_TYPES.FILTERS]: 'Filters',
  [MOBILE_MODAL_TYPES.SETTINGS]: 'Settings',
};

export function CorvaModal({
  actions,
  actionsClassName,
  children,
  contentClassName,
  contentContainerClassName,
  isCloseIconHidden = false,
  isMobile = isMobileDetected,
  isNative = isNativeDetected,
  modalTitleClassName,
  closeIconClassName,
  onClose = noop,
  open,
  rootClassName,
  size,
  stickyFooterClassName,
  title,
  type,
  'data-testid': PAGE_NAME = 'CorvaModal',
  ...otherProps
}: ModalProps): JSX.Element {
  const isMobileOrNative = isNative || isMobile;
  const modalTitle = title || DEFAULT_TITLES[type];

  return (
    <MUIModal
      open={open}
      onClose={onClose}
      className={classNames(!isMobileOrNative && 'c-modal', styles.modalWrapper, rootClassName)}
      {...otherProps}
    >
      <div
        className={classNames({
          [styles.modalContainer]: true,
          [styles.modalContainerMobile]: isMobileOrNative,
          [styles[size]]: true,
          [contentContainerClassName]: true,
        })}
      >
        {modalTitle && (
          <div
            className={classNames(
              styles.title,
              isMobileOrNative && styles.titleMobile,
              modalTitleClassName
            )}
          >
            <div className={classNames(styles.titleText)}>{modalTitle}</div>
            {(!isCloseIconHidden || type) && (
              <IconButton
                className={closeIconClassName}
                tooltipProps={{ title: 'Close' }}
                onClick={onClose}
                data-testid={`${PAGE_NAME}_closeButton`}
              >
                <CloseIcon />
              </IconButton>
            )}
          </div>
        )}

        {children && (
          <div
            className={classNames(
              styles.modalContent,
              isMobileOrNative && styles.modalContentMobile,
              contentClassName
            )}
          >
            {children}
          </div>
        )}

        {actions && (
          <div
            className={classNames(
              styles.modalActions,
              isMobileOrNative && styles.modalActionsMobile,
              stickyFooterClassName,
              actionsClassName
            )}
          >
            {actions}
          </div>
        )}
      </div>
    </MUIModal>
  );
}
