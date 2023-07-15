import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import {
  FilesetTag,
  FilterKey,
  UploadSessionTag,
  WaferMapTag
} from 'app/utils/filterConstants';
import { decodeURL, encodeURL } from 'app/utils/helpers';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { selectWaferTableStructure } from 'store/helpers/selector';

import AIoutputFilter from './AIoutputFilter';
import AutoClassifiedFilter from './AutoClassified';
import BookmarkFilter from './BookmarkFilter';
// import DateFilter from './DateFilter'
import DateFilter from './DateRangeFilter';
import DefectFilter from './DefectFilter';
import Filter from './Filter';
import FolderFilter from './FolderFilter';
import ModelFilter from './ModelFilter';
import ModelStatusFilter from './ModelStatusFilter';
import MoreFilter from './MoreFilter';
import ReviewedFilter from './ReviewedFilter';
import TagFilter from './TagFilter';
import TypeFilter from './TypeFilter';
import UseCaseFilter from './UseCaseFilter';
import WaferFilter from './WaferFilter';
import WaferStatusFilter from './WaferStatusFilter';

const useStyles = makeStyles(theme => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: '0 !important'
  },
  filterBtn: {
    background: '#02658C',
    padding: '0px 17px',
    height: '28px',
    borderRadius: 0,
    fontSize: '12px',
    color: '#fff',
    '&:hover': {
      color: '#fff',
      background: '#02658C'
    }
  },
  btnSpan: {
    marginRight: 16
  },
  aaplied: {
    marginTop: '8px'
  },
  filterBar: {
    overflowY: 'auto',
    '& > div': {
      margin: '4px 4px 4px 0px'
    },
    [theme.breakpoints.down('lg')]: {
      '& > div': {
        margin: '4px'
      }
    },
    [theme.breakpoints.down('md')]: {
      '& > div': {
        margin: '4px'
      }
    }
  }
}));

const trainFilterKey = 'train_type__in';
const useCaseFilterKey = 'use_case_id__in';
const defectFilterKey = 'defect_id__in';
const groundTruthFilterKey = 'ground_truth_label__in';
const GTModelFilterKey = 'ml_model_id__in';
const waferFilterKey = 'wafer_id__in';
const TagFilterKey = 'tags__in';
const FolderFilterKey = 'upload_session_id__in';
const AIoutputFilterKey = 'ai_predicted_label__in';
const ReviewedFilterKey = 'is_reviewed';

const moreFilterData = {
  is_bookmarked: {
    id: 'is_bookmarked',
    name: 'Bookmark ',
    key: 'is_bookmarked',
    visible: false,
    filter_key: 'bookmarkFilter'
  },
  train_type__in: {
    id: 'train_type__in',
    name: 'Training Type',
    key: 'train_type__in',
    visible: false,
    filter_key: 'typeFilter'
  },
  training_ml_model__in: {
    id: 'training_ml_model__in',
    name: 'Training Model',
    key: 'training_ml_model__in',
    visible: false,
    filter_key: 'modelFilter'
  }
};

const bookmarkFilterKey = 'is_bookmarked';
const autoClassifiedFileterKey = 'is_confident_defect';
const waferStatusFilterKey = 'status__in';
const modelStatusFilterKey = 'status__in';

const Filters = props => {
  const {
    onlyFolder = false,
    dateFilter = false,
    modelFilter = false,
    typeFilter = false,
    modelKey,
    UseCase = false,
    filterModels = true,
    bookmarkFilter = false,
    commontFilter = true,
    folderFilter = true,
    defectFilter = false,
    groundTruth = false,
    gtModel = false,
    // autoModelFilter = false,
    wafermap = false,
    autoClassified = false,
    waferStatus = false,
    typeData = [],
    setFilters,
    filters,
    lightTheme = false,
    waferTagFilter = false,
    uploadSessionTagFilter = false,
    filesetTagFilter = false,
    aiOutputFilter = false,
    reviewedFilter = false,
    waferMetaInfoFilter = false,
    modelStatusFilter = false
  } = props;

  const classes = useStyles();

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const [deleteDateFilter, setDeleteDateFilter] = useState(false);
  const [moreFilterValue, setMoreFilterValue] = useState([]);

  const metaInfo = useSelector(({ dataLibrary }) => dataLibrary.tableStructure);

  const waferMetaInfo = useSelector(selectWaferTableStructure);

  const { date__gte = null, date__lte = null } = filters;

  const [moreFilter, setMoreFilter] = useState({});

  useEffect(() => {
    const screenFilters = {};
    Object.keys(moreFilterData).forEach(key => {
      if (props[moreFilterData[key]?.filter_key]) {
        if (
          (moreFilterData[key]?.filter_key === 'modelFilter' &&
            modelKey === 'training_ml_model__in') ||
          moreFilterData[key]?.filter_key !== 'modelFilter'
        ) {
          screenFilters[key] = moreFilterData[key];
        }
      }
    });
    if (!onlyFolder && commontFilter) {
      metaInfo
        .filter(info => info.is_filterable)
        .forEach(item => {
          screenFilters[`meta_info__${item.field}__in`] = {
            name: item.name,
            key: `meta_info__${item.field}__in`,
            visible: false,
            filter_key: 'commontFilter',
            id: `meta_info__${item.field}__in`
          };
        });
    }
    if (waferMetaInfoFilter) {
      waferMetaInfo
        .filter(info => info.is_filterable)
        .forEach(item => {
          screenFilters[`meta_info__${item.field}__in`] = {
            name: item.name,
            key: `meta_info__${item.field}__in`,
            visible: true,
            filter_key: 'waferMetaFilter',
            id: `meta_info__${item.field}__in`
          };
        });
    }
    setMoreFilter(screenFilters);
  }, [
    bookmarkFilter,
    commontFilter,
    waferMetaInfoFilter,
    waferMetaInfo,
    typeFilter,
    modelFilter,
    metaInfo
  ]);

  useEffect(() => {
    setMoreFilterValue(Object.values(moreFilter).filter(item => item.visible));
  }, [moreFilter]);

  useEffect(() => {
    if (!Object.keys(moreFilter).length) return;
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    const contextualFilters = decodeURL(params.contextual_filters);
    const otherFilters = decodeURL(params.other_filters);
    const mergedParmas = { ...contextualFilters, ...otherFilters };
    const temp = [];
    const tempMoreFilter = moreFilter;
    Object.keys(tempMoreFilter).forEach(key => {
      if (mergedParmas[tempMoreFilter[key].key]) {
        temp.push(tempMoreFilter[key]);
        tempMoreFilter[key].visible = true;
      }
      // else {
      // 	tempMoreFilter[key].visible = false
      // }
    });
    setMoreFilter(tempMoreFilter);
  }, [location.search, moreFilter]);

  const handleApplyFilter = data => {
    const value = data ?? moreFilterValue;

    let updatedFilter;
    if (value.every(item => typeof item === 'string')) {
      updatedFilter = Object.keys(moreFilter).filter(item =>
        value.includes(moreFilter[item]?.name)
      );
    } else {
      updatedFilter = value.map(item => item.key);
    }

    const tempObj = {};
    const filterSession = JSON.parse(sessionStorage.getItem(FilterKey) || {});
    const parsedParams = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    const {
      screen_key: screenKey,
      other_filters: otherFilers,
      contextual_filters: contextualFilters
    } = parsedParams;
    const parsedOtherFilters = decodeURL(otherFilers);
    Object.keys(moreFilter).forEach(key => {
      if (updatedFilter.includes(key)) {
        tempObj[key] = {
          ...moreFilter[key],
          visible: !moreFilter[key].visible || true
        };
      } else {
        if (parsedOtherFilters?.[key]) {
          delete parsedOtherFilters?.[key];
        }

        tempObj[key] = { ...moreFilter[key], visible: false };
      }
    });
    sessionStorage.setItem(
      FilterKey,
      JSON.stringify({
        ...filterSession,
        [screenKey]: {
          contextual_filters: decodeURL(contextualFilters),
          other_filters: parsedOtherFilters,
          key: screenKey
        }
      })
    );
    setMoreFilter(prev => {
      return { ...prev, ...tempObj };
    });
    if (otherFilers !== encodeURL(parsedOtherFilters)) {
      const params = queryString.stringify({
        contextual_filters: contextualFilters,
        other_filters: encodeURL(parsedOtherFilters),
        screen_key: screenKey
      });
      setSearchParams(params);
    }
  };

  const handleClearFilter = key => {
    if (filters[key]) {
      setFilters(d => {
        delete d[key];
        return { ...d };
      });
    }

    const updatedMoreFilterValue = moreFilterValue.filter(d => d.key !== key);

    setMoreFilterValue(updatedMoreFilterValue);
    handleApplyFilter(updatedMoreFilterValue);
  };

  return (
    <Box
      display='flex'
      flexWrap='wrap'
      alignItems='center'
      className={classes.filterBar}
    >
      {dateFilter ? (
        <DateFilter
          date={{ end: date__lte, start: date__gte }}
          setDeleteDateFilter={setDeleteDateFilter}
          deleteDateFilter={deleteDateFilter}
          setFilters={setFilters}
          lightTheme={lightTheme}
        />
      ) : (
        ''
      )}
      {folderFilter && (
        <FolderFilter
          setFilters={setFilters}
          filterKey={FolderFilterKey}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}
      {waferTagFilter && (
        <TagFilter
          setFilters={setFilters}
          lightTheme={lightTheme}
          filterKey={TagFilterKey}
          filters={filters}
          variant={WaferMapTag}
        />
      )}
      {filesetTagFilter && (
        <TagFilter
          setFilters={setFilters}
          lightTheme={lightTheme}
          filterKey={TagFilterKey}
          filters={filters}
          variant={FilesetTag}
        />
      )}
      {uploadSessionTagFilter && (
        <TagFilter
          setFilters={setFilters}
          lightTheme={lightTheme}
          filterKey={TagFilterKey}
          filters={filters}
          variant={UploadSessionTag}
        />
      )}
      {UseCase && (
        <UseCaseFilter
          filterKey={useCaseFilterKey}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}
      {defectFilter && (
        <DefectFilter
          filterKey={defectFilterKey}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}
      {groundTruth && (
        <DefectFilter
          filterKey={groundTruthFilterKey}
          groundTruth
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}
      {reviewedFilter && (
        <ReviewedFilter
          filterKey={ReviewedFilterKey}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}
      {autoClassified && (
        <AutoClassifiedFilter
          filterKey={autoClassifiedFileterKey}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}
      {wafermap && (
        <WaferFilter
          filterKey={waferFilterKey}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}
      {waferStatus && (
        <WaferStatusFilter
          filterKey={waferStatusFilterKey}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}
      {/* {autoModelFilter && (
					<AutoModelFilter
						filterKey={modelKey}
						data={models}
						isLoading={isModelLoading}
						setFilters={setFilters}
					/>
				)} */}
      {gtModel && (
        <ModelFilter
          filterKey={GTModelFilterKey}
          gtModel
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
          filterModels={filterModels}
        />
      )}
      {aiOutputFilter && (
        <AIoutputFilter
          lightTheme={lightTheme}
          filters={filters}
          setFilters={setFilters}
          filterKey={AIoutputFilterKey}
        />
      )}
      {modelFilter &&
        (modelKey !== 'training_ml_model__in' ||
          (modelKey === 'training_ml_model__in' &&
            moreFilter?.training_ml_model__in?.visible)) && (
          <ModelFilter
            filterKey={modelKey}
            setFilters={setFilters}
            lightTheme={lightTheme}
            filters={filters}
            filterModels={filterModels}
            clearFilter={moreFilter?.training_ml_model__in?.visible}
            handleClearFilter={() => handleClearFilter(modelKey)}
          />
        )}
      {bookmarkFilter && moreFilter?.is_bookmarked?.visible && (
        <BookmarkFilter
          filterKey={bookmarkFilterKey}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
          clearFilter
          handleClearFilter={() => handleClearFilter(bookmarkFilterKey)}
        />
      )}
      {typeFilter && moreFilter?.train_type__in?.visible && (
        <TypeFilter
          filterKey={trainFilterKey}
          data={typeData}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}

      {modelStatusFilter && (
        <ModelStatusFilter
          filterKey={modelStatusFilterKey}
          setFilters={setFilters}
          lightTheme={lightTheme}
          filters={filters}
        />
      )}

      {!onlyFolder &&
        commontFilter &&
        metaInfo?.length > 0 &&
        metaInfo
          .filter(
            info =>
              info.is_filterable &&
              moreFilter?.[`meta_info__${info.field}__in`]?.visible
          )
          .map(info => (
            <Filter
              info={info}
              date={{ start: date__gte, end: date__lte }}
              filter={filters[info.field]}
              key={info.name}
              classes={classes}
              setFilters={setFilters}
              lightTheme={lightTheme}
              filters={filters}
              clearFilter
              handleClearFilter={() =>
                handleClearFilter(`meta_info__${info.field}__in`)
              }
            />
          ))}
      {waferMetaInfoFilter &&
        waferMetaInfo.length > 0 &&
        waferMetaInfo
          .filter(
            info =>
              info.is_filterable &&
              moreFilter?.[`meta_info__${info.field}__in`]?.visible
          )
          .map(info => (
            <Filter
              info={info}
              date={{ start: date__gte, end: date__lte }}
              filter={filters[info.field]}
              key={info.name}
              classes={classes}
              setFilters={setFilters}
              lightTheme={lightTheme}
              filters={filters}
              clearFilter
              handleClearFilter={() =>
                handleClearFilter(`meta_info__${info.field}__in`)
              }
              waferMeta
            />
          ))}
      {Object.keys(moreFilter).length > 0 && (
        <MoreFilter
          data={moreFilter}
          lightTheme={lightTheme}
          value={moreFilterValue}
          setValue={setMoreFilterValue}
          handleApplyFilter={handleApplyFilter}
        />
      )}
    </Box>
  );
};

export default Filters;

Filters.defaultValue = {
  onlyFolder: false,
  dateFilter: false
};

Filters.propTypes = {
  onlyFolder: PropTypes.bool,
  dateFilter: PropTypes.bool
};
