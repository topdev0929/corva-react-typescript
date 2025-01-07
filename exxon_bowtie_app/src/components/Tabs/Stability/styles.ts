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
    marginLeft: '35px',
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
    margin: '15px 8px',
    gap: '8px',
  },
};
