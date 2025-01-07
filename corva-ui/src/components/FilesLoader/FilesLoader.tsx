import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Typography, LinearProgress } from '@material-ui/core';
import { Delete as DeleteIcon, Close as CloseIcon } from '@material-ui/icons';
import IconButton from '~/components/IconButton';
import Button from '~/components/Button';

import IconWarning from './Icons/IconWarning';
import IconSuccess from './Icons/IconSuccess';
import IconRefresh from './Icons/IconRefresh';
import LoaderIcon from './Icons/IconLoader.svg';
import FileIcon from './Icons/FileIcon';
import UploadIcon from './Icons/UploadIcon';
import { useStyles } from './useStyles';

function getInitSizeParams(sizeBytes, unit, customUnitName) {
  if (unit === 'time') {
    return {
      downloaded: 0,
      unit: 'min',
      convertedSize: sizeBytes,
    };
  }

  if (unit === 'custom') {
    return {
      downloaded: 0,
      unit: customUnitName,
      convertedSize: sizeBytes,
    };
  }

  if (sizeBytes >= 10 ** 6) {
    return {
      downloaded: 0,
      unit: 'MB',
      convertedSize: Math.floor(sizeBytes / 10 ** 5) / 10,
    };
  }
  if (sizeBytes >= 10 ** 3) {
    return {
      downloaded: 0,
      unit: 'KB',
      convertedSize: Math.floor(sizeBytes / 10 ** 2) / 10,
    };
  }
  return {
    downloaded: 0,
    unit: 'B',
    convertedSize: Math.floor(sizeBytes * 10) / 10,
  };
}

interface FilesLoaderProps extends PropTypes.InferProps<typeof filesLoaderPropTypes> {}
interface SizeParams {
  downloaded?: number;
  convertedSize?: number;
  unit?: string;
}

function FilesLoader({
  size,
  unit,
  name,
  customUnitName,
  sizeBytes,
  handleCancel,
  onReload,
  onDelete,
  loadedBytes,
  error,
  errorText,
  formatError,
  importButtonType,
  isLoadingAnimation,
  showActions,
}: FilesLoaderProps): JSX.Element {
  const classes = useStyles();
  const [sizeParams, setSizeParams] = useState<SizeParams>({});
  const [progressPercent, setProgressPercent] = useState(0);
  const [isSuccessButtonVisible, setIsSuccessButtonVisible] = useState(true);
  const isLarge = size === 'large';

  const handleCancelProgress = () => {
    handleCancel(name);
    setProgressPercent(0);
    setSizeParams(prev => ({ ...prev, downloaded: 0 }));
  };

  useEffect(() => {
    setSizeParams(getInitSizeParams(sizeBytes, unit, customUnitName));
  }, [sizeBytes, unit]);

  useEffect(() => {
    if (loadedBytes && sizeBytes) {
      const currentPercent = Math.round((loadedBytes / sizeBytes) * 100);
      setSizeParams(prev => ({
        ...prev,
        downloaded: Math.floor((prev.convertedSize * currentPercent) / 10) / 10,
      }));
      setProgressPercent(currentPercent);
    }
  }, [loadedBytes, sizeBytes]);

  useEffect(() => {
    let timerId;
    if (onDelete && progressPercent >= 100) {
      setIsSuccessButtonVisible(true);
      timerId = setTimeout(() => {
        setIsSuccessButtonVisible(false);
      }, 5000);
    }
    return () => timerId && clearTimeout(timerId);
  }, [progressPercent]);

  useEffect(() => {
    if (error) {
      setProgressPercent(0);
      setSizeParams(prev => ({ ...prev, downloaded: 0 }));
    }
  }, [error]);

  const [iconButtonClassName, actionIconClassName] = useMemo(() => {
    const iconButtonStyle = classNames(classes.iconButton, {
      [classes.iconButtonLarge]: isLarge,
    });
    const actionIconStyle = classNames(classes.actionIcon, {
      [classes.actionIconLarge]: isLarge,
    });
    return [iconButtonStyle, actionIconStyle];
  }, [isLarge]);

  return (
    <div className={classes.fileStateWrapper}>
      <div className={classes.fileIconContainer}>
        <FileIcon name={name} style={{ fontSize: isLarge ? 48 : 32 }} />
      </div>
      <div className={classes.fileState}>
        <div className={classes.fileStateProgress}>
          <div className={classes.fileNameWrapper}>
            <Typography
              className={classNames(classes.fileName, { [classes.fileNameLarge]: isLarge })}
            >
              {name.length > 7 ? (
                <>
                  <span className={classes.firstPart}>{name.slice(0, name.length - 7)}</span>
                  <span>{name.slice(-7)}</span>
                </>
              ) : (
                name
              )}
            </Typography>
          </div>
          {!isLoadingAnimation && (
            <LinearProgress
              className={classes.progressBar}
              variant="determinate"
              value={progressPercent}
              classes={{
                colorPrimary: classNames(classes.progressBackground, {
                  [classes.progressBarError]: error,
                }),
                barColorPrimary: classNames(classes.progressBarColor, {
                  [classes.progressBarError]: error,
                }),
              }}
            />
          )}
          <div className={classes.loaderProgressContainer}>
            {!isLoadingAnimation && (
              <Typography
                className={classNames(classes.fileSize, { [classes.fileSizeLarge]: isLarge })}
                component="span"
              >
                {`${sizeParams.downloaded} of ${sizeParams.convertedSize} ${sizeParams.unit}`}
              </Typography>
            )}
            <div
              className={classNames(classes.progressStatus, { [classes.fileSizeLarge]: isLarge })}
            >
              {error && (
                <Typography component="div" className={classes.errorContainer}>
                  <IconWarning size={size} />
                  <Typography
                    component="span"
                    className={classNames(classes.errorText, { [classes.fileSizeLarge]: isLarge })}
                  >
                    {formatError
                      ? 'Upload Error. Unacceptable file format.'
                      : `Upload Error${errorText && `. ${errorText}`}`}
                  </Typography>
                </Typography>
              )}
              {!error && !isLoadingAnimation && `${progressPercent} %`}
            </div>
          </div>
        </div>

        {showActions && (
          <div className={classes.fileActions}>
            {progressPercent < 100 && !error && (
              <>
                {isLoadingAnimation ? (
                  <div
                    className={classNames(classes.loadingIcon, {
                      [classes.loadingLargeIcon]: isLarge,
                    })}
                    style={{ backgroundImage: `url(${LoaderIcon})` }}
                  />
                ) : (
                  <IconButton
                    tooltipProps={{ title: 'Cancel' }}
                    className={iconButtonClassName}
                    onClick={handleCancelProgress}
                  >
                    <CloseIcon classes={{ root: actionIconClassName }} />
                  </IconButton>
                )}
              </>
            )}

            {progressPercent === 100 &&
              !error &&
              (!isSuccessButtonVisible && onDelete ? (
                <IconButton
                  variant="contained"
                  tooltipProps={{ title: 'Delete' }}
                  className={iconButtonClassName}
                  onClick={onDelete}
                >
                  <DeleteIcon classes={{ root: actionIconClassName }} />
                </IconButton>
              ) : (
                <IconSuccess size={size} style={{ marginLeft: 12 }} />
              ))}

            {onReload && error && (
              <>
                {!formatError ? (
                  <IconButton
                    tooltipProps={{ title: 'Reload' }}
                    className={iconButtonClassName}
                    onClick={onReload}
                  >
                    <IconRefresh style={{ fontSize: isLarge ? 24 : 16 }} />
                  </IconButton>
                ) : (
                  <>
                    {importButtonType === 'default' ? (
                      <Button
                        size={isLarge ? 'medium' : 'small'}
                        variation="primary"
                        startIcon={<UploadIcon />}
                        onClick={onReload}
                      >
                        Import
                      </Button>
                    ) : (
                      <IconButton
                        tooltipProps={{ title: 'Import File' }}
                        className={iconButtonClassName}
                        onClick={onReload}
                      >
                        <UploadIcon style={{ fontSize: isLarge ? 24 : 16 }} />
                      </IconButton>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const filesLoaderPropTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  unit: PropTypes.oneOf(['size', 'time', 'custom']),
  customUnitName: PropTypes.string,
  onDelete: PropTypes.func,
  onReload: PropTypes.func,
  handleCancel: PropTypes.func,
  name: PropTypes.string,
  sizeBytes: PropTypes.number,
  error: PropTypes.bool,
  errorText: PropTypes.string,
  formatError: PropTypes.bool,
  importButtonType: PropTypes.oneOf(['default', 'icon']),
  loadedBytes: PropTypes.number.isRequired,
  isLoadingAnimation: PropTypes.bool,
  showActions: PropTypes.bool,
};

FilesLoader.propTypes = filesLoaderPropTypes;

FilesLoader.defaultProps = {
  size: 'small',
  unit: 'size',
  onDelete: null,
  onReload: null,
  name: '',
  customUnitName: '',
  sizeBytes: 1,
  error: null,
  errorText: '',
  formatError: false,
  importButtonType: 'default',
  handleCancel: null,
  isLoadingAnimation: false,
  showActions: true,
};
export default FilesLoader;
