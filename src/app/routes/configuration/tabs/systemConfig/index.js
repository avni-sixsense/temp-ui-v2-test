// import { faEdit } from '@fortawesome/pro-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setConfigUsecases } from 'store/configuration/actions';

import Collapse from '../../components/Collapse';
import {
  systemConfigAutoAccuracyThreshold,
  systemConfigThreshold
} from '../components/columns';
// import CommonButton from 'app/components/ReviewButton'
import CustomTable from '../components/table';
import OverallThreshold from './overallThreshold';

const useStyles = makeStyles(theme => ({
  infoText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[12]
  },
  tableContainer: {
    maxHeight: '300px',
    overflow: 'auto',
    width: '100%',
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 0px white',
      borderRadius: '5px'
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: ' #dfdcdc',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#cecece'
    }
  }
}));

const SystemConfigContainer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { usecases } = useSelector(({ configuration }) => configuration);

  const { data, isLoading } = useQuery('getConfigUsecases', context =>
    api.getConfigUsecases(...context.queryKey)
  );

  useEffect(() => {
    dispatch(setConfigUsecases(data?.results || []));
  }, [data]);

  const tempData = [
    {
      name: 'title',
      threshold: 95,
      auto_classified_percentage: 65,
      accuracy_percentage: 95
    }
  ];

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={3}
      >
        <Typography className={classes.infoText}>
          Configure system defaults here.
        </Typography>
        {/* <CommonButton
					text="Edit Configuration"
					icon={<FontAwesomeIcon icon={faEdit} />}
					variant="tertiary"
					size="m"
				/> */}
      </Box>
      <Box mb={2}>
        <Collapse
          title='Auto-classification threshold to classify wafers'
          subTitle='If auto-classification rate on wafer is greater than selected threshold than only wafer will be auto-classified otherwise it will go for manual classification'
          content={
            <Box className={classes.tableContainer}>
              <CustomTable columns={systemConfigThreshold} data={usecases} />
            </Box>
          }
          isLoading={isLoading}
        />
      </Box>
      <Box mb={2}>
        <Collapse
          title='Expected auto-classification & accuracy at overall level'
          content={<OverallThreshold />}
        />
      </Box>
      <Box mb={2}>
        <Collapse
          title='Expected auto-classification & accuracy at usecases level'
          content={
            <Box className={classes.tableContainer}>
              <CustomTable
                columns={systemConfigAutoAccuracyThreshold}
                data={usecases}
              />
            </Box>
          }
          isLoading={isLoading}
        />
      </Box>
    </>
  );
};

export default SystemConfigContainer;
