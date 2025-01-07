import { memo, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { get, isArray, findKey } from 'lodash';

import { Button, ColorPicker, Modal } from '@corva/ui/components';
import { getUnitDisplay, getUniqueUnitsByType } from '@corva/ui/utils';
import {
  makeStyles,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  withStyles,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Warning } from '@material-ui/icons';

import { LayoutContext } from '../../context/layoutContext';
import { FilterBoxContext } from '../../context/filterBoxContext';
import FilterBoxDeleteDialog from './FilterBoxDeleteDialog';
import { CHANNELS_LIST } from '@/constants';

const StyledButton = withStyles({ root: { height: '36px' } })(Button);
const ClearAllButton = withStyles({ root: { margin: '0 16px 0 auto' } })(StyledButton);

const MAX_SCALE_COUNT = 15;

const useStyles = makeStyles(theme => ({
  modalContentWrapper: {
    width: '300px',
  },
  selectFormControl: {
    marginTop: '32px',
  },
  menuItemWrapper: {
    position: 'relative',
    '&:hover': {
      '&>$removeButtonWrapper': {
        visibility: 'unset',
      },
    },
  },
  removeButtonWrapper: {
    position: 'absolute',
    top: '2px',
    right: '8px',
    visibility: 'hidden',
  },
  fieldsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& > :first-child': {
      marginRight: 8,
    },
    '& > :last-child': {
      marginLeft: 8,
    },
  },
  colorPickersContainer: {
    display: 'flex',
    gap: 16,
  },
  textField: {
    marginTop: 16,
    minWidth: 120,
  },
  limitationInfoContainer: {
    display: 'flex',
    padding: '8px 16px',
    pointerEvents: 'none',
  },
  infoIcon: {
    marginRight: '8px',
  },
  infoText: {
    color: theme.palette.primary.text7,
  },
  helperText: {
    display: 'flex',
    margin: '10px 0 -16px',
    fontSize: 12,
    letterSpacing: 0.4,
    lineHeight: '16px',
    alignItems: 'center',
    color: theme.palette.primary.text1,
    gap: 8,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
}));

const getAxisLabel = (value, axisTypes) => {
  const axisType = axisTypes.find(item => item.key !== 'trashChannels' && item.key === value);

  if (!axisType) return null;
  return axisType.label;
};

function FilterBox(props) {
  const { dataSetting, scaleSetting, onScaleSettingChange, assetId } = props;
  const { isResponsive } = useContext(LayoutContext);
  const classes = useStyles();

  const {
    state: { isDialogOpen, paramToEdit },
    dispatch,
  } = useContext(FilterBoxContext);

  const [seriesColor, setSeriesColor] = useState(null);
  const [offsetColor, setOffsetColor] = useState(null);
  const [currentAxis, setCurrentAxis] = useState(null);
  const [axisTypes, setAxisTypes] = useState(null);
  const [currentSeriesSetting, setCurrentSeriesSetting] = useState(null);
  // scale selector should be controlled component for CMPL-214
  const [isScaleSelectOpen, setIsScaleSelectOpen] = useState(false);

  const channelName = useMemo(() => {
    if (!paramToEdit) return null;
    const channelKey = scaleSetting.find(setting =>
      setting.series.find(item => item.key === paramToEdit.key)
    ).key;

    const channelName = CHANNELS_LIST.find(channel => channel.key === channelKey)?.label;
    return channelName;
  }, [paramToEdit]);

  const safelySetCurrentAxis = currentAxis => {
    setCurrentAxis({
      ...currentAxis,
      max: currentAxis?.max == undefined ? '' : currentAxis.max,
      min: currentAxis?.min == undefined ? '' : currentAxis.min,
    });
  };

  useEffect(() => {
    const allSeriesTypes = scaleSetting.reduce((result, setting) => {
      return [...result, ...setting.series];
    }, []);

    const currentSeries =
      allSeriesTypes.find(series => series.key === paramToEdit.key) || paramToEdit;
    const currentAxis = scaleSetting.find(setting => {
      return setting.series.some(
        series => series.key === paramToEdit.key && setting.key !== 'trashChannels'
      );
    });

    const primaryColor = currentSeries.color;
    setSeriesColor(primaryColor);
    setOffsetColor(currentSeries.offsetColor || primaryColor);

    safelySetCurrentAxis(currentAxis);
    setAxisTypes(scaleSetting);
    setCurrentSeriesSetting(currentSeries);
  }, [scaleSetting, paramToEdit]);

  const handleCancel = () => {
    dispatch({ type: 'CLOSE_DIALOG' });
  };

  const handleSave = () => {
    onScaleSettingChange(
      'scaleSetting',
      axisTypes.map(axisType => ({
        ...axisType,
        max: axisType.max === '' ? null : axisType.max,
      }))
    );
    dispatch({ type: 'CLOSE_DIALOG' });
  };

  const handleDelete = () => {
    const settingKey = findKey(
      dataSetting,
      setting => isArray(setting) && setting.includes(paramToEdit.key)
    );

    const newDataSetting = {
      ...dataSetting,
      [settingKey]: get(dataSetting, [settingKey], []).filter(key => key !== paramToEdit.key),
    };

    onScaleSettingChange('dataSetting', newDataSetting);
    dispatch({ type: 'CLOSE_DIALOG' });
  };

  const handleChangeAxisSetting = e => {
    const {
      target: { value },
    } = e;

    const isDisabledItem = axisTypes.find(
      item => item.key === value && currentSeriesSetting.unitType !== item.unitType
    );

    if (value !== 'add' && isDisabledItem) {
      e.stopPropagation();
      return;
    }

    const updatedAxisTypes = axisTypes.map(item => {
      if (item.key === currentAxis?.key) {
        return {
          ...item,
          series: item.series.filter(series => series.key !== currentSeriesSetting.key),
        };
      }
      if (item.key === value) {
        return {
          ...item,
          series: [...item.series, currentSeriesSetting],
        };
      }
      return item;
    });

    if (value === 'add') {
      if (axisTypes.map(item => item.key).includes(currentSeriesSetting.key)) return;

      const newAxis = {
        key: currentSeriesSetting.key,
        label: currentSeriesSetting.name,
        unitType: currentSeriesSetting.unitType,
        unit: currentSeriesSetting.unit,
        series: [currentSeriesSetting],
        min: currentAxis?.min || 0,
        max: currentAxis?.max || '',
        assetId,
      };
      safelySetCurrentAxis(newAxis);
      setAxisTypes([...updatedAxisTypes, newAxis]);
    } else {
      const currentAxis = scaleSetting.find(setting => setting.key === value);

      if (currentAxis) {
        safelySetCurrentAxis(currentAxis);
      }

      setAxisTypes(updatedAxisTypes);
    }
  };

  const handleChangeScaleSetting = (type, value) => {
    const updatedAxisTypes = axisTypes.map(item => {
      if (item.key === currentAxis?.key) {
        return {
          ...item,
          [type]: +value || null,
        };
      }
      return item;
    });
    setAxisTypes(updatedAxisTypes);
    setCurrentAxis(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleDeleteScale = axisKey => {
    const deletedScale = axisTypes.find(item => item.key === axisKey);
    const updatedAxisTypes = axisTypes
      .filter(item => item.key !== axisKey)
      .map(item => {
        if (item.key === 'trashChannels') {
          return {
            ...item,
            series: [...item.series, ...deletedScale.series],
          };
        }

        return item;
      });
    if (currentAxis === axisKey) setCurrentAxis(null);
    setAxisTypes(updatedAxisTypes);
  };

  const handleChangeUnitTo = e => {
    const newUnit = e.target.value;
    const updatedAxisTypes = axisTypes.map(item => {
      if (item.series.some(seriesItem => seriesItem.key === currentSeriesSetting.key)) {
        return {
          ...item,
          max: null,
          min: 0,

          series: item.series.map(series => {
            return {
              ...series,
              unitTo: newUnit,
              unitType: currentSeriesSetting.unitType,
            };
          }),
        };
      } else {
        return item;
      }
    });

    setAxisTypes(updatedAxisTypes);
    setCurrentAxis(prev => ({
      ...prev,
      min: 0,
      max: '',
    }));
    setCurrentSeriesSetting(prev => ({
      ...prev,
      unitTo: newUnit,
    }));
  };

  const handleChangeColor = (newColor, key = 'color') => {
    const updatedAxisTypes = axisTypes.map(item => {
      const findSeries = item.series.find(series => series.key === currentSeriesSetting.key);
      if (!findSeries) return item;

      return {
        ...item,
        series: item.series.map(series => {
          return series.key === currentSeriesSetting.key
            ? {
                ...series,
                [key]: newColor,
              }
            : series;
        }),
      };
    });

    setAxisTypes(updatedAxisTypes);
    setCurrentSeriesSetting(prev => ({
      ...prev,
      [key]: newColor,
    }));
    if (key === 'color') {
      setSeriesColor(newColor);
    } else {
      setOffsetColor(newColor);
    }
  };

  if (!paramToEdit) return null;

  return (
    <Modal
      open={isDialogOpen}
      onClose={handleCancel}
      title={paramToEdit.name}
      actions={
        <>
          <ClearAllButton color="primary" onClick={handleDelete}>
            Remove
          </ClearAllButton>
          <StyledButton variant="contained" color="primary" onClick={handleSave}>
            Save
          </StyledButton>
        </>
      }
    >
      <div className={classes.modalContentWrapper}>
        <div className={classes.colorPickersContainer}>
          <ColorPicker label="Color" value={seriesColor} onChange={handleChangeColor} />
          <ColorPicker
            label="Offset Color"
            value={offsetColor}
            onChange={color => handleChangeColor(color, 'offsetColor')}
          />
        </div>
        <div className={isResponsive && classes.fieldsContainer}>
          <FormControl classes={{ root: classes.selectFormControl }} fullWidth>
            <InputLabel shrink htmlFor="unitTo">
              Convert To
            </InputLabel>
            <Select
              value={currentSeriesSetting?.unitTo || getUnitDisplay(currentSeriesSetting?.unitType)}
              inputProps={{ name: 'unitTo', id: 'unitTo' }}
              onChange={handleChangeUnitTo}
            >
              {getUniqueUnitsByType(currentSeriesSetting?.unitType).map(item => (
                <MenuItem value={item.abbr} key={item.abbr}>
                  {item.display}
                </MenuItem>
              ))}
            </Select>
            <div className={classes.helperText}>
              <Warning className={classes.warningIcon} />
              Changes will be applied to all {channelName} channels
            </div>
          </FormControl>
        </div>
        <FormControl classes={{ root: classes.selectFormControl }} fullWidth>
          <InputLabel htmlFor="parameter">Select Scale</InputLabel>
          <Select
            value={
              currentAxis?.key && currentAxis?.key !== 'trashChannels' ? currentAxis?.key : null
            }
            inputProps={{ name: 'parameter', id: 'parameter' }}
            renderValue={value => <span>{getAxisLabel(value, axisTypes)}</span>}
            open={isScaleSelectOpen}
            placeholder="Select Scale"
            onChange={handleChangeAxisSetting}
            MenuProps={{
              onClose: () => setIsScaleSelectOpen(false),
            }}
            onOpen={() => setIsScaleSelectOpen(true)}
          >
            {axisTypes
              .filter(
                axisType =>
                  axisType.key !== 'trashChannels' &&
                  (!axisType.assetId || axisType.assetId === assetId)
              )
              .map(axisType => {
                const isDisabled = currentSeriesSetting?.unitType !== axisType.unitType;
                return (
                  <div
                    className={classes.menuItemWrapper}
                    value={axisType.key}
                    key={axisType.key}
                    onClick={() => {
                      if (!isDisabled) {
                        setIsScaleSelectOpen(false);
                      }
                    }}
                  >
                    <MenuItem value={axisType.key} key={axisType.key} disabled={isDisabled}>
                      <Typography>{axisType.label}</Typography>
                    </MenuItem>
                    <div className={classes.removeButtonWrapper}>
                      <FilterBoxDeleteDialog onDelete={() => handleDeleteScale(axisType.key)} />
                    </div>
                  </div>
                );
              })}
            <MenuItem value="add" key="add" disabled={axisTypes.length >= MAX_SCALE_COUNT}>
              <Typography color="primary">New Scale</Typography>
            </MenuItem>
            {axisTypes.length > MAX_SCALE_COUNT && (
              <div className={classes.limitationInfoContainer}>
                <InfoOutlinedIcon className={classes.infoIcon} htmlColor="#64B5F6" />
                <Typography className={classes.infoText}>
                  {`You can't have more than ${MAX_SCALE_COUNT} Scales`}
                </Typography>
              </div>
            )}
          </Select>
        </FormControl>
        <div className={classes.fieldsContainer}>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {currentSeriesSetting?.unitTo || getUnitDisplay(currentSeriesSetting?.unitType)}
                </InputAdornment>
              ),
            }}
            className={classes.textField}
            placeholder="Auto if not set"
            label="Scale From"
            value={currentAxis?.min}
            onChange={e => handleChangeScaleSetting('min', e.target.value)}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {currentSeriesSetting?.unitTo || getUnitDisplay(currentSeriesSetting?.unitType)}
                </InputAdornment>
              ),
            }}
            className={classes.textField}
            placeholder="Auto if not set"
            label="Scale To"
            value={currentAxis?.max}
            onChange={e => handleChangeScaleSetting('max', e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}

FilterBox.propTypes = {
  assetId: PropTypes.number,
  dataSetting: PropTypes.shape({}).isRequired,
  scaleSetting: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onScaleSettingChange: PropTypes.func.isRequired,
};

export default memo(FilterBox);
