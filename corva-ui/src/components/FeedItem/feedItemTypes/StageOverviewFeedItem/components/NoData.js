import { string } from 'prop-types';

import Typography from '@material-ui/core/Typography';

const NoData = ({ subject }) => (
  <Typography variant="body1" gutterBottom>{`No data for ${subject}`}</Typography>
);

NoData.propTypes = {
  subject: string.isRequired,
};

export default NoData;
