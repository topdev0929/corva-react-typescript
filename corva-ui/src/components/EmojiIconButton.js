import { PureComponent } from 'react';
import { Picker } from 'emoji-mart';
import PropTypes from 'prop-types';

import Popover from '@material-ui/core/Popover';

import IconButton from '~components/IconButton';
import EmojiIcon from '~components/Icons/EmojiIcon';

class EmojiIconButton extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openEmojiPicker: false,
    };
  }

  onSelect = emoji => {
    const { handleSelectEmoji, closeOnSelect } = this.props;
    handleSelectEmoji(emoji);
    if (closeOnSelect) {
      this.setState({ openEmojiPicker: false });
    }
  };

  render() {
    return (
      <>
        <IconButton
          data-testid={this.props['data-testid']}
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-label="Emoji"
          onClick={() => this.setState({ openEmojiPicker: true })}
          disableRipple={this.props.disableRipple}
          className={this.props.emojiIconClassName}
          tooltipProps={this.props.tooltipProps}
        >
          <EmojiIcon />
        </IconButton>

        <Popover
          open={this.state.openEmojiPicker}
          anchorEl={this.anchorEl}
          onClose={() => this.setState({ openEmojiPicker: false })}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Picker onSelect={this.onSelect} theme="dark" />
        </Popover>
      </>
    );
  }
}

EmojiIconButton.propTypes = {
  handleSelectEmoji: PropTypes.func.isRequired,
  emojiIconClassName: PropTypes.string,
  disableRipple: PropTypes.bool,
  closeOnSelect: PropTypes.bool,
  'data-testid': PropTypes.string,
  tooltipProps: PropTypes.shape({}),
};

EmojiIconButton.defaultProps = {
  emojiIconClassName: undefined,
  disableRipple: false,
  closeOnSelect: true,
  'data-testid': 'generic_emojiButton',
  tooltipProps: { title: 'Add Emoji' },
};

export default EmojiIconButton;
