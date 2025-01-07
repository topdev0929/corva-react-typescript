import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function getCurrentScrollOffsetTop(element) {
  return element.scrollTop + element.offsetHeight;
}

function isScrolledToBottomRange(element, bottomThreshold) {
  return getCurrentScrollOffsetTop(element) >= element.scrollHeight - bottomThreshold;
}

function isScrollable(element) {
  return element.scrollHeight > element.offsetHeight;
}

function LazyListRenderer({
  data,
  renderItem,
  scrollableContainerElem,
  renderChunkSize = 5,
  threshold = 200, // px from bottom
}) {
  const [itemsToShowAmount, setItemsToShowAmount] = useState(renderChunkSize);
  const itemsToShow = data.slice(0, itemsToShowAmount);
  const dataSize = data.size || data.length;

  useEffect(() => {
    if (!scrollableContainerElem) {
      return null;
    }

    const onScroll = e => {
      if (isScrolledToBottomRange(e.target, threshold) && itemsToShowAmount < dataSize) {
        setItemsToShowAmount(amount => amount + renderChunkSize);
      }
    };

    scrollableContainerElem.addEventListener('scroll', onScroll);

    return () => scrollableContainerElem.removeEventListener('scroll', onScroll);
  }, [scrollableContainerElem, threshold, itemsToShowAmount, dataSize]);

  useEffect(() => {
    if (
      scrollableContainerElem &&
      !isScrollable(scrollableContainerElem) &&
      itemsToShowAmount < dataSize
    ) {
      setItemsToShowAmount(amount => amount + renderChunkSize);
    }
  });

  return itemsToShow.map(renderItem);
}

LazyListRenderer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  renderItem: PropTypes.func.isRequired,
  scrollableContainerElem: PropTypes.shape({}),
  renderChunkSize: PropTypes.number,
  threshold: PropTypes.number, // px from bottom
};

LazyListRenderer.defaultProps = {
  renderChunkSize: 5,
  threshold: 200, // px from bottom
};

export default LazyListRenderer;
