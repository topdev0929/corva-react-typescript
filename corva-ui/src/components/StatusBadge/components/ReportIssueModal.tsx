import { useState } from 'react';
import { TextField, makeStyles, MenuItem } from '@material-ui/core';
import Modal from '~/components/Modal';
import Button from '~/components/Button';
import Select from '~/components/Select';
import { truncateString } from '~/components/Search/utils/truncate';

const useStyles = makeStyles(theme => ({
  container: {
    width: 472,
    color: theme.palette.primary.text6,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  helpText: {
    fontSize: 16,
    lineHeight: '22px',
  },
  clearAllButton: { margin: '0 16px 0 auto' },
  textField: {
    '& .MuiInput-formControl': { marginTop: 8 },
  },
  popover: { marginTop: 8, maxHeight: 500, width: '100%' },
}));

type Asset = {
  name: string;
  id: number;
};

type ReportIssueModalProps = {
  onSave: (description: string, selectedAssetId: number) => void;
  onClose: () => void;
  assets?: Asset[];
};

export const ReportIssueModal = ({
  assets,
  onSave,
  onClose,
}: ReportIssueModalProps): JSX.Element => {
  const classes = useStyles();
  const [description, setDescription] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | number>(assets[0]?.id);
  const isMultiAssets = assets.length > 1;

  const handleReportClick = () => {
    onSave(description, selectedAssetId as number);
    setDescription('');
    setSelectedAssetId('');
    if (!isMultiAssets) onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Report Data Quality Issue"
      actions={
        <>
          <Button color="primary" className={classes.clearAllButton} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!description || (isMultiAssets && !selectedAssetId)}
            onClick={handleReportClick}
            variation="primary"
          >
            report data issue
          </Button>
        </>
      }
    >
      <div className={classes.container}>
        <div className={classes.helpText}>
          All issues are submitted to the Corva’s 24/7 Fusion data quality team for immediate review
          and remediation.
        </div>
        {isMultiAssets && (
          <Select
            MenuProps={{
              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
              transformOrigin: { vertical: 'top', horizontal: 'left' },
              PopoverClasses: { root: classes.popover },
            }}
            label="Select Asset"
            onChange={e => setSelectedAssetId(e.target.value)}
            value={selectedAssetId}
          >
            {assets.map(asset => (
              <MenuItem key={asset.id} value={asset.id}>
                {truncateString(asset.name, {
                  maxChars: 50,
                  charsNumFromStart: 26,
                  charsNumFromEnd: 24,
                })}
              </MenuItem>
            ))}
          </Select>
        )}
        <TextField
          className={classes.textField}
          multiline
          rows={1}
          rowsMax={4}
          label="Error Description"
          onChange={e => setDescription(e.target.value)}
          value={description}
        />
      </div>
    </Modal>
  );
};
