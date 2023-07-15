import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(() => ({
  progress: {
    backgroundColor: '#E5E5E5',
    borderRadius: '6px',
    height: '6px',
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#65D7C8'
    }
  }
}));
const Progress = ({ uppy }) => {
  const classes = useStyles();
  const [total, setTotal] = useState(0);
  const [uploaded, setUploaded] = useState(0);

  useEffect(() => {
    if (uppy) {
      uppy.on('upload', () => {
        let filesCount = 0;
        const files = uppy.getFiles();
        files.forEach(file => {
          if (!file.progress.uploadComplete) {
            filesCount += 1;
          }
        });
        if (uploaded === total) {
          setUploaded(0);
        }
        setTotal(filesCount);
      });
    }
  }, [uppy, uploaded, total]);

  useEffect(() => {
    if (uppy) {
      uppy.on('upload-success', () => {
        setUploaded(prevState => prevState + 1);
      });
    }
  }, [uppy]);

  if (!total) {
    return '';
  }

  return (
    <Box display='flex' mt={1} mb={2}>
      <Box flexGrow='1'>
        <Box display='flex' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <Typography variant='subtitle1'>{uploaded}</Typography>
            &nbsp;/&nbsp;
            <Typography variant='subtitle2'>{`${total} Uploaded`}</Typography>
          </Box>
          <Box>
            <Typography variant='body2'>
              {parseInt((uploaded / total) * 100, 10)}%&nbsp;Completed
            </Typography>
          </Box>
        </Box>
        <Box mt={1}>
          <LinearProgress
            variant='determinate'
            value={(uploaded / total) * 100}
            className={classes.progress}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Progress;
