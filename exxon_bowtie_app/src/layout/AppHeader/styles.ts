import { CSSProperties } from 'react';

export const styles = {
  header: {
    display: 'grid',
    gridTemplateColumns: 'min-content min-content auto',
    alignItems: 'center',
    paddingBottom: '8px',
  },

  headerLogo: {
    objectFit: 'contain',
    width: '9rem',
  } as CSSProperties,

  headerSplit: {
    width: '1px',
    height: '16px',
    backgroundColor: 'var(--palette-primary-text-9)',
    margin: '0 1.25rem',
  },

  headerContent: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  } as CSSProperties,
};
