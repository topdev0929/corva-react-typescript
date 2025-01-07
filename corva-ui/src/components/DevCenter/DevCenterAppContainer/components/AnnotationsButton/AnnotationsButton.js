import { IconButton, withStyles } from '@material-ui/core';

const annotationsIconSize = { width: 24, height: 24 };

const IconButtonWithStyles = withStyles({
  root: {
    ...annotationsIconSize,
    padding: '3px',
    marginRight: '10px',
    backgroundColor: 'transparent!important',
  },
  label: {
    ...annotationsIconSize,
    '& img': {
      ...annotationsIconSize,
    },
  },
})(IconButton);

const AnnotationsButton = ({ toggleAnnotationsList }) => {
  return (
    <IconButtonWithStyles
      onClick={toggleAnnotationsList}
      disableRipple
    >
      <img src="https://cdn.corva.ai/app/images/annotations-menu.svg" alt="" />
    </IconButtonWithStyles>
  );
};

export default AnnotationsButton;
