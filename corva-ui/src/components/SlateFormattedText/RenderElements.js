import { Tooltip, withStyles } from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import classnames from 'classnames';

import { TEXT_FORMATS } from './Constants';

import { ImageElement, VideoElement } from './Elements';

import styles from './style.css';

const StyledTooltip = withStyles({
  tooltip: {
    height: 24,
    maxWidth: 168,
  },
})(Tooltip);

const StyledLanguageIcon = withStyles({
  root: {
    color: '#bdbdbd',
    fontSize: 14,
    marginRight: 8,
  },
})(LanguageIcon);

export const Leaf = params => {
  const { attributes, leaf } = params;

  let { children } = params;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.contrastText) {
    children = <span className={styles.contrastText}>{children}</span>;
  }

  if (leaf.textPrimary) {
    children = <span className={styles.textPrimary}>{children}</span>;
  }

  if (leaf.bodyLeaf) {
    children = <span className={styles.body}>{children}</span>;
  }

  if (leaf.captionLeaf) {
    children = <span className={styles.caption}>{children}</span>;
  }

  if (leaf.codeLeaf) {
    children = <span className={styles.code}>{children}</span>;
  }

  if (leaf.headerOneLeaf) {
    children = <span className={styles.headerOne}>{children}</span>;
  }

  if (leaf.headerTwoLeaf) {
    children = <span className={styles.headerTwo}>{children}</span>;
  }

  if (leaf.headerThreeLeaf) {
    children = <span className={styles.headerThree}>{children}</span>;
  }

  return (
    <span
      {...attributes}
      className={classnames('token', {
        'attr-name': leaf['attr-name'],
        'class-name': leaf['class-name'],
        boolean: leaf.boolean,
        char: leaf.char,
        comment: leaf.comment || leaf.visiblePragma,
        constant: leaf.constant,
        constants: leaf.constants,
        function: leaf.function,
        keyword: leaf.keyword,
        number: leaf.number,
        operator: leaf.operator,
        punctuation: leaf.punctuation,
        regex: leaf.regex,
        selector: leaf.selector,
        string: leaf.string,
        symbol: leaf.symbol,
        tag: leaf.tag,
        url: leaf.url,
        variable: leaf.variable,
        [styles.invisible]: leaf.invisiblePragma,
      })}
    >
      {children}
    </span>
  );
};

export const Element = params => {
  const { attributes, children, element } = params;

  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return (
        <ul {...attributes} className={styles.bulletedList}>
          {children}
        </ul>
      );
    case 'numbered-list': {
      let listItemClassName = styles.numberedList;
      if (element.children?.length === 1 && element.children?.[0].textPrimary) {
        listItemClassName = classnames(styles.listItem, styles.listItemPrimary);
      }
      return (
        <ol {...attributes} className={listItemClassName} start={element?.startPosition}>
          {children}
        </ol>
      );
    }
    case 'list-item': {
      let listItemClassName = styles.listItem;
      if (element.children?.length === 1 && element.children?.[0].textPrimary) {
        listItemClassName = classnames(styles.listItem, styles.listItemPrimary);
      }
      return (
        <li {...attributes} className={listItemClassName}>
          {children}
        </li>
      );
    }
    case 'image':
      return <ImageElement {...params} />;

    case TEXT_FORMATS.headerOne:
      return <div className={styles.headerOne}>{children}</div>;

    case TEXT_FORMATS.headerTwo:
      return <div className={styles.headerTwo}>{children}</div>;

    case TEXT_FORMATS.headerThree:
      return <div className={styles.headerThree}>{children}</div>;

    case TEXT_FORMATS.body:
      return <div className={styles.body}>{children}</div>;

    case TEXT_FORMATS.caption:
      return <div className={styles.caption}>{children}</div>;

    case TEXT_FORMATS.code:
      return <pre className={classnames('language-js', styles.codeBlock)}>{children}</pre>;

    case 'video':
      return <VideoElement {...params} />;

    case 'link':
      return (
        <StyledTooltip
          placement="bottom-start"
          title={
            <span className={styles.richTextEditorPopoverLinkElement}>
              <StyledLanguageIcon />
              <a href={element.url}>{element.url}</a>
            </span>
          }
        >
          <a {...attributes} href={element.url} className={styles.richTextEditorLinkElement}>
            {children}
          </a>
        </StyledTooltip>
      );

    default:
      return <div className={styles.body}>{children}</div>;
  }
};
