import { CSSProperties } from 'react';

export const styles = {
  wrapper: {
    backgroundColor: 'rgba(65, 65, 65, 1)',
    borderRadius: '22px',
  },
  flex: {
    display: 'flex',
  },
};

export const getStyles = (
  active: boolean,
  hasTLBorder: boolean,
  hasBRBorder: boolean
): CSSProperties => ({
  padding: '11px 8px 11px 8px',
  fontFamily: 'Roboto',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '16px',
  letterSpacing: '0px',
  textAlign: 'center',
  flexBasis: 'fit-content',
  cursor: 'pointer',
  backgroundColor: active ? 'rgba(3, 188, 212, 1)' : 'rgba(65, 65, 65, 1)',
  color: active ? 'rgba(255, 255, 255, 1)' : 'rgba(189, 189, 189, 1)',
  ...(hasTLBorder && { borderRadius: '22px 0 0 22px' }),
  ...(hasBRBorder && { borderRadius: '0 22px 22px 0' }),
});
