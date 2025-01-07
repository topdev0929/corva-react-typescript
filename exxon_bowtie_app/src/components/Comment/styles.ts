import { CSSProperties } from 'react';

export const styles = {
  relative: {
    position: 'relative',
  } as CSSProperties,
  icon: {
    width: '16px',
    height: '16px',
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
  } as CSSProperties,
  avatarWrapper: {
    position: 'absolute',
    top: '8px',
    left: 0,
    zIndex: 10,
  } as CSSProperties,
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  commentWrapper: {
    backgroundColor: '#3B3B3B',
    width: '1103px',
    marginLeft: 'auto',
    padding: '16px 24px',
    boxShadow: '0px 5px 5px 0px #00000033',
  },
  titleWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '14px',
    lineHeight: '20px',
    color: 'white',
    fontWeight: 700,
  },
  dateWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  date: {
    fontSize: '14px',
    lineHeight: '20px',
    color: '#BDBDBD',
  },
  iconBtn: {
    padding: '6px',
  },
  divider: {
    margin: '12px auto',
  },
  desc: {
    fontSize: '14px',
    lineHeight: '16.41px',
    color: 'white',
  },
};
