import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import CommonButton from 'app/components/CommonButton';
import ModelSelect from 'app/routes/reviewData/components/ModelSelect';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const useStyle = makeStyles(theme => ({
  input: {
    display: 'none'
  },
  gridContainer: {
    width: '100%'
  },
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
  tipContainer: {
    borderRadius: '3px',
    margin: theme.spacing(1, 2),
    padding: theme.spacing(1),
    backgroundColor: '#F1FBFF'
  },
  tipRoot: {
    width: '95%'
  },
  tip: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'left',
    margin: 10
  },
  commonBtn: {
    margin: 'auto 10px'
  }
}));

const ModelDefectSelect = () => {
  const classes = useStyle();

  const state = useSelector(({ allUploads }) => allUploads);
  const { modelDefectDrawer } = state;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { subscriptionId } = useParams();

  const { data: { results: models = [] } = [], isLoading } = useQuery(
    ['models', subscriptionId],
    context => api.getMlModels(...context.queryKey)
  );

  const [defects, setDefects] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectdDefects, setSelectedDefects] = useState([]);

  const handleDrawer = () => {
    dispatch({ type: 'SET_MODEL_DEFECT_DRAWER', status: false });
  };

  const handleClose = () => {
    handleDrawer(false);
  };

  const handleModelChange = val => {
    setSelectedModel(val);
    setDefects(val?.defects || []);
  };

  const handleDefectChange = val => {
    setSelectedDefects(val);
  };

  const handleFeedback = () => {
    setLoading(true);
    const params = JSON.parse(localStorage.getItem('params') || {});
    if (!params) {
      return;
    }
    const data = {
      ml_model_id: selectedModel?.id,
      subscription_id: subscriptionId,
      ...params,
      feedback: {
        assign_to_all: selectdDefects.map(defect => defect.id)
      }
    };
    api.bulkFeedback(data).finally(() => {
      setLoading(false);
      handleDrawer();
      localStorage.removeItem('params');
    });
  };

  return (
    <Drawer anchor='right' open={modelDefectDrawer}>
      <Grid
        container
        direction='column'
        justifyContent='space-between'
        className={classes.container}
      >
        <Box py={5} px={4}>
          <Box>
            <Box my={1}>
              <Typography variant='h1'>Bulk Feedback</Typography>
            </Box>
            <Box my={1}>
              <Typography variant='h4'>Provide bulk feedback</Typography>
            </Box>
          </Box>
          <Box width='100%' py={5}>
            {models.filter(
              model =>
                model.classification_type === 'SINGLE_LABEL' &&
                (model.status === 'ready_for_deployment' ||
                  model.status === 'deployed_in_prod')
            ).length ? (
              <Grid container className={classes.gridContainer}>
                <Grid container>
                  <Grid item xs={12}>
                    <Box py={3} width={320}>
                      <Typography variant='h3'>Model</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs='auto'>
                    <ModelSelect
                      models={
                        models.filter(
                          model =>
                            model.classification_type === 'SINGLE_LABEL' &&
                            (model.status === 'ready_for_deployment' ||
                              model.status === 'deployed_in_prod')
                        ) || []
                      }
                      width={320}
                      onChange={handleModelChange}
                    />
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12}>
                    <Box py={3} width={320}>
                      <Typography variant='h3'>Defect</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs='auto'>
                    <ModelSelect
                      selected={selectdDefects || []}
                      models={defects || []}
                      width={320}
                      multiSelect
                      onChange={handleDefectChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ) : isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Typography>
                Bulk feedback feature is available for Single Label
                Classification type only.
              </Typography>
            )}
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
              text='Close'
              variant='quaternary'
              onClick={handleClose}
              wrapperClass={classes.commonBtn}
            />
          </Grid>

          <Grid item>
            <CommonButton
              text='Give Feedback'
              onClick={handleFeedback}
              variant='primary'
              disabled={!(selectedModel && selectdDefects.length)}
              wrapperClass='mr-2'
            />
          </Grid>
        </Grid>
      </Grid>
      <CommonBackdrop open={loading} />
    </Drawer>
  );
};

export default ModelDefectSelect;
