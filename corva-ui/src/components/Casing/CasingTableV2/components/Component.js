import { memo, useEffect, useState } from 'react';
import classNames from 'classnames';
import { omit } from 'lodash';
import PropTypes from 'prop-types';
import { Grid, Menu, MenuItem } from '@material-ui/core';
import { validateComponent } from '~/utils/casing/validation';
import { COMPONENT_FAMILIES } from '~/constants/casing';
import { CasingComponentIcon as ComponentIcon } from '~/components';

import {
  FormatedNumber,
  ExpandCollapseButton,
  MoreButton,
  StaticField,
  ConfirmationPopup,
} from '~/components/Drillstring/BHAComponentsTable/components/shared';
import { calculateComponent } from '~/components/Drillstring/BHAComponentsTable/components/utils/calculation';
import { useStyles } from '~/components/Drillstring/BHAComponentsTable/components/sharedStyles';
import { Browser as DrillPipeBrowser, Editor as DrillPipeEditor } from './DrillPipe';
import { Browser as ComponentBrowser, Editor as ComponentEditor } from './CasingJoints';
import EditComponentDialog from './EditComponentDialog';

function getComponentName(family) {
  return COMPONENT_FAMILIES.find(item => item.type === family)?.name || '—';
}

function Component({
  component,
  viewColumnsPerRow,
  editColumnsPerRow,
  isDraft,
  onCancel,
  onDelete,
  onSave,
  onChangeEditing,
  isMobile,
  isDragComponent,
}) {
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [tempComponent, setTempComponent] = useState(component);
  const [isOpenSaveConfirm, setIsOpenSaveConfirm] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenEditorDialog, setIsOpenEditorDialog] = useState(false);
  const [error, setError] = useState(null);

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
    const result = validateComponent(newComponent);
    setTempComponent(newComponent);
    if (!result.isValid) {
      setError(result.errors);
    } else {
      setError(null);
    }
  };

  const handleUseSuggestion = suggestion => {
    setTempComponent(prev => {
      return {
        ...prev,
        ...suggestion,
      };
    });
  };

  const handleConfirmSave = () => {
    const result = validateComponent(tempComponent);
    if (!result.isValid) {
      setError(result.errors);
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
      onCancel: handleCancel,
      onSave: isMobile ? handleSave : handleConfirmSave,
      onUseSuggestion: handleUseSuggestion,
      columns: editColumnsPerRow,
    };

    if (isMobile) {
      setIsOpenEditorDialog(true);
    } else {
      return (
        <div className={classes.component}>
          {(family === 'dp' || family === 'hwdp') && <DrillPipeEditor {...componentProps} />}
          {family !== 'dp' && family !== 'hwdp' && <ComponentEditor {...componentProps} />}

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
          {tempComponent.family !== 'dp' && tempComponent.family !== 'hwdp' && (
            <ComponentBrowser component={tempComponent} columns={viewColumnsPerRow} />
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
          onCancel={handleCancel}
          onSave={handleConfirmSave}
          onUseSuggestion={handleUseSuggestion}
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
  component: PropTypes.shape({
    family: PropTypes.string,
    size: PropTypes.number,
    outer_diameter: PropTypes.number,
    inner_diameter: PropTypes.number,
    linear_weight: PropTypes.number,
    length: PropTypes.number,
  }).isRequired,
  isMobile: PropTypes.bool.isRequired,
  isDraft: PropTypes.bool,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  onChangeEditing: PropTypes.func,
  viewColumnsPerRow: PropTypes.number.isRequired,
  editColumnsPerRow: PropTypes.number.isRequired,
  isDragComponent: PropTypes.bool.isRequired,
};

Component.defaultProps = {
  isDraft: false,
  onCancel: null,
  onDelete: null,
  onChangeEditing: undefined,
};

export default memo(Component);
