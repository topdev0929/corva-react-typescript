/* eslint-disable react/prop-types */

import { Grid, Typography, makeStyles } from '@material-ui/core';
// In case you update the component src path,
// please also update the GitHub source link at the bottom
import CounterComponent from '~/components/Counter';

const useStyles = makeStyles({
  counterContainer: {
    marginRight: 16,
    marginTop: 16,
  },
  coloredMain: {
    backgroundColor: '#03BCD4 !important',

    '& .MuiChip-label': {
      color: '#ffffff !important',
    },

    '&:hover': {
      backgroundColor: '#008BA3 !important',
    },
  },
  coloredRed: {
    backgroundColor: '#F44336 !important',
    '& .MuiChip-label': {
      color: '#ffffff !important',
    },
    '&:hover': {
      backgroundColor: '#D32F2F !important',
    },
  },
});

export const Counter = props => {
  const styles = useStyles();

  return (
    <Grid container style={{ width: '100%', padding: 16, backgroundColor: '#272727' }} spacing={2}>
      <Grid item>
        <Typography variant="body" component="div">
          Size 16
        </Typography>
        <Grid container>
          <Grid item className={styles.counterContainer}>
            <CounterComponent label={25} size="small" {...props} {...props.muiChipProps} />
          </Grid>
          <Grid item className={styles.counterContainer}>
            <CounterComponent label="99+" limited size="small" {...props} {...props.muiChipProps} />
          </Grid>
          <Grid item />
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="body" component="div">
          Size 24
        </Typography>
        <Grid container>
          <Grid item className={styles.counterContainer}>
            <CounterComponent label={25} size="medium" {...props} {...props.muiChipProps} />
          </Grid>
          <Grid item className={styles.counterContainer}>
            <CounterComponent
              label="99+"
              limited
              size="medium"
              {...props}
              {...props.muiChipProps}
            />
          </Grid>
          <Grid item className={styles.counterContainer}>
            <CounterComponent
              label="3"
              size="medium"
              clickable
              // eslint-disable-next-line no-console
              onDelete={() => console.log('Will be closed')}
              {...props}
              {...props.muiChipProps}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="body" component="div">
          Size 32
        </Typography>
        <Grid container>
          <Grid item className={styles.counterContainer}>
            <CounterComponent label={25} size="large" />
          </Grid>
          <Grid item className={styles.counterContainer}>
            <CounterComponent label="99+" limited size="large" />
          </Grid>
          <Grid item className={styles.counterContainer}>
            <CounterComponent
              label="3"
              size="large"
              clickable
              // eslint-disable-next-line no-console
              onDelete={() => console.log('Will be closed')}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="body" component="div">
          Colored
        </Typography>
        <Grid container>
          <Grid item className={styles.counterContainer}>
            <CounterComponent label={25} size="large" classes={{ root: styles.coloredMain }} />
          </Grid>
          <Grid item className={styles.counterContainer}>
            <CounterComponent
              label="99+"
              limited
              size="large"
              classes={{ root: styles.coloredRed }}
            />
          </Grid>
          <Grid item className={styles.counterContainer} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default {
  title: 'Components/Counter',
  component: CounterComponent,
  argTypes: {
    // don't show classes prop in table as it's used only internally
    classes: {
      table: {
        disable: true,
      },
    },
    muiChipProps: {
      name: '...muiChipProps',
      description:
        '<a href="https://v4.mui.com/api/chip/#chip-api" target="_blank">MUI Chip API</a>',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
      control: {
        type: 'object',
      },
    },
  },
  parameters: {
    sourceLink: 'https://github.dev/corva-ai/corva-ui/blob/develop/src/components/Counter/index.js',
    designLink:
      'https://www.figma.com/file/PUgBxjNswqqG1yyU6OQERZ/Corva-Design-System?node-id=19105%3A59511',
  },
};
