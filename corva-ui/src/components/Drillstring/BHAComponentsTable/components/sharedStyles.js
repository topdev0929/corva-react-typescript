import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  component: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    '&:hover': {
      background: ({ isEditing, isDragComponent }) =>
        !isEditing && !isDragComponent && 'rgba(255, 255, 255, 0.03)',
    },
    padding: 0,
  },
  componentActive: {
    background: ({ isEditing }) => !isEditing && 'rgba(255, 255, 255, 0.03)',
    '& $moreButton': {
      color: theme.palette.primary.text1,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  componentMobile: {
    height: '72px',
    marginBottom: '8px',
    padding: '0px 12px',
    borderRadius: '4px',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.b7,
  },
  componentExpandedMobile: {
    height: 'fit-content',
    paddingBottom: '16px',
  },
  detailedView: {
    padding: '24px 80px 16px 40px',
  },
  detailedViewMobile: {
    padding: '0px 4px',
  },
  editorContainer: {
    padding: '16px 0',
  },
  editorComponentSize: {
    width: '40px',
  },
  eidtorContentContainer: {
    width: ({ isMobile }) => (isMobile ? '100%' : 'calc(100% - 120px)'),
  },
  eidtorActionGroup: {
    width: '80px',
    textAlign: 'right',
  },
  eidtorNozzleView: {
    padding: 0,
    paddingLeft: '8px',
  },
  editorHeaderCell: {
    maxWidth: '20%',
    flexBasis: '20%',
  },
  editorGap: {
    width: '100%',
    height: '8px',
  },
  row: {
    display: 'flex',
  },
  rowExpanded: {
    marginTop: '12px',
    marginBottom: '8px',
  },
  cell: ({ isMobile }) => ({
    display: 'flex',
    alignItems: 'center',
    fontSize: isMobile ? '14px' : '13px',
    fontWeight: 400,
    color: theme.palette.primary.text1,
    paddingBottom: isMobile ? 0 : 1,
  }),
  ratioWidth: {
    width: 'calc((100% - 120px) / 5)',
    paddingLeft: '8px',
  },
  actionCell: {
    display: 'flex',
    width: '80px',
    minWidth: '80px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  actionButton: {
    padding: '8px',
    color: theme.palette.primary.text6,
    '&:hover': {
      color: theme.palette.primary.text1,
    },
  },
  actionIcon: {
    fontSize: '16px',
  },
  moreButton: {},
  componentMobileCell: {
    marginLeft: '36px',
  },
  cellInnerMobile: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cellLabel: ({ isMobile }) => ({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.primary.text6,
    fontSize: isMobile ? '13px' : '12px',
    fontWeight: 500,
    letterSpacing: '0.4px',
    lineHeight: isMobile ? '14px' : '17px',
  }),
  cellValue: ({ isMobile }) => ({
    marginTop: isMobile ? 0 : 5,
    paddingLeft: isMobile && '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: isMobile ? '13px' : '16px',
    fontWeight: 400,
    color: theme.palette.primary.text1,
    lineHeight: isMobile ? '14px' : '22px',
  }),
  largeFontSize: {
    fontSize: '16px',
  },
  inputLabel: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subGroup: {
    width: '100%',
  },
  subTitle: ({ isMobile }) => ({
    fontSize: '14px',
    fontWeight: isMobile ? 600 : 700,
    marginLeft: isMobile ? '4px' : '40px',
    marginTop: isMobile && '16px',
    marginBottom: isMobile && '16px',
  }),
  subTitleEditing: {
    marginLeft: '8px !important',
  },
  additionalTitle: ({ isMobile }) => ({
    fontSize: '14px',
    fontWeight: isMobile ? 600 : 700,
  }),
  addButton: {
    padding: '8px',
    margin: '8px 12px',
  },
  addIcon: {
    fontSize: '20px',
  },
}));
