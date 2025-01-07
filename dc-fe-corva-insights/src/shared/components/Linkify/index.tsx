import DOMPurify from 'dompurify';

export const Linkify = ({ children }) => {
  const isUrl = word => {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    return word.match(urlPattern);
  };

  const addMarkup = word => {
    return isUrl(word) ? `<a href="${word}" target="_blank">${word}</a>` : word;
  };

  const words = children.split(' ');
  const formatedWords = words.map(w => addMarkup(w));
  const html = DOMPurify.sanitize(formatedWords.join(' '), { ALLOWED_ATTR: ['target', 'href'] });

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};
