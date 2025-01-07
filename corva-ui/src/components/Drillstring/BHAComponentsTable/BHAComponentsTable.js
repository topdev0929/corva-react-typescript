import { useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import Header from './components/Header';
import Component from './components/Component';
import SortableComponents from './components/SortableComponents';
import BHACasingEmptyView from '../BHACasingEmptyView';
import styles from './BhaComponentsTable.css';

function BHAComponentsTable({
  isActualBha,
  viewColumnsPerRow,
  editColumnsPerRow,
  components,
  draftComponent,
  validate,
  onSort,
  onAdd,
  onDelete,
  onSave,
  onCancel,
  isMobile,
  onAutocompleteApplied,
}) {
  const [sortableIndex, setSortableIndex] = useState(-1);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const containerRef = useRef(null);
  const isComponentsEmpty = useMemo(() => {
    return !((components && !isEmpty(components)) || draftComponent);
  }, [components, draftComponent]);

  const handleSortStart = node => {
    setSortableIndex(node.index);
  };

  const handleSortEnd = (oldIndex, newIndex) => {
    setSortableIndex(-1);
    onSort(oldIndex, newIndex);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setShowTopGradient(!!containerRef.current.scrollTop);
    }
  };

  return (
    <div className={styles.container}>
      {isComponentsEmpty ? (
        <BHACasingEmptyView type="BHA" onAdd={onAdd} />
      ) : (
        <div
          className={classNames(styles.drilistringContent, { [styles.contentMobile]: isMobile })}
          ref={containerRef}
          onScroll={handleScroll}
        >
          {!isMobile && <Header />}
          <div>
            {draftComponent && (
              <Component
                isMobile={isMobile}
                isActualBha={isActualBha}
                viewColumnsPerRow={viewColumnsPerRow}
                editColumnsPerRow={editColumnsPerRow}
                component={draftComponent}
                isDraft
                validate={validate}
                onCancel={onCancel}
                onSave={onSave}
                onAutocompleteApplied={onAutocompleteApplied}
              />
            )}
            <SortableComponents
              useDragHandle
              lockAxis="y"
              lockToContainerEdges
              isActualBha={isActualBha}
              components={components}
              sortableIndex={sortableIndex}
              validate={validate}
              onSaveComponent={onSave}
              onDeleteComponent={onDelete}
              onSortEnd={handleSortEnd}
              onSortStart={handleSortStart}
              isMobile={isMobile}
              viewColumnsPerRow={viewColumnsPerRow}
              editColumnsPerRow={editColumnsPerRow}
              onAutocompleteApplied={onAutocompleteApplied}
            />
          </div>
        </div>
      )}
      <div
        className={classNames(styles.topGradient, { [styles.visible]: showTopGradient })}
        style={{ top: isMobile ? 0 : 50 }}
      />
      <div className={styles.bottomGradient} />
    </div>
  );
}

BHAComponentsTable.propTypes = {
  isActualBha: PropTypes.bool.isRequired,
  viewColumnsPerRow: PropTypes.oneOf([1, 2, 3, 4, 6]),
  editColumnsPerRow: PropTypes.oneOf([1, 2, 3, 4, 6]),
  components: PropTypes.arrayOf(PropTypes.shape({})),
  draftComponent: PropTypes.arrayOf(PropTypes.shape({})),
  validate: PropTypes.func.isRequired,
  onSort: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  onAutocompleteApplied: PropTypes.func.isRequired,
};

BHAComponentsTable.defaultProps = {
  viewColumnsPerRow: 3,
  editColumnsPerRow: 3,
  components: null,
  draftComponent: null,
};

export default BHAComponentsTable;
