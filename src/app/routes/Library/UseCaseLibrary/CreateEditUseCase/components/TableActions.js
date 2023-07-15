import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import Button from 'app/components/CommonButton';
import CommonDialog from 'app/components/CommonDialog';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(3.75, 0, 0, 3.75)
  }
}));

const TableActions = ({ selected, drawerClick }) => {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDialog = status => {
    setShowDialog(status);
  };

  const handleDelete = () => {
    const useCase = selected?.[0];
    if (useCase) {
      setShowDialog(false);
      setLoading(true);
      api
        .deleteUseCase(useCase.id)
        .then(_ => {
          if (_.status === 204) {
            toast.success('Deleted Use Case successfully');
          }
        })
        .catch(() => {
          toast.error(`Couldn't delete the Use Case. Please try again.`);
        })
        .finally(() => setLoading(false));
    }
  };
  const dialogActions = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleDialog(false)
    },
    {
      text: 'Continue',
      callback: handleDelete
    }
  ];

  return (
    <Grid
      className={classes.header}
      spacing={2}
      container
      alignItems='center'
      justifyContent='flex-start'
    >
      <Grid item>
        <Button
          wrapperClass='px-3'
          disabled={selected.length !== 1}
          onClick={() => drawerClick('update', selected)}
          text='Edit Use Case'
          variant='tertiary'
        />
      </Grid>
      {/* <Grid item>
				<Button
					wrapperClass="px-3"
					disabled={selected.length !== 1}
					onClick={() => handleDialog(true)}
					text="Delete"
					variant="tertiary"
				/>
			</Grid> */}
      {showDialog && (
        <CommonDialog
          open={showDialog}
          message='Are you sure you want to delete the use case?'
          subMessage={`You're deleting folder  ${selected?.[0]?.name}. This action is irreversible and will delete all images, feedback and AI output on the images`}
          actions={dialogActions}
        />
      )}
      <CommonBackdrop open={loading} />
    </Grid>
  );
};

export default TableActions;
