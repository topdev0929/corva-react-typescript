import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic, ReactEditor } from 'slate-react';

import styles from './ImageElement.css';

const CONTENT_PADDING = 24;
const MIN_PANE_SIZE = 150;

const ImageElement = props => {
  const { attributes, element, imageWidth, mode, children } = props;
  const isWriteMode = mode === 'write';
  const wrapperRef = useRef();
  const imageRef = useRef();
  const editor = useSlateStatic();

  const pointermoveController = new AbortController();

  const setPaneWidth = width => {
    if (wrapperRef.current) {
      wrapperRef.current.style.setProperty('width', `${width}px`);
    }
  };

  const getPaneWidth = () => {
    const containerElement = document.getElementById(`resizable${element.url}`);
    const pxWidth =
      containerElement && window.getComputedStyle(containerElement).getPropertyValue('width');
    return pxWidth ? parseInt(pxWidth, 10) : document.body.clientWidth;
  };

  const stopDragging = () => {
    // update Slate element params
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element) });
    Transforms.insertNodes(
      editor,
      { ...element, dimensions: { width: getPaneWidth() - CONTENT_PADDING } },
      { at: ReactEditor.findPath(editor, element) }
    );
    document.body.removeEventListener('pointerup', stopDragging);
  };

  const pageContent = document.getElementsByClassName('c-docs-custom-page-content');
  const maxPaneSize =
    (pageContent && pageContent[0] && pageContent[0].offsetWidth - CONTENT_PADDING * 1.5) ||
    document.body.clientWidth * 0.5;

  const mouseDragHandler = (moveEvent, xOffset, startingPaneWidth) => {
    moveEvent.preventDefault();
    if (getPaneWidth() < MIN_PANE_SIZE || getPaneWidth() > maxPaneSize) {
      setPaneWidth(Math.min(Math.max(getPaneWidth(), MIN_PANE_SIZE), maxPaneSize));
      return;
    }
    const paneOriginAdjustment = -1;
    setPaneWidth((xOffset - moveEvent.pageX) * paneOriginAdjustment + startingPaneWidth);
  };

  const startDraggingRight = event => {
    const startingPaneWidth = getPaneWidth();
    const xOffset = event.pageX;

    document.body.addEventListener(
      'pointermove',
      moveEvent => mouseDragHandler(moveEvent, xOffset, startingPaneWidth),
      { signal: pointermoveController.signal }
    );
    document.body.addEventListener('pointerup', stopDragging);
  };

  useEffect(() => {
    if (wrapperRef.current && isWriteMode) {
      wrapperRef.current.addEventListener('mousedown', startDraggingRight);
    }

    return () => {
      pointermoveController.abort();
      document.body.removeEventListener('pointerup', stopDragging);
      document.body.removeEventListener('pointermove', stopDragging);
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener('mousedown', startDraggingRight);
      }
    };
  }, [mode]);

  const containerWidth = element.dimensions?.width + CONTENT_PADDING;

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        {element && (
          <div
            style={{
              width: containerWidth || imageWidth,
            }}
            ref={wrapperRef}
            id={`resizable${element.url}`}
            className={styles.resizable}
          >
            <div className={styles.container}>
              {isWriteMode && <div className={styles.handleLeft} />}
              <img src={element.url} className={styles.image} ref={imageRef} alt="" />
              {isWriteMode && <div className={styles.handleRight} />}
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

ImageElement.propTypes = {
  attributes: PropTypes.shape({}).isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.shape({
    url: PropTypes.string.isRequired,
    dimensions: PropTypes.shape({
      width: PropTypes.string,
    }),
  }).isRequired,
  imageWidth: PropTypes.string,
  mode: PropTypes.string,
};

ImageElement.defaultProps = {
  imageWidth: undefined,
  mode: undefined,
};

export default ImageElement;
