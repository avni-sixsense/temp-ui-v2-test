import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ButtonContainer from './ButtonContainer';
import InstanceActionContainer from './InstanceActions';
import InstanceCount from './InstanceCount';
import SelectAllContainer from './SelectAll';

const usestyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
}));

const InstaceCountBtn = () => {
  const classes = usestyle();

  return (
    <div className={classes.root}>
      <InstanceCount />

      <div className={classes.actionContainer}>
        <InstanceActionContainer />

        <ButtonContainer>
          <SelectAllContainer />
        </ButtonContainer>
      </div>
    </div>
  );
};

export default InstaceCountBtn;
