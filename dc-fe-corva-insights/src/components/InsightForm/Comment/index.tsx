import { observer } from 'mobx-react-lite';
import { InputAdornment, makeStyles, TextField } from '@material-ui/core';

import { isAllowInsightContainFiles } from '@/entities/insight';
import { useInsightFormStore } from '@/contexts/insight-form';
import { EmojiISelector } from '@/shared/components/EmojiSelector';
import { AttachFile } from '@/shared/components/AttachFile';
import { VIEWS } from '@/constants';

import styles from './index.module.css';

const useStyles = makeStyles({
  input: {
    padding: 8,
    borderRadius: 4,
    alignItems: 'flex-end',
    '&::after': {
      display: 'none',
    },
    '&::before': {
      display: 'none',
    },
  },
  endAdornment: {
    height: '100%',
  },
});

export const InsightFormComment = observer(() => {
  const classes = useStyles();
  const store = useInsightFormStore();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.setText(e.target.value);
  };

  const handleSelectEmoji = emoji => store.setText(`${store.text}${emoji.native}`);

  return (
    <div className={styles.container}>
      <TextField
        data-testid={`${VIEWS.INSIGHT_FORM}_commentTextField`}
        InputProps={{
          inputProps: {
            'data-testid': `${VIEWS.INSIGHT_FORM}_commentTextField_textarea`,
          },
          classes: { root: classes.input },
          endAdornment: (
            <InputAdornment position="end" className={classes.endAdornment}>
              <div className={styles.actions}>
                {isAllowInsightContainFiles(store.type) && (
                  <AttachFile
                    testId={`${VIEWS.INSIGHT_FORM}_attachFileBtn`}
                    onUpload={files => store.uploadFiles(files)}
                    isLoading={store.isFilesLoading}
                  />
                )}
                <EmojiISelector
                  testId={`${VIEWS.INSIGHT_FORM}_emojiSelector`}
                  handleSelectEmoji={handleSelectEmoji}
                  disableRipple
                  closeOnSelect
                />
              </div>
            </InputAdornment>
          ),
        }}
        variant="filled"
        fullWidth
        value={store.text}
        onChange={onChange}
        multiline
        rows={4}
        placeholder="Type here..."
      />
    </div>
  );
});
