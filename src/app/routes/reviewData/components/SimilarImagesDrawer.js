import {
  faCheck,
  faFilter,
  faSignOut,
  faTimes,
  faVectorSquare
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ReviewButton from 'app/components/ReviewButton';
import ReviewTags from 'app/components/ReviewTags';
import ReviewImage from 'assests/images/reviewScreen/reviewImage.png';
import ReviewImage1 from 'assests/images/reviewScreen/reviewImage1.jpg';
import ReviewImage2 from 'assests/images/reviewScreen/reviewImage2.jpg';
import ReviewImage3 from 'assests/images/reviewScreen/reviewImage3.jpg';
import ReviewImage4 from 'assests/images/reviewScreen/reviewImage4.jpg';
import ReviewImage5 from 'assests/images/reviewScreen/reviewImage5.png';
import ReviewImage6 from 'assests/images/reviewScreen/reviewImage6.jpg';
import ReviewImage7 from 'assests/images/reviewScreen/reviewImage7.jpg';
import ReviewImage8 from 'assests/images/reviewScreen/reviewImage8.jpg';
import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import ThumbnailCard from './ThumbnailCard';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[18],
    width: '1300px',
    overflowX: 'hidden',
    flexWrap: 'wrap',
    padding: 0
  },
  imageHeader: {
    fontWeight: 600,
    fontSize: '1rem',
    color: theme.colors.grey[0]
  },
  buttons: {
    marginRight: theme.spacing(1.5)
  },
  masonryImg: {
    marginBottom: theme.spacing(2.5),
    marginRight: theme.spacing(2.875),
    minHeight: '80px',
    maxWidth: '240px',
    '& img': {
      minHeight: '80px',
      maxWidth: '240px'
      // maxHeight: '220px',
    }
  },
  filterBar: {
    backgroundColor: theme.colors.grey[16],
    border: `0.2px solid ${theme.colors.grey[13]}`,
    boxShadow: theme.colors.shadow.sm,
    borderRadius: '4px',
    '& input': {
      color: theme.colors.grey[0]
    }
    // '& div': {
    // 	height: '40px',
    // },
  }
}));

const SimilarImagesDrawer = ({ similarImageDrawer, setSimilarImageDrawer }) => {
  const classes = useStyles();

  const handleDrawerClose = () => {
    setSimilarImageDrawer(false);
  };

  return (
    <Drawer
      classes={{ paper: classes.root }}
      anchor='right'
      open={similarImageDrawer}
    >
      <Box pt={2.75} pb={8} px={2}>
        <Box
          width='100%'
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Box width='50%'>
            <Box>
              <Typography className={classes.imageHeader}>
                Original Image
              </Typography>
            </Box>
            <Box pt={2.25} pb={1} display='flex' alignItems='center'>
              <Box pr={0.75}>
                <ReviewTags label='Defect A' />
              </Box>
              <Box pr={0.75}>
                <ReviewTags label='Defect B' />
              </Box>
            </Box>
            <Box>
              <img src={ReviewImage} alt='reviewImage' />
            </Box>
          </Box>
          <Box width='50%'>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Typography className={classes.imageHeader}>
                Similar Image
              </Typography>
              <ReviewButton
                text='Close'
                onClick={handleDrawerClose}
                icon={<FontAwesomeIcon icon={faTimes} />}
                variant='secondary'
              />
            </Box>
            <Box pt={2.25} pb={1} display='flex' alignItems='center'>
              <Box pr={0.75}>
                <ReviewTags label='Defect A' />
              </Box>
              <Box pr={0.75}>
                <ReviewTags label='Defect B' />
              </Box>
            </Box>
            <Box>
              <img src={ReviewImage} alt='reviewImage' />
            </Box>
          </Box>
        </Box>
        <Box>
          <Box
            pt={5.75}
            pb={3.25}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box>
              <Typography className={classes.imageHeader}>
                Other similar images
              </Typography>
            </Box>
            <Box display='flex' alignItems='center'>
              <ReviewButton
                text='Start Annotating'
                onClick={() => {}}
                icon={<FontAwesomeIcon icon={faVectorSquare} />}
                size='sm'
                variant='secondary'
                wrapperClass={classes.buttons}
              />
              <ReviewButton
                text='Start Review'
                onClick={() => {}}
                icon={<FontAwesomeIcon icon={faCheck} />}
                size='sm'
                variant='secondary'
                wrapperClass={classes.buttons}
              />
              <TextField
                fullWidth
                className={classes.filterBar}
                size='small'
                variant='outlined'
                InputProps={{
                  endAdornment: (
                    <ReviewButton
                      text='Fetch Images'
                      onClick={() => {}}
                      size='sm'
                      icon={<FontAwesomeIcon icon={faSignOut} />}
                    />
                  )
                }}
              />
            </Box>
          </Box>
          <Box>
            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 3, 750: 3, 900: 5 }}
            >
              <Masonry columnsCount={5}>
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage1}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage2}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage3}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage4}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage5}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage6}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage7}
                  wrapperClass={classes.masonryImg}
                />
                <ThumbnailCard
                  onClick={() => {}}
                  img={ReviewImage8}
                  wrapperClass={classes.masonryImg}
                />
              </Masonry>
            </ResponsiveMasonry>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SimilarImagesDrawer;
