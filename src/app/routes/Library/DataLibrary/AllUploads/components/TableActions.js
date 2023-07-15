import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import CommonDialog from 'app/components/CommonDialog';
// import DatasetContainer from 'app/components/Dataset';
import Button from 'app/components/ReviewButton';
import TagsContainer from 'app/components/Tags';
import { FilterKey, ReviewScreen } from 'app/utils/filterConstants';
import {
  convertToUtc,
  decodeURL,
  encodeURL,
  getDatesFromTimeRange,
  getTimeFormat,
  NumberFormater
} from 'app/utils/helpers';
import { keyBy } from 'lodash';
import uniq from 'lodash/uniq';
import queryString from 'query-string';
import React, { useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import { toast } from 'react-toastify';
import BACKEND_URL from 'store/constants/urls';
import {
  // setIsDownloadAiDrawer,
  setSelectedInferenceSession,
  toggleInferenceModal
} from 'store/inferenceDrawer/actions';
import { setParams } from 'store/reviewData/actions';
import { ScratchAIAnnotation } from 'store/reviewData/constants';
import {
  setSelectedSession,
  toggleUploadDataModal
} from 'store/uploadData/actions';
// import { selectFoldersUploadCount } from 'store/uploadData/selector';

import UserDrawer from '../UserDrawer';
import BulkLabelContainer from './BulkLabel';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(3.75, 0, 1, 0)
  }
}));

const TableActions = ({ selected, data, total }) => {
  const state = useSelector(({ allUploads }) => allUploads);
  const { rowsPerPage } = state;
  const classes = useStyles();
  const dispatch = useDispatch();

  const { subscriptionId, packId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [, setSearchParams] = useSearchParams();

  const [showDialog, setShowDialog] = useState(false);
  const [showStitchDialog, setShowStitchDialog] = useState(false);
  const [isGF7] = useState(BACKEND_URL.includes('gf7'));
  const [loading, setLoading] = useState(false);
  const [drawer, setDrawer] = useState(false);
  // const uploadService = useRef(new UploadService(dispatch, subscriptionId))

  const queryClient = useQueryClient();

  const { data: uploadSessionTags } = useQuery(['uploadSessionTags'], context =>
    api.getAllUploadSessionsTags(...context.queryKey)
  );

  // const { data: dataSet } = useQuery(['dataSetList'], context =>
  //   api.getDataset(...context.queryKey)
  // );

  // const handleCreateDataset = data => {
  //   const payload = {
  //     name: data,
  //     is_locked: 'false',
  //     description: ''
  //   };
  //   return new Promise((resolve, reject) =>
  //     api
  //       .createDataset(payload)
  //       .then(res => {
  //         queryClient.invalidateQueries('dataSetList');
  //         toast('Created new Dataset successfully');
  //         resolve(res.data);
  //       })
  //       .catch(({ response }) => {
  //         if (response?.status === 400) {
  //           toast('Dataset with the provided name already exists.');
  //         } else {
  //           toast('Something went wrong, please try again.');
  //         }
  //         reject();
  //       })
  //   );
  // };

  // const handleAddDataset = data => {
  //   const encodedString = btoa(
  //     `upload_session_id__in=${selected.map(x => x.id).join(',')}`
  //   );
  //   const payload = {
  //     file_set_filters: encodedString
  //   };
  //   api
  //     .addFilesetsToDataset(data.map(x => x.id).join(','), payload)
  //     .then(() => {
  //       queryClient.invalidateQueries('dataSetLib');
  //       toast('Folders Added to Dataset successfully');
  //     })
  //     .catch(() => {
  //       toast('Something went wrong.');
  //     });
  // };

  const handleCreateTag = data => {
    const payload = {
      name: data,
      description: ''
    };
    return new Promise((resolve, reject) =>
      api
        .createuploadsessionTag(payload)
        .then(res => {
          queryClient.invalidateQueries('uploadSessionTags');
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
  const handleAddTags = tags => {
    const encodedString = btoa(`id__in=${selected.map(x => x.id).join(',')}`);
    api
      .updateTagsonUploadsession(
        { tag_ids: tags.map(x => x.id) },
        encodedString
      )
      .then(() => {
        toast('Tag Added to folders successfully');
        api
          .getUploadSessionsTags(selected.map(x => x.id).join(','))
          .then(res => {
            dispatch({
              type: 'UPDATE_UPLOADSESSION_BY_ID',
              payload: keyBy(res?.results, 'id')
            });
          })
          .catch(() => {
            toast('Tags are not updated in UI please refresh the page.');
          });
      })
      .catch(() => {
        toast('Something went wrong.');
      });
  };

  const handleRemoveTags = (tags, isAllRemove = false) => {
    const encodedString = btoa(`id__in=${selected.map(x => x.id).join(',')}`);
    api
      .removeTagsOnUploadsession(
        isAllRemove
          ? { remove_all_tags: true }
          : { tag_ids: tags.map(x => x.id) },
        encodedString
      )
      .then(() => {
        toast('Tag removed from folders successfully');
        api
          .getUploadSessionsTags(selected.map(x => x.id).join(','))
          .then(res => {
            dispatch({
              type: 'UPDATE_UPLOADSESSION_BY_ID',
              payload: keyBy(res?.results, 'id')
            });
          })
          .catch(() => {
            toast('Tags are not updated in UI please refresh the page.');
          });
      })
      .catch(() => {
        toast('Something went wrong.');
      });
  };

  const handleReviewClick = () => {
    const parsedParams = queryString.parse(location.search);

    let contextualFilters = decodeURL(parsedParams.contextual_filters);

    contextualFilters = {
      upload_session_id__in: selected.map(row => row.id),
      date: 'ALL_DATE_RANGE'
    };

    const params = queryString.stringify({
      contextual_filters: encodeURL(contextualFilters)
    });
    // const params = queryString.stringify(
    // 	{
    // 		...parsedParams,
    // 		upload_session_id__in: selected.map((row) => row.id),
    // 		packId,
    // 	},
    // 	{
    // 		arrayFormat: 'comma',
    // 	}
    // )
    // dispatch(setUploadSession(params))

    navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`, {
      state: {
        path: location.pathname,
        params: location.search
      }
    });
  };

  const handleStartInferencing = () => {
    dispatch(setSelectedInferenceSession(selected));
    dispatch(toggleInferenceModal());
  };

  // const handleDownload = () => {
  //   dispatch(setSelectedInferenceSession(selected));
  //   dispatch(toggleInferenceModal());
  //   dispatch(setIsDownloadAiDrawer(true));
  // };

  const handleDelete = () => {
    const session = selected?.[0];
    if (session) {
      setShowDialog(false);
      setLoading(true);
      api
        .deleteUploadSession(session.id)
        .then(_ => {
          if (_.status === 204) {
            const temp = data.filter(item => item.id !== session.id);
            dispatch({ type: 'SET_ALL_UPLOAD_DATA', payload: temp });
            dispatch({ type: 'SET_ALL_UPLOAD_TOTAL', payload: total - 1 });
            dispatch({ type: 'SET_ALL_UPLOAD_SELECTED', selected: [] });
            queryClient.invalidateQueries('uploadSessions');
            queryClient.invalidateQueries('subscription');
            const params = queryString.parse(location.search, {
              arrayFormat: 'comma',
              parseNumbers: true
            });
            if (
              params.upload_session_id__in &&
              Array.isArray(params.upload_session_id__in) &&
              params.upload_session_id__in.includes(session.id)
            ) {
              params.upload_session_id__in =
                params.upload_session_id__in.filter(x => x !== session.id);
            } else if (params.upload_session_id__in) {
              delete params.upload_session_id__in;
            }
            setSearchParams(
              queryString.stringify(params, { arrayFormat: 'comma' })
            );
            dispatch({
              type: 'REMOVE_FILTER',
              field: 'folder',
              param: 'upload_session_id__in',
              item: session.id
            });
            toast.success('Session deleted successfully');
          }
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 400 || err.response.status === 500) {
              toast.error(
                'The session cannot be deleted because some or all files in the folder are used for training'
              );
            }
          }
        })
        .finally(() => setLoading(false));
    }
  };

  // const handleUploadDataClick = (newSession = true) => {
  // 	if (newSession) {
  // 		uploadService.current.uploadSession = null
  // 	}
  // 	dispatch({ type: 'SET_ALL_UPLOAD_DOWNLOAD_BTN', status: false })
  // 	dispatch({ type: 'SET_ALL_UPLOAD_ACTIVE_STEP', step: 0 })
  // 	dispatch({ type: 'SET_ALL_UPLOAD_DRAWER', status: true })
  // }

  const handleUploadMore = () => {
    dispatch(setSelectedSession(selected?.[0]));
    dispatch(toggleUploadDataModal());
  };

  // const handleBulkFeedback = () => {
  // 	localStorage.setItem('params', JSON.stringify({ upload_session_id: selected?.[0]?.id }))
  // 	dispatch({ type: 'SET_MODEL_DEFECT_DRAWER', status: true })
  // }

  const handleClick = () => {
    const data = getDatesFromTimeRange('ALL_DATE_RANGE');

    const [formatDateStart, formatDateEnd] = [...data];

    dispatch({ type: 'RESET_APPLIED' });
    const params = queryString.stringify(
      {
        upload_session_id__in: selected.map(row => row.id),
        date__gte: convertToUtc(formatDateStart),
        date__lte: convertToUtc(formatDateEnd)
      },
      { arrayFormat: 'comma' }
    );
    const s = queryString.stringify(
      {
        upload_session_id__in: selected.map(row => row.id),
        date__gte: convertToUtc(formatDateStart),
        date__lte: convertToUtc(formatDateEnd)
      },
      { arrayFormat: 'comma' }
    );
    dispatch({
      type: 'SET_DATE_FILTER',
      date: {
        start: formatDateStart,
        end: formatDateEnd,
        timeFormat: params?.time_format
          ? params.time_format
          : getTimeFormat(
              convertToUtc(formatDateStart),
              convertToUtc(formatDateEnd)
            )
      }
    });
    dispatch(setParams(s));
    dispatch({ type: 'SET_FOLDER_ITEMS', state: selected });
    navigate(`${location.pathname}/results?${params}`);
  };

  // const handleWaferClick = () => {
  // 	const filterSession = JSON.parse(sessionStorage.getItem(FilterKey) || {})
  // 	const parsedParams = queryString.parse(location.search, {
  // 		arrayFormat: 'comma',
  // 		parseNumbers: true,
  // 	})
  // 	let contextualFilters = decodeURL(parsedParams.contextual_filters)
  // 	contextualFilters = {
  // 		upload_session_id__in: selected.map((row) => row.id),
  // 		packId,
  // 		time__range: 'LAST_30_DAYS',
  // 		time_format: 'weekly',
  // 	}
  // 	sessionStorage.setItem(
  // 		FilterKey,
  // 		JSON.stringify({
  // 			...filterSession,
  // 			[WaferLibrary]: { contextual_filters: contextualFilters, other_filters: {}, key: WaferLibrary },
  // 		})
  // 	)
  // 	const params = queryString.stringify({
  // 		contextual_filters: encodeURL(contextualFilters),
  // 		other_filters: encodeURL({}),
  // 		screen_key: WaferLibrary,
  // 	})
  // 	// const s = queryString.stringify(
  // 	// 	{
  // 	// 		upload_session_id__in: selected.map((row) => row.id),
  // 	// 	},
  // 	// 	{ arrayFormat: 'comma' }
  // 	// )
  // 	// dispatch(setParams(s))
  // 	// dispatch({ type: 'SET_FOLDER_ITEMS', state: selected })
  // 	navigate({
  // 		pathname: `${location.pathname}/wafers`,
  // 		search: params,
  // 	})
  // }

  const handleStitchImages = () => {
    const session = selected?.[0];
    if (session) {
      setShowStitchDialog(true);
      setLoading(true);
      api
        .stitchImages(session.id)
        .then(() => {
          queryClient.invalidateQueries('uploadSessions');
          toast.success(
            'A new folder with the grouped images will be created soon.'
          );
        })
        .catch(() => {
          toast.error('Something went wrong');
        })
        .finally(() => {
          setShowStitchDialog(false);
          setLoading(false);
        });
    }
  };

  const handleStitchDialog = status => {
    setShowStitchDialog(status);
  };

  const handleDialog = status => {
    setShowDialog(status);
  };
  const handleShowDrawer = () => {
    setDrawer(true);
  };
  const handleClose = () => {
    setDrawer(false);
  };
  const dialogActions = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleDialog(false)
    },
    {
      text: 'Continue',
      callback: handleDelete
    }
  ];

  const stitchDialogActions = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleStitchDialog(false)
    },
    {
      text: 'Continue',
      callback: handleStitchImages
    }
  ];

  return (
    <Grid spacing={2} container direction='column' className={classes.header}>
      <Grid item xs={12}>
        <Typography id='lib_table_header_count' variant='h3'>
          Showing{' '}
          {total < rowsPerPage
            ? NumberFormater(total)
            : NumberFormater(rowsPerPage)}{' '}
          of {NumberFormater(total)} Folders
        </Typography>
      </Grid>
      <Grid item>
        <Grid container alignItems='flex-start' justifyContent='space-between'>
          <Grid item>
            <Grid
              spacing={1}
              container
              alignItems='center'
              justifyContent='flex-start'
            >
              <Grid item>
                <Button
                  id='data_lib_btn_Upload_More'
                  wrapperClass='px-3'
                  disabled={selected.length !== 1}
                  onClick={handleUploadMore}
                  text='Upload More'
                  variant='tertiary'
                />
              </Grid>
              <Grid item>
                <Button
                  disabled={
                    !(
                      selected.length > 0 &&
                      uniq(selected.map(x => x.use_case)).length === 1
                    )
                  }
                  onClick={() => handleReviewClick(ScratchAIAnnotation)}
                  variant='tertiary'
                  text='View'
                />
              </Grid>
              <Grid item>
                <Button
                  id='data_lib_btn_Delete'
                  wrapperClass='px-3'
                  disabled={selected.length !== 1}
                  onClick={() => handleDialog(true)}
                  text='Delete'
                  variant='tertiary'
                />
              </Grid>
              <Grid item>
                <BulkLabelContainer selected={selected} lightTheme />
              </Grid>
              <Grid item>
                <Button
                  id='data_lib_btn_Start_Inferencing'
                  wrapperClass='px-3'
                  disabled={
                    selected.length === 0 ||
                    [...new Set(selected.map(item => item.use_case))].length > 1
                  }
                  onClick={handleStartInferencing}
                  text='Inference'
                  variant='tertiary'
                />
              </Grid>
              <Grid item>
                <TagsContainer
                  text='Add Folder Tag'
                  data={uploadSessionTags?.results || []}
                  lightTheme
                  creatableFunc={handleCreateTag}
                  disabled={selected.length === 0}
                  onSubmit={handleAddTags}
                />
              </Grid>
              <Grid item>
                <TagsContainer
                  text='Remove Folder Tag'
                  data={uploadSessionTags?.results || []}
                  lightTheme
                  removeDialog
                  disabled={selected.length === 0}
                  onSubmit={handleRemoveTags}
                />
              </Grid>
              {/* <Grid item>
                <DatasetContainer
                  text='Add to Datasets'
                  data={dataSet?.results || []}
                  lightTheme
                  creatableFunc={handleCreateDataset}
                  disabled={
                    !(
                      selected.length > 0 &&
                      uniq(selected.map(x => x.use_case)).length === 1
                    )
                  }
                  onSubmit={handleAddDataset}
                />
              </Grid> */}
              <Grid item>
                <Button
                  id='data_lib_btn_User'
                  wrapperClass='px-3'
                  disabled={selected.length === 0}
                  onClick={handleShowDrawer}
                  text='Assign Task'
                  variant='tertiary'
                />
              </Grid>
              {/* <Grid item>
								<Button
									id="data_lib_btn_Open_Wafers"
									disabled={
										!(selected.length > 0 && uniq(selected.map((x) => x.use_case)).length === 1)
									}
									onClick={handleWaferClick}
									variant="tertiary"
									text="Open Wafer"
								/>
							</Grid> */}

              {/* <Grid item>
                <Button
                  id='data_lib_btn_Download_AI_Output'
                  disabled={!(selected.length > 0)}
                  onClick={() => handleDownload(selected)}
                  variant='tertiary'
                  text='Download AI Output'
                />
              </Grid> */}

              {/* <Grid item>
								<Button
									id="data_lib_btn_Bulk_Feedback"
									wrapperClass="px-3"
									disabled={selected.length !== 1}
									onClick={handleBulkFeedback}
									text="Bulk Feedback"
									variant="tertiary"
								/>
							</Grid> */}
              <Grid item>
                <Button
                  id='data_lib_btn_Open_Images'
                  disabled={
                    !(
                      selected.length > 0 &&
                      uniq(selected.map(x => x.use_case)).length === 1
                    )
                  }
                  onClick={handleClick}
                  variant='tertiary'
                  text='Open Images'
                />
              </Grid>
              {isGF7 && (
                <Grid item>
                  <Button
                    id='data_lib_btn_Group_Images'
                    wrapperClass='px-3'
                    disabled={selected.length !== 1}
                    onClick={() => handleStitchDialog(true)}
                    text='Group Images'
                    variant='tertiary'
                  />
                </Grid>
              )}

              {showDialog && (
                <CommonDialog
                  open={showDialog}
                  message='Are you sure you want to delete the folder?'
                  subMessage={`You're deleting folder ${selected?.[0]?.name} with ${selected?.[0]?.file_sets} images. This action is irreversible and will delete all images, feedback and AI output on the images`}
                  actions={dialogActions}
                />
              )}
              {showStitchDialog && (
                <>
                  <CommonDialog
                    open={showStitchDialog}
                    message={`You are about to request group images for folder  ${selected?.[0]?.name}`}
                    actions={stitchDialogActions}
                  />
                  <CommonBackdrop open={loading} />
                </>
              )}
              {drawer && (
                <UserDrawer
                  drawerOpen={drawer}
                  onClose={handleClose}
                  lightTheme
                  selected={selected}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TableActions;
