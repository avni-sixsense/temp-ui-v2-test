import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import api from 'app/api';
import { convertToUtc } from 'app/utils/helpers';
import filterImg from 'assests/images/filter.svg';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { setParams } from 'store/reviewData/actions';

import AutoModelFilter from './AutoModelFilter';
import BookmarkFilter from './BookmarkFilter';
// import DateFilter from './DateFilter'
import DateFilter from './DateRangeFilter';
import DefectFilter from './DefectFilter';
import Filter from './Filter';
import FolderFilter from './FolderFilter';
import ModelFilter from './ModelFilter';
import TypeFilter from './TypeFilter';
import UseCaseFilter from './UseCaseFilter';
import WaferFilter from './waferFilter';

const useStyles = makeStyles(() => ({
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
  }
}));

const trainFilterKey = 'train_type__in';
const useCaseFilterKey = 'use_case_id__in';
const defectFilterKey = 'defect_id__in';
const groundTruthFilterKey = 'ground_truth_label__in';
const GTModelFilterKey = 'ml_model_id__in';
const waferFilterKey = 'wafer_id__in';

const gtDefectsData = [
  { id: 'no_gt', name: 'No Label' },
  { id: 'NVD', name: 'No Defects' }
];

const bookmarkFilterData = [
  {
    id: 'bookmarked',
    name: 'Bookmarked'
  },
  {
    id: 'notBookmarked',
    name: 'Not Bookmarked'
  }
];

const bookmarkDict = keyBy(bookmarkFilterData, 'id');
const bookmarkFilterKey = 'is_bookmarked';

const Filters = ({
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
  autoModelFilter = false,
  wafermap = false,
  typeData = []
}) => {
  const typeDict = keyBy(typeData, 'value');

  const classes = useStyles();
  const { subscriptionId } = useParams();

  const [deleteDateFilter, setDeleteDateFilter] = useState(false);

  const metaInfo = useSelector(({ dataLibrary }) => dataLibrary.tableStructure);

  const filters = useSelector(({ filters }) => filters);
  const folderDict = useSelector(({ filters }) => filters.folderDict);
  const date = useSelector(({ filters }) => filters.date);

  const dispatch = useDispatch();

  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  const [modelsDict, setModelsDict] = useState({});
  const [autoModelDict, setAutoModelDict] = useState({});
  const [useCaseDict, setUseCaseDict] = useState({});
  const [defectDict, setDefectDict] = useState({});
  const [groundTruthDict, setGroundTruthDict] = useState({});
  const [gtModelDict, setGtModelDict] = useState({});
  const [waferDict, setWaferDict] = useState({});

  const { data: wafers, isLoading: isWaferLoading } = useQuery(
    ['wafers'],
    context => api.getWaferMap(...context.queryKey),
    { enabled: !!wafermap }
  );

  const { data: { results: models = [] } = [], isLoading: isModelLoading } =
    useQuery(
      ['models', subscriptionId, filterModels],
      context => api.getMlModels(...context.queryKey),
      { enabled: !!subscriptionId && (modelFilter || autoModelFilter) }
    );

  const { data: useCases, isLoading: isUseCaseLoading } = useQuery(
    ['useCase', undefined, undefined, subscriptionId, '', true],
    context => api.useCase(...context.queryKey),
    { enabled: !!UseCase }
  );

  const { data: defects = [], isLoading: isDefectLoading } = useQuery(
    ['defects', subscriptionId],
    context => api.getDefects(...context.queryKey),
    { enabled: !!subscriptionId }
  );

  useEffect(() => {
    if (models.length) {
      const dict = keyBy(models, 'id');
      setModelsDict(dict);
      setGtModelDict(dict);
      setAutoModelDict({
        ...dict,
        AutoModel: { id: 'AutoModel', name: 'Auto' }
      });
    }
  }, [models]);

  useEffect(() => {
    if ((wafers?.results || []).length) {
      const dict = keyBy(wafers.results, 'id');
      setWaferDict(dict);
    }
  }, [wafers]);

  useEffect(() => {
    if (useCases?.results?.length) {
      const dict = keyBy(useCases?.results, 'id');
      setUseCaseDict(dict);
    }
  }, [useCases]);

  useEffect(() => {
    if (defects?.results?.length) {
      const dict = keyBy([...gtDefectsData, ...defects.results], 'id');
      setDefectDict(dict);
      setGroundTruthDict(dict);
    }
  }, [defects]);

  // useEffect(() => {
  // 	if (!dateFilter) {
  // 		dispatch({
  // 			type: 'SET_DATE_FILTER',
  // 			date: {
  // 				start: '',
  // 				end: '',
  // 				actualStart: '',
  // 				actualEnd: '',
  // 				timeFormat: format,
  // 			},
  // 		})
  // 	}
  // }, [dispatch, dateFilter])

  useEffect(() => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (dateFilter && !(params?.date__gte && params?.date__lte)) {
      const formattedDate = {
        start: convertToUtc(date.start),
        end: convertToUtc(date.end)
      };
      let s = queryString.stringify(
        {
          ...params,
          date__gte: `${formattedDate.start}`,
          date__lte: `${formattedDate.end}`
        },
        { arrayFormat: 'comma' }
      );
      setSearchParams(s);
      delete params?.page;
      s = queryString.stringify(params, { arrayFormat: 'comma' });
      dispatch(setParams(s));
    }
  }, [location.search, date, dateFilter]);

  useEffect(() => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (!modelFilter) {
      dispatch({
        type: 'REMOVE_MODEL_FILTER'
      });
      if (params[modelKey]) {
        delete params[modelKey];
      }
    }
    if (!defectFilter) {
      dispatch({
        type: 'REMOVE_DEFECT_FILTER'
      });
      if (params[defectFilterKey]) {
        delete params[defectFilterKey];
      }
    }
    if (!groundTruth) {
      dispatch({
        type: 'REMOVE_GROUND_TRUTH_FILTER'
      });
      if (params[groundTruthFilterKey]) {
        delete params[groundTruthFilterKey];
      }
    }
    if (!UseCase) {
      dispatch({
        type: 'REMOVE_USECASE_FILTER'
      });
      if (params[useCaseFilterKey]) {
        delete params[useCaseFilterKey];
      }
    }
    if (!typeFilter) {
      dispatch({
        type: 'REMOVE_TYPE_FILTER'
      });
      if (params[trainFilterKey]) {
        delete params[trainFilterKey];
      }
    }
    if (!bookmarkFilter) {
      dispatch({
        type: 'REMOVE_BOOKMARK_FILTER'
      });
      if (params[bookmarkFilterKey]) {
        delete params[bookmarkFilterKey];
      }
    }
    let s = queryString.stringify(params, { arrayFormat: 'comma' });
    setSearchParams(s);
    delete params?.page;
    s = queryString.stringify(params, { arrayFormat: 'comma' });
    dispatch(setParams(s));
  }, [
    location.search,
    modelFilter,
    modelKey,
    typeFilter,
    bookmarkFilter,
    groundTruth,
    UseCase,
    defectFilter
  ]);

  useEffect(() => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (Object.entries(params).length) {
      delete params?.time_format;
      delete params?.page;
      if (
        params[trainFilterKey] &&
        params[trainFilterKey].includes('TEST') &&
        params[trainFilterKey].includes('VALIDATION')
      ) {
        params[trainFilterKey].push('TEST,VALIDATION');
        params[trainFilterKey].splice(
          params[trainFilterKey].indexOf('TEST'),
          1
        );
        params[trainFilterKey].splice(
          params[trainFilterKey].indexOf('VALIDATION'),
          1
        );
      }
      const s = queryString.stringify(params, { arrayFormat: 'comma' });
      dispatch(setParams(s));
    }
  }, [location.search]);

  const removeFilter = (field, param, item) => {
    const params = queryString.parse(location.search, {
      arrayFormat: 'comma',
      parseNumbers: true
    });
    if (
      params[trainFilterKey] &&
      params[trainFilterKey].includes('TEST') &&
      params[trainFilterKey].includes('VALIDATION')
    ) {
      params[trainFilterKey].push('TEST,VALIDATION');
      params[trainFilterKey].splice(params[trainFilterKey].indexOf('TEST'), 1);
      params[trainFilterKey].splice(
        params[trainFilterKey].indexOf('VALIDATION'),
        1
      );
    }
    if (params[param]) {
      if (Array.isArray(params[param])) {
        params[param] = params[param].filter(p => p !== item);
      } else {
        params[param] = [];
      }
    }

    const newParams = queryString.stringify(params, { arrayFormat: 'comma' });
    setSearchParams(newParams);
    dispatch({ type: 'REMOVE_FILTER', field, param, item });
  };

  // const removeDateFilter = () => {
  // 	const params = queryString.parse(location.search, { arrayFormat: 'comma', parseNumbers: true })
  // 	delete params.date__gte
  // 	delete params.date__lte
  // 	delete params.time_format
  // 	const newParams = queryString.stringify(params, { arrayFormat: 'comma' })
  // 	setSearchParams({
  // 		search: newParams,
  // 	})
  // 	dispatch({
  // 		type: 'SET_DATE_FILTER',
  // 		date: {
  // 			start: '',
  // 			end: '',
  // 			actualStart: '',
  // 			actualEnd: '',
  // 			timeFormat: format,
  // 		},
  // 	})
  // 	setDeleteDateFilter(true)
  // }

  return (
    <Box my={4}>
      <Box id='filter_bar' display='flex' mb={1} flexWrap='wrap'>
        <Box className={classes.item} mr={4} mb={1}>
          <Typography variant='h4'>Filter Bar</Typography>
          <Box ml={1.5}>
            <img src={filterImg} alt='' />
          </Box>
        </Box>
        {dateFilter ? (
          <DateFilter
            date={date}
            setDeleteDateFilter={setDeleteDateFilter}
            deleteDateFilter={deleteDateFilter}
          />
        ) : null}
        {folderFilter && <FolderFilter />}
        {UseCase && (
          <UseCaseFilter
            filterKey={useCaseFilterKey}
            data={useCases?.results || []}
            isLoading={isUseCaseLoading}
          />
        )}
        {defectFilter && (
          <DefectFilter
            filterKey={defectFilterKey}
            data={defects?.results || []}
            isLoading={isDefectLoading}
          />
        )}
        {groundTruth && (
          <DefectFilter
            filterKey={groundTruthFilterKey}
            data={[...gtDefectsData, ...(defects?.results || [])]}
            isLoading={isDefectLoading}
            groundTruth
          />
        )}
        {bookmarkFilter && (
          <BookmarkFilter
            data={bookmarkFilterData}
            filterKey={bookmarkFilterKey}
          />
        )}
        {modelFilter && (
          <ModelFilter
            filterKey={modelKey}
            data={models}
            isLoading={isModelLoading}
          />
        )}
        {wafermap && (
          <WaferFilter
            filterKey={waferFilterKey}
            data={wafers?.results || []}
            isLoading={isWaferLoading}
          />
        )}
        {autoModelFilter && (
          <AutoModelFilter
            filterKey={modelKey}
            data={models}
            isLoading={isModelLoading}
          />
        )}
        {gtModel && (
          <ModelFilter
            filterKey={GTModelFilterKey}
            data={models}
            isLoading={isModelLoading}
            gtModel
          />
        )}
        {typeFilter && (
          <TypeFilter filterKey={trainFilterKey} data={typeData} />
        )}
        {!onlyFolder &&
          commontFilter &&
          metaInfo?.length > 0 &&
          metaInfo
            .filter(info => info.is_filterable)
            .map(info => (
              <Filter
                info={info}
                filter={filters[info.field]}
                key={info.name}
                classes={classes}
              />
            ))}
      </Box>
      <Grid container spacing={2} className={classes.applied}>
        {filters?.folder?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  Folder:{' '}
                  {folderDict[item]?.name || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() =>
                    removeFilter('folder', 'upload_session_id__in', item)
                  }
                />
              </Button>
            </Grid>
          );
        })}
        {filters?.model?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  {`${
                    location.pathname.includes('results') &&
                    location.pathname.includes('data')
                      ? 'Training Model'
                      : 'Model'
                  }:`}{' '}
                  {get(modelsDict, `${item}.name`, '') || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() => removeFilter('model', modelKey, item)}
                />
              </Button>
            </Grid>
          );
        })}
        {filters?.wafer?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  {`Wafer map:`}{' '}
                  {get(waferDict, `${item}.organization_wafer_id`, '') || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() => removeFilter('wafer', waferFilterKey, item)}
                />
              </Button>
            </Grid>
          );
        })}
        {filters?.autoModel?.applied.length > 0 && (
          <Grid item>
            <Button className={classes.filterBtn}>
              <span className={classes.btnSpan}>
                {`Model: `}
                {filters.autoModel.applied?.[0] === 'AutoModel'
                  ? 'Auto'
                  : get(
                      autoModelDict,
                      `${filters.autoModel.applied?.[0]}.name`,
                      ''
                    ) || (
                      <CircularProgress
                        style={{ marginLeft: '5px' }}
                        color='#ffffff'
                        size={12}
                      />
                    )}
              </span>
              <CloseIcon
                onClick={() =>
                  removeFilter(
                    'autoModel',
                    filters.autoModel.applied?.[0] === 'AutoModel'
                      ? 'auto_model_selection'
                      : modelKey,
                    get(
                      autoModelDict,
                      `${filters.autoModel.applied?.[0]}.id`,
                      ''
                    ) || (
                      <CircularProgress
                        style={{ marginLeft: '5px' }}
                        color='#ffffff'
                        size={12}
                      />
                    )
                  )
                }
              />
            </Button>
          </Grid>
        )}
        {filters?.gtModel?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  GT Model:
                  {get(gtModelDict, `${item}.name`, '') || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() =>
                    removeFilter('gtModel', GTModelFilterKey, item)
                  }
                />
              </Button>
            </Grid>
          );
        })}
        {filters?.type?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  {`${
                    location.pathname.includes('results') &&
                    location.pathname.includes('data')
                      ? 'Training Type'
                      : 'Type'
                  }:`}{' '}
                  {get(typeDict, `${item}.name`) || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() => removeFilter('type', trainFilterKey, item)}
                />
              </Button>
            </Grid>
          );
        })}
        {filters?.useCase?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  Use Case:{' '}
                  {get(useCaseDict, `${item}.name`) || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() =>
                    removeFilter('useCase', useCaseFilterKey, item)
                  }
                />
              </Button>
            </Grid>
          );
        })}
        {filters?.defect?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  Defect:{' '}
                  {get(defectDict, `${item}.name`) || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() => removeFilter('defect', defectFilterKey, item)}
                />
              </Button>
            </Grid>
          );
        })}
        {filters?.groundTruth?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  Label:{' '}
                  {get(groundTruthDict, `${item}.name`) || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() =>
                    removeFilter('groundTruth', groundTruthFilterKey, item)
                  }
                />
              </Button>
            </Grid>
          );
        })}
        {filters?.bookmark?.applied.map(item => {
          return (
            <Grid item key={item}>
              <Button className={classes.filterBtn}>
                <span className={classes.btnSpan}>
                  Bookmark:{' '}
                  {get(bookmarkDict, `${item}.name`) || (
                    <CircularProgress
                      style={{ marginLeft: '5px' }}
                      color='#ffffff'
                      size={12}
                    />
                  )}
                </span>
                <CloseIcon
                  onClick={() =>
                    removeFilter('bookmark', bookmarkFilterKey, item)
                  }
                />
              </Button>
            </Grid>
          );
        })}
        {!onlyFolder &&
          metaInfo?.length > 0 &&
          metaInfo
            .filter(info => info.is_filterable)
            .map(info =>
              filters?.[info.field]?.applied.map(item => {
                return (
                  <Grid item key={item}>
                    <Button className={classes.filterBtn}>
                      <span className={classes.btnSpan}>
                        {info.field}: {item}
                      </span>
                      <CloseIcon
                        onClick={() =>
                          removeFilter(
                            info.field,
                            `meta_info__${info.field}__in`,
                            item
                          )
                        }
                      />
                    </Button>
                  </Grid>
                );
              })
            )}
      </Grid>
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
