import { faDownload, faPen, faSync } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import React from 'react';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.grey[19]
  },
  subtitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  estimatedTimeBox: {
    backgroundColor: theme.colors.blue[600],
    borderRadius: '4px'
  },
  estimatedTimeHeader: {
    fontSize: '0.625rem',
    fontWeight: 500,
    color: theme.colors.grey[0]
  },
  estimatedTimeSubHeader: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[0]
  },
  estimatedTimeTime: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[0]
  },
  detailBox: {
    backgroundColor: theme.colors.grey[1]
  },
  detailBoxHeader: {
    fontSize: '0.625rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  },
  detailBoxHeader2: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  },
  lightText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[13]
  },
  boldText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[19]
  }
}));

const Step5 = () => {
  const classes = useStyles();
  return (
    <Box pt={4.25} px={21.25}>
      <Box
        mb={2.5}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box>
          <Typography className={classes.header}>
            Review Training Details
          </Typography>
          <Typography className={classes.subtitle}>
            This information will be displayed publicly so be careful what you
            share.{' '}
          </Typography>
        </Box>
        <Box>
          <CommonButton
            text='Export as XLS'
            icon={<FontAwesomeIcon icon={faDownload} />}
            variant='tertiary'
            size='sm'
            onClick={() => {}}
          />
        </Box>
      </Box>
      <Box mb={2.5} py={2} px={1.25} className={classes.estimatedTimeBox}>
        <Typography className={classes.estimatedTimeHeader}>
          Estimated time
        </Typography>
        <Box
          mt={1.5}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            width='20%'
          >
            <Typography className={classes.estimatedTimeSubHeader}>
              Training time
            </Typography>
            <Typography className={classes.estimatedTimeTime}>
              20 hours 24 minutes
            </Typography>
          </Box>
          <Box>
            <CommonButton
              text='Recalculate Training Time'
              icon={<FontAwesomeIcon icon={faSync} />}
              variant='tertiary'
              size='sm'
              onClick={() => {}}
            />
          </Box>
        </Box>
      </Box>
      <Box className={classes.detailBox} mb={2.5} px={1.25} pt={2} pb={0.375}>
        <Box
          mb={1.4375}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography className={classes.detailBoxHeader}>
            MODEL DETAILS
          </Typography>
          <CommonButton
            text='Edit'
            icon={<FontAwesomeIcon icon={faPen} />}
            variant='tertiary'
            size='sm'
            onClick={() => {}}
          />
        </Box>
        <Box>
          <Box mb={1.625} width='40%' display='flex' alignItems='center'>
            <Box width='20%'>
              <Typography className={classes.lightText}>Model Name</Typography>
            </Box>
            <Box>
              <Typography className={classes.boldText}>Defect Tags</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.detailBox} mb={2.5} px={1.25} pt={2} pb={0.375}>
        <Box>
          <Box
            mb={1.4375}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography className={classes.detailBoxHeader}>
              DEFECT DETAILS
            </Typography>
            <CommonButton
              text='Edit'
              icon={<FontAwesomeIcon icon={faPen} />}
              variant='tertiary'
              size='sm'
              onClick={() => {}}
            />
          </Box>
          <Box>
            <Box mb={1.625} width='40%' display='flex' alignItems='center'>
              <Box width='20%'>
                <Typography className={classes.lightText}>Counts</Typography>
              </Box>
              <Box>
                <Typography className={classes.boldText}>7 Defects</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box
            mb={1.4375}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography className={classes.detailBoxHeader2}>
              Defect List
            </Typography>
            <CommonButton
              text='Edit'
              icon={<FontAwesomeIcon icon={faPen} />}
              variant='tertiary'
              size='sm'
              onClick={() => {}}
            />
          </Box>
          <Box>
            <Box mb={1.625} width='40%' display='flex' alignItems='center'>
              <Box width='20%'>
                <Typography className={classes.boldText}>Defect A</Typography>
              </Box>
              <Box>
                <Typography className={classes.boldText}>
                  21 Instances
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.detailBox} mb={2.5} px={1.25} pt={2} pb={0.375}>
        <Box
          mb={1.4375}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography className={classes.detailBoxHeader}>LABEL</Typography>
          <CommonButton
            text='Edit'
            icon={<FontAwesomeIcon icon={faPen} />}
            variant='tertiary'
            size='sm'
            onClick={() => {}}
          />
        </Box>
        <Box>
          <Box mb={1.625} width='40%' display='flex' alignItems='center'>
            <Box width='20%'>
              <Typography className={classes.lightText}>Image Count</Typography>
            </Box>
            <Box>
              <Typography className={classes.boldText}>14145</Typography>
            </Box>
          </Box>
          <Box mb={1.625} width='40%' display='flex' alignItems='center'>
            <Box width='20%'>
              <Typography className={classes.lightText}>
                Defect Instances
              </Typography>
            </Box>
            <Box>
              <Typography className={classes.boldText}>3145141</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.detailBox} mb={2.5} px={1.25} pt={2} pb={0.375}>
        <Box
          mb={1.4375}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography className={classes.detailBoxHeader}>
            LABEL CHANGE
          </Typography>
          <CommonButton
            text='Edit'
            icon={<FontAwesomeIcon icon={faPen} />}
            variant='tertiary'
            size='sm'
            onClick={() => {}}
          />
        </Box>
        <Box>
          <Box mb={1.625} width='40%' display='flex' alignItems='center'>
            <Box>
              <Typography className={classes.boldText}>Class B</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.detailBox} mb={2.5} px={1.25} pt={2} pb={0.375}>
        <Box
          mb={1.4375}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography className={classes.detailBoxHeader}>
            TRAINING DETAILS
          </Typography>
          <CommonButton
            text='Edit'
            icon={<FontAwesomeIcon icon={faPen} />}
            variant='tertiary'
            size='sm'
            onClick={() => {}}
          />
        </Box>
        <Box>
          <Box mb={1.625} width='40%' display='flex' alignItems='center'>
            <Box width='20%'>
              <Typography className={classes.lightText}>
                Training Split
              </Typography>
            </Box>
            <Box>
              <Typography className={classes.boldText}>52%</Typography>
            </Box>
          </Box>
          <Box mb={1.625} width='40%' display='flex' alignItems='center'>
            <Box width='20%'>
              <Typography className={classes.lightText}>
                Testing Split
              </Typography>
            </Box>
            <Box>
              <Typography className={classes.boldText}>48%</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Step5;
