import { useEffect, useState } from 'react';
import {
  useNavigate,
  useLocation,
  useSearchParams,
  useParams
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import queryString from 'query-string';

import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import CommonButton from 'app/components/ReviewButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import api from 'app/api';

import { AUDIT, MANUAL_CLASSIFY } from 'store/reviewData/constants';
import { resetReviewData } from 'store/reviewData/actions';
import { convertToArray, decodeURL, encodeURL } from 'app/utils/helpers';

import classes from './ActionModal.module.scss';
import Show from 'app/hoc/Show';
import WaferListItem from './WaferListItem';
import WithCondition from 'app/hoc/WithCondition';
import { CircularProgress } from '@material-ui/core';
import { makeWaferInactive } from 'app/utils/waferbook';
import { goToPreviousRoute } from 'app/utils/navigation';

const ActionModal = ({
  isModalOpen,
  handleToggleModal,
  annotationType,
  subscriptionId
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { packId } = useParams();
  const [, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [waferIds, setWaferIds] = useState([]);

  const { data: waferList = [], isLoading } = useQuery(
    ['waferList', waferIds.join(',')],
    context => api.getWaferListForKlarfUpdate(...context.queryKey),
    { enabled: !!waferIds.length && isModalOpen }
  );

  useEffect(() => {
    if (isModalOpen) queryClient.invalidateQueries('waferList');
  }, [isModalOpen]);

  const [checkedWaferList, setCheckedWaferList] = useState([]);

  const [isNextWaferChecked, setIsNextWaferChecked] = useState(false);

  useEffect(() => {
    const allWafersId = convertToArray(
      decodeURL(queryString.parse(window.location.search).contextual_filters)
        .allWafersId
    ).map(d => parseInt(d, 10));

    setWaferIds(allWafersId);
    setCheckedWaferList(allWafersId);
  }, []);

  const handleWaferCheck = id => {
    if (checkedWaferList.includes(id)) {
      setCheckedWaferList(checkedWaferList.filter(item => item !== id));
    } else {
      setCheckedWaferList([...checkedWaferList, id]);
    }
  };

  const handleCloseReview = async () => {
    try {
      await makeWaferInactive(waferIds);
    } catch ({ response }) {
      toast('Something went wrong.');
      return;
    }

    goToPreviousRoute(navigate, `/${subscriptionId}/${packId}/library/data`);

    dispatch(resetReviewData());
  };

  const handleModalSubmit = () => {
    if (annotationType === MANUAL_CLASSIFY) {
      api.updateKlarfFile(checkedWaferList.join(','));

      if (!isNextWaferChecked) {
        queryClient.invalidateQueries('DrawerWafers');
        handleToggleModal();
        handleCloseReview();
        return;
      }
    }

    const createWaferTag = data => {
      const payload = { name: data, description: '' };

      return new Promise((resolve, reject) =>
        api
          .createNewWaferTag(payload)
          .then(res => {
            resolve(res.data);
          })
          .catch(({ response }) => {
            if (response?.status === 400) {
              toast.error('Tag with the provided name already exists.');
            } else {
              toast.error('Something went wrong, please try again.');
            }

            reject();
          })
      );
    };

    if (annotationType === AUDIT) {
      api
        .getWaferTagsByName('Audited')
        .then(res => {
          const [auditedTag] = res.results;
          const encodedString = btoa(`id__in=${checkedWaferList.join(',')}`);
          if (res.count) {
            api
              .updateTagsOnWafers({ tag_ids: [auditedTag.id] }, encodedString)
              .then(() => {
                if (!isNextWaferChecked) {
                  handleToggleModal();
                  handleCloseReview();
                }
              })
              .catch(() => {
                handleToggleModal();
                toast.error('Something went wrong, please try again.');
              });
          } else {
            createWaferTag('Audited').then(res => {
              api
                .updateTagsOnWafers({ tag_ids: [res.id] }, encodedString)
                .then(() => {
                  if (!isNextWaferChecked) {
                    handleToggleModal();
                    handleCloseReview();
                  }
                })
                .catch(() => {
                  handleToggleModal();
                  toast.error('Something went wrong, please try again.');
                });
            });
          }
        })
        .catch(() => {
          handleToggleModal();
          toast.error('Failed to fetch Audited Tag.');
        });
    }

    if (
      isNextWaferChecked &&
      (annotationType === MANUAL_CLASSIFY || annotationType === AUDIT)
    ) {
      api
        .getNextWafer(
          checkedWaferList.join(','),
          annotationType === MANUAL_CLASSIFY
            ? 'manual_classification_pending'
            : 'auto_classified'
        )
        .then(res => {
          if (res.length) {
            const { id } = res[0];

            const parsedURL = queryString.parse(location.search);

            const { contextual_filters: contextualFilters } = parsedURL;

            const parsedContextual = decodeURL(contextualFilters);

            parsedContextual.wafer_id__in = id;

            const newParams = queryString.stringify({
              contextual_filters: encodeURL(parsedContextual)
            });

            // const newParams = queryString.stringify(parsedParams, { arrayFormat: 'comma' })
            handleToggleModal();
            setSearchParams(newParams);
          } else {
            handleToggleModal();
            handleCloseReview();
          }
        });
    }
  };

  const handleNewWaferCheck = event => {
    setIsNextWaferChecked(event.target.checked);
  };

  return (
    <Modal
      className={classes.modal}
      open={isModalOpen}
      onClose={handleToggleModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isModalOpen}>
        <Paper className={classes.paper}>
          <div className={classes.headerContainer}>
            <Typography className={classes.header}>
              Update Klarf file
            </Typography>

            <IconButton
              className={classes.closeIcon}
              onClick={handleToggleModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>

          <div className={classes.modalBody}>
            <div className={classes.waferListContainer}>
              <WithCondition
                when={isLoading}
                then={<CircularProgress size={30} />}
                or={(waferList?.results || []).map(item => (
                  <WaferListItem
                    checked={checkedWaferList.includes(item.id)}
                    data={item}
                    onChange={() => handleWaferCheck(item.id)}
                  />
                ))}
              />
            </div>

            <Show when={false}>
              <CustomizedCheckbox
                checked={isNextWaferChecked}
                onChange={handleNewWaferCheck}
                label={`Open next wafer for ${
                  annotationType === AUDIT ? 'Audit' : 'Classification'
                }.`}
              />
            </Show>

            <div className={classes.modalActionBtns}>
              <CommonButton
                text='Update'
                onClick={handleModalSubmit}
                shortcutKey='u'
                size='sm'
                disabled={checkedWaferList.length === 0}
              />
            </div>
          </div>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default ActionModal;
