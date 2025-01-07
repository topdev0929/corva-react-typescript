import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';

const DataLoadingIndicator = withStyles({
  colorPrimary: {
    backgroundColor: 'transparent !important',
  },
  root: {
    height: 1,
    position: 'absolute',
    width: '100%'
  },
})(LinearProgress);

export default DataLoadingIndicator;
