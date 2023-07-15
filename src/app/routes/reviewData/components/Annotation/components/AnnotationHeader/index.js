import { Box } from '@material-ui/core';
import api from 'app/api';
import TagsContainer from 'app/components/Tags';
import {
  encodeURL,
  formatFileSetData,
  getParamsObjFromEncodedString
} from 'app/utils/helpers';
import { keyBy } from 'lodash';
import React, { useCallback } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createStructuredSelector } from 'reselect';
import { setSelectAll, updateFilsetById } from 'store/reviewData/actions';
import {
  selectActiveImg,
  selectReviewData,
  selectSelectAll
} from 'store/reviewData/selector';

import SelecteAllImages from '../../../ReviewDataV2/ReviewSettings/SelectAll';
import Sorting from '../../../ReviewDataV2/ReviewSettings/Sorting';
import SelectedImageCount from '../../../ReviewDataV2/ReviewSettings/SelectedImageCount';

const mapReviewState = createStructuredSelector({
  fileSets: selectReviewData,
  activeImg: selectActiveImg,
  selectAll: selectSelectAll
});

const AnnotationHeader = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const { selectAll, activeImg, fileSets } = useSelector(mapReviewState);

  const { data: filesetTags } = useQuery(['filesetsTags'], context =>
    api.getAllFilesetTags(...context.queryKey)
  );

  const getFileSetIds = isSelectAll => {
    if (!isSelectAll) {
      return activeImg.map(x => fileSets[x].fileSetId).join(',');
    }
    return fileSets.map(item => item.fileSetId).join(',');
  };

  const handleAddTags = useCallback(
    tags => {
      const parsedParams = getParamsObjFromEncodedString(location.search);
      let encodedString = null;

      if (!selectAll) {
        encodedString = btoa(`id__in=${getFileSetIds(selectAll)}`);
      } else {
        encodedString = encodeURL(parsedParams);
      }

      api
        .updateTagsOnFilesets({
          tag_ids: tags.map(x => x.id),
          file_set_filters: encodedString
        })
        .then(() => {
          toast('Tags Added to images successfully');
          if (selectAll && fileSets.length >= 50) {
            window.location.reload();
            return;
          }
          if (activeImg.length < 50) {
            api
              .getFilesetTags(getFileSetIds(selectAll))
              .then(res => {
                const data = formatFileSetData(res?.results || []);
                dispatch(updateFilsetById(keyBy(data, 'id')));
                dispatch(setSelectAll(false));
              })
              .catch(() => {
                toast('Tags are not updated in UI please refresh the page.');
              });
          } else {
            toast('Please refresh to see updated tags.');
          }
        })
        .catch(() => {
          toast('Something went wrong.');
        });
    },
    [location.search, fileSets, activeImg]
  );

  const handleRemoveTags = useCallback(
    (tags, isAllRemove = false) => {
      const parsedParams = getParamsObjFromEncodedString(location.search);
      let encodedString = null;

      if (!selectAll) {
        encodedString = btoa(`id__in=${getFileSetIds(selectAll)}`);
      } else {
        encodedString = encodeURL(parsedParams);
      }

      api
        .removeTagsOnFilesets(
          isAllRemove
            ? { remove_all_tags: true, file_set_filters: encodedString }
            : { tag_ids: tags.map(x => x.id), file_set_filters: encodedString }
        )
        .then(() => {
          toast('Tag removed from images successfully');
          if (selectAll && fileSets.length >= 50) {
            window.location.reload();
            return;
          }
          if (activeImg.length < 50) {
            api
              .getFilesetTags(getFileSetIds(selectAll))
              .then(res => {
                const data = formatFileSetData(res?.results || []);
                dispatch(updateFilsetById(keyBy(data, 'id')));
                dispatch(setSelectAll(false));
              })
              .catch(() => {
                toast('Tags are not updated in UI please refresh the page.');
              });
          } else {
            toast('Please refresh to see updated tags.');
          }
        })
        .catch(() => {
          toast('Something went wrong.');
        });
    },
    [activeImg, fileSets, location.search]
  );

  const handleCreateTag = useCallback(data => {
    const payload = { name: data, description: '' };

    return new Promise((resolve, reject) =>
      api
        .createNewFilesetTag(payload)
        .then(res => {
          queryClient.invalidateQueries('filesetsTags');
          toast('Created new tag successfully');
          resolve(res.data);
        })
        .catch(({ response }) => {
          if (response?.status === 400) {
            toast('Tag with the provided name already exists.');
          } else {
            toast('Something went wrong, please try again.');
          }
          reject();
        })
    );
  }, []);

  return (
    <Box
      display='flex'
      justifyContent='flex-end'
      width='100%'
      alignItems='center'
    >
      <SelectedImageCount />

      <SelecteAllImages />

      <TagsContainer
        text='Add Image Tag'
        data={filesetTags?.results || []}
        creatableFunc={handleCreateTag}
        disabled={activeImg.length === 0}
        onSubmit={handleAddTags}
      />

      <TagsContainer
        text='Remove Image Tag'
        data={filesetTags?.results || []}
        removeDialog
        disabled={activeImg.length === 0}
        onSubmit={handleRemoveTags}
      />

      <Sorting />
    </Box>
  );
};

export default AnnotationHeader;
