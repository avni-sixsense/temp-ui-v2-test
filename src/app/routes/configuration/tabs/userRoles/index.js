import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonButton from 'app/components/ReviewButton';
import Show from 'app/hoc/Show';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { userRolesColumns } from '../components/columns';
import CustomTable from '../components/table';
import DeactivateUserDialog from './components/deactivateUserDialog';
import UserDialog from './components/userDialog';

const useStyles = makeStyles(theme => ({
  header: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.grey[22]
  },
  tableContainer: {
    height: 'calc(100vh - 215px)',
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

const conditionalCellStyles = [
  {
    when: row => !row.is_active,
    style: {
      opacity: 0.7,
      pointerEvents: 'none'
    }
  }
];

const UserRolesContainer = () => {
  const classes = useStyles();

  const [users, setUsers] = useState([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeactivatingUser, setIsDeactivatingUser] = useState(null);
  const [editingUserData, setEditingUserData] = useState(null);
  const [isActiveDialog, setIsActiveDialog] = useState(false);

  const { is_staff: isAdmin } = useSelector(({ common }) => common.userInfo);

  const { data: usersData, isLoading } = useQuery(
    ['usersData'],
    api.getAllUsers
  );

  useEffect(() => {
    if (usersData?.count) {
      setUsers(
        usersData.results.map(x => {
          return {
            ...x,
            name: x.display_name,
            visible: false
          };
        })
      );
    }
  }, [usersData]);

  const handleOpenDialog = (_, isActiveDialog) => {
    setIsUserDialogOpen(true);
    if (isActiveDialog) {
      setIsActiveDialog(true);
    }
  };

  const onEdit = (id, isActiveDialog = false) => {
    setEditingUserData(users.filter(x => x.id === id)[0]);
    handleOpenDialog(null, isActiveDialog);
  };

  const onDelete = row => {
    setIsDeactivatingUser(row);
  };

  const handleClose = () => {
    setIsUserDialogOpen(false);
    setEditingUserData(null);
    setIsDeactivatingUser(null);
    setIsActiveDialog(false);
  };

  return (
    <>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        mb={3}
      >
        <Typography className={classes.header}>Manage Users</Typography>

        {isAdmin && <CommonButton onClick={handleOpenDialog} text='Add User' />}
      </Box>

      <Box className={classes.tableContainer}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <CustomTable
            columns={userRolesColumns(
              onEdit,
              onDelete,
              conditionalCellStyles
            ).filter(d => !(!isAdmin && !d.name))}
            data={users}
            maxHeight={`${window.innerHeight - 215}px`}
          />
        )}
      </Box>

      {isUserDialogOpen && (
        <UserDialog
          onClose={handleClose}
          data={editingUserData}
          isActiveDialog={isActiveDialog}
        />
      )}

      <Show when={isDeactivatingUser}>
        <DeactivateUserDialog user={isDeactivatingUser} onClose={handleClose} />
      </Show>
    </>
  );
};

export default UserRolesContainer;
