import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  tableHeader: {
    fontSize: '0.6875rem',
    fontWeight: 500,
    color: theme.colors.grey[13],
    textTransform: 'uppercase'
  },
  tableValue: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[19]
  }
}));

const tempData = [
  {
    id: 1,
    name: 'defect 1',
    intances: 100000
  },
  {
    id: 2,
    name: 'defect 2',
    intances: 100
  }
];

const DefectTable = () => {
  const classes = useStyles();
  const [sortOrder, setSortOrder] = ['asc'];

  // const handleSort = ()

  return (
    <Box>
      <Box
        mb={1.5}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box>
          <Typography className={classes.tableHeader}>Defects</Typography>
        </Box>
        <Box>
          <Typography className={classes.tableHeader}>
            Available Instances
          </Typography>
        </Box>
      </Box>
      {tempData.map(data => (
        <Box
          key={data.id}
          mb={1.625}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <Typography className={classes.tableValue}>{data.name}</Typography>
          </Box>
          <Box>
            <Typography className={classes.tableValue}>
              {data.intances}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default DefectTable;
