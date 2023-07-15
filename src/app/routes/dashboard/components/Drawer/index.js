import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonButton from 'app/components/CommonButton';
import ModelSelect from 'app/routes/reviewData/components/ModelSelect';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

const useStyle = makeStyles(theme => ({
  container: {
    background: '#F1FBFF',
    width: '690px',
    minHeight: '100%',
    padding: 0,
    margin: 0,
    flexWrap: 'nowrap'
  },
  bottomNav: {
    width: '100%',
    margin: 0,
    padding: theme.spacing(1, 2),
    background: '#fff'
  },
  commonBtn: {
    margin: 'auto 10px'
  }
}));

const Upload = ({ selectedDefects, handleClose, setSelectedDefects }) => {
  const classes = useStyle();
  const { subscriptionId } = useParams();
  const [tempDefectSelect, setTempDefectSelect] = useState([]);

  const { data: defects = [] } = useQuery(
    ['defects', subscriptionId],
    context => api.getDefects(...context.queryKey),
    {
      enabled: !!subscriptionId
    }
  );

  const handleDefectSelect = values => {
    if (values) {
      if (
        values.filter(defect => defect.name === 'Non Visible Defects').length >
        0
      ) {
        setTempDefectSelect(values);
      } else {
        setTempDefectSelect([
          { name: 'Non Visible Defects', value: 'Non Visible Defects' },
          ...values
        ]);
      }
    }
  };

  const applyDefects = () => {
    setSelectedDefects(tempDefectSelect);
    handleClose();
  };

  const handleCancelClick = () => {
    setTempDefectSelect([]);
    handleClose();
  };

  return (
    <Drawer anchor='right' open>
      <Grid
        container
        direction='column'
        justifyContent='space-between'
        className={classes.container}
      >
        <Box py={5} px={4}>
          <Box>
            <Box my={1}>
              <Typography variant='h1'>Overkill Defects</Typography>
            </Box>
          </Box>
          <Box width='100%' py={5}>
            <Grid container className={classes.gridContainer}>
              <Grid alignItems='center' container>
                <Grid item xs={3}>
                  <Box py={3} width={320}>
                    <Typography variant='h3'>Defects: </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <ModelSelect
                    selected={selectedDefects}
                    models={
                      defects?.results
                        ? [
                            {
                              name: 'Non Visible Defects',
                              value: 'Non Visible Defects'
                            },
                            ...defects?.results
                          ]
                        : []
                    }
                    multiSelect
                    onChange={handleDefectSelect}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Grid
          container
          direction='row'
          justifyContent='flex-end'
          alignItems='center'
          spacing={1}
          className={classes.bottomNav}
        >
          <Grid item>
            <CommonButton
              text='Cancel'
              variant='quaternary'
              onClick={handleCancelClick}
              wrapperClass={classes.commonBtn}
            />
          </Grid>

          <Grid item>
            <CommonButton
              text='Apply'
              variant='primary'
              wrapperClass={classes.commonBtn}
              onClick={applyDefects}
            />
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default Upload;
