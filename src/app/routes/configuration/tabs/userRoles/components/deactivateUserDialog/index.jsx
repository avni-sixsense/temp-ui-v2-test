import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import Dialog from '@material-ui/core/Dialog';

import CommonButton from 'app/components/ReviewButton';
import CommonBackdrop from 'app/components/CommonBackdrop';

import api from 'app/api';

import classes from './DeactivateUserDialog.module.scss';

const DeactivateUserDialog = ({ onClose, user }) => {
  const queryClient = useQueryClient();

  const [isUserDeactivating, setIsUserDeactivating] = useState(false);

  const handleDeactivate = () => {
    setIsUserDeactivating(true);

    const payload = { email: user.email, is_active: false };

    api
      .updateUser(user.id, payload)
      .then(() => {
        queryClient.invalidateQueries('usersData');
      })
      .catch(() => {
        toast('Something went wrong. Please try again.');
      })
      .finally(onClose);
  };

  return (
    <>
      <Dialog open onClose={onClose} maxWidth='lg'>
        <div className={classes.root}>
          <div className={classes.title}>Are you sure?</div>

          <div className={classes.content}>
            <span>{user.display_name}</span> (<span>{user.email}</span>) will
            not be able to login to SixSense. Access to the tool would be
            removed.
          </div>

          <div className={classes.actionBtn}>
            <CommonButton
              text='Yes, Deactivate'
              variant='negative'
              onClick={handleDeactivate}
              disabled={isUserDeactivating}
            />
            <CommonButton text='Cancel' variant='tertiary' onClick={onClose} />
          </div>
        </div>
      </Dialog>

      <CommonBackdrop open={isUserDeactivating} />
    </>
  );
};

export default DeactivateUserDialog;
