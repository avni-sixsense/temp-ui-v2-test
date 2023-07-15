import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
// import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined'
import BookmarkBorderOutlinedIcon from 'assests/images/reviewScreen/bookmark.svg';
// import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkIcon from 'assests/images/reviewScreen/bookmarked.svg';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    padding: props => (props.paddingZero ? 0 : 9),
    marginRight: props => (props.paddingZero ? 8 : 0),
    '&:hover': {
      backgroundColor: 'transparent'
    },
    color: '#02435D'
  },
  icon: {
    backgroundColor: '#fff',
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)'
    }
  },
  checkedIcon: {
    '&:before': {
      display: 'block',
      width: props => (props.size ? 11 : 15),
      height: props => (props.size ? 12 : 15)
    }
  },
  bookmark: {
    width: 15
  }
}));

const CustomizedBookmark = React.forwardRef(
  ({ indeterminate, checked, onChange, ...rest }, ref) => {
    const classes = useStyles(rest);

    return (
      // <StyledCheckbox {...props} />
      <IconButton
        className={clsx(
          classes.root,
          checked ? clsx(classes.icon, classes.checkedIcon) : classes.icon
        )}
        onClick={onChange}
      >
        {checked ? (
          <img className={classes.bookmark} src={BookmarkIcon} alt='bookmark' />
        ) : (
          <img
            className={classes.bookmark}
            src={BookmarkBorderOutlinedIcon}
            alt='bookmark'
          />
        )}
      </IconButton>
    );
  }
);

export default CustomizedBookmark;
