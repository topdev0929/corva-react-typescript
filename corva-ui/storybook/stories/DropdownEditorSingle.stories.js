import { useState } from 'react';
import PropTypes from 'prop-types';

// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { StyledDropdownEditor } from '~/components/SettingEditors';

const METRIC_TYPES = [
  { label: 'drilled feet', value: 1 },
  { label: 'drilled feet rotary', value: 2 },
  { label: 'drilled feet slide', value: 3 },
];

export const DropdownEditorSingle = props => {
  const [value, setValue] = useState(props.defaultValue);

  return (
    <div>
      <StyledDropdownEditor
        currentValue={value}
        defaultValue={props.defaultValue}
        onChange={setValue}
        options={METRIC_TYPES}
        placeholder={props.placeholder}
        multiple={false}
        disabled={props.disabled}
        classes={props.classes}
        renderValue={props.renderValue}
        errorText={props.errorText}
      />
    </div>
  );
};

DropdownEditorSingle.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  errorText: PropTypes.string,
  placeholder: PropTypes.string,
  renderValue: PropTypes.func,
};

DropdownEditorSingle.defaultProps = {
  defaultValue: 1,
  disabled: false,
  errorText: '',
  placeholder: 'Choose An Option',
  renderValue: null,
};

export default {
  title: 'Components/Dropdown Editor',
  component: DropdownEditorSingle,
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/SettingEditors/DropdownEditor/index.js',
  },
};
