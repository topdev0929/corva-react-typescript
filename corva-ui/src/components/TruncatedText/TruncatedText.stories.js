// In case you update the component src path,
// please also update the GitHub source link at the bottom
import { makeStyles } from '@material-ui/core';
import TruncatedText from '~/components/TruncatedText';

const Text =
  'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section;';

const useStyles = makeStyles({
  label: { fontSize: 13, color: '#bdbdbd', marginBottom: 8 },
  container: { maxWidth: 300, maxHeight: 250, marginBottom: 32 },
});

export const TruncatedTextExamples = () => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.label}>Default TruncatedText</div>
      <div className={styles.container}>
        <TruncatedText>{Text}</TruncatedText>
      </div>
      <div className={styles.label}>Multiline TruncatedText</div>
      <div className={styles.container}>
        <TruncatedText maxLines={6}>{Text}</TruncatedText>
      </div>
      <div className={styles.label}>Multiline TruncatedText Without Tooltip</div>
      <div className={styles.container}>
        <TruncatedText maxLines={6} showTooltip={false}>
          {Text}
        </TruncatedText>
      </div>
    </div>
  );
};

export default {
  title: 'Components/TruncatedText',
  component: TruncatedText,
  argTypes: {},
  parameters: {
    sourceLink:
      'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/TruncatedText/index.js',
    docs: {
      description: {
        component:
          '<div>A wrapper around text. To achieve three dots truncation and tooltip.</div>',
      },
    },
  },
};
