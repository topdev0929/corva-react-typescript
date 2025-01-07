import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({ chooseAssetButton: { margin: '8px 0', width: 150 } });

interface ChooseAssetButtonProps {
  toggleAppSettingsDialog: () => void;
}

export const PAGE_NAME = 'Choose_asset_button';

export const ChooseAssetButton = ({
  toggleAppSettingsDialog,
}: ChooseAssetButtonProps): JSX.Element => {
  const styles = useStyles();

  return (
    <Button
      className={styles.chooseAssetButton}
      color="primary"
      onClick={toggleAppSettingsDialog}
      variant="contained"
      data-testid={PAGE_NAME}
    >
      CHOOSE ASSET
    </Button>
  );
};
