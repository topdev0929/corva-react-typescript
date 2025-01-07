import { memo, useEffect, useState } from 'react';
import classNames from 'classnames';
import { map, isEmpty, omit } from 'lodash';
import PropTypes from 'prop-types';
import { Grid, Menu, MenuItem } from '@material-ui/core';
import { showErrorNotification } from '~/utils';
import { COMPONENT_FAMILIES } from '~/constants/drillstring';
import { BHAComponentIcon as ComponentIcon } from '~/components';

import {
  FormatedNumber,
  ExpandCollapseButton,
  MoreButton,
  StaticField,
  ConfirmationPopup,
} from './shared';
import { useStyles } from './sharedStyles';
import { calculateComponent } from './utils/calculation';

import { Browser as AgitatorBrowser, Editor as AgitatorEditor } from './Agitator';
import { Browser as BitBrowser, Editor as BitEditor } from './Bit';
import { Browser as DrillCollarBrowser, Editor as DrillCollarEditor } from './DrillCollar';
import { Browser as DrillPipeBrowser, Editor as DrillPipeEditor } from './DrillPipe';
import { Browser as JarBrowser, Editor as JarEditor } from './Jar';
import { Browser as LwdBrowser, Editor as LwdEditor } from './Lwd';
import { Browser as MwdBrowser, Editor as MwdEditor } from './Mwd';
import { Browser as PdmBrowser, Editor as PdmEditor } from './Pdm';
import { Browser as RssBrowser, Editor as RssEditor } from './Rss';
import { Browser as StabilizerBrowser, Editor as StabilizerEditor } from './Stabilizer';
import { Browser as SubBrowser, Editor as SubEditor } from './Sub';
import { Browser as UrBrowser, Editor as UrEditor } from './Ur';

import EditComponentDialog from './EditComponentDialog';

function getComponentName(family) {
  return COMPONENT_FAMILIES.drilling.find(item => item.type === family)?.name || '—';
}

function Component({
  isMobile,
  viewColumnsPerRow,
  editColumnsPerRow,
  component,
  validate,
  isDraft,
  onCancel,
  onDelete,
  onSave,
  onChangeEditing,
  onAutocompleteApplied,
  isDragComponent
}) {
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [isOpenSaveConfirm, setIsOpenSaveConfirm] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [tempComponent, setTempComponent] = useState(component);
  const [error, setError] = useState(null);
  const [isOpenEditorDialog, setIsOpenEditorDialog] = useState(false);

  const classes = useStyles({ isMobile, isEditing: tempComponent.is_editing, isDragComponent });

  useEffect(() => {
    if (onChangeEditing) onChangeEditing(tempComponent.is_editing);
  }, [tempComponent.is_editing]);

  const handleExpandCollapse = () => {
    setTempComponent(prev => {
      return prev.is_expanded ? { ...prev, is_expanded: false } : { ...prev, is_expanded: true };
    });
  };

  const handleOpenActionMenu = e => {
    setActionAnchorEl(e.currentTarget);
  };

  const handleCloseActionMenu = () => {
    setActionAnchorEl(null);
  };

  const handleEdit = () => {
    setActionAnchorEl(null);
    setTempComponent(prev => ({ ...prev, is_editing: true }));
  };

  const handleConfirmDelete = () => {
    setActionAnchorEl(null);
    setIsOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    onDelete(component);
  };

  const handleCancel = () => {
    setError(null);
    if (isDraft) {
      onCancel();
      return;
    }

    setTempComponent(component);
  };

  const handleChange = (key, value) => {
    const newComponent = calculateComponent(tempComponent, key, value);
    const result = validate(newComponent, isDraft);
    setTempComponent(newComponent);
    if (result) {
      setError(result.components[tempComponent.id]);
    } else {
      setError(null);
    }
  };

  const handleUseSuggestion = suggestion => {
    if (onAutocompleteApplied) {
      onAutocompleteApplied(true);
    }
    setTempComponent(prev => {
      return {
        ...prev,
        ...suggestion,
      };
    });
  };

  const handleConfirmSave = () => {
    const result = validate(tempComponent, isDraft);
    if (result) {
      setError(result.components[tempComponent.id]);

      // TODO: handle global errors notification
      const globalErros = {
        ...omit(result, ['general', 'components', 'specificErrors']),
        ...result.general,
      };
      if (globalErros && !isEmpty(globalErros)) {
        map(globalErros, msg => {
          showErrorNotification(msg);
        });
      }
      return;
    }

    setError(null);
    setIsOpenSaveConfirm(true);
  };

  const handleSave = () => {
    setIsOpenSaveConfirm(false);
    setIsOpenEditorDialog(false);

    const { is_editing, ...saving } = tempComponent;

    setTempComponent(saving);

    onSave(omit(saving, ['is_expanded']), isDraft);
  };

  const contentCellName = classNames(classes.cell, classes.ratioWidth, {
    [classes.focusedFontsize]: tempComponent.is_editing || tempComponent.is_expanded,
  });

  if (tempComponent.is_editing && !isOpenEditorDialog) {
    const { family } = tempComponent;

    const componentProps = {
      component: tempComponent,
      isDraft,
      error,
      onChange: handleChange,
      onUseSuggestion: handleUseSuggestion,
      onCancel: handleCancel,
      onSave: isMobile ? handleSave : handleConfirmSave,
      columns: editColumnsPerRow,
    };

    if (isMobile) {
      setIsOpenEditorDialog(true);
    } else {
      return (
        <div className={classes.component}>
          {(family === 'dp' || family === 'hwdp') && <DrillPipeEditor {...componentProps} />}
          {family === 'agitator' && <AgitatorEditor {...componentProps} />}
          {family === 'bit' && <BitEditor {...componentProps} />}
          {family === 'dc' && <DrillCollarEditor {...componentProps} />}
          {family === 'jar' && <JarEditor {...componentProps} />}
          {family === 'lwd' && <LwdEditor {...componentProps} />}
          {family === 'mwd' && <MwdEditor {...componentProps} />}
          {family === 'pdm' && <PdmEditor {...componentProps} />}
          {family === 'rss' && <RssEditor {...componentProps} />}
          {family === 'stabilizer' && <StabilizerEditor {...componentProps} />}
          {family === 'sub' && <SubEditor {...componentProps} />}
          {family === 'ur' && <UrEditor {...componentProps} />}

          {isOpenSaveConfirm && (
            <ConfirmationPopup
              title="Save Changes?"
              text="You will not be able to recover it."
              okText="Save"
              handleClose={() => setIsOpenSaveConfirm(false)}
              handleOk={handleSave}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div
      className={classNames(classes.component, {
        [classes.componentMobile]: isMobile,
        [classes.componentExpandedMobile]: isMobile && tempComponent.is_expanded,
        [classes.componentActive]: Boolean(actionAnchorEl),
      })}
    >
      <div
        className={classNames(classes.row, {
          [classes.rowExpanded]: isMobile && tempComponent.is_expanded,
        })}
      >
        <div className={classNames(classes.cell, { [classes.componentMobileCell]: isMobile })}>
          <ComponentIcon component={tempComponent} />
        </div>
        <div className={contentCellName}>{getComponentName(tempComponent.family)}</div>
        {!isMobile && (
          <>
            <div className={contentCellName}>
              <FormatedNumber
                value={
                  tempComponent.family === 'bit' ? tempComponent.size : tempComponent.outer_diameter
                }
              />
            </div>
            <div className={contentCellName}>
              <FormatedNumber value={tempComponent.inner_diameter} />
            </div>
            <div className={contentCellName}>
              <FormatedNumber value={tempComponent.linear_weight} />
            </div>
            <div className={contentCellName}>
              <FormatedNumber value={tempComponent.length} format="0.0" />
            </div>
          </>
        )}
        <div className={classNames(classes.cell, classes.actionCell)}>
          <ExpandCollapseButton
            isExpanded={tempComponent.is_expanded}
            classes={classes}
            handleExpandCollapse={handleExpandCollapse}
          />
          <MoreButton classes={classes} handleOpenActionMenu={handleOpenActionMenu} />
        </div>
      </div>

      {tempComponent.is_expanded && (
        <>
          {isMobile && (
            <Grid container spacing={2} style={{ padding: '8px 4px 16px' }}>
              <StaticField
                label={tempComponent.family === 'bit' ? 'Bit Size' : 'OD'}
                unit="shortLength"
                value={
                  tempComponent.family === 'bit' ? tempComponent.size : tempComponent.outer_diameter
                }
              />
              {tempComponent.family !== 'bit' && (
                <StaticField label="ID" unit="shortLength" value={component.inner_diameter} />
              )}
              {tempComponent.family !== 'bit' && (
                <StaticField
                  label="Linear Weight"
                  unit="massPerLength"
                  value={component.linear_weight}
                  format="0.0"
                />
              )}
              <StaticField label="Length" unit="length" value={component.length} format="0.0" />
            </Grid>
          )}

          {(tempComponent.family === 'dp' || tempComponent.family === 'hwdp') && (
            <DrillPipeBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'agitator' && (
            <AgitatorBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'bit' && (
            <BitBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'dc' && (
            <DrillCollarBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'jar' && (
            <JarBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'lwd' && (
            <LwdBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'mwd' && (
            <MwdBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'pdm' && (
            <PdmBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'rss' && (
            <RssBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'stabilizer' && (
            <StabilizerBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'sub' && (
            <SubBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
          {tempComponent.family === 'ur' && (
            <UrBrowser component={tempComponent} columns={viewColumnsPerRow} />
          )}
        </>
      )}

      <Menu
        anchorEl={actionAnchorEl}
        keepMounted
        open={Boolean(actionAnchorEl)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={handleCloseActionMenu}
      >
        <MenuItem onClick={handleEdit} className={classes.menuItem}>
          Edit
        </MenuItem>
        {tempComponent.family !== 'bit' && (
          <MenuItem onClick={handleConfirmDelete} className={classes.menuItem}>
            Delete
          </MenuItem>
        )}
      </Menu>

      {isOpenDeleteDialog && (
        <ConfirmationPopup
          title="Delete Component?"
          text="You will not be able to recover it."
          okText="Delete"
          handleClose={() => setIsOpenDeleteDialog(false)}
          handleOk={handleDelete}
        />
      )}

      {isOpenEditorDialog && (
        <EditComponentDialog
          component={tempComponent}
          isDraft={isDraft}
          error={error}
          onChange={handleChange}
          onUseSuggestion={handleUseSuggestion}
          onCancel={handleCancel}
          onSave={handleConfirmSave}
          onClose={() => {
            handleCancel();
            setIsOpenEditorDialog(false);
          }}
        />
      )}

      {isMobile && isOpenSaveConfirm && (
        <ConfirmationPopup
          title="Save Changes?"
          text="You will not be able to recover it."
          okText="Save"
          handleClose={() => setIsOpenSaveConfirm(false)}
          handleOk={handleSave}
        />
      )}
    </div>
  );
}

Component.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  component: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    outer_diameter: PropTypes.number,
    inner_diameter: PropTypes.number,
    linear_weight: PropTypes.number,
    length: PropTypes.number,
  }).isRequired,
  isDraft: PropTypes.bool,
  validate: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  onChangeEditing: PropTypes.func,
  viewColumnsPerRow: PropTypes.number.isRequired,
  editColumnsPerRow: PropTypes.number.isRequired,
  onAutocompleteApplied: PropTypes.func,
  isDragComponent: PropTypes.bool.isRequired,
};

Component.defaultProps = {
  isDraft: false,
  onCancel: null,
  onDelete: null,
  onChangeEditing: undefined,
  onAutocompleteApplied: undefined,
};

export default memo(Component);
