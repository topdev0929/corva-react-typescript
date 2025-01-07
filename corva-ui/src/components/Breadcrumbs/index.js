import PropTypes from 'prop-types';
import { Breadcrumbs as MuiBreadcrumbs, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import { UniversalLink } from '../DevCenter/DevCenterRouterContext';

const useStyles = makeStyles(theme => ({
  container: { fontSize: '0.8125rem' },
  pathPart: {
    color: theme.palette.grey[400],
    '&:hover': { color: 'white' },
  },
  lastPathPart: { color: 'white' },
}));

const Breadcrumbs = ({ pathItems }) => {
  const classes = useStyles();
  return (
    <MuiBreadcrumbs className={classes.container}>
      {pathItems.map((pathInfo, index, allPathInfos) => (
        <UniversalLink
          key={pathInfo.text}
          className={classNames(classes.pathPart, {
            [classes.lastPathPart]: index === allPathInfos.length - 1,
          })}
          data-testid={`Breadcrumbs_${pathInfo.text}`}
          href={pathInfo.href}
        >
          {pathInfo.text}
        </UniversalLink>
      ))}
    </MuiBreadcrumbs>
  );
};

Breadcrumbs.propTypes = {
  pathItems: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      href: PropTypes.string,
    })
  ).isRequired,
};

export default Breadcrumbs;
