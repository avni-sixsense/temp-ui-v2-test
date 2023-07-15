import { faWebcam } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
// import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from 'app/components/ReviewButton';
import { FilterKey, ReviewScreen } from 'app/utils/filterConstants';
import { decodeURL, encodeURL } from 'app/utils/helpers';
import uniq from 'lodash/uniq';
import queryString from 'query-string';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { setUploadSession } from 'store/reviewData/actions';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.grey[1],
    borderRadius: '8px',
    width: 'auto'
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
  const { subscriptionId, packId } = useParams();

  const dispatch = useDispatch();
  // const paramsString = useSelector(({ filters }) => filters.paramsString);

  const handlereviewClick = () => {
    const data = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });

    const contextualFilters = decodeURL(data.contextual_filters);
    const otherFilters = decodeURL(data.other_filters);

    delete contextualFilters.use_case_id__in;
    delete otherFilters.use_case_id__in;

    const suffix = queryString.stringify({
      contextual_filters: encodeURL(
        {
          ...contextualFilters,
          ...otherFilters,
          wafer_id__in: selectedRows.map(item => item.id)
        },
        { arrayFormat: 'comma' }
      )
    });

    dispatch(setUploadSession(suffix));

    navigate(`/${subscriptionId}/${packId}/annotation/review?${suffix}`);
  };

  // const handleStartInferencing = () => {
  // const ids = selectedRows.map((item) => item.file_set)
  // if (showAllTitle) {
  // 	uploadService.current.params = paramsString
  // } else {
  // 	const params = queryString.stringify({ id__in: ids }, { arrayFormat: 'comma' })
  // 	uploadService.current.params = params
  // 	dispatch({
  // 		type: 'SET_ALL_UPLOAD_INFERENCE_SELECTED',
  // 		selected: uniq(ids).map((x) => {
  // 			return { id: x }
  // 		}),
  // 	})
  // }
  // uploadService.current.uploadSession = { id: selectedRows?.[0].sessionId, name: selectedRows?.[0].Folder }
  // dispatch({ type: 'SET_ALL_IMAGES_INFERENCE_SELECTED', status: true })
  // dispatch({ type: 'SET_ALL_UPLOAD_ACTIVE_STEP', step: 2 })
  // dispatch({ type: 'SET_ALL_UPLOAD_DRAWER', status: true })
  // }

  return (
    <Box
      mb={1.5}
      p={1}
      className={classes.container}
      display='inline-flex'
      flexWrap='wrap'
      alignItems='center'
    >
      <Box>
        <Button
          id='data_lib_btn_Review'
          disabled={
            !(
              selectedRows.length > 0 &&
              uniq(selectedRows.map(x => x.use_case)).length === 1
            )
          }
          onClick={handlereviewClick}
          text='Label'
          variant='tertiary'
          icon={<FontAwesomeIcon icon={faWebcam} />}
        />
      </Box>
      {/* <Box mr={1}>
				<Button
					id="data_lib_btn_Start_Inferencing"
					disabled={selectedRows.length === 0}
					onClick={handleStartInferencing}
					text="Start Inferencing"
					variant="tertiary"
					icon={<FontAwesomeIcon icon={faDatabase} />}
				/>
			</Box> */}
      {total &&
      selectedRows.length === Math.min(rowsPerPage, total) &&
      !showAllTitle ? (
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
      ) : (
        ''
      )}
      {showAllTitle ? (
        <Box
          height={34}
          display='flex'
          alignItems='center'
          ml={3}
          style={{ float: 'right', cursor: 'pointer' }}
        >
          <Typography>{`All ${total} images selected`}</Typography>
        </Box>
      ) : (
        ''
      )}
      {/* {loading && <CommonBackdrop open={loading} />} */}
    </Box>
  );
};

export default TableActions;
