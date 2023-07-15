import { Box, makeStyles } from '@material-ui/core';
import Show from 'app/hoc/Show';
import { getAIDefectsLabels, getGTDefectsLabels } from 'app/utils/helpers';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { AUDIT } from 'store/reviewData/constants';
import {
  selectActiveImg,
  selectFileSetDefects,
  selectReviewData,
  selectSelectAll
} from 'store/reviewData/selector';

import ThumbnailCard from '../ThumbnailCard';
import AnnotatorArea from './components/AnnotationArea';
import AnnotationHeader from './components/AnnotationHeader';

const useStyles = makeStyles(theme => ({
  multiSelectBox: {
    height: '82vh',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-track': {
      // boxShadow: 'inset 0 0 5px grey',
      borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.colors.grey[18],
      borderRadius: '10px'
    }
  }
}));

const mapReviewState = createStructuredSelector({
  fileSets: selectReviewData,
  activeImg: selectActiveImg,
  fileSetDefects: selectFileSetDefects,
  selectAll: selectSelectAll
});

const AnnotationContainer = props => {
  const classes = useStyles();

  const { annotationType } = useParams();

  const { fileSets, activeImg, fileSetDefects, selectAll } =
    useSelector(mapReviewState);

  const getSelectedFiles = () => {
    if (selectAll) {
      return fileSets.map((item, index) => {
        return { ...item, originalIndex: index };
      });
    }

    return activeImg.map(x => {
      return { ...fileSets[x], originalIndex: x };
    });
  };

  if (activeImg.length === 1 && !selectAll) {
    return (
      <>
        <AnnotationHeader />
        <AnnotatorArea {...props} />
      </>
    );
  }

  return (
    <>
      <AnnotationHeader />
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexWrap='wrap'
        className={classes.multiSelectBox}
      >
        <Show when={(fileSets || []).length > 0}>
          {getSelectedFiles().map(data => (
            <Box width='200px' height='200px'>
              <ThumbnailCard
                active
                onClick={() => {}}
                key={data.originalIndex}
                groundTruthLabels={getGTDefectsLabels(fileSetDefects[data.id])}
                aiLabel={getAIDefectsLabels(fileSetDefects[data.id])}
                index={data.originalIndex}
                img={data.src}
                fileName={data.name}
                id={data.fileSetId}
                isAnnotatorImage
                noFileName
                noComments={annotationType === AUDIT}
                // noTags={annotationType === Audit}
                tags={data?.tags}
              />
            </Box>
          ))}
        </Show>
      </Box>
    </>
  );
};

export default AnnotationContainer;
