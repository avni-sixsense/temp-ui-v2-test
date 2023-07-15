import api from 'app/api';
import { getCurrentModelFromState } from 'app/utils/reviewData';
import React from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getDefect } from 'store/reviewData/actions';

import MultiButtonBar from '../MultiButtonBar';

const DetectionContainer = () => {
  const {
    activeImg,
    data: fileSets,
    otherDefects
  } = useSelector(({ review }) => review);
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const handleBulkDetectionSubmit = data => {
    if (Object.keys(data).length) {
      if (data.type === 'EDIT') {
        const tempObj = {};
        tempObj.original_defect = data.oldValue[0].id;
        tempObj.new_defect = data.newValue[0].id;
        tempObj.file_ids = activeImg.map(x => fileSets[x].id);
        api.replaceBulkDetection(tempObj).then(() => {
          dispatch(
            getDefect(
              [activeImg.map(x => fileSets[x].fileSetId)],
              getCurrentModelFromState()
            )
          );
        });
      } else if (data.type === 'DELETE') {
        const tempObj = {};
        if (data.radioValue === 'All Boxes') {
          tempObj.remove_all = true;
          tempObj.defects = [];
        } else {
          tempObj.remove_all = false;
          tempObj.defects = data.value.map(x => x.id);
        }

        tempObj.file_ids = activeImg.map(x => fileSets[x].id);
        api.deleteBulkDetection(tempObj).then(() => {
          queryClient.invalidateQueries('userDetection');
          dispatch(
            getDefect(
              [activeImg.map(x => fileSets[x].fileSetId)],
              getCurrentModelFromState()
            )
          );
        });
      }
    }
  };

  return (
    <>
      <MultiButtonBar
        addOptionData={otherDefects}
        replaceOptionDate={otherDefects}
        deleteOptionData={otherDefects}
        variant='detectionAction'
        onSubmit={handleBulkDetectionSubmit}
      />
      {/* <SearchComp
							placeholder="Search Defects"
							data={TempDetectionSearchData}
							onVisibilityChange={handleTempSearch}
						/> */}
    </>
  );
};

export default DetectionContainer;
