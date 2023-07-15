import { faPlus, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LightTextfield from 'app/components/LightTextField';
import CommonButton from 'app/components/ReviewButton';
import React, { useState } from 'react';

import BodyBox from '../BodyBox';
import HeaderBox from '../Header';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  title: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  subtitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  chartTitle: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[15]
  },
  chartSubtitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  formFieldTitle: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[15]
  },
  formFieldValue: {
    '& input, textarea': {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: theme.colors.grey[14]
    }
  },
  chartContainer: {
    borderBottom: `1px solid ${theme.colors.grey[3]}`
  },
  chart: {
    width: '80px',
    height: '40px',
    backgroundColor: theme.colors.grey[3],
    borderRadius: '4px'
  }
}));

const AIResults = () => {
  const classes = useStyles();
  const [columns, setColumns] = useState(2);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Box width='100%' height='100%'>
      <HeaderBox
        setColumns={setColumns}
        columns={columns}
        handleWidgetClick={handleOpenModal}
      />
      <BodyBox columns={columns} handleWidgetClick={handleOpenModal} />
      <Modal open={isModalOpen} onClose={handleClose} className={classes.modal}>
        <Paper>
          <Box px={1.5} pt={1.5} pb={2} width='633px'>
            <Box
              pb={1.25}
              mb={1.5}
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              className={classes.modalTitleContainer}
            >
              <Box>
                <Typography className={classes.title}>
                  Create New Widget
                </Typography>
                <Typography className={classes.subtitle}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit!
                </Typography>
              </Box>
              <CommonButton
                text='Close'
                icon={<FontAwesomeIcon icon={faTimes} />}
                variant='tertiary'
                size='sm'
                onClick={handleClose}
              />
            </Box>
            <Box pb={0.5} className={classes.chartContainer} mb={1.5}>
              <Box mb={1}>
                <Typography className={classes.chartTitle}>
                  Select Chart Type
                </Typography>
                <Typography className={classes.chartSubtitle}>
                  Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
                </Typography>
              </Box>
              <Box display='flex' alignItems='center' flexWrap='wrap'>
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
                <Box mb={1} mr={1} className={classes.chart} />
              </Box>
            </Box>
            <Box pb={1.5} mb={1.5} className={classes.chartContainer}>
              <Grid container alignItems='center' spacing={1}>
                <Grid item sm={3}>
                  <Typography className={classes.formFieldTitle}>
                    Chart Title
                  </Typography>
                </Grid>
                <Grid item sm={9}>
                  <LightTextfield
                    className={classes.formFieldValue}
                    value='Lot level yield loss'
                    fullWidth
                    variant='outlined'
                    size='small'
                  />
                </Grid>
                <Grid item sm={3}>
                  <Typography className={classes.formFieldTitle}>
                    Chart Description
                  </Typography>
                </Grid>
                <Grid item sm={9}>
                  <LightTextfield
                    value='Which lots have high yield loss? '
                    className={classes.formFieldValue}
                    fullWidth
                    variant='outlined'
                    size='small'
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box pb={1.5} mb={1.5} className={classes.chartContainer}>
              <Grid container alignItems='center' spacing={1}>
                <Grid item sm={3}>
                  <Typography className={classes.formFieldTitle}>
                    X Axis
                  </Typography>
                </Grid>
                <Grid item sm={5}>
                  <LightTextfield
                    className={classes.formFieldValue}
                    value='Inference Date'
                    fullWidth
                    variant='outlined'
                    size='small'
                  />
                </Grid>
                <Grid item sm={4}>
                  <LightTextfield
                    className={classes.formFieldValue}
                    value='Date'
                    fullWidth
                    variant='outlined'
                    size='small'
                  />
                </Grid>
                <Grid item sm={3}>
                  <Typography className={classes.formFieldTitle}>
                    Y Axis
                  </Typography>
                </Grid>
                <Grid item sm={5}>
                  <LightTextfield
                    value='Defect'
                    className={classes.formFieldValue}
                    fullWidth
                    variant='outlined'
                    size='small'
                  />
                </Grid>
                <Grid item sm={4}>
                  <LightTextfield
                    className={classes.formFieldValue}
                    value='Sum'
                    fullWidth
                    variant='outlined'
                    size='small'
                  />
                </Grid>
              </Grid>
            </Box>
            <Box pb={1.5} mb={1.5} className={classes.chartContainer}>
              <Grid container alignItems='center' spacing={1}>
                <Grid item sm={3}>
                  <Typography className={classes.formFieldTitle}>
                    Group By
                  </Typography>
                </Grid>
                <Grid item sm={9}>
                  <LightTextfield
                    className={classes.formFieldValue}
                    value='Machine ID'
                    fullWidth
                    variant='outlined'
                    size='small'
                  />
                </Grid>
                <Grid item sm={3}>
                  <Typography className={classes.formFieldTitle}>
                    Filter
                  </Typography>
                </Grid>
                <Grid item sm={9}>
                  <LightTextfield
                    value=''
                    className={classes.formFieldValue}
                    placeholder='Add Filters...'
                    fullWidth
                    variant='outlined'
                    size='small'
                  />
                </Grid>
              </Grid>
            </Box>
            <Box display='flex' alignItems='center' justifyContent='flex-end'>
              <CommonButton
                text='Cancel'
                variant='tertiary'
                size='sm'
                onClick={handleClose}
              />
              <Box ml={1}>
                <CommonButton
                  text='Add Widget'
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  size='sm'
                  onClick={handleClose}
                />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
};

export default AIResults;
