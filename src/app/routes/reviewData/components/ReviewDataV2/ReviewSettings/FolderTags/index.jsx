import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from 'react-query';
import { createStructuredSelector } from 'reselect';
import { toast } from 'react-toastify';

import TagsContainer from 'app/components/Tags';

import api from 'app/api';
import {
  handleAddFolderTags,
  handleRemoveFolderTags
} from 'app/utils/reviewData';

import { selectActiveImg } from 'store/reviewData/selector';

const mapFolderTagsState = createStructuredSelector({
  activeImg: selectActiveImg
});

const FolderTags = () => {
  const queryClient = useQueryClient();

  const { data: filesetTags } = useQuery(['filesetsTags'], context =>
    api.getAllFilesetTags(...context.queryKey)
  );

  const { activeImg } = useSelector(mapFolderTagsState);

  const handleCreateTag = data => {
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
  };

  return (
    <>
      <TagsContainer
        text='Add Image Tag'
        data={filesetTags?.results || []}
        creatableFunc={handleCreateTag}
        disabled={activeImg.length === 0}
        onSubmit={handleAddFolderTags}
      />

      <TagsContainer
        text='Remove Image Tag'
        data={filesetTags?.results || []}
        removeDialog
        disabled={activeImg.length === 0}
        onSubmit={handleRemoveFolderTags}
      />
    </>
  );
};

export default FolderTags;
