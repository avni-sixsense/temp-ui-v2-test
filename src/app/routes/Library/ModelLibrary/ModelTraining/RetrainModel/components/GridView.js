import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import ModeSelector from 'app/components/ModeSelector';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import UnderlineModeSelector from 'app/components/UnderlineModeSelector';
import ThumbnailCard from 'app/routes/reviewData/components/ThumbnailCard';
import ReviewImage from 'assests/images/reviewScreen/reviewImage.png';
import ReviewImage1 from 'assests/images/reviewScreen/reviewImage1.jpg';
import ReviewImage2 from 'assests/images/reviewScreen/reviewImage2.jpg';
import ReviewImage3 from 'assests/images/reviewScreen/reviewImage3.jpg';
import ReviewImage4 from 'assests/images/reviewScreen/reviewImage4.jpg';
import ReviewImage5 from 'assests/images/reviewScreen/reviewImage5.png';
import ReviewImage6 from 'assests/images/reviewScreen/reviewImage6.jpg';
import ReviewImage7 from 'assests/images/reviewScreen/reviewImage7.jpg';
import ReviewImage8 from 'assests/images/reviewScreen/reviewImage8.jpg';
import React, { useCallback, useMemo, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

const useStyles = makeStyles(theme => ({
  diffViewCheckBox: {
    backgroundColor: theme.colors.grey[0],
    border: `0.5px solid ${theme.colors.grey[4]}`,
    borderRadius: '2px'
  },
  masonryImg: {
    marginBottom: theme.spacing(2.5),
    marginRight: theme.spacing(2.875),
    minHeight: '80px',
    maxWidth: '240px',
    '& img': {
      minHeight: '80px',
      maxWidth: '240px',
      maxHeight: '220px'
    }
  }
}));

const GridView = () => {
  const classes = useStyles();
  const [parentMode, setParentMode] = useState('Not Added for Training');
  const [childMode, setChildMode] = useState('All Images');

  const handleParentModeChange = mode => {
    if (mode !== parentMode) {
      setParentMode(mode);
    }
  };

  const handleChildModeChange = useCallback(mode => {
    if (mode !== childMode) {
      setChildMode(mode);
    }
  }, []);

  const parentModeList = [
    {
      label: 'Not Added for Training',
      subLabel: 21
    },
    {
      label: 'Added for Training',
      subLabel: 21341
    }
  ];

  const childModeList = useMemo(
    () => [
      {
        label: 'All Images',
        subLabel: 21
      },
      {
        label: 'New Available',
        subLabel: 21
      },
      {
        label: 'Removed Images',
        subLabel: 21
      }
    ],
    []
  );

  return (
    <Box>
      <Box px={21.25} mb={1.25} display='flex' alignItems='center'>
        <UnderlineModeSelector
          modes={parentModeList}
          onChange={handleParentModeChange}
          active={parentMode}
        />
      </Box>
      <Box
        px={21.25}
        mb={2.125}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <ModeSelector
          modes={childModeList}
          onChange={handleChildModeChange}
          active={childMode}
          blueLightTheme
        />
        <Box className={classes.diffViewCheckBox}>
          <Box>
            <CustomizedCheckbox
              label='Select All'
              lightTheme
              onChange={() => {}}
            />
          </Box>
        </Box>
      </Box>
      <Box px={2.875}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 4, 750: 5, 900: 6 }}>
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
  );
};

export default GridView;
