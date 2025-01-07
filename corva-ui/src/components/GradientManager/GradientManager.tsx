import { Box, Grid, TextField } from '@material-ui/core';
import { isEmpty, trim, noop } from 'lodash';
import { useEffect, useState } from 'react';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { DEFAULT_GRADIENT_STOPS, GRADIENT_MAX_NAME_LENGTH, DEFAULT_GRADIENTS, TEMP_GRADIENT_ID } from './configuration/constants';
import { GradientList } from './GradientList';
import type { CustomGradient, GradientFillStop } from '~/types';
import IconButton from '../IconButton';
import { GradientSelect } from './GradientSelect';
import { GradientPicker } from '../GradientPicker';
import { GradientManagerProps } from './GradientManagerProps';

import { useStyles } from './GradientManager.styles';

export const GradientManager: React.FC<GradientManagerProps> = (props) => {
  const {
    gradientId,
    onGradientEditStateChange = noop,
    onChange = noop,
    defaultGradients = DEFAULT_GRADIENTS,
    defaultGradientStops = DEFAULT_GRADIENT_STOPS,
    allowNoname,
    scaleOptions = { scaleFrom: 0, scaleTo: 100 },
  } = props;

  const classes = useStyles();
  const gradientList = new GradientList(
    props.gradients || [],
    defaultGradients,
    props.onGradientsChange
  );
  const [currentlyEdited, setCurrentlyEdited] = useState<Partial<CustomGradient>>(null);
  const disableGradientsManagement = props.disableGradientsManagement || !props.onGradientsChange;
  const validationResult = gradientList.getHelperText({ name: currentlyEdited?.name, allowNoname, gradientId });

  /**
   * Calls editStateChange handler when gradient edit starts or ends.
   * Will be called with false on component mount
   */
  useEffect(() => {
    onGradientEditStateChange(Boolean(currentlyEdited));
  }, [Boolean(currentlyEdited)]);

  /**
   * Use stops from the stored gradient first, then fallback to stored in the trace
   * and finally, use defaultGradientStops if none of above is available
   */
  const gradientStops =
    gradientList.getById(gradientId)?.gradientStops ||
    props.gradientStops ||
    defaultGradientStops;

  const cancelEdit = () => {
    setCurrentlyEdited(null);
  };

  const startAddGradient = () => {
    setCurrentlyEdited({
      name: '',
      gradientStops: defaultGradientStops,
      id: TEMP_GRADIENT_ID,
    });
  };

  const startEditGradient = () => {
    if (gradientList.isDefault(gradientId)) {
      setCurrentlyEdited({
        name: gradientList.newName(),
        gradientStops,
        id: TEMP_GRADIENT_ID,
      });
      return;
    }

    setCurrentlyEdited({
      name: gradientList.getById(gradientId)?.name || '',
      gradientStops,
    });
  };

  const saveChanges = () => {
    if (!isEmpty(validationResult)) {
      return;
    }

    const gradientStops = currentlyEdited.gradientStops;
    const name = trim(currentlyEdited.name);

    setCurrentlyEdited(null);

    // No name - no need to create a gradient. Saving stops to the trace.
    if (!name) {
      if (allowNoname) {
        onChange({ gradientStops, gradientId: null });
      }
      return;
    }

    /**
     * Gradient exists - Updating
     * simple check that gradientId is not null is NOT enough because
     * Deleted gradients have gradientId but should be handles as non-existing ones.
     */
    if (gradientList.getById(currentlyEdited.id || gradientId)) {
      gradientList.update(gradientId, {
        gradientStops,
        name,
      });
      onChange({
        gradientId,
        gradientStops,
      });
      return;
    }

    // Creating a new gradient
    const newGradient = gradientList.add(name, gradientStops);
    onChange({
      gradientId: newGradient?.id,
      gradientStops,
    });
  };

  const deleteGradient = (id: string) => {
    if (id === gradientId) {
      onChange({
        gradientId: null,
        gradientStops,
      });
      setCurrentlyEdited(null);
    }
    gradientList.remove(id);
  };

  const handleNameChange = (value: string) => {
    const name = value.trimStart().substring(0, GRADIENT_MAX_NAME_LENGTH);
    setCurrentlyEdited({ ...currentlyEdited, name });
  };

  const handleGradientAction = (type: 'delete' | 'add', id: string) => {
    switch (type) {
      case 'add':
        startAddGradient();
        break;
      case 'delete': {
        deleteGradient(id);
        break;
      }
      default:
    }
  };

  const handleGradientSelect = (id: string) => {
    const gradient = gradientList.getById(id);
    onChange({
      gradientId: id,
      gradientStops: gradient?.gradientStops ?? defaultGradientStops,
    });
  };

  const handleGradientChange = (gradientStops: GradientFillStop[]) => {
    setCurrentlyEdited({
      ...currentlyEdited,
      gradientStops,
    });
  };

  const handleNameKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Enter') {
      // @ts-ignore
      const value = evt.target?.value;
      if (value) {
        handleNameChange(value);
        saveChanges();
      }
    }
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        {currentlyEdited ? (
          <TextField
            className={classes.customGradientName}
            label="Gradient Name"
            value={currentlyEdited.name}
            onChange={evt => handleNameChange(evt.target.value)}
            onFocus={event => {
              event.target.select();
            }}
            onKeyDown={handleNameKeyDown}
            autoFocus
            fullWidth
            {...validationResult}
          />
        ) : (
          <GradientSelect
            value={gradientId}
            gradients={props.gradients || []}
            onChange={handleGradientSelect}
            defaultGradients={defaultGradients}
            onAction={handleGradientAction}
            readonly={disableGradientsManagement}
          />
        )}
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" alignItems="center" height="100%">
          {/* Control panel */}
          <Box display="flex" paddingLeft={1}>
            {currentlyEdited ? (
              <>
                <IconButton
                  data-testid="save-gradient-btn"
                  className={classes.iconButton}
                  onClick={saveChanges}
                  tooltipProps={{ title: 'Save' }}
                  disabled={!!validationResult || disableGradientsManagement}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton
                  data-testid="cancel-edit-btn"
                  className={classes.iconButton}
                  onClick={cancelEdit}
                  tooltipProps={{ title: 'Cancel' }}
                  >
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  data-testid="edit-gradient-btn"
                  className={classes.iconButton}
                  onClick={startEditGradient}
                  tooltipProps={{ title: 'Edit' }}
                  disabled={disableGradientsManagement}
                >
                  <EditIcon />
                </IconButton>
                {!!gradientList.getById(gradientId) && !gradientList.isDefault(gradientId) && (
                  <IconButton
                    data-testid="delete-gradient-btn"
                    className={classes.iconButton}
                    onClick={() => deleteGradient(gradientId)}
                    tooltipProps={{ title: 'Remove' }}
                    disabled={disableGradientsManagement}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </>
            )}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <GradientPicker
          from={scaleOptions?.scaleFrom}
          to={scaleOptions?.scaleTo}
          unit={scaleOptions?.scaleUnit}
          noScale
          gradientStops={currentlyEdited?.gradientStops || gradientStops}
          onChange={handleGradientChange}
          readonly={!currentlyEdited}
          isMoveInputVisible
        />
      </Grid>
    </Grid>
  );
};
