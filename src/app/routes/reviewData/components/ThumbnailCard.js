/* eslint-disable react/no-this-in-sfc */
// import { faTags } from '@fortawesome/pro-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import ReviewTags from 'app/components/ReviewTags';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { changeGridMode, setActiveImg } from 'store/reviewData/actions';
import {
  selectActiveGridMode,
  selectActiveImg,
  selectUseAiAssistance
} from 'store/reviewData/selector';

import CommentPopup from './Comment';

const useStyle = makeStyles(theme => ({
  active: {
    border: `2px solid ${theme.colors.blue[600]}`,
    boxShadow: theme.colors.shadow.sm,
    borderRadius: '4px'
  },
  root: {
    // height: '100%',
    // width: '100%',
    cursor: 'pointer',
    width: '100%',
    maxHeight: 'calc(100% - 35px)'
    // overflow: 'hidden',
  },
  annotatorRoot: {
    // width: '100%',
    cursor: 'pointer',
    width: '100%'
    // height: 'calc(100% - 35px)',
  },
  imageInfo: {
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: theme.colors.grey[13],
    '& p': {
      color: theme.colors.grey[0]
    },
    color: theme.colors.grey[11]
  },
  details: {
    backgroundColor: theme.colors.grey[16]
    // position: 'absolute',
    // bottom: 0,
  },
  activeImageInfo: {
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: theme.colors.grey[0],
    '& p': {
      color: theme.colors.grey[19]
    },
    color: theme.colors.grey[11]
  },
  activeDetails: {
    backgroundColor: theme.colors.blue[600]
    // position: 'absolute',
    // bottom: 0,
  },
  iconText: {
    marginLeft: '5px'
  },
  checkBox: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    '& button': {
      padding: 0
    },
    '& svg': {
      fontSize: '0.625rem'
    }
  },
  annotatorBox: {
    margin: theme.spacing(3.6),
    position: 'relative'
  },
  containerBox: {
    margin: '4px 0',
    position: 'relative'
  },
  circularProgress: {
    '& svg': {
      color: '#FFFFFF'
    }
  },
  cursor: {
    cursor: 'pointer'
  }
}));

const mapReviewState = createStructuredSelector({
  activeGridMode: selectActiveGridMode,
  activeImages: selectActiveImg,
  useAIAssistance: selectUseAiAssistance
});

const ThumbnailCard = ({
  img,
  index,
  onClick,
  active,
  fileName = '',
  groundTruthLabels = [],
  aiLabel = [],
  id,
  // isSearched = false,
  isAnnotatorImage = false,
  wrapperClass = '',
  // lightTheme = false,
  noFileName = false,
  noTags = false,
  // noComments = false,
  isLoading,
  isComponentLoading = false,
  tags = [],
  confidence,
  ...rest
}) => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const { activeImages, activeGridMode, useAIAssistance } =
    useSelector(mapReviewState);
  const [anchorEl, setAnchorEl] = useState(null);
  const [remainingGTLabels, setRemainingGTLabels] = useState([]);
  const [remainingAiLabels, setRemainingAiLabels] = useState([]);

  useEffect(() => {
    if (groundTruthLabels.length > 1) {
      const tempLabels = [];
      groundTruthLabels.forEach((label, index) => {
        if (index > 0) {
          tempLabels.push(label);
        }
      });
      setRemainingGTLabels(tempLabels);
    }
  }, [groundTruthLabels]);

  useEffect(() => {
    if (aiLabel.length > 1) {
      const tempLabels = [];
      aiLabel.forEach((label, index) => {
        if (index > 0) {
          tempLabels.push(label);
        }
      });
      setRemainingAiLabels(tempLabels);
    }
  }, [aiLabel]);

  const ref = useRef(null);

  // const handleCommentClick = (event) => {
  // 	if (!anchorEl) {
  // 		setAnchorEl(event.currentTarget)
  // 	} else {
  // 		setAnchorEl(null)
  // 	}
  // }

  // useEffect(() => {
  // 	if (ref.current && activeImages.length === 1 && !selectAll) {
  // 		const rect = ref.current.getBoundingClientRect()
  // 		const inInViewport =
  // 			rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
  // 		if (active && !inInViewport) {
  // 			ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
  // 		}
  // 	}
  // }, [active, index, activeImages.length])

  const handleCheckBoxClick = () => {
    if (activeImages.includes(index) && activeImages.length > 1) {
      dispatch(setActiveImg(activeImages.filter(x => x !== index)));
    } else if (!activeImages.includes(index)) {
      dispatch(setActiveImg([...activeImages, index]));
    }
  };

  const handleDoubleClick = () => {
    if (activeGridMode === 'Grid View') {
      dispatch(setActiveImg([index]));
      dispatch(changeGridMode('Canvas View'));
    }
  };

  // const handleLoadSuccess = () => {
  // 	const image = document.getElementById(`thumbnail-img-${index}`)
  // 	// image.onload = function () {
  // 	// console.log(`${this.width}x${this.height}`, document.getElementById(`thumbnail-img-${index}`))
  // 	console.log(image, image.width, image.height)
  // 	if (image.width > image.height) {
  // 		document.getElementById(`thumbnail-img-${index}`).style.height = `200px !important`
  // 		document.getElementById(`thumbnail-img-${index}`).style.width = `${
  // 			(image.width / image.height) * 200
  // 		}px !important`
  // 	} else if (image.width < image.height) {
  // 		document.getElementById(`thumbnail-img-${index}`).style.width = `200px !important`
  // 		document.getElementById(`thumbnail-img-${index}`).style.height = `${
  // 			(200 * image.height) / image.width
  // 		}px !important`
  // 	} else {
  // 		document.getElementById(`thumbnail-img-${index}`).style.height = `200px !important`
  // 		document.getElementById(`thumbnail-img-${index}`).style.width = `200px !important`
  // 	}
  // 	// }
  // 	// image.src = img
  // }

  // useEffect(() => {

  // }, [img])

  // console.log(
  // 	document.getElementById(`thumbnail-img-${index}`)?.width,
  // 	document.getElementById(`thumbnail-img-${index}`)?.height
  // )

  return (
    <Box
      {...rest}
      onDoubleClick={handleDoubleClick}
      ref={ref}
      id={`thumbnail-card-${index}`}
      p={1}
      width='100%'
      height='100%'
    >
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        onClick={isComponentLoading ? () => {} : e => onClick(index, e)}
        className={`thumbnail-card ${active ? classes.active : null} ${
          isAnnotatorImage ? classes.annotatorBox : classes.containerBox
        } ${wrapperClass}${!isComponentLoading ? classes.cursor : ''}`}
        width='100%'
        height='100%'
      >
        {isComponentLoading ? (
          <Box
            width='100%'
            height='75%'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <CircularProgress size={30} className={classes.circularProgress} />
          </Box>
        ) : (
          <img
            onClick={e => onClick(index, e)}
            src={img}
            id={`thumbnail-img-${index}`}
            className={isAnnotatorImage ? classes.annotatorRoot : classes.root}
            // onLoad={handleLoadSuccess}
            // style={
            // 	document.getElementById(`thumbnail-img-${index}`)?.width >
            // 	document.getElementById(`thumbnail-img-${index}`)?.height
            // 		? { height: '200px' }
            // 		: { width: '200px' }
            // }
            alt='thumbnail'
          />
        )}

        <Box className={classes.checkBox}>
          <CustomizedCheckbox
            checked={active}
            whiteTheme
            onChange={handleCheckBoxClick}
          />
        </Box>
        {/* {(!noFileName || !noComments || !noTags) && ( */}
        <Box
          width='100%'
          className={active ? classes.activeDetails : classes.details}
          px={0.5}
          py={1}
          display='flex'
          flexWrap='wrap'
          alignItems='center'
        >
          <Box display='flex' alignItems='center'>
            <Box
              px={1}
              mr={0.5}
              className={active ? classes.activeImageInfo : classes.imageInfo}
            >
              <Typography>{index + 1}</Typography>
            </Box>
            {!noFileName && (
              <Box
                px={1}
                className={active ? classes.activeImageInfo : classes.imageInfo}
              >
                <Tooltip title={fileName}>
                  <Typography>{fileName.substr(0, 5)}</Typography>
                </Tooltip>
              </Box>
            )}
          </Box>
          {isLoading && (
            <CircularProgress size={15} className={classes.circularProgress} />
          )}
          {!isLoading && groundTruthLabels.length > 0 && (
            <Box
              display='flex'
              alignItems='center'
              sx={{ gap: '4px' }}
              mr={0.5}
            >
              <ReviewTags
                label={groundTruthLabels[0]}
                variant={false ? 'amber' : active ? 'white' : 'grey'}
                size='small'
                trim
              />
              {remainingGTLabels.length > 1 && (
                <Tooltip title={remainingGTLabels.join(', ')}>
                  <Box mt={1}>
                    <ReviewTags
                      label={`${remainingGTLabels.length} Defects`}
                      variant={false ? 'amber' : active ? 'white' : 'grey'}
                      size='small'
                      trim
                      showTooltip={false}
                    />
                  </Box>
                </Tooltip>
              )}
            </Box>
          )}
          {!isLoading &&
            aiLabel.length > 0 &&
            groundTruthLabels.length === 0 &&
            useAIAssistance && (
              <Box
                display='flex'
                alignItems='center'
                sx={{ gap: '4px' }}
                mr={0.5}
              >
                <ReviewTags
                  label={`AI: ${aiLabel[0]}`}
                  variant='amber'
                  size='small'
                  sublabel={confidence}
                  trim
                />
                {remainingAiLabels.length > 1 && (
                  <Tooltip title={remainingAiLabels.join(', ')}>
                    <Box mt={1}>
                      <ReviewTags
                        label={`AI: ${remainingAiLabels.length} Defects`}
                        variant='amber'
                        size='small'
                        trim
                        showTooltip={false}
                      />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            )}
          {!noTags && tags.length > 0 && (
            <Tooltip title={tags.map(x => x.name).join(',')}>
              <Box>
                <ReviewTags
                  icon={<FontAwesomeIcon icon={faTags} />}
                  variant={active ? 'white' : 'grey'}
                  size='small'
                  trim
                />
              </Box>
            </Tooltip>
          )}
          {/* {!noComments && (
							<Box
								ml={0.5}
								px={1}
								className={active ? classes.activeImageInfo : classes.imageInfo}
								display="flex"
								alignItems="center"
								justifyContent="space-around"
								onClick={handleCommentClick}
							>
								<FontAwesomeIcon icon={faCommentAlt} />
								<Typography className={classes.iconText}>4</Typography>
							</Box>
						)} */}
        </Box>
        {/* )} */}
        <CommentPopup anchorEl={anchorEl} />
      </Box>
    </Box>
  );
};
export default ThumbnailCard;
