import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const Step4 = ({ classes, handleModelChange, modelName }) => {
  return (
    <Box style={{ backgroundColor: '#FFFFFF' }} px={2} py={3} mt={2}>
      <Box display='flex' flexGrow={1}>
        <Typography variant='h2'>New Model Name</Typography>
      </Box>
      <Box mt={2}>
        <input
          className={classes.input}
          onChange={handleModelChange}
          value={modelName}
          placeholder='Model Name'
        />
      </Box>
    </Box>
  );
};

export default Step4;
