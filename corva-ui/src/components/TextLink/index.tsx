import { Tooltip, makeStyles, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LanguageIcon from '@material-ui/icons/Language';
import { useDevCenterRouter } from '../DevCenter';

const StyledTooltip = withStyles({
  tooltip: {
    padding: '4px 8px',
    display: 'flex',
    alignItems: 'center',
  },
})(Tooltip);

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: '0.15px',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
    '&:visited': {
      color: theme.palette.primary.main,
    },
  },
  disabled: {
    color: theme.palette.primary.dark,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: '0.15px',
  },
  icon: {
    marginRight: 8,
  },
  buttonLink: {
    border: 'none',
    background: 'none',
    padding: 0,
    cursor: 'pointer',
  },
}));

type TextLinkProps = PropTypes.InferProps<typeof textLinkPropTypes>;

const TextLink = ({
  TooltipProps,
  children,
  className,
  disabled,
  showTooltip,
  tooltipText,
  target,
  href,
  ...LinkProps
}: TextLinkProps): JSX.Element => {
  const styles = useStyles();
  const devCenterRouter = useDevCenterRouter(); // Available only in DC apps in an iframe

  if (disabled) {
    return (
      <Tooltip title="Disabled" placement="bottom-start">
        <span className={classNames(styles.disabled, className)} {...LinkProps}>
          {children}
        </span>
      </Tooltip>
    );
  }

  const link =
    devCenterRouter && target === '_self' ? (
      <button
        tabIndex={0}
        role="link"
        className={classNames(styles.buttonLink, styles.root, className)}
        onClick={e => {
          if (e.metaKey || e.ctrlKey) {
            window.open(href, '_blank');
          } else {
            devCenterRouter.push(href);
          }
        }}
        {...LinkProps}
      >
        {children}
      </button>
    ) : (
      // TODO: use react-router API when it's availble & target=_self instead of `a` tag
      // to not reload the whole page
      // https://corvaqa.atlassian.net/browse/DC-3914
      <a
        className={classNames(styles.root, className)}
        target={target}
        href={href}
        rel="noopener noreferrer"
        {...LinkProps}
      >
        {children}
      </a>
    );

  if (showTooltip || tooltipText) {
    return (
      <StyledTooltip
        title={
          <>
            <LanguageIcon fontSize="small" className={styles.icon} />
            {tooltipText || href}
          </>
        }
        placement="bottom-start"
        {...TooltipProps}
      >
        {link}
      </StyledTooltip>
    );
  }

  return link;
};

const textLinkPropTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  target: PropTypes.oneOf(['_self', '_blank']),
  disabled: PropTypes.bool,
  showTooltip: PropTypes.bool,
  tooltipText: PropTypes.string,
  TooltipProps: PropTypes.shape({}),
};

TextLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  className: PropTypes.string,
  target: PropTypes.oneOf(['_self', '_blank']),
  disabled: PropTypes.bool,
  showTooltip: PropTypes.bool,
  tooltipText: PropTypes.string,
  TooltipProps: PropTypes.shape({}),
};

TextLink.defaultProps = {
  TooltipProps: {},
  className: '',
  target: '_blank',
  disabled: false,
  showTooltip: false,
  tooltipText: '',
};

export default TextLink;
