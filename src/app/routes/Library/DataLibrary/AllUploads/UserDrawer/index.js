import { Box, ClickAwayListener, Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import api from 'app/api';
import CommonButton from 'app/components/ReviewButton';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { userRolesColumns } from './components/columns';
import CustomTable from './components/table';

const useStyle = makeStyles(theme => ({
  tableContainer: {
    maxHeight: `calc(100vh - 150px)`,
    overflow: 'auto',
    width: 'auto',
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
  },
  container: {
    background: theme.colors.grey[2],
    width: '690px',
    height: '100vh',
    overflowY: 'auto',
    padding: 0,
    margin: 0,
    flexWrap: 'nowrap'
  },
  header: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.colors.grey[22]
  }
}));

const UserDrawer = ({ drawerOpen, onClose, lightTheme, selected }) => {
  const classes = useStyle();
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const { data: usersData } = useQuery(['usersData'], api.getAllUsers);

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

  const handleSubmit = () => {
    const encodedString = btoa(
      `upload_session_id__in=${selected.map(x => x.id).join(',')}`
    );
    api
      .createUserTags({
        file_set_filters: encodedString,
        user_ids: selectedRows.map(x => x.id)
      })
      .then(() => {
        toast('User tags allocated to the filesets');
      })
      .catch(() => {
        toast('Something went wrong, please try again.');
      });
    onClose();
  };
  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  return (
    <Drawer id='data_lib_upload_drawer' anchor='right' open={drawerOpen}>
      <ClickAwayListener onClickAway={onClose}>
        <Box className={classes.container}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            mb={3}
            mt={3}
            mx={3}
          >
            <Typography className={classes.header}>
              Assign Task to User{' '}
            </Typography>
          </Box>
          <Box className={classes.tableContainer} mx={1}>
            <CustomTable
              columns={userRolesColumns}
              data={users}
              selectableRows
              onchange={handleChange}
              maxHeight={`${window.innerHeight - 150}px`}
            />
          </Box>
          <Box display='flex' alignItems='center' mt={1} mx={1}>
            <Box display='flex' alignItems='center'>
              <CommonButton
                text='Assign'
                onClick={handleSubmit}
                size='sm'
                variant={lightTheme ? 'primary' : 'secondary'}
              />
            </Box>
            <Box pl={2} display='flex' alignItems='center'>
              <CommonButton
                text='Cancel'
                onClick={onClose}
                variant='tertiary'
              />
            </Box>
          </Box>
        </Box>
      </ClickAwayListener>
    </Drawer>
  );
};

export default UserDrawer;
