import { SvgIcon } from '@material-ui/core';

const UploadIcon = props => {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 10V16H9V10H5L12 3L19 10H15ZM19 20V18H5V20H19Z"
      />
    </SvgIcon>
  );
};

export default UploadIcon;
