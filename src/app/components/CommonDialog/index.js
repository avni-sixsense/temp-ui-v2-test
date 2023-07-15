import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/CommonButton';
import get from 'lodash/get';
import React from 'react';

const CommonDialog = ({ open, message, actions = [], subMessage = '' }) => {
  return (
    <Dialog open={open}>
      <Paper>
        <Box px={7} py={10} textAlign='center'>
          <Box my={1}>
            <Typography
              variant='h1'
              gutterBottom
              style={{ wordBreak: 'break-word' }}
            >
              {message}
            </Typography>
            <Typography variant='h3'>{subMessage}</Typography>
          </Box>
          <Box mt={5} justifyContent='center' display='flex'>
            {actions.map((action, index) => (
              <Box mx={1} key={index}>
                <CommonButton
                  text={action.text}
                  variant={get(action, 'variant', 'primary')}
                  onClick={action.callback}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Dialog>
  );
};

export default CommonDialog;
