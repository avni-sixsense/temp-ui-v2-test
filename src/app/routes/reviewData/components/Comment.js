import { Avatar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AvatarImage from 'assests/images/testTableImg.svg';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
  paper: {
    boxShadow: theme.colors.shadow.sm,
    backgroundColor: theme.colors.grey[17],
    borderRadius: '4px',
    width: '488px'
  },
  avatarName: {
    color: theme.colors.grey[0],
    fontWeight: 600,
    fontSize: '0.875rem'
  },
  timeStamp: {
    color: theme.colors.grey[9],
    fontWeight: 400,
    fontSize: '0.750rem'
  },
  comment: {
    color: theme.colors.grey[0],
    fontWeight: 500,
    fontSize: '0.875rem'
  },
  inputField: {
    borderRadius: '8px',
    backgroundColor: theme.colors.grey[16],
    // border: `0.2px solid ${theme.colors.grey[13]}`,
    color: '#FFFFFF',
    '& textarea': {
      color: '#FFFFFF',
      fontWeight: 500,
      fontSize: '0.750rem',
      '&::placeholder': {
        color: theme.colors.grey[9],
        opacity: 1
      },
      '&:-ms-input-placeholder': {
        color: theme.colors.grey[9]
      },
      '&::-ms-input-placeholder': {
        color: theme.colors.grey[9]
      }
    }
  },
  stepperLine: {
    backgroundColor: theme.colors.grey[15],
    width: '2px'
  }
}));

const CommentPopup = ({ anchorEl }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (anchorEl && !open) {
      setOpen(true);
    } else if (open) {
      setOpen(false);
    }
  }, [anchorEl, open]);

  const commentData = [
    {
      id: 1,
      name: 'Eduardo Benz',
      timeStamp: 'Commented 6d ago',
      comment: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam.`
    },
    {
      id: 2,
      name: 'Eduardo Benz',
      timeStamp: 'Commented 6d ago',
      comment: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam.`
    },
    {
      id: 3,
      name: 'Eduardo Benz',
      timeStamp: 'Commented 6d ago',
      comment: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam.`
    }
  ];

  return (
    <Popper open={open} anchorEl={anchorEl} placement='right-start' transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Box mx={1}>
            <Paper className={classes.paper}>
              <Box p={1.5}>
                {commentData.map((data, index) => (
                  <Box key={data.id} display='flex'>
                    <Box
                      display='flex'
                      flexDirection='column'
                      alignItems='center'
                    >
                      <Avatar src={AvatarImage} />
                      {commentData.length !== index + 1 && (
                        <Box className={classes.stepperLine} height='100%' />
                      )}
                    </Box>
                    <Box pb={1.75} pl={1.5}>
                      <Box>
                        <Typography className={classes.avatarName}>
                          {data.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography className={classes.timeStamp}>
                          {data.timeStamp}
                        </Typography>
                      </Box>
                      <Box pt={0.5}>
                        <Typography className={classes.comment}>
                          {data.comment}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
                <TextField
                  className={classes.inputField}
                  multiline
                  fullWidth
                  rows={3}
                  placeholder='Add Comment'
                  variant='outlined'
                />
              </Box>
            </Paper>
          </Box>
        </Fade>
      )}
    </Popper>
  );
};

export default CommentPopup;
