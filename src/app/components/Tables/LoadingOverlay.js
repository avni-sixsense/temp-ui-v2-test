import { TableContainer } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import WithCondition from 'app/hoc/WithCondition';
import React from 'react';

import useStyles from './styles';

const LoadingOverlay = ({ isLoading, children }) => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.tableContainer}>
      <WithCondition
        when={isLoading}
        then={
          <div className={classes.overlayWrapper}>
            <div className={classes.overlay}>
              <div className={classes.overlayInner}>
                <CircularProgress />
              </div>
            </div>
          </div>
        }
        or={children}
      />
    </TableContainer>
  );
};

export default LoadingOverlay;
