import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'app/components/CommonButton';
import collapseFalse from 'assests/images/collapseFalse.png';
import collapseTrue from 'assests/images/collapseTrue.png';
import expandFalse from 'assests/images/expandFalse.png';
import expandTrue from 'assests/images/expandTrue.png';
import React from 'react';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(3.75, 0, 0, 3.75)
  },
  expand: {
    marginRight: theme.spacing(2)
  },
  deleteButton: {
    marginLeft: theme.spacing(2)
  }
}));

const TableActions = ({
  drawerClick,
  state,
  setExpandAll,
  expandAll,
  handleDeleteDefect,
  handleConfigHotKeyClick
}) => {
  const classes = useStyles();

  return (
    <Grid
      className={classes.header}
      spacing={2}
      container
      alignItems='center'
      justifyContent='space-between'
    >
      <Grid item>
        <Button
          text='Edit Defect'
          onClick={() => drawerClick('update')}
          variant='tertiary'
          disabled={state.selected.length !== 1}
        />
        <Button
          text='Delete Defect'
          onClick={() => handleDeleteDefect(true)}
          variant='tertiary'
          disabled={state.selected.length !== 1}
          wrapperClass={classes.deleteButton}
        />
        <Button
          text='Configure Hotkeys'
          onClick={handleConfigHotKeyClick}
          variant='tertiary'
          disabled={state.selected.length === 0}
          wrapperClass={classes.deleteButton}
        />
      </Grid>
      <Grid item className={classes.expand}>
        {expandAll ? (
          <img
            src={expandFalse}
            alt=''
            onClick={() => setExpandAll(false)}
            style={{ minWidth: '29px', minHeight: '27px' }}
            className='ss_pointer'
          />
        ) : (
          <img
            src={expandTrue}
            alt=''
            onClick={() => setExpandAll(true)}
            className='ss_pointer'
            style={{ minWidth: '29px', minHeight: '27px' }}
          />
        )}
        {expandAll ? (
          <img
            src={collapseTrue}
            alt=''
            onClick={() => setExpandAll(false)}
            className='ss_pointer'
            style={{ minWidth: '29px', minHeight: '27px' }}
          />
        ) : (
          <img
            src={collapseFalse}
            alt=''
            onClick={() => setExpandAll(true)}
            className='ss_pointer'
            style={{ minWidth: '29px', minHeight: '27px' }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default TableActions;
