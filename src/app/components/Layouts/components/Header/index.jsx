import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import api from 'app/api';
import { logout } from 'app/utils/helpers';
import logo from 'assests/images/logo.png';
import rectangle from 'assests/images/rectangle.svg';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.common.white,
    color: theme.palette.primary.main,
    position: 'fixed',
    top: 0
  },
  grow: {
    flexGrow: 1
  },
  title: {
    height: '100%',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleBg: {
    background: `url(${rectangle})`,
    backgroundRepeat: 'no-repeat',
    width: '46px',
    height: '46px',
    marginRight: '-23px'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  appBar: {},
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    margin: 'auto'
  },
  menu: {
    top: '50px'
  },
  logo: {
    width: '100%',
    height: '100%'
  }
}));

export default function Header() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const userInfo = useSelector(({ common }) => common.userInfo);

  const navigate = useNavigate();

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async () => {
    setOpen(false);
    await api.logout();
    logout();
    navigate('/login');
  };

  return (
    <div className={classes.grow}>
      <AppBar position='static' className={classes.root} elevation={0}>
        <Toolbar>
          <Box height={40} width={111}>
            <img alt='sixsense' src={logo} className={classes.logo} />
          </Box>
          <div className={classes.title}>
            <Box className={classes.titleBg} />
            <Box>
              <Typography variant='h6' className='ss_futura'>
                Hello {userInfo?.display_name}! Welcome to classifAI
              </Typography>
            </Box>
          </div>
          <div className={classes.sectionDesktop}>
            {/* <IconButton aria-label="show 17 new notifications">
							<NotificationsNoneOutlinedIcon color="primary" />
						</IconButton> */}
            <IconButton
              aria-label='show 17 new notifications'
              href='https://drive.google.com/drive/folders/1ZgzVBh8w5HSGVRwL2dsICsssVA7iOH8h?usp=sharing'
              target='_blank'
              className='mr-2'
            >
              <HelpOutlineOutlinedIcon color='primary' />
            </IconButton>
            <Avatar className={classes.small} />
            <Box
              display='flex'
              alignItems='center'
              ml={1}
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              onClick={handleToggle}
              aria-haspopup='true'
              className='ss_pointer'
              id='header_menu'
            >
              <Typography
                variant='subtitle2'
                color='primary'
                className='ss_futura'
              >
                Hi, {userInfo?.display_name}
              </Typography>
              <ExpandMoreIcon />
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ zIndex: 100 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom'
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id='menu-list-grow'>
                          <MenuItem
                            onClick={handleLogout}
                            id='header_menu_logout'
                          >
                            Logout
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
