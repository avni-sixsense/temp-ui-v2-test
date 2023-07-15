import { faLock, faLockOpen } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@material-ui/core';
import { NumberFormater } from 'app/utils/helpers';
import React from 'react';

const columns = (onClick, onReviewClick) => {
  return [
    {
      accessor: 'name',
      Header: 'Data Set Name',
      variant: 'body2'
      // width: '200px',
    },
    {
      accessor: 'is_locked',
      Header: 'Status',
      maxWidth: '200px',
      Cell: ({ row: { original } }) => {
        return (
          <Box className='textClickable'>
            <FontAwesomeIcon
              onClick={() => onClick(original)}
              icon={original.is_locked ? faLock : faLockOpen}
            />
          </Box>
        );
      }
    },
    {
      accessor: 'file_sets_count',
      Header: 'Total Images',
      maxWidth: '200px',
      Cell: ({ value, row: { original } }) => {
        return (
          <Box
            className='textClickable'
            onClick={() => {
              onReviewClick({ data_sets__in: original.id });
            }}
          >
            <Typography>{NumberFormater(value)}</Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'unlabelled_file_sets_count',
      Header: 'Unlabelled Images',
      maxWidth: '200px',
      Cell: ({ value, row: { original } }) => {
        return (
          <Box
            onClick={() => {
              onReviewClick({
                data_sets__in: original.id,
                is_gt_classified: false
              });
            }}
            className='textClickable'
          >
            <Typography>{NumberFormater(value)}</Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'unreviewed_file_sets_count',
      Header: 'uneviewed Images',
      maxWidth: '200px',
      Cell: ({ value, row: { original } }) => {
        return (
          <Box
            onClick={() => {
              onReviewClick({ data_sets__in: original.id, is_reviewed: false });
            }}
            className='textClickable'
          >
            <Typography>{NumberFormater(value)}</Typography>
          </Box>
        );
      }
    },
    {
      accessor: 'user_name',
      Header: 'Create by',
      maxWidth: '200px'
    }
  ];
};

export default columns;
