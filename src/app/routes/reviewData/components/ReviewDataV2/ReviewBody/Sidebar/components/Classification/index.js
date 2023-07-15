import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import { GLOBAL_CONSTS } from 'app/utils/constants';
import {
  encodeURL,
  getAIDefects,
  getDateFromParams,
  getParamsFromEncodedString
} from 'app/utils/helpers';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import {
  getDefect,
  handleUserClassificationChange,
  reArrangeManualAuditFiles,
  refetchUpdatedFileSetDefects
} from 'store/reviewData/actions';
import { Review } from 'store/reviewData/constants';
import {
  selectActiveImageMode,
  selectActiveImg,
  selectFileSetDefects,
  selectOtherDefects,
  selectReviewData,
  selectCurrentModelId,
  selectSelectAll,
  selectSearchText
} from 'store/reviewData/selector';

import MultiButtonBar from '../MultiButtonBar';

const mapReviewState = createStructuredSelector({
  activeImg: selectActiveImg,
  fileSets: selectReviewData,
  activeImageMode: selectActiveImageMode,
  fileSetDefects: selectFileSetDefects,
  selectAll: selectSelectAll,
  otherDefects: selectOtherDefects,
  currentModelId: selectCurrentModelId,
  searchText: selectSearchText
});

const ClassificationContainer = () => {
  const { annotationType } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const {
    activeImg,
    fileSets,
    activeImageMode,
    fileSetDefects,
    selectAll,
    otherDefects,
    currentModelId,
    searchText
  } = useSelector(mapReviewState);

  const handleBulkClassificationSubmit = data => {
    setIsLoading(true);
    const isAsync = activeImg.length >= GLOBAL_CONSTS.BULK_CREATE_SYNC_LIMIT;

    if (data.type === 'NOSELECT') {
      const payload = {};
      activeImg.forEach(item => {
        const defectIds = Object.values(
          getAIDefects(fileSetDefects[fileSets[item].id]) || {}
        )
          .flat()
          .map(item => item.id);
        if (defectIds.length) {
          payload[fileSets[item].id] = defectIds;
        }
      });
      if (Object.keys(payload).length) {
        api
          .markBulkAiLabels({ file_defects: payload })
          .then(() => {
            if (activeImg.length < 50) {
              dispatch(
                getDefect(
                  activeImg.map(x => fileSets[x].fileSetId),
                  currentModelId
                )
              );
            } else if (annotationType === Review) {
              toast('Please refresh to see updated labels.');
            }

            if (
              annotationType !== Review &&
              (activeImageMode === 'Unclassified' ||
                activeImageMode === 'Unaudited')
            ) {
              setTimeout(() => {
                reArrangeManualAuditFiles(annotationType);
              }, 1000);
            }

            toast('Lables were marked succesfully');
          })
          .catch(() => {
            toast('something went wrong');
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
        toast('Ai does not have defect.');
      }
    } else if (data.type === 'MARK_AS_GT') {
      const tempObj = {};

      if (selectAll) {
        tempObj.file_set_filters = btoa(
          getParamsFromEncodedString(location.search)
        );
      } else {
        tempObj.file_set_filters = encodeURL({
          id__in: activeImg.map(x => fileSets[x].fileSetId)
        });
      }

      api
        .markOperatorBulkGTClassification(tempObj, isAsync)
        .then(() => {
          if (isAsync || (selectAll && fileSets.length >= 50)) {
            setIsLoading(false);
            window.location.reload();
            return;
          }

          refetchUpdatedFileSetDefects();

          setIsLoading(false);
          toast(
            `${
              selectAll ? 'All' : activeImg.length
            } images are updated successfully.`
          );

          setIsLoading(false);

          if (
            annotationType !== Review &&
            (activeImageMode === 'Unclassified' ||
              activeImageMode === 'Unaudited')
          ) {
            setTimeout(() => {
              reArrangeManualAuditFiles(annotationType);
            }, 1000);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }

    if (Object.keys(data).length) {
      if (data.type === 'ADD') {
        handleUserClassificationChange(
          data.value,
          annotationType,
          data.checkboxValue.includes(
            'Overwrite images which have Label already.'
          )
        );
        setIsLoading(false);
      } else if (data.type === 'EDIT') {
        const tempObj = {};

        tempObj.original_defect = data.oldValue[0].id;
        tempObj.new_defect = data.newValue[0].id;

        if (selectAll) {
          tempObj.file_set_filters = btoa(
            getParamsFromEncodedString(location.search)
          );
        } else {
          tempObj.file_set_filters = encodeURL({
            id__in: activeImg.map(x => fileSets[x].fileSetId)
          });
        }

        api
          .replaceBulkClassification(tempObj, isAsync)
          .then(() => {
            if (isAsync || (selectAll && fileSets.length >= 50)) {
              setIsLoading(false);
              window.location.reload();
              return;
            }

            setIsLoading(false);
            toast(`${activeImg.length} images are updated successfully.`);

            refetchUpdatedFileSetDefects();
          })
          .catch(() => {
            setIsLoading(false);
          });
      } else if (data.type === 'DELETE') {
        const tempObj = {};

        if (data.radioValue === 'Remove All') {
          tempObj.remove_all = true;
          tempObj.defects = [];
        } else {
          tempObj.remove_all = false;
          tempObj.defects = data.value.map(x => x.id);
        }

        if (selectAll) {
          const params = getDateFromParams(
            window.location.search,
            undefined,
            true
          );

          if (searchText) {
            params['files__name__icontains'] = searchText;
          }

          tempObj.file_set_filters = encodeURL(params);
        } else {
          tempObj.file_set_filters = encodeURL({
            id__in: activeImg.map(x => fileSets[x].fileSetId)
          });
        }

        api
          .deleteBulkClassification(tempObj, isAsync)
          .then(() => {
            if (isAsync || (selectAll && fileSets.length >= 50)) {
              setIsLoading(false);
              window.location.reload();
              return;
            }

            setIsLoading(false);
            toast(`${activeImg.length} images are updated successfully.`);

            if (
              annotationType !== Review &&
              activeImageMode === 'Audited' &&
              tempObj?.remove_all
            ) {
              setTimeout(() => {
                reArrangeManualAuditFiles(annotationType);
              }, 1000);
            } else {
              refetchUpdatedFileSetDefects();
            }
          })
          .catch(() => {
            setIsLoading(false);
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
        variant='classificationAction'
        onSubmit={handleBulkClassificationSubmit}
      />
      {/* <SearchComp
							placeholder="Search Classifications"
							data={TempClassificationSearchData}
							onVisibilityChange={handleTempSearch}
						/> */}
      <CommonBackdrop open={isLoading} />
    </>
  );
};

export default ClassificationContainer;
