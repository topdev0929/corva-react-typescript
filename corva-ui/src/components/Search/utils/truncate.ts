export type TruncateOptions = {
  maxChars: number;
  charsNumFromStart: number;
  charsNumFromEnd: number;
};

type TruncateString = (label: string, truncateOptions: TruncateOptions) => string;

export const truncateString: TruncateString = (label, truncateOptions) => {
  const { maxChars, charsNumFromStart, charsNumFromEnd } = truncateOptions;

  if (label.length > maxChars)
    return `${label.slice(0, charsNumFromStart)}...${label.slice(label.length - charsNumFromEnd)}`;

  return label;
};
