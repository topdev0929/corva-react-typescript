import palette from './palette.mjs';

const { primary, background } = palette;

export default {
  MuiChip: {
    root: {
      '&:not([data-not-migrated-MuiChip])': {
        backgroundColor: background.b9,
        fontSize: 14,
        lineHeight: '20px',
        '&:hover': {
          backgroundColor: primary.text9,
          '& .MuiChip-label, & .MuiChip-deleteIcon, & .MuiChip-icon, & .MuiIcon-root': {
            color: '#FFFFFF',
          },
        },
        '&.Mui-disabled': {
          opacity: 1,
          backgroundColor: 'rgba(65, 65, 65, 0.5)',
          '& .MuiChip-label, & .MuiChip-icon, & .MuiChip-deleteIcon, & .MuiIcon-root': {
            color: primary.text8,
          },
          '& .MuiChip-avatar': {
            opacity: '0.5',
          },
        },
        '& .MuiChip-avatar, &.MuiChip-outlined .MuiChip-avatar': {
          marginLeft: 8,
          marginRight: '-8px',
        },
        '& .MuiAvatar-root': {
          border: '1px solid #909090',
          width: 24,
          height: 24,
          boxSizing: 'border-box',
        },
        '& .MuiChip-label': {
          paddingLeft: 12,
          paddingRight: 12,
          color: primary.text6,
        },
        '& .MuiChip-labelSmall': {
          paddingLeft: 12,
          paddingRight: 12,
        },
        '& .MuiChip-deleteIcon': {
          color: primary.text6,
          width: 16,
          height: 16,
          marginRight: 8,
          marginLeft: '-8px',
        },
        '& .MuiChip-deleteIconSmall': {
          marginRight: 8,
          marginLeft: '-8px',
        },
        '& .MuiChip-avatar': {
          border: `1px solid ${primary.text9}`,
        },
        '& .MuiChip-icon': {
          color: primary.text6,
          marginLeft: 8,
          marginRight: '-8px',
        },
        '& .MuiChip-iconSmall': {
          width: 16,
          height: 16,
          marginLeft: 8,
          marginRight: '-8px',
        },
      },
    },
    sizeSmall: {
      '&:not([data-not-migrated-MuiChip])': {
        '& .MuiAvatar-root': {
          width: 16,
          height: 16,
        },
      },
    },
    outlined: {
      '&:not([data-not-migrated-MuiChip])': {
        backgroundColor: 'transparent',
        borderColor: primary.text9,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '&.MuiChip-clickable': {
          borderColor: primary.text9,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
        '& .MuiChip-icon': {
          marginLeft: 8,
          marginRight: '-8px',
        },
      },
    },
  },
};
