import palette from './palette.mjs';

const { primary, background } = palette;

export const dateTimePickerThemeOverrides = {
  MuiPickerDTToolbar: {
    toolbar: {
      backgroundColor: background.b7,
      marginBottom: '-10px',
      '& .MuiGrid-justify-xs-center .MuiGrid-grid-xs-6': {
        marginLeft: '12px',
      },
      '& .MuiButton-root': {
        height: 'unset',
        color: primary.text6,
      },
      '& .MuiPickersToolbarText-toolbarTxt': {
        color: primary.text6,
      },
      '& .MuiPickersToolbarText-toolbarBtnSelected': {
        color: primary.contrastText,
      },
      '& h3.MuiPickersToolbarText-toolbarTxt': {
        fontSize: '44px',
        marginBottom: '-12px',
      },
      '& h4.MuiPickersToolbarText-toolbarTxt': {
        marginBottom: '-6px',
        minWidth: '120px',
        textAlign: 'left',
      },
      '& h6.MuiPickersToolbarText-toolbarTxt': {
        marginBottom: '-8px',
        fontSize: '18px',
      },
      '& .MuiGrid-grid-xs-5 h6.MuiPickersToolbarText-toolbarTxt': {
        marginBottom: '2px',
      },
      '& .MuiGrid-grid-xs-1:last-child': { marginBottom: '-16px' },
      '& .MuiGrid-grid-xs-1:last-child h6.MuiPickersToolbarText-toolbarTxt': {
        marginBottom: 0,
      },
      '& .MuiGrid-grid-xs-6': {
        marginLeft: '24px',
      },
    },
  },

  MuiPickersCalendarHeader: {
    switchHeader: {
      '& .MuiPickersCalendarHeader-transitionContainer p': {
        marginLeft: '-12px',
      },
      '& .MuiPickersCalendarHeader-iconButton:first-child': {
        marginLeft: '12px',
      },
      '& .MuiPickersCalendarHeader-iconButton:last-child': {
        marginRight: '12px',
      },
    },
  },
  MuiPickersBasePicker: {
    container: {
      '& .MuiPaper-elevation1': {
        boxShadow: 'none',
      },
      '& .MuiTabs-indicator': {
        width: '160px !important',
        height: 3,
      },
    },
    pickerView: {
      '& .MuiPickersCalendar-transitionContainer': {
        marginLeft: '-6px',
        minHeight: '212px',
      },

      '& .MuiPickersClock-clock': {
        backgroundColor: background.b7,
      },
      '& .MuiPickersClockPointer-pointer': {
        width: '1px',
      },
      '& .MuiPickersClockNumber-clockNumber': {
        color: primary.contrastText,
        fontSize: '18px',
      },
    },
  },
  MuiPickerDTTabs: {
    tabs: {
      backgroundColor: background.b7,
      '& .MuiTab-textColorInherit.Mui-selected': { color: primary.main },
      '& .MuiTab-textColorInherit': { color: primary.text6 },
      '& .MuiTabs-flexContainer': {
        '& .MuiTabs-indicator': {
          width: '160px !important',
        },
      },
    },
  },
  MuiPickersDay: {
    day: {
      color: primary.contrastText,
      '&:hover': {
        backgroundColor: primary.text9,
      },
      fontSize: 14,
    },
    daySelected: {
      backgroundColor: primary.main,
    },
  },
};
