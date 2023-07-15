import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { SaveWaferTableStructure } from 'store/helpers/actions';
import { SaveTableStructure } from 'store/dataLibrary/actions';

import api from 'app/api';

const useMetaFiltersLoad = () => {
  const { subscriptionId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    if (subscriptionId) {
      api
        .getSubscription(subscriptionId)
        .then(res => {
          dispatch(SaveWaferTableStructure(res.wafer_map_meta_info));

          if (res.file_set_meta_info?.length) {
            dispatch(SaveTableStructure(res.file_set_meta_info));
          }
        })
        .catch(() => {
          toast.error(`Failed to load meta filters.`);
        });
    }
  }, [subscriptionId]);

  return null;
};

export default useMetaFiltersLoad;
