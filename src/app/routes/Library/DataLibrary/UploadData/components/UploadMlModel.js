import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(5),
    paddingBottom: 0,
    maxHeight: '92vh',
    overflowY: 'auto',
    marginBottom: 26
  },
  card: {
    background: '#F1FBFF',
    '& .react-bootstrap-table': {
      height: '70vh',
      overflowY: 'auto',
      '& .selection-cell': {
        padding: 0,
        textAlign: 'center',
        verticalAlign: 'middle',
        paddingTop: '6px'
      }
    }
  }
}));

const UploadMlModels = ({ setModel }) => {
  const classes = useStyles();

  const models = useSelector(({ common }) => common.models);

  const columns = [
    {
      dataField: 'name',
      text: 'Model Name'
    },
    {
      dataField: 'code',
      text: 'Model Code'
    },
    {
      dataField: 'status',
      text: 'Status'
    }
  ];

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    hideSelectAll: true,
    onSelect: row => {
      setModel(row.id);
    }
  };

  return (
    <Grid container direction='column' className={classes.container}>
      <Card className={classes.card} elevation={0}>
        <Box mb={3}>
          <Typography variant='h1'>Select Model</Typography>
        </Box>
        <BootstrapTable
          keyField='id'
          data={models}
          columns={columns}
          selectRow={selectRow}
          style={{ backgroundColor: 'white' }}
        />
      </Card>
    </Grid>
  );
};

export default UploadMlModels;
