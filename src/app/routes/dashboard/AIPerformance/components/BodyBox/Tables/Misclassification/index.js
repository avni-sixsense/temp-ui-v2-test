import Box from '@material-ui/core/Box';
import { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DialogBoxConfirmation from './DialogueBoxConfirmation';
import CommonButton from 'app/components/ReviewButton';
import { decodeURL, encodeURL } from 'app/utils/helpers';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { setUploadSession } from 'store/reviewData/actions';

import { misClassificationColumns } from '../../../columns';

import { createStructuredSelector } from 'reselect';
import {
  selectMisclassificationImagesRowIds,
  selectMisclassificationPairs
} from 'store/aiPerformance/selectors';
import VirtualTable from 'app/components/VirtualTable';

const useStyles = makeStyles(theme => ({
  dataTableHeader: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.colors.grey[18]
  },
  subTitle: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  tableContainer: {
    maxHeight: '400px',
    overflow: 'auto'
  }
}));

const mapAiPerformanceState = createStructuredSelector({
  misclassificationImagesRowIds: selectMisclassificationImagesRowIds,
  misclassificationPair: selectMisclassificationPairs
});

const MisclassificationTable = ({
  mlModelId,
  columnFilter = val => val,
  modelSelection
}) => {
  const classes = useStyles();
  const [dialogBoxConfig, setDialogBoxConfig] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { subscriptionId, packId } = useParams();

  const dispatch = useDispatch();

  const { misclassificationImagesRowIds, misclassificationPair } = useSelector(
    mapAiPerformanceState
  );

  const {
    isLoading: isMisClassificationLoading,
    data: missclassificationDefect
  } = misclassificationPair;

  const closeDialogueBox = () => setDialogBoxConfig(null);

  const createURL = (modelId, gtId) => {
    const currentParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });

    const contextualFilters = decodeURL(currentParams.contextual_filters);
    const otherFilters = decodeURL(currentParams.other_filters);

    delete contextualFilters.packId;
    delete otherFilters.packId;

    const q = {};

    if (gtId) {
      q.ground_truth_label__in = gtId;
    }

    if (modelId) {
      q.ai_predicted_label__in = modelId;
    }

    q.model_selection = modelSelection;

    q.ml_model_id__in = mlModelId;

    const params = queryString.stringify({
      contextual_filters: encodeURL(
        {
          ...contextualFilters,
          ...otherFilters,
          ...q,
          is_confident_defect: true
        },
        { arrayFormat: 'comma' }
      )
    });

    dispatch(setUploadSession(params));

    return `/${subscriptionId}/${packId}/annotation/review?${params}`;
  };

  const handleMisclassificationClick = () => {
    const parsedParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });

    const contextualFilters = decodeURL(parsedParams.contextual_filters);
    const otherFilters = decodeURL(parsedParams.other_filters);

    const q = {};

    q.model_selection = modelSelection;

    q.ml_model_id__in = mlModelId;

    const params = queryString.stringify({
      contextual_filters: encodeURL(
        { ...contextualFilters, ...otherFilters, ...q, is_accurate: false },
        { arrayFormat: 'comma' }
      )
    });

    navigate(`/${subscriptionId}/${packId}/annotation/review?${params}`);
  };

  const filterMisClassificationColums = misClassificationColumns({
    createURL,
    setDialogBoxConfig,
    misclassificationImagesRowIds
  }).filter(columnFilter);

  return (
    <>
      {dialogBoxConfig?.id && (
        <DialogBoxConfirmation
          dialogBoxConfig={dialogBoxConfig}
          hideDialogueBox={closeDialogueBox}
          mlModelId={mlModelId}
        />
      )}
      <Box>
        <Paper>
          <Box mb={2} pb={1.5}>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              pl={2.5}
              py={2}
              pr={1.25}
            >
              <Box>
                <Box>
                  <Typography className={classes.dataTableHeader}>
                    Misclassification Pair
                  </Typography>
                </Box>
                <Box>
                  <Typography className={classes.subTitle}>
                    This table is misclassification between two defects.
                  </Typography>
                </Box>
              </Box>
              <Box display='flex' alignItems='center'>
                {(missclassificationDefect || []).length > 0 && (
                  <CommonButton
                    size='sm'
                    variant='tertiary'
                    text='View all misclassified images'
                    wrapperClass={classes.btns}
                    onClick={handleMisclassificationClick}
                  />
                )}
              </Box>
            </Box>
            <Box className={classes.tableContainer}>
              <VirtualTable
                data={missclassificationDefect}
                columns={filterMisClassificationColums}
                isLoading={isMisClassificationLoading}
                height={400}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default MisclassificationTable;
