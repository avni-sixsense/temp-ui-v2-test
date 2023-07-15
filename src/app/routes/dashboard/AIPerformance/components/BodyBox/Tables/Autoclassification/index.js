// import { faArrowAltFromTop, faCog } from '@fortawesome/pro-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from '@material-ui/core/Box';
// import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// import CommonButton from 'app/components/ReviewButton'
import React, { useState } from 'react';

import AutoClassificationTableChart from '../../Charts/AutoClassificationTableChart';

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  root: {
    borderRadius: '4px',
    border: `0.2px solid ${theme.colors.grey[0]}`,
    backgroundColor: theme.colors.grey[0],
    boxShadow: theme.colors.shadow.base
    // minHeight: '440px',
  },
  btns: {
    marginLeft: theme.spacing(1)
  },
  titleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  modeContainer: {
    backgroundColor: theme.colors.grey[1],
    border: `1px solid ${theme.colors.grey[5]}`,
    padding: theme.spacing(0.25, 0.25, 0.25, 1),
    borderRadius: '4px',
    fontSize: '12px'
  },
  modeTitle: {
    fontWeight: 500,
    color: theme.colors.grey[12]
  },
  selectedMode: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.5),
    backgroundColor: theme.colors.blue[600],
    borderRadius: '4px',
    '& p': {
      fontWeight: 600,
      color: `${theme.colors.grey[0]} !important`
    },
    cursor: 'pointer'
  },
  normalMode: {
    padding: theme.spacing(0.125, 0.5, 0.375, 0.5),
    backgroundColor: theme.colors.grey[0],
    borderRadius: '4px',
    border: `1px solid ${theme.colors.grey[4]}`,
    '& p': {
      fontWeight: 600,
      color: `${theme.colors.grey[19]} !important`
    },
    cursor: 'pointer'
  }
}));

const AutoClassificationTable = () => {
  const classes = useStyles();
  const [mode, setMode] = useState('90% +');

  return (
    <Box mb={2} className={`${classes.root}`}>
      <Box
        className={classes.titleContainer}
        py={1}
        pl={1.75}
        // mb={1.5}
        pr={1.25}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box
          className={classes.modeContainer}
          display='flex'
          alignItems='center'
          ml={1.5}
        >
          <Typography className={classes.modeTitle}>
            Auto-classification:
          </Typography>
          <Box
            onClick={() => setMode('90% +')}
            ml={0.75}
            className={
              mode === '90% +' ? classes.selectedMode : classes.normalMode
            }
          >
            <Typography>>=90%</Typography>
          </Box>
          <Box
            onClick={() => setMode('80%-90%')}
            ml={0.75}
            className={
              mode === '80%-90%' ? classes.selectedMode : classes.normalMode
            }
          >
            <Typography>{`>=80% & <90%`}</Typography>
          </Box>
          <Box
            onClick={() => setMode('< 80%')}
            ml={0.75}
            className={
              mode === '< 80%' ? classes.selectedMode : classes.normalMode
            }
          >
            <Typography>{`< 80%`}</Typography>
          </Box>
        </Box>
        <Box display='flex' alignItems='center'>
          {/* <CommonButton
						icon={<FontAwesomeIcon icon={faCog} />}
						size="sm"
						variant="tertiary"
						wrapperClass={classes.btns}
					/>
					<CommonButton
						icon={<FontAwesomeIcon icon={faArrowAltFromTop} />}
						size="sm"
						variant="tertiary"
						text="Export"
						wrapperClass={classes.btns}
						onClick={() => {}}
					/> */}
        </Box>
      </Box>
      <Box pl={1.5} pr={1.25}>
        <AutoClassificationTableChart tableFilter={mode} />
      </Box>
    </Box>
  );
};

export default AutoClassificationTable;
