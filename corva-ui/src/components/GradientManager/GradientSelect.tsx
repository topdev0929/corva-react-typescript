import { ListSubheader, MenuItem } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import { useState } from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { GradientPreview } from './GradientPreview/GradientPreview';
import Select from '~/components/Select';
import IconButton from '~/components/IconButton';

import { useStyles } from './GradientSelect.styles';
import { CustomGradient } from '~/types';

interface GradientSelectProps {
  gradients: CustomGradient[];
  value: string;
  onChange: (id: string) => void;
  defaultGradients: CustomGradient[];
  onAction: ( type: string, data?: any ) => void;
  readonly: boolean;
}

export const GradientSelect: React.FC<GradientSelectProps> = ({
  value,
  gradients,
  onChange,
  defaultGradients,
  onAction,
  readonly,
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  /** @param {React.ChangeEvent<HTMLInputElement>} event */
  const handleItemChange = ({ target }) => {
    if (target.value) {
      onChange(target.value);
    }
  };

  const handleDeleteClick = evt => {
    evt.stopPropagation();
    // When we simply disable the button  clicks are passing through it
    // and another gradient selected. To prevent this the button still handles
    // clicks but does nothing.
    if (readonly) {
      return;
    }
    const gradientId = evt.currentTarget.closest('li')?.dataset?.value;
    if (value === gradientId) {
      // Do not close dropdown when deleting not selected gradients
      setOpen(false);
    }

    onAction('delete', gradientId);
  };

  const hideMyGroup = isEmpty(gradients) && readonly;

  return (
    <Select
      data-testid="gradient-select"
      label="Gradients"
      value={value || ''}
      className={classes.select}
      onChange={handleItemChange}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      inputProps={{
        name: 'gradientId',
        id: 'gradientId',
      }}
      FormControlProps={{ fullWidth: true } as any}
      fullWidth
      defaultValue=""
    >
      <ListSubheader className={classes.listHeader}>Gradients</ListSubheader>

      {!hideMyGroup && <ListSubheader className={classes.subHeader}>
        My Gradients
        {!readonly && (
          <IconButton
            color="primary"
            data-testid="add-gradient-btn"
            className={classes.addButton}
            onClick={() => onAction('add')}
            tooltipProps={{ title: 'Create Custom Gradient' }}
            >
            <AddCircleIcon color="primary" />
          </IconButton>
        )}
      </ListSubheader>}

      {gradients.map(({ id, name, gradientStops }) => (
        <MenuItem key={id} value={id} className={classes.customGradientListItem}>
          <GradientPreview gradientStops={gradientStops} />
          <span>{name}</span>
          <IconButton
            className={classNames(classes.removeButton, { disabled: readonly })}
            onClick={handleDeleteClick}
            tooltipProps={{ title: 'Remove Gradient' }}
          >
            <DeleteIcon />
          </IconButton>
        </MenuItem>
      ))}

      {!isEmpty(defaultGradients) && <ListSubheader className={classes.subHeader}>Default Gradients</ListSubheader>}
      {defaultGradients.map(({ id, name, gradientStops }) => (
        <MenuItem key={id} value={id} className={classes.customGradientListItem}>
          <GradientPreview gradientStops={gradientStops} />
          <span>{name}</span>
        </MenuItem>
      ))}
    </Select>
  );
};
