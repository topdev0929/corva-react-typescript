import { useMemo, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  IconButton,
  List,
  ListItem,
  TextField,
  Popover,
  CircularProgress,
  Tooltip,
} from '@material-ui/core';
import {
  Layers as LayersIcon,
  LayersClear as LayersClearIcon,
  AddCircle as AddCircleIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  FileCopy as CopyIcon,
} from '@material-ui/icons';
import classnames from 'classnames';
import { get, omit } from 'lodash';

import TemplateSharingDialog from '../TemplateSharingDialog';
import { useTemplatePopoverStyles } from './Styles';

const NO_TEMPLATE_SELECTED_ID = -100;
const DUPLICATED_NAME_ERROR_MESSAGE = 'Duplicated name';

const TEMPLATE_TYPES = {
  USER: 'USER',
  DEFAULT: 'DEFAULT',
  SHARED: 'SHARED',
};

const NO_TEMPLATE_MSG = {
  [TEMPLATE_TYPES.USER]: 'No templates yet...',
  [TEMPLATE_TYPES.DEFAULT]: 'No templates yet...',
  [TEMPLATE_TYPES.SHARED]: 'No shared templates yet...',
};

const TEMPLATE_LABELS = {
  [TEMPLATE_TYPES.USER]: 'My Template',
  [TEMPLATE_TYPES.DEFAULT]: 'Default Templates',
  [TEMPLATE_TYPES.SHARED]: 'Shared With Me',
};

function TemplatePopover({
  currentUser,
  // popover
  open,
  anchorEl,
  anchorOrigin,
  transformOrigin,
  onClose,
  // templates
  templates,
  activeTemplateId,
  getDefaultTemplates,
  getUserTemplates,
  getSharedTemplates,
  onAddNewTemplate,
  onTemplateDelete,
  onTemplateCopy,
  onTemplateEdit,
  onTemplateShare,
  onActiveTemplateChange,
  loading,
  classes: customMuiStyles,
  // custome slot
  hasNameSlot,
  renderSlot,
}) {
  const classes = useTemplatePopoverStyles();
  const [allTemplates, setAllTemplates] = useState(templates);
  const [templateToShare, setTemplateToShare] = useState(null);
  const [error, setError] = useState({});
  useEffect(() => {
    setAllTemplates(templates);
  }, [templates]);

  // NOTE: Group template by type
  const groupedTemplates = useMemo(
    () => [
      {
        type: TEMPLATE_TYPES.USER,
        templatesList: getUserTemplates(allTemplates),
      },
      {
        type: TEMPLATE_TYPES.DEFAULT,
        templatesList: getDefaultTemplates(allTemplates),
      },
      {
        type: TEMPLATE_TYPES.SHARED,
        templatesList: getSharedTemplates(allTemplates),
      },
    ],
    [allTemplates]
  );

  const handleClickTemplate = nextActiveTemplateId => () => {
    onActiveTemplateChange(nextActiveTemplateId);
  };

  const handleChange = (templateId, callback) => e => {
    e.stopPropagation();
    callback(templateId);
  };

  // NOTE: Handlers for template name change
  const handleTemplateNameEdit = templateId => e => {
    e.stopPropagation();
    setAllTemplates(
      allTemplates.map(item =>
        item.id === templateId ? { ...item, isEditing: true, prevName: item.name } : item
      )
    );
  };
  const handleTemplateNameChange = templateId => e => {
    e.stopPropagation();

    const allTemplateNames = allTemplates
      .filter(template => template.id !== templateId)
      .map(template => template.name);
    if (allTemplateNames.includes(e.target.value)) {
      setError({
        ...error,
        [templateId]: DUPLICATED_NAME_ERROR_MESSAGE,
      });
    } else {
      setError({
        ...error,
        [templateId]: null,
      });
    }

    setAllTemplates(
      allTemplates.map(item => (item.id === templateId ? { ...item, name: e.target.value } : item))
    );
  };
  const handleTemplateNameEditApply = templateId => e => {
    e.stopPropagation();
    setAllTemplates(
      allTemplates.map(item => (item.id === templateId ? { ...item, isEditing: false } : item))
    );
    const currentTemplate = allTemplates.find(template => template.id === templateId);
    onTemplateEdit(omit(currentTemplate, ['prevName', 'isEditing']));
  };
  const handleTemplateNameEditCancel = templateId => e => {
    e.stopPropagation();
    setAllTemplates(
      allTemplates.map(item =>
        item.id === templateId ? { ...item, name: item.prevName, isEditing: false } : item
      )
    );
  };
  const handleKeyDown = templateId => e => {
    if (e.key === 'Enter') {
      setAllTemplates(
        allTemplates.map(item => (item.id === templateId ? { ...item, isEditing: false } : item))
      );
      const currentTemplate = allTemplates.find(template => template.id === templateId);
      onTemplateEdit(omit(currentTemplate, ['prevName', 'isEditing']));
    }
  };

  // NOTE: Handlers for template sharing
  const handleTemplateSharingDialogOpen = templateId => e => {
    e.stopPropagation();
    const currentTemplate = allTemplates.find(item => item.id === templateId);
    setTemplateToShare(currentTemplate);
  };
  const handleTemplateSharingDialogClose = () => {
    setTemplateToShare(null);
  };
  const handleTemplateSharingSave = usersToShare => {
    if (templateToShare) {
      onTemplateShare(templateToShare.id, usersToShare);
    }
    handleTemplateSharingDialogClose();
  };

  return (
    <Popover
      id="app-settings-template-popper"
      classes={{
        paper: classnames(classes.paper, customMuiStyles.paper),
      }}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <div className={classes.paperWrapper}>
        <div className={classes.titleWrapper}>
          <Typography className={classes.title}>Templates</Typography>
          {loading && <CircularProgress size={16} />}
        </div>

        <div
          className={classnames(classes.selectedGroup, {
            [classes.selectedGroupSelected]: activeTemplateId === NO_TEMPLATE_SELECTED_ID,
            [classes.selectedGroupUnSelected]: activeTemplateId !== NO_TEMPLATE_SELECTED_ID,
          })}
          onClick={handleClickTemplate(NO_TEMPLATE_SELECTED_ID)}
        >
          <div className={classes.noTemplateItem}>
            {activeTemplateId === NO_TEMPLATE_SELECTED_ID ? (
              <CheckIcon fontSize="small" className={classes.selectedIcon} />
            ) : (
              <LayersClearIcon fontSize="small" className={classes.selectedIcon} />
            )}
            <div className={classes.selectedLabel}>No Template Selected</div>
          </div>
        </div>

        {groupedTemplates.map(({ type, templatesList }) => (
          <Fragment key={`template-list-${type}`}>
            <div className={classes.templateHeader}>
              <Typography className={classes.subtitle}>{TEMPLATE_LABELS[type]}</Typography>
              {type === TEMPLATE_TYPES.USER && (
                <Tooltip title="Create Template" placement="right">
                  <AddCircleIcon
                    fontSize="small"
                    color="primary"
                    className={classes.addNewTemplateIcon}
                    onClick={onAddNewTemplate}
                  />
                </Tooltip>
              )}
            </div>

            {templatesList.length === 0 ? (
              <Typography className={classes.noTemplateLabel}>{NO_TEMPLATE_MSG[type]}</Typography>
            ) : (
              <List className={classes.templateList}>
                {templatesList.map(template => (
                  <Tooltip
                    key={`template-list-item-${template.id}`}
                    title={template.disabled ? template.tooltipTitle : ''}
                  >
                    <ListItem
                      className={classnames(classes.templateListItem, {
                        [classes.templateListItemSelected]: template.id === activeTemplateId,
                        [classes.templateListItemUnSelected]: template.id !== activeTemplateId,
                      })}
                      onClick={template.disabled ? null : handleClickTemplate(template.id)}
                      disabled={template.disabled ?? false}
                    >
                      {template.id === activeTemplateId ? (
                        <CheckIcon
                          fontSize="small"
                          {...(template.isEditing && { color: 'primary' })}
                        />
                      ) : (
                        <LayersIcon
                          fontSize="small"
                          {...(template.isEditing && { color: 'primary' })}
                        />
                      )}

                      {template.isEditing ? (
                        <TextField
                          autoFocus
                          className={classes.templateListItemInput}
                          value={template.name}
                          onClick={e => e.stopPropagation()}
                          onChange={handleTemplateNameChange(template.id)}
                          onKeyDown={handleKeyDown(template.id)}
                          error={!!error[template.id]}
                          helperText={error[template.id]}
                        />
                      ) : (
                        <Typography className={classes.templateListItemName}>
                          {template.name}
                        </Typography>
                      )}

                      {!template.isEditing
                        ? hasNameSlot && renderSlot(get(template, ['settings', 'data'], []))
                        : null}

                      {template.isEditing ? (
                        <div
                          className={classnames(
                            classes.actionWrapper,
                            classes.actionWrapperEditing
                          )}
                        >
                          <Tooltip title="Save">
                            <IconButton
                              className={classes.actionIconButton}
                              onClick={handleTemplateNameEditApply(template.id)}
                            >
                              <CheckIcon fontSize="small" color="primary" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Cancel">
                            <IconButton
                              className={classes.actionIconButton}
                              onClick={handleTemplateNameEditCancel(template.id)}
                            >
                              <CloseIcon className={classes.actionIcon} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      ) : (
                        <div
                          className={classnames(classes.actionWrapper, {
                            [classes.actionWrapperHidden]: template.disabled,
                          })}
                        >
                          {type === TEMPLATE_TYPES.USER ? (
                            <>
                              <Tooltip title="Delete">
                                <IconButton
                                  className={classes.actionIconButton}
                                  onClick={handleChange(template.id, onTemplateDelete)}
                                >
                                  <DeleteIcon className={classes.actionIcon} fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Rename">
                                <IconButton
                                  className={classes.actionIconButton}
                                  onClick={handleTemplateNameEdit(template.id)}
                                >
                                  <EditIcon className={classes.actionIcon} fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Copy">
                                <IconButton
                                  className={classes.actionIconButton}
                                  onClick={handleChange(template.id, onTemplateCopy)}
                                >
                                  <CopyIcon className={classes.actionIcon} fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Share">
                                <IconButton
                                  className={classes.actionIconButton}
                                  onClick={handleTemplateSharingDialogOpen(template.id)}
                                >
                                  <ShareIcon className={classes.actionIcon} fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Copy To My Templates">
                              <IconButton
                                className={classes.actionIconButton}
                                onClick={handleChange(template.id, onTemplateCopy)}
                              >
                                <CopyIcon className={classes.actionIcon} fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </div>
                      )}
                    </ListItem>
                  </Tooltip>
                ))}
              </List>
            )}
          </Fragment>
        ))}
      </div>

      <TemplateSharingDialog
        title={`Share "${get(templateToShare, 'name')}"`}
        open={!!templateToShare}
        onSave={handleTemplateSharingSave}
        onCancel={handleTemplateSharingDialogClose}
        currentUser={currentUser}
      />
    </Popover>
  );
}

TemplatePopover.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.node,
  anchorOrigin: PropTypes.shape({}),
  transformOrigin: PropTypes.shape({}),
  onClose: PropTypes.func.isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      settings: PropTypes.shape({}),
      shared: PropTypes.bool,
    })
  ).isRequired,
  activeTemplateId: PropTypes.number.isRequired,
  getDefaultTemplates: PropTypes.func.isRequired, // Needs to be pure function
  getUserTemplates: PropTypes.func.isRequired, // Needs to be pure function
  getSharedTemplates: PropTypes.func.isRequired, // Needs to be pure function
  onAddNewTemplate: PropTypes.func.isRequired, // () => {}
  onTemplateDelete: PropTypes.func.isRequired, // templateId => {}
  onTemplateCopy: PropTypes.func.isRequired, // templateId => {}
  onTemplateEdit: PropTypes.func.isRequired, // newTemplate => {}
  onTemplateShare: PropTypes.func.isRequired, // (templateId, users) => {}
  onActiveTemplateChange: PropTypes.func.isRequired, // templateId => {}
  loading: PropTypes.bool, // Template loading status

  // Customize styles
  classes: PropTypes.shape({
    paper: PropTypes.string,
  }),
  hasNameSlot: PropTypes.bool,
  renderSlot: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

TemplatePopover.defaultProps = {
  loading: false,
  classes: {},
  hasNameSlot: false,
  anchorEl: null,
  anchorOrigin: {},
  transformOrigin: {},
};

export default TemplatePopover;
