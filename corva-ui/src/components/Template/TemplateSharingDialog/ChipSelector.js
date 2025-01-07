import { PureComponent } from 'react';
import { get, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  withStyles,
  TextField,
  List as ListComponent,
  ListItem,
  ListItemText,
  FormControl,
  FormHelperText,
  Chip,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import './ChipSelector.css';

const PAGE_NAME = 'chipSelector';

const newItemRegExp = new RegExp('^new.*$');

const muiStyles = {
  listStyle: {
    borderColor: 'grey',
    overflow: 'auto',
  },
  formControl: { marginBottom: 8 },
  inputRoot: { paddingBottom: '8px !important' },
};

class ChipSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { isError: false };
  }

  componentDidUpdate({ selectedItems }) {
    if (this.props.selectedItems !== selectedItems) {
      this.setState({ isError: false });
    }
  }

  get itemList() {
    return this.listedItems.map(item => (
      <ListItem
        data-testid={`${PAGE_NAME}_item_${this.props.listItemFormatter(item)}`}
        key={get(item, 'id')}
        button
        divider
        onClick={() => this.props.onAdd(get(item, 'id'))}
      >
        <ListItemText>{this.props.listItemFormatter(item)}</ListItemText>
      </ListItem>
    ));
  }

  get listedItems() {
    return this.props.items.filter(item => !this.props.selectedItems.has(get(item, 'id')));
  }

  get selectedItems() {
    return this.props.items
      .filter(item => this.props.selectedItems.has(get(item, 'id')))
      .concat(this.props.allowAddNewItems ? this.props.newItems : []);
  }

  get formattedSelectedItems() {
    return this.selectedItems.map(this.formatItem);
  }

  get formattedListedItems() {
    return this.listedItems.map(this.formatItem);
  }

  formatItem = item => ({
    text: this.props.chipFormatter(item),
    id: get(item, 'id'),
    persistent: get(item, 'persistent', false), // NOTE: Item is not removable
  });

  handleChange = (e, nextItems) => {
    const prevItems = this.formattedSelectedItems;
    const prevIdsSet = new Set(prevItems.map(item => item.id));
    const nextIdsSet = new Set(nextItems.map(item => item.id));

    const itemsToAdd = nextItems.filter(item => !prevIdsSet.has(item.id));
    const itemsIdsToRemove = prevItems
      .filter(item => !nextIdsSet.has(item.id) && !item.persistent)
      .map(item => item.id);
    itemsToAdd.forEach(this.handleRequestAdd);
    itemsIdsToRemove.forEach(this.handleRequestDelete);
  };

  handleRequestAdd = ({ id, text }) => {
    if (this.props.allowAddNewItems) {
      if (this.itemWithSameNameExists(text)) {
        this.setState({ isError: true });
      } else {
        this.props.onAddNew({
          id: `new${text}`,
          name: text,
        });
      }
    } else if (this.listedItems.find(item => get(item, 'id') === id)) {
      this.props.onAdd(id);
    } else {
      this.setState({ isError: true });
    }
  };

  handleRequestDelete = id => {
    if (this.props.allowAddNewItems && newItemRegExp.test(id)) {
      this.props.onRemoveNew(id);
    } else {
      this.props.onRemove(id);
    }
  };

  handleUpdateInput = () => {
    if (this.state.isError) {
      this.setState({ isError: false });
    }
  };

  getOptionLabel = option => option.text;

  renderTags = (value, getCustomizedTagProps) =>
    value.map((option, index) => (
      <Chip
        data-not-migrated-MuiChip
        label={this.getOptionLabel(option)}
        {...getCustomizedTagProps({ index })}
        onDelete={option.persistent ? null : () => this.handleRequestDelete(option.id)}
      />
    ));

  renderInput = params => (
    <TextField {...params} variant="standard" placeholder={this.props.hintText} />
  );

  itemWithSameNameExists = text =>
    this.props.items
      .concat(this.props.newItems)
      .map(this.formatItem)
      .find(item => get(item, 'text') === text);

  render() {
    const errorText = this.state.isError ? this.props.errorText : '';
    const { classes } = this.props;

    return (
      <div>
        <FormControl className={classes.formControl} error={!!errorText} fullWidth>
          <Autocomplete
            data-testid="generic_chipInput"
            multiple
            fullWidth
            id="chip-selector"
            classes={{ inputRoot: classes.inputRoot }}
            value={this.formattedSelectedItems}
            onChange={this.handleChange}
            onInputChange={this.handleUpdateInput}
            options={this.formattedListedItems}
            getOptionLabel={this.getOptionLabel}
            renderInput={this.renderInput}
            renderTags={this.renderTags}
          />
          <FormHelperText>{errorText}</FormHelperText>
        </FormControl>

        <div className="c-chip-select-component__list-title">
          <em>{this.props.listTitle}</em>
        </div>
        <ListComponent className={classNames(this.props.listClasses, this.props.classes.listStyle)}>
          {!isEmpty(this.listedItems) ? (
            this.itemList
          ) : (
            <div className="c-chip-select-component__empty-list">
              <p data-testid={`${PAGE_NAME}_emptyLabel`}>List is empty</p>
            </div>
          )}
        </ListComponent>
      </div>
    );
  }
}

ChipSelector.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  selectedItems: PropTypes.shape([]).isRequired,
  newItems: PropTypes.arrayOf(PropTypes.shape({})),
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  allowAddNewItems: PropTypes.bool,
  onAddNew: PropTypes.func,
  onRemoveNew: PropTypes.func,
  chipFormatter: PropTypes.func,
  listItemFormatter: PropTypes.func,
  classes: PropTypes.string,
  listClasses: PropTypes.string,
  hintText: PropTypes.string,
  errorText: PropTypes.string,
  listTitle: PropTypes.string,
};

ChipSelector.defaultProps = {
  allowAddNewItems: false,
  chipFormatter: item => item.toString(),
  listItemFormatter: item => item.toString(),
  classes: 'c-chip-select-component__container',
  listClasses: 'c-chip-select-component__list',
  hintText: null,
  errorText: 'You can not add not existing item',
  listTitle: 'All items',
  onAddNew: null,
  onRemoveNew: null,
  newItems: null,
};

export default withStyles(muiStyles)(ChipSelector);
