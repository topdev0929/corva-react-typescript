import { useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import BHACasingEmptyView from '~/components/Drillstring/BHACasingEmptyView';
import Header from './components/Header';
import Component from './components/Component';
import SortableComponents from './components/SortableComponents';
import styles from './CasingTableV2.css';

function CasingTableV2({
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
        <BHACasingEmptyView type="Casing" onAdd={onAdd} />
      ) : (
        <div
          className={classNames(styles.tableContent, { [styles.contentMobile]: isMobile })}
          ref={containerRef}
          onScroll={handleScroll}
        >
          {!isMobile && <Header />}
          <div>
            {draftComponent && (
              <Component
                isMobile={isMobile}
                viewColumnsPerRow={viewColumnsPerRow}
                editColumnsPerRow={editColumnsPerRow}
                component={draftComponent}
                isDraft
                validate={validate}
                onCancel={onCancel}
                onSave={onSave}
              />
            )}
            <SortableComponents
              useDragHandle
              lockAxis="y"
              lockToContainerEdges
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

CasingTableV2.propTypes = {
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
};

CasingTableV2.defaultProps = {
  viewColumnsPerRow: 3,
  editColumnsPerRow: 3,
  components: null,
  draftComponent: null,
};

export default CasingTableV2;
