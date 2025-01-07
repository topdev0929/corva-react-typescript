/* eslint-disable import/no-extraneous-dependencies */

import moment from 'moment';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import corvaTheme from './corvaTheme';

import MiniApp from './stories/MiniApp';

export const parameters = {
  docs: {
    theme: corvaTheme,
    source: {
      type: 'code',
    },
  },
  options: {
    showPanel: true,
    storySort: (a, b) =>
      a.title === b.title ? 0 : a.id.localeCompare(b.id, undefined, { numeric: true }),
  },
  controls: { expanded: true },
  viewport: {
    viewports: {
      smallMobile: {
        name: 'Small Mobile',
        styles: {
          width: '375px',
          height: '100%',
        },
      },
      mobile: {
        name: 'Mobile',
        styles: {
          width: '599px',
          height: '100%',
        },
      },
      iPad: {
        name: 'iPad',
        styles: {
          width: '959px',
          height: '100%',
        },
      },
    },
  },
  // viewMode: 'docs',
};

export const decorators = [
  storyFn => (
    <MiniApp>
      <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        {storyFn()}
      </MuiPickersUtilsProvider>
    </MiniApp>
  )
];
