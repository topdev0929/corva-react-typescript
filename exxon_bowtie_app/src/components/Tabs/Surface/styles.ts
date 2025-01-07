import { CSSProperties } from 'react';

export const styles = {
  preventWrapper: {
    position: 'relative',
    zIndex: 10,
    width: '96%',
    marginTop: '16px',
  } as CSSProperties,
  mitigateWrapper: {
    width: '94%',
    marginTop: '32px',
    marginLeft: 'auto',
    marginBottom: '32px',
  },
  unControlled: {
    marginTop: '32px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  flex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '24px 8px',
    gap: '8px',
  },
  arrowLineLeft: {
    position: 'absolute',
    top: '325px',
    left: '28px',
  } as CSSProperties,
  arrowLineRight: {
    position: 'absolute',
    top: '212px',
    right: '28px',
    zIndex: '-1',
  } as CSSProperties,
  w40: {
    width: '40%',
  },
};
