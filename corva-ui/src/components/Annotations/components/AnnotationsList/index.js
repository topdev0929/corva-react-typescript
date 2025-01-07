import { memo, useState, useEffect, useRef } from 'react';
import { func, bool, shape, number, string } from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Typography, IconButton, Tooltip, RootRef } from '@material-ui/core';
import BackIcon from '@material-ui/icons/ChevronLeft';

import { showSuccessNotification } from '~/utils';
import { isNativeDetected } from '~/utils/mobileDetect';
import InfiniteList from '~components/InfiniteList';
import useOutsideClick from '~effects/useOutsideClick';

import AddAnnotationForm from './components/AddAnnotationForm';
import Annotation from './components/Annotation';

import { getAnnotations } from '../../../../clients/jsonApi';
import { useAnnotationsState, useAnnotationsDispatch } from '../../AnnotationsContext';
import { SET_ANNOTATIONS, APPEND_ANNOTATIONS } from '../../constants';

import styles from './style.css';

const PAGE_NAME = 'AppAnnotationsPo';

const muiStyles = theme => ({
  title: { fontWeight: 200, marginBottom: 20 },
  secondaryTitle: {
    fontWeight: 200,
    textTransform: 'uppercase',
    color: theme.palette.grey[600],
  },
  annotateIcon: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  },
  noAnnotations: { marginTop: 16 },
  backIcon: { cursor: 'pointer', color: theme.palette.grey[600], padding: 5 },
});

const PER_PAGE = 4;

const AnnotationsList = ({
  appId,
  appTitle,
  assetId,
  assetCompanyId,
  appSettings,
  currentUser,
  onClose,
  isNative,
  classes,
  dashboardType,
}) => {
  const { annotations } = useAnnotationsState();
  const dispatch = useAnnotationsDispatch();

  const rootRef = useRef();
  const footerRef = useRef();

  const infiniteContainerHeight = () => {
    if (rootRef.current && footerRef.current)
      return rootRef.current.clientHeight - footerRef.current.clientHeight;
    return null;
  };

  useOutsideClick(rootRef, onClose);

  const [isOpen, setIsOpen] = useState(false);
  const [isInfiniteLoading, setIsInfiniteLoading] = useState(true);
  const [moreItemsMayExist, setMoreItemsMayExist] = useState(true);
  const [page, setPage] = useState(1);

  async function handleFetchAnnotations() {
    if (!(appId && assetId)) return;
    setIsInfiniteLoading(true);

    let response;
    try {
      const options = {
        page,
        per_page: PER_PAGE,
        sort: 'created_at',
        order: 'desc',
      };
      if (dashboardType) options.dashboard_type = dashboardType;

      response = await getAnnotations(appId, assetId, options);
      dispatch({
        type: page === 1 ? SET_ANNOTATIONS : APPEND_ANNOTATIONS,
        annotations: response,
      });
    } catch (e) {
      console.error(e);
    }

    const lessThanPerPage = response && response.data.length < PER_PAGE;

    setPage(page + 1);
    setMoreItemsMayExist(!lessThanPerPage);
    setIsInfiniteLoading(false);
  }

  useEffect(() => {
    setIsOpen(true); // NOTE: Opens here because of for the sliding effect on open
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <RootRef rootRef={rootRef}>
      <Paper
        className={classNames(styles.cAnnotationsList, {
          [styles.cAnnotationsListOpen]: isOpen,
          [styles.cAnnotationsListOpenNative]: isNative,
        })}
      >
        <InfiniteList
          infiniteClassName={styles.cAnnotationsListContentContainer}
          headerComponent={
            <>
              <Typography
                data-testid={`${PAGE_NAME}_appTitle`}
                variant="body1"
                className={classes.title}
              >
                {appTitle}
              </Typography>

              <div className={styles.cAnnotationsListContentTop}>
                <Typography
                  data-testid={`${PAGE_NAME}_annotationsTitle`}
                  variant="caption"
                  className={classes.secondaryTitle}
                >
                  Annotations ({annotations.data ? annotations.data.length : 0})
                </Typography>
              </div>

              <AddAnnotationForm
                appId={appId}
                assetId={assetId}
                assetCompanyId={assetCompanyId}
                appSettings={appSettings}
                currentUser={currentUser}
                dashboardType={dashboardType}
              />
            </>
          }
          useWindow={isNative}
          items={annotations.data || []}
          showNoItemsFound={
            (!annotations.data || annotations.data.length === 0) && !isInfiniteLoading
          }
          noItemsFoundLabel={
            <Typography
              variant="body2"
              data-testid={`${PAGE_NAME}_noAnnotations`}
              className={classes.noAnnotations}
            >
              No Annotations yet
            </Typography>
          }
          threshold={50}
          infiniteContainerHeight={infiniteContainerHeight()}
          moreItemsMayExist={moreItemsMayExist}
          pathToCreatedAt={['attributes', 'created_at']}
          renderItem={item => (
            <Annotation
              key={item.id}
              isNative={isNative}
              annotation={item}
              assetCompanyId={assetCompanyId}
              included={annotations.included}
              currentUser={currentUser}
              showSuccessNotification={showSuccessNotification}
            />
          )}
          loadItems={handleFetchAnnotations}
        />
        <div className={styles.cAnnotationsListActions} ref={footerRef}>
          <Tooltip title="Hide" placement="bottom">
            <IconButton
              data-testid={`${PAGE_NAME}_hideButton`}
              onClick={onClose}
              className={classes.backIcon}
            >
              <BackIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Paper>
    </RootRef>
  );
};

AnnotationsList.propTypes = {
  appId: number.isRequired,
  appTitle: string.isRequired,
  assetId: number.isRequired,
  assetCompanyId: number.isRequired,
  appSettings: shape(),
  classes: shape().isRequired,
  onClose: func.isRequired,
  currentUser: shape({}).isRequired,
  isNative: bool,
  dashboardType: string,
};

AnnotationsList.defaultProps = {
  appSettings: {},
  isNative: isNativeDetected,
  dashboardType: null,
};

export default withStyles(muiStyles)(memo(AnnotationsList));
