import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from 'app/components/ReviewButton';
import { FilterKey, ReviewScreen } from 'app/utils/filterConstants';
import {
  convertToUtc,
  decodeURL,
  encodeURL,
  getDatesFromTimeRange,
  getTimeFormat,
  NumberFormater
} from 'app/utils/helpers';
// import SanityReport from 'assests/images/sanity_report.png'
import uniq from 'lodash/uniq';
import queryString from 'query-string';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  header: {
    padding: theme.spacing(3.75, 0, 1, 0)
  },
  sanityContainer: {
    padding: theme.spacing(0.5),
    backgroundColor: '#fff',
    width: '75%',
    maxHeight: '60%',
    overflowY: 'scroll',
    '&::-webkit-scrollbar ': {
      width: 3
    },

    /* Track */
    '&::-webkit-scrollbar-track': {
      borderRadius: 10
    },

    /* Handle */
    '&::-webkit-scrollbar-thumb': {
      background: '#31456A',
      borderRadius: 10
    },

    /* Handle on hover */
    '&::-webkit-scrollbar-thumb:hover': {
      background: theme.colors.grey[4]
    },
    '& img': {
      width: '100%'
    }
  },
  modalContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const TableActions = ({ selected, total }) => {
  // const [openSanityModal, setOpenSanityModal] = useState(false)
  const state = useSelector(({ allUploads }) => allUploads);
  const dispatch = useDispatch();
  const { rowsPerPage } = state;

  const classes = useStyles();

  const { subscriptionId, packId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleReviewClick = () => {
    const parsedParams = queryString.parse(location.search);
    let contextualFilters = decodeURL(parsedParams.contextual_filters);
    // const otherFilters = decodeURL(parsedParams.other_filters)
    contextualFilters = {
      data_sets__in: selected.map(row => row.id),
      date: 'ALL_DATE_RANGE'
    };

    const params = queryString.stringify({
      contextual_filters: encodeURL(contextualFilters)
    });
    // const params = queryString.stringify(
    // 	{
    // 		...parsedParams,
    // 		upload_session_id__in: selected.map((row) => row.id),
    // 		packId,œ
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

  const handleImageViewClick = () => {
    const data = getDatesFromTimeRange('ALL_DATE_RANGE');

    const [formatDateStart, formatDateEnd] = [...data];

    dispatch({ type: 'RESET_APPLIED' });
    const params = queryString.stringify(
      {
        data_sets__in: selected.map(row => row.id),
        packId,
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
    navigate(`${location.pathname}/results?${params}`);
  };

  // const handleSanityReportClick = () => {
  // 	setOpenSanityModal(true)
  // }

  // const handleSanityModalClose = () => {
  // 	setOpenSanityModal(false)
  // }

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
                  id='data_lib_btn_Open_Images'
                  disabled={
                    !(
                      selected.length > 0 &&
                      uniq(selected.map(x => x.use_case)).length === 1
                    )
                  }
                  onClick={handleImageViewClick}
                  variant='tertiary'
                  text='Open Images'
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
                  onClick={handleReviewClick}
                  variant='tertiary'
                  text='View'
                />
              </Grid>
              {/* <Grid item>
								<Button
									disabled={selected.length !== 1}
									onClick={handleSanityReportClick}
									variant="tertiary"
									text="View Sanity Report"
								/>
							</Grid> */}
              {/* <Grid item>
								<Button
									id="data_lib_btn_Edit"
									wrapperClass="px-3"
									disabled={selected.length !== 1}
									// onClick={() => handleDialog(true)}
									text="Edit"
									variant="tertiary"
								/>
							</Grid> */}
              {/* <Grid item>
								<Button
									id="data_lib_btn_Delete"
									wrapperClass="px-3"
									disabled={selected.length !== 1}
									// onClick={() => handleDialog(true)}
									text="Delete"
									variant="tertiary"
								/>
							</Grid>
							<Grid item>
								<Button
									id="data_lib_btn_Duplicate"
									wrapperClass="px-3"
									disabled={selected.length !== 1}
									// onClick={() => handleDialog(true)}
									text="Duplicate"
									variant="tertiary"
								/>
							</Grid>
							<Grid item>
								<Button
									id="data_lib_btn_Download_Sanity_Report"
									wrapperClass="px-3"
									disabled={selected.length !== 1}
									// onClick={() => handleDialog(true)}
									text="Download Sanity Report"
									variant="tertiary"
								/>
							</Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* <Modal className={classes.modalContainer} open={openSanityModal} onClose={handleSanityModalClose}>
				<div className={classes.sanityContainer}>
					<img src={SanityReport} alt="sanityModal" />
				</div>
			</Modal> */}
    </Grid>
  );
};

export default TableActions;
