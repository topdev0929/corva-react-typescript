import { memo } from 'react';
import PropTypes from 'prop-types';
import { get, includes, map } from 'lodash';
import { Grid, Button, makeStyles } from '@material-ui/core';

import { getUnitDisplay } from '~/utils';
import {
  UR_ACTIVATION_LOGIC_KEYS,
  UR_ACTIVATION_LOGIC_TYPES,
  FLOW_RATE_UNIT,
  BHA_COMPONENT_TYPES,
  BHA_GENERAL_FIELD_TYPES,
  BHA_ALTERNATIVE_FIELD_TYPES,
  BHA_TABLE_FIELD_TYPES,
  BHA_STABILIZER_FIELD_TYPES,
} from './constants';

const useStyles = makeStyles({
  header: {
    marginBottom: '10px',
    borderBottom: '1px solid #888',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '2rem',
    marginTop: '0px',
  },
  done_button: {
    float: 'right',
  },
  field_label: {
    color: '#ccc',
    fontSize: '0.8rem',
  },
  field_value: {
    fontSize: '1.2rem',
    lineHeight: '2rem',
    fontWeight: 'bold',
  },
  thead: {
    borderBottom: '0px',
  },
  th: {
    color: '#ccc',
    fontSize: '0.8rem',
    padding: '0px',
  },
  td: {
    fontSize: '1.2rem',
    padding: '0px',
  },
  col: {
    padding: '0 0.75rem',
  },
  row: {
    marginBottom: '20px',
  },
  sub_title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginTop: '10px',
    padding: '0 0.75rem',
  },
});

const getURLogicNameByKey = key => {
  return (UR_ACTIVATION_LOGIC_TYPES.find(item => item.type === key) || {}).name;
};

function BHAComponentDetail({ component, onDone, currentUser }) {
  const classes = useStyles();
  const family = component && get(component, 'family');
  const userSegment = currentUser ? (get(currentUser, ['preference', 'segment'], [])) : [];
  const userCurrentSegment = currentUser && get(currentUser, 'current_segment');
  const doesNotExist = userSegment.indexOf(userCurrentSegment) === -1;
  const currentSegment = doesNotExist ? userSegment[0] : userCurrentSegment;

  const filterComponents = BHA_COMPONENT_TYPES.filter(type => type.family === family);
  const curComponent = filterComponents && filterComponents[0];
  const curComponentData = curComponent && curComponent.data;

  const componentLabelField = (path, label = '', colSize = 2, unitType, unitFromSegment = false) => {
    const value = get(component, path) || '';
    const newUnitType = unitFromSegment ? FLOW_RATE_UNIT[currentSegment].unitType : unitType;
    const units = newUnitType ? `(${getUnitDisplay(newUnitType)})` : '';
    return (
      <Grid item md={colSize} xs={12} className={classes.col} key={label}>
        <span className={classes.field_label}>{`${label} ${units}`}</span>
        <br />
        <span className={classes.field_value}>
          {value.fixFloat ? value.fixFloat(3) : value || 'n/a'}
        </span>
      </Grid>
    );
  };

  const generalFieldItems = (colSize, fields) => {
    return fields ?
        map(
          BHA_GENERAL_FIELD_TYPES,
          element =>
            ((includes(fields, element.name) &&
            (!element.cond || (element.cond && get(component, element.cond, false))) &&
            (!element.family || element.family === family))) &&
            (element.unit ? 
              componentLabelField(
                  [element.name],
                  element.label,
                  element.col_size || colSize,
                element.unit
                )
              : componentLabelField([element.name], element.label, element.col_size || colSize))
      ) : null;
  };

  const subTitleItem = subTitle => {
    return subTitle ? (
      <Grid item xs={12} className={classes.sub_title} key="subTitle">
        {subTitle}
      </Grid>
    ) : null;
  };

  const tableFieldItems = (tbField, tbHead, tbBody) => {
    return (
      <Grid item xs={12} className={classes.col} key="tbField">
        {get(component, tbField, []).length > 0 && (
          <table>
            <thead className={classes.thead}>
              <tr>
                {map(tbHead, (element, idx) => (
                  <th key={idx} className={classes.th}>
                    {element}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {map(get(component, tbField, []), (pl, index) => (
                <tr key={index}>
                  {map(tbBody, (element, idx) => (
                    <td key={idx} className={classes.td}>
                      {element.isNumber
                        ? get(pl, element.field) && get(pl, element.field).fixFloat(3)
                        : get(pl, element.field)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Grid>
    );
  };

  const subFieldItems = (colSize, subKey, subFields, activationLogic, isDepthActivation) => {
    return subKey ? (
      <Grid container key={subKey}>
        {subFields &&
            map(
              BHA_TABLE_FIELD_TYPES,
              element =>
                includes(subFields, element.name) &&
                (!element.cond || (element.cond && get(component, element.cond, false))) &&
                ((element.unit || element.unit_from_segment) ? 
                  componentLabelField(
                      [element.name],
                      element.label,
                      element.col_size || colSize,
                      element.unit,
                      element.unit_from_segment
                    )
                  : componentLabelField([element.name], element.label, element.col_size || colSize))
            )}
        <Grid item md={4} xs={12} className={classes.col}>
          <span className={classes.field_label}>Activation Logic</span>
          <br />
          <span className={classes.field_value}>
            {getURLogicNameByKey(activationLogic) || 'n/a'}
          </span>
        </Grid>
        {isDepthActivation &&
            includes(subFields, 'ur_opened_depth') &&
            componentLabelField(['ur_opened_depth'], 'Activation Depth', colSize, 'length')}
      </Grid>
    ) : null;
  };

  const alternativeFieldItems = (colSize, fields) => {
    return fields ?
        map(
          BHA_ALTERNATIVE_FIELD_TYPES,
          element =>
            includes(fields, element.name) &&
            (!element.cond || (element.cond && get(component, element.cond, false))) &&
            (!element.family || element.family === family) &&
            (element.unit
              ? componentLabelField(
                  [element.name],
                  element.label,
                  element.col_size || colSize,
                  element.unit
                )
              : componentLabelField([element.name], element.label, element.col_size || colSize))
      ) : null;
  };

  const stabilizerFieldItems = (colSize, stablizerFields) => {
    return (stablizerFields && get(component, 'has_stabilizer')) ?
        map(
          BHA_STABILIZER_FIELD_TYPES,
          element =>
            includes(stablizerFields, element.name) &&
            (!element.cond || (element.cond && get(component, element.cond, false))) &&
            (!element.family || element.family === family) &&
            (element.unit
              ? componentLabelField(
                  ['stabilizer', element.name],
                  element.label,
                  element.col_size || colSize,
                  element.unit
                )
              : componentLabelField(
                  ['stabilizer', element.name],
                  element.label,
                  element.col_size || colSize
                ))
      ) : null;
  };

  const generalizedRow = item => {
    const colSize = item && +get(item, 'col_size');
    const fields = item && get(item, 'fields');
    const stablizerFields = item && get(item, 'stablizer_fields');
    const subTitle = item && get(item, 'sub_title');
    const subKey = item && get(item, 'sub_key');
    const subFields = item && get(item, 'sub_fields');
    const tbField = item && get(item, 'tb_field');
    const tbHead = item && get(item, 'tb_head');
    const tbBody = item && get(item, 'tb_body');
    const activationLogic = get(component, 'activation_logic');
    const isDepthActivation = activationLogic === UR_ACTIVATION_LOGIC_KEYS.DEPTH_ACTIVATION;

    return (
      <Grid container className={classes.row} key={item.key}>
        {generalFieldItems(colSize, fields)}
        {subTitleItem(subTitle)}
        {tableFieldItems(tbField, tbHead, tbBody)}
        {subFieldItems(colSize, subKey, subFields, activationLogic, isDepthActivation)}
        {alternativeFieldItems(colSize, fields)}
        {stabilizerFieldItems(colSize, stablizerFields)}
      </Grid>
    );
  };

  return (
    <div>
      <header className={classes.header}>
        <Button variant="contained" className={classes.done_button} onClick={onDone}>
          Close
        </Button>
        <h4 className={classes.title}>
          {get(component, 'name')} ( {get(component, 'family')} )
        </h4>
      </header>
      <Grid container>
        <Grid item xs={12} className={classes.col}>
          {map(curComponentData, item => generalizedRow(item))}
        </Grid>
      </Grid>
    </div>
  );
}

BHAComponentDetail.propTypes = {
  component: PropTypes.shape({}).isRequired,
  onDone: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

export default memo(BHAComponentDetail);
