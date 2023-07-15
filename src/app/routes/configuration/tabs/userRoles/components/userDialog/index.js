import {
  faExclamationTriangle,
  faInfoCircle,
  faTimes
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonButton from 'app/components/ReviewButton';
import CustomizedRadio from 'app/components/ReviewRadio';
import clsx from 'clsx';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  root: {
    width: '707px'
  },
  titleContainer: {
    borderBottom: `1px solid ${theme.colors.grey[4]}`
  },
  title: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  subTitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  textField: {
    backgroundColor: theme.colors.grey[0],
    '& input': {
      color: theme.colors.grey[18],
      fontSize: '0.875rem',
      fontWeight: 500
    }
  },
  textFieldBorder: {
    '& fieldset': {
      border: `0.2px solid ${theme.colors.grey[5]}`,
      boxShadow: theme.colors.shadow.sm,
      borderRadius: '4px'
    },
    '& div:hover fieldset, .Mui-focused fieldset': {
      border: `0.2px solid ${theme.colors.grey[5]} !important`,
      boxShadow: theme.colors.shadow.sm,
      borderRadius: '4px'
    }
  },
  textFieldErrorBorder: {
    '& fieldset': {
      border: `0.2px solid ${theme.colors.red[600]}`,
      boxShadow: theme.colors.shadow.sm,
      borderRadius: '4px'
    },
    '& div:hover fieldset, .Mui-focused fieldset': {
      border: `0.2px solid ${theme.colors.red[600]} !important`,
      boxShadow: theme.colors.shadow.sm,
      borderRadius: '4px'
    }
  },
  inputTitle: {
    color: theme.colors.grey[16],
    fontSize: '0.875rem',
    fontWeight: 600
  },
  errorContainer: {
    color: theme.colors.red[600],
    fontSize: '0.875rem',
    fontWeight: 600,
    '& p': {
      color: theme.colors.red[600],
      fontSize: '0.875rem',
      fontWeight: 600,
      marginLeft: theme.spacing(1)
    }
  },
  infoContainer: {
    backgroundColor: theme.colors.yellow[50],
    border: `1px solid ${theme.colors.yellow[500]}`,
    color: theme.colors.yellow[400],
    fontSize: '0.625rem',
    fontWeight: 900,
    borderRadius: '4px'
  },
  infoText: {
    color: theme.colors.yellow[600],
    fontSize: '0.875rem',
    fontWeight: 600,
    marginLeft: theme.spacing(1)
  },
  infoContainerRoot: {
    borderBottom: `1px solid ${theme.colors.grey[4]}`
  },
  closeBtn: {
    color: theme.colors.grey[7],
    fontSize: '0.75rem',
    fontWeight: 400,
    cursor: 'pointer'
  }
}));

const getDialogTitle = (isData, isActive) => {
  if (isActive) return 'Activate User';
  if (isData) return 'Edit User Profile';
  if (!isData) return 'Add User';
};

const getActionBtnText = (isData, isActive) => {
  if (isActive) return 'Activate User';
  if (isData) return 'Update User Profile';
  if (!isData) return 'Save';
};

const UserDialog = ({ onClose, data, isActiveDialog = false }) => {
  const classes = useStyles();

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      display_name: data?.display_name || '',
      email: data?.email || '',
      password: '',
      role: data?.is_staff ? 'Admin' : 'Operator'
    }
  });

  const onSubmit = submitData => {
    const { email, display_name: displayName, password, role } = submitData;
    const [firstName = '', lastName = ''] = displayName.split(' ');
    if (data && Object.keys(data).length) {
      const tempObj = {
        email,
        first_name: firstName,
        last_name: lastName,
        is_staff: role === 'Admin'
      };
      if (password) {
        tempObj.password = password;
      }
      if (isActiveDialog) {
        tempObj.is_active = true;
      }
      api
        .updateUser(data.id, tempObj)
        .then(() => {
          queryClient.invalidateQueries('usersData');
          onClose();
        })
        .catch(({ response }) => {
          if (response?.status === 400) {
            setError('email', {
              type: 'validate',
              message: 'User with this log in id already exists.'
            });
          } else {
            onClose();
            toast('Something went wrong.');
          }
        });
    } else {
      const tempObj = {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        is_staff: role === 'Admin'
      };
      api
        .addNewUser(tempObj)
        .then(() => {
          queryClient.invalidateQueries('usersData');
          onClose();
        })
        .catch(({ response }) => {
          if (response?.status === 400) {
            setError('email', {
              type: 'validate',
              message: 'User with this log in id already exists.'
            });
          } else {
            onClose();
            toast('Something went wrong.');
          }
        });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth='lg'>
      <Box
        pt={2}
        pb={1}
        pl={1.25}
        pr={2.125}
        mb={1}
        width='100%'
        className={classes.root}
      >
        <Box
          className={classes.titleContainer}
          mb={1}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <Box mb={0.25}>
              <Typography className={classes.title}>
                {getDialogTitle(data, isActiveDialog)}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography className={classes.subTitle}>
                Provide information about the user.{' '}
              </Typography>
            </Box>
          </Box>
          <Box onClick={onClose} className={classes.closeBtn}>
            <FontAwesomeIcon icon={faTimes} />
          </Box>
        </Box>

        <Box mb={2}>
          <Typography className={classes.inputTitle}>Name of User</Typography>
          <Box mt={1}>
            <Controller
              name='display_name'
              control={control}
              defaultValue={data?.display_name || ''}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  className={clsx(classes.textField, {
                    [classes.textFieldBorder]: !errors?.display_name,
                    [classes.textFieldErrorBorder]: errors?.display_name
                  })}
                  size='small'
                  variant='outlined'
                />
              )}
            />
          </Box>
        </Box>
        <Box display='flex' alignItems='flex-top' mb={1}>
          <Box mr={3}>
            <Typography className={classes.inputTitle}>Login Id</Typography>
            <Box mt={1}>
              <Controller
                name='email'
                control={control}
                defaultValue={data?.email || ''}
                rules={{
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please enter valid email address'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className={clsx(classes.textField, {
                      [classes.textFieldBorder]: !errors?.email,
                      [classes.textFieldErrorBorder]: errors?.email
                    })}
                    size='small'
                    variant='outlined'
                  />
                )}
              />
            </Box>
          </Box>
          <Box>
            <Typography className={classes.inputTitle}>Password</Typography>
            <Box mt={1}>
              <Controller
                name='password'
                control={control}
                defaultValue={data?.password || ''}
                rules={{
                  required: !data,
                  minLength: {
                    value: 5,
                    message: 'min length is 5'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className={clsx(classes.textField, {
                      [classes.textFieldBorder]: !errors?.password,
                      [classes.textFieldErrorBorder]: errors?.password
                    })}
                    size='small'
                    placeholder={data ? '********' : ''}
                    variant='outlined'
                  />
                )}
              />
            </Box>
          </Box>
        </Box>
        {errors?.email && (
          <Box
            className={classes.errorContainer}
            display='flex'
            alignItems='center'
            mb={2.125}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <Typography>
              {errors.email?.message ||
                'User with this log in id already exists.'}
            </Typography>
          </Box>
        )}
        <Box mb={2}>
          <Box mb={1}>
            <Typography className={classes.inputTitle}>
              Select User role
            </Typography>
          </Box>
          <Controller
            name='role'
            control={control}
            defaultValue={data?.name || ''}
            rules={{
              required: true
            }}
            render={({ field }) => (
              <RadioGroup {...field}>
                <Box
                  pl={1.25}
                  pr={2.125}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='flex-top'
                >
                  <Box maxWidth='50%'>
                    <FormControlLabel
                      className={classes.formControl}
                      value='Admin'
                      control={
                        <CustomizedRadio
                          label='Admin'
                          subtitle='Admin can do all tasks in sixsense platform. '
                          lightTheme
                        />
                      }
                    />
                  </Box>
                  <Box maxWidth='50%'>
                    <FormControlLabel
                      className={classes.formControl}
                      value='Operator'
                      control={
                        <CustomizedRadio
                          label='Member'
                          subtitle='Member can only manually classify and audit data. He can access AI performance, defect library, usecase library, model library  but can’t make any changes in them'
                          lightTheme
                        />
                      }
                    />
                  </Box>
                </Box>
              </RadioGroup>
            )}
          />
        </Box>
        <Box pb={2} mb={2.5} className={classes.infoContainerRoot}>
          <Box
            py={1.375}
            px={1.125}
            className={classes.infoContainer}
            display='flex'
            alignItems='center'
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            <Typography className={classes.infoText}>
              Please share the login id and password with the user separately.
            </Typography>
          </Box>
        </Box>
        <Box display='flex'>
          <CommonButton
            text={getActionBtnText(data, isActiveDialog)}
            size='m'
            onClick={handleSubmit(onSubmit)}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default UserDialog;
