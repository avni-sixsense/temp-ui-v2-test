import {
  faSortSizeDown,
  faSortSizeUp,
  faTimes
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { setSorting } from 'store/reviewData/actions';
import { SORTING_CONSTANTS } from 'store/reviewData/constants';
import {
  selectActiveImageMode,
  selectFileSetCount,
  selectImageModes,
  selectIsModelAppliedForAll,
  selectSorting,
  selectUseAiAssistance
} from 'store/reviewData/selector';

import ImageResizeContainer from '../ImageResize';
import SortSelectorContainer from './SortSelector';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.colors.grey[17],
    width: 322,
    borderRadius: '4px',
    overflow: 'hidden',

    '& > div': {
      padding: theme.spacing(1.5)
    }
  },
  buttons: {
    marginRight: theme.spacing(1.25)
  },
  headerContainer: {
    borderBottom: `1px solid ${theme.colors.grey[16]}`,
    paddingBottom: `${theme.spacing(1.25)}px !important`,

    '& p': {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: theme.colors.grey[0]
    },
    '& svg': {
      fontSize: '0.75rem',
      fontWeight: 400,
      color: theme.colors.grey[8],
      cursor: 'pointer'
    }
  },
  sliderContainer: {
    borderBottom: `1px solid ${theme.colors.grey[16]}`,
    paddingBottom: `${theme.spacing(1.25)}px !important`,

    '& p': {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: theme.colors.grey[0],
      whiteSpace: 'nowrap',
      marginRight: theme.spacing(1.5)
    }
  },
  content: {
    borderBottom: `1px solid ${theme.colors.grey[16]}`
  },
  title: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: theme.colors.grey[0],
    marginBottom: theme.spacing(1)
  },
  radioText: {
    fontSize: '0.8125rem',
    fontWeight: 400,
    color: theme.colors.grey[10]
  },
  radioBtn: {
    marginRight: theme.spacing(3)
  },
  contentLabel: {
    fontWeight: 400,
    fontSize: '0.84rem',
    color: theme.colors.grey[7],
    fontStyle: 'italic'
  },
  sortContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
}));

const mapReviewState = createStructuredSelector({
  sorting: selectSorting,
  isModelAppliedForAll: selectIsModelAppliedForAll,
  useAiAssistance: selectUseAiAssistance,
  fileSetCount: selectFileSetCount,
  activeImageMode: selectActiveImageMode,
  imageModes: selectImageModes
});

const SORTING_OPTIONS = [
  {
    label: 'Created date',
    value: SORTING_CONSTANTS.CREATED_DATE
  },
  {
    label: 'Similarity to Training data',
    value: SORTING_CONSTANTS.SIMILARITY
  },
  {
    label: 'Label',
    value: SORTING_CONSTANTS.GROUND_TRUTH
  },
  {
    label: 'AI Output',
    value: SORTING_CONSTANTS.AI_OUTPUT
  }
];

const shortByButton = {
  ascending: {
    label: 'ASC',
    icon: <FontAwesomeIcon icon={faSortSizeUp} />
  },
  descending: {
    label: 'DES',
    icon: <FontAwesomeIcon icon={faSortSizeDown} />
  }
};

const ASCENDING = 'ascending';
const DESCENDING = 'descending';

const SortingDialog = ({
  handleClose,
  handleWithoutApplyClose,
  tempContainerMetaRef
}) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [sortByData, setSortByData] = useState(null);
  const [sortByOrder, setSortByOrder] = useState(ASCENDING);

  const {
    sorting,
    isModelAppliedForAll,
    useAiAssistance,
    fileSetCount,
    activeImageMode,
    imageModes
  } = useSelector(mapReviewState);

  useEffect(() => {
    if (sorting.sortDirection !== null || sorting.sortBy !== null) {
      setSortByData(sorting.sortBy);
      setSortByOrder(sorting.sortDirection);
    }
  }, [sorting]);

  const handleSortByChange = event => {
    setSortByData(event.target.value);
  };

  const handleDirectionChange = value => {
    if (sortByOrder === ASCENDING) setSortByOrder(DESCENDING);
    if (sortByOrder === DESCENDING) setSortByOrder(ASCENDING);
  };

  const handleApply = () => {
    if (
      sortByOrder !== sorting.sortDirection ||
      sortByData !== sorting.sortBy
    ) {
      dispatch(setSorting({ sortDirection: sortByOrder, sortBy: sortByData }));
    }

    handleClose();
  };

  const isSimilarityTrainingDisabled = !(
    isModelAppliedForAll && useAiAssistance
  );

  const count = !!activeImageMode
    ? imageModes.find(d => d.label === activeImageMode).subLabel
    : fileSetCount;

  return (
    <Box className={classes.root}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        className={classes.headerContainer}
      >
        <Typography>Settings</Typography>
        <FontAwesomeIcon icon={faTimes} onClick={handleWithoutApplyClose} />
      </Box>

      <Box
        className={classes.sliderContainer}
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <Typography>Image Size</Typography>
        <ImageResizeContainer tempContainerMetaRef={tempContainerMetaRef} />
      </Box>

      <Box className={classes.content}>
        <Typography className={classes.title}>Sort By:</Typography>

        <Box className={classes.sortContainer}>
          <SortSelectorContainer
            options={SORTING_OPTIONS.map(item => ({
              ...item,
              disabled:
                !count ||
                ((item.value === SORTING_CONSTANTS.SIMILARITY ||
                  item.value === SORTING_CONSTANTS.AI_OUTPUT) &&
                  isSimilarityTrainingDisabled)
            }))}
            value={sortByData}
            onChange={handleSortByChange}
          />

          <CommonButton
            text={shortByButton[sortByOrder].label}
            icon={shortByButton[sortByOrder].icon}
            variant='secondary'
            onClick={handleDirectionChange}
            disabled={!count}
          />
        </Box>
      </Box>

      <Box display='flex'>
        <CommonButton
          text='Apply'
          onClick={handleApply}
          wrapperClass={classes.buttons}
          disabled={!count}
        />

        <CommonButton
          text='Cancel'
          variant='secondary'
          onClick={handleWithoutApplyClose}
          wrapperClass={classes.buttons}
        />
      </Box>
    </Box>
  );
};

export default SortingDialog;
