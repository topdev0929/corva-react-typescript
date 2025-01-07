import { memo, useState, useRef } from 'react';
import { number, shape, string } from 'prop-types';
import classNames from 'classnames';
import { get, flowRight } from 'lodash';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import { Paper, Fade, Typography } from '@material-ui/core';

import Avatar from '~components/Avatar';
import useOutsideClick from '~effects/useOutsideClick';

import { showSuccessNotification, showErrorNotification } from '~/utils';
import { postAnnotation } from '~/clients/jsonApi';

import { useAnnotationsDispatch } from '../../../../AnnotationsContext';
import { ADD_ANNOTATION } from '../../../../constants';

import AnnotationInput from '../AnnotationInput';

import styles from './style.css';
import { withUniversalLocationHOC } from '~components/DevCenter';

const PAGE_NAME = 'AppAnnotationsPo';

const ANNOTATION_PLACEHOLDER = 'Type annotation here';

const muiStyles = theme => ({
  inputLabel: {
    color: theme.palette.grey[700],
    fontWeight: 200,
    width: '100%',
  },
});

const AddAnnotationForm = ({
  appId,
  assetId,
  assetCompanyId,
  appSettings,
  currentUser,
  classes,
  location,
  dashboardType,
}) => {
  const dispatch = useAnnotationsDispatch();

  const [inputIsOpen, setInputIsOpen] = useState(false);

  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    setInputIsOpen(false);
  });

  const handlePost = async (body, period, attachment) => {
    try {
      const annotation = {
        app_id: appId,
        asset_id: assetId,
        body,
        active_until: period,
        attachment: {
          file_name: attachment && attachment.attachmentName,
          s3_link: attachment && attachment.attachmentUrl,
        },
        settings: appSettings,
      };
      const options = {};
      if (dashboardType) options.dashboard_type = dashboardType;

      const queryTime = get(location, 'query.time');
      if (queryTime) annotation.data_timestamp = moment(queryTime).format();

      const newAnnotation = await postAnnotation(annotation, options);
      dispatch({ type: ADD_ANNOTATION, annotation: newAnnotation });
    } catch (e) {
      showErrorNotification('Error during annotation creation');
      console.error(e);
      return;
    }

    showSuccessNotification('Annotation has been added');
    setInputIsOpen(false);
  };

  return (
    <div className={styles.cAddAnnotationFormInput}>
      <Avatar
        displayName={`${currentUser.first_name} ${currentUser.last_name}`}
        imgSrc={currentUser.profile_photo}
        size={36}
      />
      <div
        className={classNames(styles.cAddAnnotationFormInputPaper, {
          [styles.cAddAnnotationFormInputPaperOpened]: inputIsOpen,
          [styles.cAddAnnotationFormInputPaperClosed]: !inputIsOpen,
        })}
      >
        <Fade in={!inputIsOpen} timeout={500}>
          <Paper className={styles.cAddAnnotationFormInputPaperLabel}>
            <Typography
              variant="body2"
              data-testid={`${PAGE_NAME}_collapsedInput`}
              className={classes.inputLabel}
              onClick={() => setInputIsOpen(true)}
            >
              {ANNOTATION_PLACEHOLDER}
            </Typography>
          </Paper>
        </Fade>
        <Fade in={inputIsOpen} timeout={100}>
          <div className={styles.cAddAnnotationFormInputPaperAddAnnotation}>
            {inputIsOpen && (
              <AnnotationInput
                onSend={handlePost}
                assetCompanyId={assetCompanyId}
                currentUser={currentUser}
              />
            )}
          </div>
        </Fade>
      </div>
    </div>
  );
};

AddAnnotationForm.propTypes = {
  appId: number.isRequired,
  assetId: number.isRequired,
  assetCompanyId: number.isRequired,
  appSettings: shape().isRequired,
  currentUser: shape({}),
  classes: shape().isRequired,
  location: shape().isRequired,
  dashboardType: string,
};

AddAnnotationForm.defaultProps = {
  currentUser: {},
  dashboardType: null,
};

export default flowRight([withStyles(muiStyles), withUniversalLocationHOC])(
  memo(AddAnnotationForm)
);
