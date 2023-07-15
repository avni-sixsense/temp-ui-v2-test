import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import CommonBackdrop from 'app/components/CommonBackdrop';
import Button from 'app/components/CommonButton';
import CommonDialog from 'app/components/CommonDialog';
import { DATE_RANGE_KEYS } from 'app/constants/filters';
// import DatasetContainer from 'app/components/Dataset'
import UploadService from 'app/services/uploadService';
import { DEFAULT_DATE_FORMAT } from 'app/utils/date';
import {
  encodeURL,
  formatDisplayDate,
  getTimeRangeString,
  NumberFormater
} from 'app/utils/helpers';
import dayjs from 'dayjs';
import uniq from 'lodash/uniq';
import queryString from 'query-string';
import React, { useRef, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setUploadSession } from 'store/reviewData/actions';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(3.75, 0, 0, 3.75)
  }
}));

const TableActions = ({
  total,
  rowsPerPage,
  selectedRows,
  showAllTitle,
  setShowAllTitle
}) => {
  const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { subscriptionId, packId } = useParams();
  const paramsString = useSelector(({ filters }) => filters.paramsString);
  // const { infoMode } = useSelector(({ dataLibrary }) => dataLibrary)
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const uploadService = useRef(new UploadService(dispatch, subscriptionId));

  const queryClient = useQueryClient();

  const handleAssignDefectTags = () => {
    const data = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });

    const { date__gte, date__lte } = data;

    const dateRangeString = getTimeRangeString([
      dayjs.utc(date__gte, 'YYYY-MM-DD-HH-mm-ss').millisecond(0).toDate(),
      dayjs.utc(date__lte, 'YYYY-MM-DD-HH-mm-ss').millisecond(999).toDate()
    ]);
    const contextual_filters = {};
    if (dateRangeString) {
      contextual_filters.date = dateRangeString;
    } else {
      contextual_filters.date = [date__gte, date__lte].join(',');
    }

    if (showAllTitle) {
      contextual_filters.upload_session_id__in = data.upload_session_id__in;
    } else {
      contextual_filters.id__in = selectedRows.map(item => item.fileSetId);
    }

    delete data.date__gte;
    delete data.date__lte;
    delete data.upload_session_id__in;

    const encodedParams = {
      contextual_filters: encodeURL({ ...contextual_filters, ...data })
    };

    // if (Object.keys(data).length) {
    //   encodedParams.other_filters = encodeURL(data);
    // }

    navigate(
      `/${subscriptionId}/${packId}/annotation/review?${queryString.stringify(
        encodedParams
      )}`
    );
  };

  const handleStartInferencing = () => {
    const ids = selectedRows.map(item => item.file_set);
    if (showAllTitle) {
      uploadService.current.params = paramsString;
    } else {
      const params = queryString.stringify(
        { id__in: ids },
        { arrayFormat: 'comma' }
      );
      uploadService.current.params = params;
      dispatch({
        type: 'SET_ALL_UPLOAD_INFERENCE_SELECTED',
        selected: uniq(ids).map(x => {
          return { id: x };
        })
      });
    }
    uploadService.current.uploadSession = {
      id: selectedRows?.[0].sessionId,
      name: selectedRows?.[0].Folder
    };
    dispatch({ type: 'SET_ALL_IMAGES_INFERENCE_SELECTED', status: true });
    dispatch({ type: 'SET_ALL_UPLOAD_ACTIVE_STEP', step: 2 });
    dispatch({ type: 'SET_ALL_UPLOAD_DRAWER', status: true });
  };

  const handleShowDialog = status => {
    setShowDialog(status);
  };

  const handleDelteFileSet = () => {
    setLoading(true);
    api
      .deleteFileSet(selectedRows?.[0]?.file_set)
      .then(() => {
        queryClient.invalidateQueries('fileSets');
        toast.success('File deleted successfully');
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
      .finally(() => {
        setLoading(false);
        setShowDialog(false);
      });
  };

  const dialogActions = [
    {
      text: 'Cancel',
      variant: 'tertiary',
      callback: () => handleShowDialog(false)
    },
    {
      text: 'Continue',
      callback: handleDelteFileSet
    }
  ];

  const handleBulkFeedback = () => {
    const ids = selectedRows.map(item => item.fileSetId);
    if (showAllTitle) {
      localStorage.setItem(
        'params',
        JSON.stringify(
          queryString.parse(paramsString, {
            arrayFormat: 'comma',
            parseNumbers: true
          })
        )
      );
    } else {
      localStorage.setItem('params', JSON.stringify({ id__in: ids }));
    }
    dispatch({ type: 'SET_MODEL_DEFECT_DRAWER', status: true });
  };

  return (
    <Grid
      className={classes.header}
      spacing={2}
      container
      alignItems='center'
      justifyContent='flex-start'
    >
      <Grid item xs={12}>
        <Typography variant='h3'>
          Showing{' '}
          {total < rowsPerPage
            ? NumberFormater(total)
            : NumberFormater(rowsPerPage)}{' '}
          of {NumberFormater(total)} Images
        </Typography>
      </Grid>
      <Grid item>
        <Button
          id='data_lib_btn_Review'
          disabled={
            !(
              selectedRows.length > 0 &&
              uniq(selectedRows.map(x => x.use_case)).length === 1
            )
          }
          wrapperClass='px-3 mr-3'
          onClick={handleAssignDefectTags}
          text='Review'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='data_lib_btn_Start_Inferencing'
          wrapperClass='px-3'
          disabled={selectedRows.length === 0}
          onClick={handleStartInferencing}
          text='Start Inferencing'
          variant='tertiary'
        />
      </Grid>
      <Grid item>
        <Button
          id='data_lib_btn_Open'
          wrapperClass='px-3'
          disabled={selectedRows.length !== 1}
          onClick={() => handleShowDialog(true)}
          text='Delete'
          variant='tertiary'
        />
      </Grid>
      {/* {infoMode !=='floder' && (
			<Grid item>
				<DatasetContainer
					text="Add to Datasets"
					// data={dataSet?.results || []}
					lightTheme
					//  creatableFunc={handleCreateTag}

					// onSubmit={handleAddTags}
					/>
				</Grid>
				)}
				{infoMode!=='floder' && (
			<Grid item>
				<DatasetContainer
					text="Remove from Datasets"
					// data={dataSet?.results || []}
					lightTheme
					removeDialog
					//  creatableFunc={handleCreateTag}

					// onSubmit={handleAddTags}
					/>
				</Grid>
				)} */}
      <Grid item>
        <Button
          id='data_lib_btn_Bulk_Feedback'
          wrapperClass='px-3'
          disabled={selectedRows.length === 0}
          onClick={handleBulkFeedback}
          text='Bulk Feedback'
          variant='tertiary'
        />
      </Grid>
      {total &&
      selectedRows.length === Math.min(rowsPerPage, total) &&
      !showAllTitle ? (
        <Grid item>
          <Box
            height={34}
            display='flex'
            alignItems='center'
            ml={3}
            style={{ float: 'right', cursor: 'pointer' }}
            onClick={() => setShowAllTitle(true)}
          >
            <Typography>{`Select all ${total} images`}</Typography>
          </Box>
        </Grid>
      ) : (
        ''
      )}
      {showAllTitle ? (
        <Grid item>
          <Box
            height={34}
            display='flex'
            alignItems='center'
            ml={3}
            style={{ float: 'right', cursor: 'pointer' }}
          >
            <Typography>{`All ${total} images selected`}</Typography>
          </Box>
        </Grid>
      ) : (
        ''
      )}
      {showDialog && (
        <CommonDialog
          open={showDialog}
          actions={dialogActions}
          message='Are you sure you want to delete the file?'
        />
      )}
      {loading && <CommonBackdrop open={loading} />}
    </Grid>
  );
};

export default TableActions;
