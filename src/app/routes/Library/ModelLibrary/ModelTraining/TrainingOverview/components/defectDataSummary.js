import { CircularProgress, Divider } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { NumberFormater } from 'app/utils/helpers';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNewTrainingModel } from 'store/modelTraining/selector';

import Table from '../../RetrainModel/components/Table';
import { useParams } from 'react-router-dom';

const usestyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[1],
    width: '400px'
  },
  tableContainer: {
    backgroundColor: theme.colors.grey[1],
    width: 'calc(100% - 416px)',
    overflowY: 'hidden',
    '&  [class*="MuiTableContainer-root"]': {
      overflow: 'auto',
      maxHeight: '353px',
      '&::-webkit-scrollbar ': {
        width: 3
      },

      /* Track */
      '&::-webkit-scrollbar-track': {
        borderRadius: 10
      },

      /* Handle */
      '&::-webkit-scrollbar-thumb': {
        background: '#31456A',
        borderRadius: 10
      },

      /* Handle on hover */
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#EEEEEE'
      }
    }
  },
  header: {
    fontSize: '0.625rem',
    fontWeight: 500,
    color: theme.colors.grey[13],
    textTransform: 'uppercase'
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[900]
  },
  value: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[19]
  },
  devider: {
    height: 2,
    backgroundColor: theme.colors.grey[6]
  },
  intances: {
    fontSize: '0.875rem',
    fontWeight: 600
  }
}));

const defectSummaryKeys = [
  { label: 'Total Defect in training', key: 'total_defect_in_training' },
  {
    label: 'Defects imported from base model',
    key: 'defects_imported_from_base_model'
  },
  { label: 'Newly added Defect', key: 'newly_added_defect' },
  {
    label: 'Removed defect from base model',
    key: 'removed_defect_from_base_model'
  }
];

const dataSummaryKeys = [
  { label: 'Total Images in training', key: 'total_images_in_training' },
  {
    label: 'Images imported from base model',
    key: 'total_imported_from_base_model'
  },
  { label: 'Newly added Images', key: 'newly_added_images' },
  {
    label: 'Removed Images from base model',
    key: 'removed_images_from_base_model'
  }
];

// const tempDefect = {
// 	defect_in_training: 21,
// 	imported_defects: 21,
// 	new_defects: 21,
// 	removed_defects: 21,
// }

// const tempData = {
// 	images_in_training: 21,
// 	imported_images: 21,
// 	new_images: 21,
// 	removed_images: 21,
// }

const STYLES = {
  column: {
    width: '100%',
    textAlign: 'right'
  }
};
const DefectDataSummary = () => {
  const classes = usestyle();

  const { trainingSessionId } = useParams();

  const {
    data = {},
    isLoading,
    isError
  } = useQuery(['trainingModelSummary', trainingSessionId], context =>
    api.reviewTrainingDefectData(...context.queryKey)
  );

  const columns = [
    { Header: 'Defect name', accessor: 'name' },
    {
      Header: () => <div style={STYLES.column}>Added Defect Instances</div>,
      accessor: 'count',
      Cell: ({ row: { original } }) => {
        return (
          <Box display='flex' justifyContent='flex-end'>
            <Typography className={classes.intances}>
              {NumberFormater(original.count)}
            </Typography>
          </Box>
        );
      }
    }
  ];

  return (
    <Box display='flex' alignItems='flex-start' width='100%'>
      <Box pt={2} px={2} pb={3} mr={2} className={classes.root}>
        <Box mb={1.5}>
          <Typography className={classes.header}>
            Defect Class Summary
          </Typography>
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography className={classes.title}>
            Something went wrong.
          </Typography>
        ) : (
          <Box>
            {defectSummaryKeys.map(keyValue => (
              <Box
                mb={1.625}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                key={keyValue.label}
              >
                <Typography
                  className={classes.title}
                >{`${keyValue.label}:`}</Typography>
                <Typography className={classes.value}>
                  {data.defect_summary?.[keyValue.key] ||
                  data.defect_summary?.[keyValue.key] === 0
                    ? NumberFormater(data.defect_summary?.[keyValue.key])
                    : ''}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        <Box mb={3}>
          <Divider className={classes.devider} />
        </Box>
        <Box mb={1.5}>
          <Typography className={classes.header}>Data Summary</Typography>
        </Box>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography className={classes.title}>
            Something went wrong.
          </Typography>
        ) : (
          <Box>
            {dataSummaryKeys.map(keyValue => (
              <Box
                mb={1.625}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <Typography
                  className={classes.title}
                >{`${keyValue.label}:`}</Typography>
                <Typography className={classes.value}>
                  {data.data_summary?.[keyValue.key] ||
                  data.data_summary?.[keyValue.key] === 0
                    ? NumberFormater(data.data_summary?.[keyValue.key])
                    : ''}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Box className={classes.tableContainer} p={2}>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography className={classes.title}>
            Something went wrong.
          </Typography>
        ) : (
          <Table columns={columns} data={data.defects?.defects ?? []} />
        )}
      </Box>
    </Box>
  );
};

export default DefectDataSummary;
