// import Box from '@material-ui/core/Box'
// import React from 'react'
// import Typography from '@material-ui/core/Typography'

import dayjs, { tz } from 'dayjs';

const timezone = require('dayjs/plugin/timezone');

dayjs.extend(timezone);
const timeZone = dayjs.tz.guess();

export const customColumnSort = (rowA, rowB) => {
  if (rowA > rowB) {
    return 1;
  }
  if (rowB > rowA) {
    return -1;
  }
  return 0;
};

export const classifyWafer = classes => {
  return [
    {
      Header: 'wafer Id',
      accessor: 'organization_wafer_id'
    },
    {
      Header: 'Folder',
      accessor: 'upload_session_name'
    },
    {
      Header: 'Total Images',
      accessor: 'total_images'
    },
    {
      Header: 'created at',
      accessor: 'created_ts',
      Cell: ({ row: { original } }) => {
        return dayjs(original?.created_ts)
          .tz(timeZone)
          .format('hh:mm A, DD MMM YYYY');
      }
    }
  ];
};
