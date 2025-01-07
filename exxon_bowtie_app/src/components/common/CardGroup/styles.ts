import { CSSProperties } from 'react';

export const styles = {
  wrapper: {
    position: 'relative',
    border: '1px dashed var(--palette-primary-text-7)',
    borderRadius: '8px',
  } as CSSProperties,

  title: {
    position: 'absolute',
    top: '-16px',
    left: '8px',
    border: '1px solid var(--palette-background-b-9)',
    borderRadius: '8px',
    padding: '6px 8px',
    backgroundColor: 'var(--palette-background-b-4)',
  } as CSSProperties,

  titleText: {
    margin: 0,
  },

  children: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
  },
};
