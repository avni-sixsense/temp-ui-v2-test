import { faPlus, faTrashAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { toast } from 'react-toastify';
import { NOT_ADDED_FOR_TRAINING } from 'store/modelTraining/constants';

import { precedentDefectInstancesCountAddedForTraining } from 'app/utils/modelTraining';

import ModeSelector from 'app/components/ModeSelector';
import {
  NumberFormater,
  encodeString,
  getParamsFromEncodedString
} from 'app/utils/helpers';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  setDialogOpen,
  setDialogVariant,
  setDefectsInstancesCount
} from 'store/modelTraining/actions';
import {
  selectTrainingUsecase,
  selectSelectedDefects,
  selectActiveTrainingMode,
  selectFileSetCount
} from 'store/modelTraining/selector';

import Table from '../../../RetrainModel/components/Table';
import { useParams } from 'react-router-dom';
// import DefectTable from './defectTable'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: -16,
    marginRight: -16,
    backgroundColor: theme.colors.grey[1],
    width: '320px',
    overflow: 'hidden',
    height: `calc(100% + 32px)`,

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
      background: '#EEEEEE'
    }
  },
  header: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: theme.colors.grey[11]
  },
  plusBox: {
    backgroundColor: theme.colors.blue[600],
    '& svg': {
      color: theme.colors.grey[1]
    }
  },
  deleteBox: {
    backgroundColor: theme.colors.red[600],
    '& svg': {
      color: theme.colors.grey[1]
    }
  },
  editBtn: {
    borderRadius: '1000px',
    width: '24px',
    height: '24px',
    cursor: 'pointer'
  },
  intances: {
    '& p': {
      fontSize: '0.875rem',
      fontWeight: 600
    }
  },
  normalBg: {
    backgroundColor: theme.colors.grey[3],
    borderRadius: '4px',
    '& p': {
      color: theme.colors.grey[14]
    }
  },
  orangeBg: {
    backgroundColor: theme.colors.yellow[600],
    borderRadius: '4px',
    '& p': {
      color: theme.colors.grey[0]
    }
  },
  tableContainer: {
    '&  [class*="MuiTableContainer-root"]': {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 220px)',
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
        background: '#EEEEEE'
      }
    }
  }
}));

// const tempData = [
// 	{
// 		id: 1,
// 		name: 'defect 1',
// 		intances: 100000,
// 	},
// 	{
// 		id: 2,
// 		name: 'defect 2',
// 		intances: 100,
// 	},
// ]

const ADDED_DEFECTS = 'Added';
const NOT_ADDED_DEFECTS = 'Not Added';

const mapDefectSummaryState = createStructuredSelector({
  selectedDefects: selectSelectedDefects,
  activeTrainingMode: selectActiveTrainingMode,
  usecase: selectTrainingUsecase,
  fileSetCount: selectFileSetCount
});

const DefectSummary = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const {
    selectedDefects,
    activeTrainingMode,
    usecase = {},
    fileSetCount
  } = useSelector(mapDefectSummaryState);

  const { trainingSessionId } = useParams();

  const [modes, setModes] = useState([
    { label: ADDED_DEFECTS, subLabel: 0 },
    { label: NOT_ADDED_DEFECTS, subLabel: 0 }
  ]);

  const [activeMode, setActiveMode] = useState(ADDED_DEFECTS);
  const [tableData, setTableData] = useState([]);

  const useCaseId = usecase.id;

  // RHS
  const {
    data: addedDefectsInstances = {},
    isLoading: isAddedDefectsInstancesLoading
  } = useQuery(
    [
      'addedDefectsInstances',
      trainingSessionId,
      `include_added_model_defects=true`
    ],
    context => api.getDefectInstances(...context.queryKey)
  );

  // RHS
  const {
    data: notAddedDefectsInstances = {},
    isLoading: isNotAddedDefectsInstancesLoading
  } = useQuery(
    [
      'notAddedDefectsInstances',
      trainingSessionId,
      `include_not_added_model_defects=true`
    ],
    context => api.getDefectInstances(...context.queryKey)
  );

  const addedDefectInstancesLen = addedDefectsInstances.defects?.length ?? 0;
  const notAddedDefectInstancesLen =
    notAddedDefectsInstances.defects?.length ?? 0;

  const precedentDefectInstancesCountNotAddedForTraining = async () => {
    try {
      const defectInstances = await api.getDefectInstances(
        'notAddedDefectsInstancesCount',
        trainingSessionId,
        `file_set_filters=${encodeString(
          `${getParamsFromEncodedString(
            window.location.search,
            true
          )}&use_case_id__in=${useCaseId}&is_gt_classified=true`
        )}&train_type_filter=NOT_TRAINED`
      );

      if (defectInstances) {
        dispatch(
          setDefectsInstancesCount({
            key: 'defectsInstancesCountNotAdded',
            value: defectInstances.total_count
          })
        );
      }
    } catch (error) {
      toast('Something went wrong.');
    }
  };

  useEffect(() => {
    if (useCaseId) {
      if (activeTrainingMode === NOT_ADDED_FOR_TRAINING) {
        precedentDefectInstancesCountNotAddedForTraining();
      } else {
        precedentDefectInstancesCountAddedForTraining(
          trainingSessionId,
          useCaseId
        );
      }
    }
  }, [activeTrainingMode, useCaseId, fileSetCount]);

  useEffect(() => {
    if (activeMode === ADDED_DEFECTS) {
      if (addedDefectsInstances.defects)
        setTableData(addedDefectsInstances.defects);
    } else if (activeMode === NOT_ADDED_DEFECTS) {
      if (notAddedDefectsInstances.defects)
        setTableData(notAddedDefectsInstances?.defects);
    }
  }, [addedDefectsInstances, notAddedDefectsInstances, activeMode]);

  useEffect(() => {
    setModes([
      { label: ADDED_DEFECTS, subLabel: addedDefectInstancesLen },
      { label: NOT_ADDED_DEFECTS, subLabel: notAddedDefectInstancesLen }
    ]);
  }, [addedDefectInstancesLen, notAddedDefectInstancesLen]);

  const handleModeChange = mode => {
    setActiveMode(mode);
  };

  const handleClick = () => {
    if (activeMode === ADDED_DEFECTS) {
      dispatch(setDialogVariant('remove_defect'));
      dispatch(setDialogOpen(true));
    } else {
      dispatch(setDialogVariant('add_defect'));
      dispatch(setDialogOpen(true));
    }
  };

  const columns = [
    {
      Header: 'Defects',
      accessor: 'name',
      Cell: ({ row: { original } }) => (
        <Tooltip title={original?.name}>
          <Box>
            {(original?.name || '').length > 16
              ? `${original.name.slice(0, 16)}...`
              : original?.name || ''}
            {/* {original?.name || ''} */}
          </Box>
        </Tooltip>
      )
    },
    {
      Header: () => (
        <Tooltip
          title='No. of instance is equal to no. of example of image for a particular defect.
        If image has only one defect, then no. of instance will be equal to no. of image.'
        >
          <div>Added Instances</div>
        </Tooltip>
      ),
      accessor: 'count',
      Cell: ({ row: { original } }) => {
        return (
          <Box display='flex' justifyContent='flex-end'>
            <Box
              px={0.25}
              className={clsx(classes.intances, {
                [classes.orangeBg]: original.count < 150,
                [classes.normalBg]: original.count >= 150
              })}
            >
              <Typography>{NumberFormater(original.count)}</Typography>
            </Box>
          </Box>
        );
      }
    }
  ];

  return (
    <Box p={1.25} className={classes.root}>
      <Box mb={2.35}>
        <Typography className={classes.header}>Defect Class Summary</Typography>
      </Box>

      <Box
        mb={1.5}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <ModeSelector
          onChange={handleModeChange}
          active={activeMode}
          modes={modes}
          noOutLined
        />

        {selectedDefects.length > 0 && (
          <Tooltip
            title={
              activeMode === ADDED_DEFECTS
                ? 'Remove from Training'
                : 'Add to Training'
            }
          >
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
              className={clsx(classes.editBtn, {
                [classes.deleteBox]: activeMode === ADDED_DEFECTS,
                [classes.plusBox]: activeMode === NOT_ADDED_DEFECTS
              })}
              onClick={handleClick}
            >
              <FontAwesomeIcon
                icon={activeMode === ADDED_DEFECTS ? faTrashAlt : faPlus}
              />
            </Box>
          </Tooltip>
        )}
      </Box>

      <Box className={classes.tableContainer}>
        {(activeMode === ADDED_DEFECTS && isAddedDefectsInstancesLoading) ||
        (activeMode === NOT_ADDED_DEFECTS &&
          isNotAddedDefectsInstancesLoading) ? (
          <CircularProgress />
        ) : (
          <Table columns={columns} data={tableData} selectable />
        )}
      </Box>
    </Box>
  );
};

export default DefectSummary;
