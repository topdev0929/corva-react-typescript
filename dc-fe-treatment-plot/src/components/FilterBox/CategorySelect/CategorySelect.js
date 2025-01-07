import PropTypes from 'prop-types';
import { FormGroup, FormControlLabel, Checkbox, Divider, makeStyles } from '@material-ui/core';

import CategorySelectPopover from '../CategorySelectPopover';

const useStyles = makeStyles({
  divider: {
    margin: '0 -16px',
  },
});

function CategorySelect(props) {
  const { paramList, paramName, value, onChange } = props;
  const classes = useStyles();

  const handleChange = (key, isChecked) => {
    const newSelectedItems = isChecked ? [...value, key] : value.filter(item => item !== key);
    onChange(paramName, newSelectedItems);
  };

  const handleChangeAll = e => {
    const isAllChecked = e.target.checked;
    if (isAllChecked) {
      const newSelectedItems = paramList.map(item => item.key);
      onChange(paramName, newSelectedItems);
    } else {
      onChange(paramName, []);
    }
  };

  return (
    <CategorySelectPopover disabled={!paramList?.length}>
      {paramName !== 'selectedCustomChannels' && (
        <>
          <FormGroup key="all">
            <FormControlLabel
              label="All"
              control={
                <Checkbox
                  checked={value.length && value.length === paramList.length}
                  indeterminate={value.length && value.length < paramList.length}
                  onChange={handleChangeAll}
                />
              }
            />
          </FormGroup>
          <Divider className={classes.divider} />
        </>
      )}
      {paramList.map(series => (
        <FormGroup key={series.key}>
          <FormControlLabel
            control={<Checkbox defaultChecked checked={value.includes(series.key)} />}
            label={series.name}
            onChange={e => handleChange(series.key, e.target.checked)}
          />
        </FormGroup>
      ))}
    </CategorySelectPopover>
  );
}

CategorySelect.propTypes = {
  paramList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  paramName: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CategorySelect;
