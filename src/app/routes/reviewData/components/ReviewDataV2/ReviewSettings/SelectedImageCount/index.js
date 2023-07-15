import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CommonButton from 'app/components/ReviewButton';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveImg } from 'store/reviewData/actions';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  selectedImageCountContainer: {
    backgroundColor: theme.colors.grey[12],
    borderRadius: '3px',
    '& p': {
      fontSize: '0.625rem',
      fontWeight: 500,
      color: theme.colors.grey[2]
    }
  },
  selectedImageText: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: theme.colors.grey[10]
  },
  clearBtn: {
    marginLeft: theme.spacing(1)
  }
}));

const SelectedImageCount = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const activeImg = useSelector(({ review }) => review.activeImg);
  const data = useSelector(({ review }) => review.data);
  const fileSetCount = useSelector(({ review }) => review.fileSetCount);
  const selectAll = useSelector(({ review }) => review.selectAll);
  const activeImageMode = useSelector(({ review }) => review.activeImageMode);
  const imageModes = useSelector(({ review }) => review.imageModes);

  const handleClearSelection = () => {
    dispatch(setActiveImg([activeImg[0]]));
  };

  if ((data.length === 0 || activeImg.length < 2) && !selectAll) {
    return null;
  }

  const selectedCount = selectAll
    ? !!activeImageMode
      ? imageModes.find(d => d.label === activeImageMode).subLabel
      : fileSetCount
    : activeImg.length;

  return (
    <Box display='flex' alignItems='center' className={classes.container}>
      <Box
        px={0.375}
        py={0.125}
        mr={0.5}
        className={classes.selectedImageCountContainer}
      >
        <Typography>{selectedCount}</Typography>
      </Box>

      <Typography className={classes.selectedImageText}>
        Images Selected
      </Typography>

      {!selectAll && (
        <CommonButton
          text='Clear'
          icon={<FontAwesomeIcon icon={faTimesCircle} />}
          size='xs'
          wrapperClass={clsx('ml-1', classes.clearBtn)}
          variant='secondary'
          onClick={handleClearSelection}
        />
      )}
    </Box>
  );
};

export default SelectedImageCount;
