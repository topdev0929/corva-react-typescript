import { bool, func, number } from 'prop-types';

import { Button } from '@material-ui/core';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

const OffsetAssetsListExpander = ({ offsetCount, handleClick, isExpanded }) => {
  return (
    <Button onClick={handleClick} size="small" disabled={offsetCount === 0}>
      Offset Wells ({offsetCount}){isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
    </Button>
  );
};

OffsetAssetsListExpander.propTypes = {
  offsetCount: number.isRequired,
  isExpanded: bool.isRequired,
  handleClick: func.isRequired,
};

export default OffsetAssetsListExpander;
