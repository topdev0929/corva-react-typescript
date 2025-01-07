import { CSSProperties } from 'react';

export const styles = {
  title: {
    fontSize: '20px',
    lineHeight: '28.12px',
  },
  subTitle: {
    fontSize: '18px',
    lineHeight: '16px',
    color: 'white',
    fontWeight: 500,
  },
  container: {
    margin: '16px auto auto auto',
    maxWidth: '1120px',
  },
  subData: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as CSSProperties,
  subHeader: {
    fontSize: '12px',
    lineHeight: '16.87px',
    color: '#9E9E9E',
  },
  subContent: {
    fontSize: '16px',
    lineHeight: '12.5px',
    color: 'white',
  },
  flexCBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as CSSProperties,
  divider: {
    marginTop: '16px',
    width: '100%',
    height: '16px',
    background: 'linear-gradient(180deg, #414141 0%, #3A3A3A 100%)',
    borderTop: '1px solid #333333',
  },
  status: {
    marginRight: '8px',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#BDBDBD',
  },
  chipWrapper: {
    margin: '8px 40px auto 40px',
    overflow: 'auto',
    paddingBottom: '1px',
  },
  statusWrapper: {
    width: '1068px',
  },
  paddingBtn: {
    padding: '6px',
  },
  paddingPicker: {
    paddingBottom: 0,
  },
  statusModal: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    position: 'absolute',
    right: '88px',
    top: '45px',
  } as CSSProperties,
  commentIcon: {
    textAlign: 'right',
    cursor: 'pointer',
  } as CSSProperties,
};

export const getContainer = (marginTop: number): CSSProperties => ({
  margin: `${marginTop}px auto auto auto`,
  maxWidth: '1120px',
});

export const getWrapper = (gap: number): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: `${gap}px`,
});

export const getSubDateWrapper = (height: number): CSSProperties => ({
  minHeight: `${height}px`,
});

export const getPadding = (padding: number): CSSProperties => ({
  padding: `${padding}px`,
});

export const getTabWrapper = (active: boolean): CSSProperties => ({
  padding: '4px 8px 4px 8px',
  fontFamily: 'Roboto',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '16px',
  letterSpacing: '0px',
  textAlign: 'center',
  backgroundColor: active ? '#333333' : 'transparent',
  borderRadius: '4px',
  cursor: 'pointer',
});

export const getTab = (active: boolean): CSSProperties => ({
  fontSize: '12px',
  lineHeight: '14px',
  color: active ? '#ffffff' : '#9E9E9E',
  fontWeight: active ? 700 : 400,
});

export const getSubData = (): CSSProperties => ({
  display: 'flex',
  flexDirection: 'column',
  width: '15%',
  gap: '8px',
});

export const getSubDataHeader = (active: boolean): CSSProperties => ({
  fontSize: '12px',
  lineHeight: '16.87px',
  color: 'rgb(158, 158, 158)',
  position: 'relative',
  top: !active ? 0 : '10px',
});

export const getPositionRelative = (): CSSProperties => ({
  position: 'relative',
});

export const getPositionAbsolute = (): CSSProperties => ({
  position: 'absolute',
});
