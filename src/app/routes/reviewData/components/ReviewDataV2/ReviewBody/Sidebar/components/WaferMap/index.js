import {
  faHandPaper,
  faSearchMinus,
  faSearchPlus
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, Divider, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import api from 'app/api';
import Label from 'app/components/Label';
import OverlayComp from 'app/components/Overlay';
import CommonButton from 'app/components/ReviewButton';
import Annotator from 'app/reactImageAnnotator/Annotator';
import { keyBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectActiveImg,
  selectReviewData,
  selectSelectAll
} from 'store/reviewData/selector';

const useStyles = makeStyles(theme => ({
  aiDefectBox: {
    borderRadius: '4px',
    width: '225px'
  },
  AiBox: {
    backgroundColor: theme.colors.grey[19],
    width: '225px'
  },
  label: {
    fontSize: '0.625',
    fontWeight: 400,
    color: theme.colors.grey[11]
  },
  value: {
    fontSize: '0.6875',
    fontWeight: 600,
    color: theme.colors.grey[0]
  },
  imageNotAvailable: {
    textAlign: 'center'
  },
  annotationTool: {
    margin: 'auto 10px',
    borderWidth: 0,
    backgroundColor: 'transparent'
  },
  divider: {
    backgroundColor: theme.colors.grey[14],
    width: '1px',
    height: '20px'
  }
}));

// const waferDetails = {
// 	Total: 100,
// 	Auto: 50,
// 	Manual: 50,
// 	'Manual Reclass Pending': 10,
// }

// const annotatorInput = [
// 	{
// 		id: 1,
// 		src: WaferImg,
// 		name: 'wafer map',
// 		regions: [
// 			{
// 				type: 'point',
// 				originalX: 0.2061691400304414,
// 				originalY: 0.1299942922374429,
// 				x: 0.3061691400304414,
// 				y: 0.2299942922374429,
// 				id: '552',
// 				color: 'red',
// 				showTags: false,
// 				visible: true,
// 				highlight: true,
// 				locked: true,
// 				is_ai_region: false,
// 				is_user_feedback: true,
// 				is_new: false,
// 				is_updated: false,
// 				r_id: 552,
// 				is_deleted: false,
// 				allowedArea: {
// 					x: 0,
// 					y: 0,
// 					w: 1,
// 					h: 1,
// 				},
// 			},
// 		],
// 	},
// ]

const createRegions = (data, id) => {
  return {
    type: 'point',
    originalX: data?.x,
    originalY: data?.y,
    x: data?.x,
    y: data?.y,
    id: JSON.stringify(id),
    color: 'red',
    showTags: false,
    visible: true,
    highlight: true,
    locked: true,
    is_ai_region: false,
    is_user_feedback: true,
    is_new: false,
    is_updated: false,
    r_id: id,
    is_deleted: false,
    allowedArea: {
      x: 0,
      y: 0,
      w: 1,
      h: 1
    }
  };
};

const mapReviewState = createStructuredSelector({
  activeImg: selectActiveImg,
  selectAll: selectSelectAll,
  fileSets: selectReviewData
});

const WaferMap = () => {
  const classes = useStyles();
  const [selectedTool, setSelectedTool] = useState('pan');
  const [annotatorInput, setAnnotatorInput] = useState([
    { id: '', src: '', name: '', regions: [] }
  ]);
  const [currentMat, setMat] = useState({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  });
  const { activeImg, fileSets, selectAll } = useSelector(mapReviewState);
  const ih = 0;
  const iw = 0;
  const waferIdList = Object.keys(
    keyBy(
      activeImg.map(x => fileSets[x]),
      'wafer'
    )
  ).filter(d => d !== 'undefined' && d !== 'null');

  const [, setScale] = useState(100);
  const [, setCurrentRegions] = useState([]);

  const { data: waferImage, isLoading } = useQuery(
    ['distributionAccuracy', waferIdList?.[0]],
    context => api.getWaferImage(...context.queryKey),
    { enabled: waferIdList.length === 1 && waferIdList?.[0] !== 'undefined' }
  );

  useEffect(() => {
    if (waferImage?.wafer_url) {
      const { id, wafer_url: src, organization_wafer_id: name } = waferImage;
      setAnnotatorInput([
        {
          id,
          src,
          name,
          regions: activeImg
            .map(x => {
              const fileSetObj = fileSets[x];
              if (fileSetObj?.location_on_wafer) {
                return createRegions(
                  fileSetObj?.location_on_wafer?.coordinates,
                  fileSetObj.id
                );
              }
              return null;
            })
            .filter(x => x !== null)
        }
      ]);
    } else {
      setAnnotatorInput([{ id: '', src: '', name: '', regions: [] }]);
    }
  }, [waferImage, fileSets, activeImg]);

  const changeMat = mat => {
    setMat(mat);
    setScale(((1 / mat.a) * 100).toFixed(0));
  };

  const handleScaleChange = value => {
    const newMat = {
      a: 100 / value,
      b: currentMat.b,
      c: currentMat.c,
      d: 100 / value,
      e: currentMat.e,
      f: currentMat.f
    };
    const horizontalMoveLimit = (1 / newMat.a - 1) * (iw / (1 / newMat.a));
    const verticalMoveLimit = (1 / newMat.d - 1) * (ih / (1 / newMat.d));

    if (newMat.e < 0) {
      newMat.e = 0;
    } else if (newMat.e > horizontalMoveLimit) {
      newMat.e = horizontalMoveLimit;
    }

    if (newMat.f < 0) {
      newMat.f = 0;
    } else if (newMat.f > verticalMoveLimit) {
      newMat.f = verticalMoveLimit;
    }
    changeMat(newMat);
  };
  return (
    <Box width='350px' height={waferImage?.wafer_url ? '400px' : 'auto'}>
      {isLoading ? (
        <CircularProgress />
      ) : !!annotatorInput[0]?.src &&
        waferImage?.wafer_url &&
        waferIdList.length === 1 ? (
        <OverlayComp
          title='All images may belong to different wafermap, so can’t plot wafer map on selecting
		all images.'
          open={selectAll}
        >
          <Box height='400px' width='350px'>
            <Box height='350px' width='350px' overflow='hidden'>
              <Annotator
                selectedTool={selectedTool}
                taskDescription='Wafer map'
                images={annotatorInput}
                selectedImage={annotatorInput[0].src}
                currentMat={currentMat}
                changeMat={changeMat}
                handleScaleChange={handleScaleChange}
                setCurrentRegions={setCurrentRegions}
                regionTagList={[]}
              />
            </Box>
            <Box
              pt={1}
              display='flex'
              alignItems='center'
              justifyContent='center'
            >
              <CommonButton
                wrapperClass={classes.annotationTool}
                onClick={() => setSelectedTool('pan')}
                icon={<FontAwesomeIcon icon={faHandPaper} />}
                size='sm'
                variant='secondary'
              />
              <Divider className={classes.divider} />
              <CommonButton
                wrapperClass={classes.annotationTool}
                onClick={() => setSelectedTool('zoom')}
                icon={<FontAwesomeIcon icon={faSearchPlus} />}
                size='sm'
                variant='secondary'
              />
              <CommonButton
                wrapperClass={classes.annotationTool}
                onClick={() => setSelectedTool('zoom-out')}
                icon={<FontAwesomeIcon icon={faSearchMinus} />}
                size='sm'
                variant='secondary'
              />
            </Box>
          </Box>
        </OverlayComp>
      ) : (
        <Label
          label='Wafer map is not available.'
          className={classes.imageNotAvailable}
        />
      )}
    </Box>
  );
};

export default WaferMap;
