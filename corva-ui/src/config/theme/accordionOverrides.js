import palette from './palette.mjs';

const { text6, contrastText } = palette.primary;

export default {
  MuiAccordion: {
    root: {
      color: text6,
      width: '100%',
      background: 'transparent',
      boxShadow: 'none',
      '&:before': {
        content: 'none',
      },
      '&$expanded': { margin: 0 },
    },
  },
  MuiAccordionDetails: {
    root: {
      padding: 0,
    },
  },
  MuiAccordionSummary: {
    root: {
      minHeight: '24px',
      height: 'max-content',
      padding: 0,
      display: 'inline-flex',
      '&:before': {
        content: '""',
        opacity: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        transition: 'opacity .3s ease-out',
        position: 'absolute',
        borderRadius: 4,
      },
      '&:hover': {
        color: contrastText,
        '& .MuiAccordionSummary-expandIcon': {
          color: contrastText,
        },
      },
      '&:hover:before': {
        opacity: 0.07,
      },
      '&.Mui-expanded': {
        minHeight: '24px',
      },
      '&.large .MuiAccordionSummary-content': {
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '22px',
        color: contrastText,
      },
      '&.large .MuiAccordionSummary-expandIcon .MuiIconButton-label .MuiSvgIcon-root': {
        fontSize: '26px',
      },
      '&.right .MuiAccordionSummary-expandIcon': {
        order: '0',
        marginLeft: '2px',
        marginRight: 'auto',
      },
      '&.right .MuiAccordionSummary-content': { margin: '0px 4px 0px 0px' },
      '&.right .MuiAccordionSummary-content .Mui-expanded': { margin: '0px 4px 0px 0px' },
      '&.stretched': { display: 'flex' },
      '&.stretched .MuiAccordionSummary-expandIcon': {
        order: '0',
        margin: 'auto',
      },
      '&.stretched .MuiAccordionSummary-content': { margin: '0' },
      '&.stretched .MuiAccordionSummary-content .Mui-expanded': { margin: '0' },
    },
    content: {
      margin: '0px 0px 0px 4px',
      '&.Mui-expanded': {
        margin: '0px 0px 0px 4px',
      },
      fontWeight: 400,
      fontSize: '12px',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      lineHeight: '17px',
      letterSpacing: '0.4px',
    },
    expandIcon: {
      order: '-1',
      padding: 0,
      marginRight: '2px',
      color: text6,
      '& .MuiIconButton-label .MuiSvgIcon-root': {
        fontSize: '16px',
        padding: 1,
      },
    },
  },
};
