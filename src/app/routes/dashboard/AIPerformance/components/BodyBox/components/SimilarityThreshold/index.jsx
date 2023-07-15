import { faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import api from 'app/api';
import CommonButton from 'app/components/ReviewButton';
import SearchBar from 'app/components/SearchBar/searchBar';
import { SimilarityInputUpdate } from 'app/components/SimilarityInputUpdate';
import SSSwitch from 'app/components/SSSwitch';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';
import React, { useEffect, useState } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setConfusionModel } from 'store/aiPerformance/actions';
import { setModels } from 'store/common/actions';

const useStyles = makeStyles(theme => ({
  container: {
    color: theme.colors.grey[13],
    fontSize: '0.875rem',
    margin: theme.spacing(2, 0),
    padding: theme.spacing(2, 1.45),
    fontWeight: 500
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(1)
  },
  headerText: {
    fontSize: '0.625rem',
    textTransform: 'uppercase'
  },
  main: {
    paddingLeft: theme.spacing(1),

    '& > div': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      margin: theme.spacing(1.25, 0),

      '& div:first-child': {
        marginRight: theme.spacing(1)
      }
    }
  },
  separator: {
    borderBottom: `1px solid ${theme.colors.grey[6]}`,
    paddingBottom: theme.spacing(1.25),
    display: 'block !important',

    '& > a': {
      textDecoration: 'none'
    }
  },
  textField: {
    maxWidth: 50,
    textAlign: 'left',
    backgroundColor: theme.colors.grey[2],

    '& > div': {
      padding: theme.spacing(0, 0.75),
      margin: '0px !important',
      display: 'flex',
      alignItems: 'center'
    },

    '& input': {
      backgroundColor: theme.colors.grey[2],
      color: theme.colors.grey[16],
      fontSize: '0.875rem',
      fontWeight: 500,
      outline: 'none',
      padding: theme.spacing(0),
      height: 25,

      '&::-webkit-inner-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
      },
      '&::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0
      }
    },

    '& fieldset': {
      border: `1px solid ${theme.colors.grey[6]}`,
      borderRadius: 4
    }
  },
  endAdornment: {
    padding: 0,
    margin: 0,
    height: '100%',
    maxHeight: '100%',

    '& > p': {
      fontSize: '0.7rem',
      fontWeight: 500,
      color: theme.colors.grey[16],
      lineHeight: 0
    }
  },
  value: {
    fontWeight: 600,
    color: theme.colors.grey[19]
  },
  searchBar: {
    width: 300
  }
}));

const SimilarityThreshold = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const [isEditable, setIsEditable] = useState(false);
  const [isGoodDefectEditable, setIsGoodDefectEditable] = useState(false);

  const { confusionModel } = useSelector(({ aiPerformance }) => aiPerformance);
  const models = useSelector(({ common }) => common.models);

  const { data = {}, isLoading } = useQuery(
    [confusionModel.id],
    context => api.getMlModelWeightedDefects(...context.queryKey),
    { enabled: !!confusionModel.id }
  );

  const [values, setValues] = useState({
    threshold: 0,
    goodDefect: [],
    goodDefectThreshold: 0
  });

  useEffect(() => {
    if (Object.keys(confusionModel).length) {
      setValues(d => ({
        ...d,
        threshold: Number(confusionModel.confidence_threshold ?? 0) * 100
      }));
    }
  }, [confusionModel]);

  useEffect(() => {
    if (data.results?.length > 0) {
      setIsGoodDefectEditable(true);

      setValues(d => ({
        ...d,
        goodDefect: [
          confusionModel.defects.find(d => d.id === data.results[0].defect)
        ],
        goodDefectThreshold: Number(data.results[0].weightage ?? 0) * 100
      }));
    }
  }, [data]);

  const disabled = !isEditable;

  const handleSave = async () => {
    setIsEditable(false);

    if (isGoodDefectEditable && !values.goodDefect.length) {
      setValues(d => ({ ...d, goodDefect: confusionModel.defects[0] }));
    }

    await api.updateModelById(confusionModel.id, {
      confidence_threshold: Number(values.threshold) / 100
    });

    if (isGoodDefectEditable) {
      const defect = values.goodDefect.length
        ? values.goodDefect[0]
        : confusionModel.defects[0];

      await api.updateMlModelWeightedDefects(confusionModel.id, defect.id, {
        weightage: Number(values.goodDefectThreshold) / 100
      });
    }

    dispatch(
      setConfusionModel({
        ...confusionModel,
        confidence_threshold: String(Number(values.threshold) / 100)
      })
    );

    queryClient.invalidateQueries('distributionAccuracy_cohort');
    queryClient.invalidateQueries('distributionAccuracy');
    queryClient.invalidateQueries('confusionMatrix');
    queryClient.invalidateQueries('usecaseDefects');
    queryClient.invalidateQueries('modelDefects');
    queryClient.invalidateQueries('missClassificationDefect');
    queryClient.invalidateQueries('overall');

    if (
      values.threshold !==
      Number(confusionModel.confidence_threshold) * 100
    ) {
      const idx = models.findIndex(d => d.id === confusionModel.id);
      const updatedModels = [...models];
      updatedModels[idx] = {
        ...updatedModels[idx],
        confidence_threshold: Number(values.threshold) / 100
      };
      dispatch(setModels(updatedModels));
    }
  };

  const handleDownload = () => {
    api.getSimilarityVsPerformanceCSV(confusionModel.id).then(data => {
      const filename = `${confusionModel.name}_similarity_vs_performance.csv`;
      const a = document.createElement('a');
      a.href = `data:text/csv;charset=utf-8,${encodeURI(data)}`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const onChangeHandler = value => {
    setValues(d => ({ ...d, threshold: value }));
  };

  return (
    <Paper elevation={1} className={classes.container}>
      <div className={classes.header}>
        <div className={classes.headerText}>Configure Similarity threshold</div>

        <WithCondition
          when={isEditable}
          then={<CommonButton onClick={handleSave} text='Save' />}
          or={
            <CommonButton
              onClick={() => setIsEditable(true)}
              text='Edit'
              variant='tertiary'
              icon={<FontAwesomeIcon icon={faPen} />}
            />
          }
        />
      </div>

      <div className={classes.main}>
        <div>
          <div>Similarity threshold for model:</div>

          <WithCondition
            when={isEditable}
            then={
              <SimilarityInputUpdate
                value={values.threshold}
                onChange={onChangeHandler}
                disabled={disabled}
              />
            }
            or={<div className={classes.value}>{values.threshold}%</div>}
          />
        </div>

        <div className={classes.separator}>
          <span
            style={{ color: '#007bff', cursor: 'pointer' }}
            onClick={handleDownload}
          >
            Download
          </span>{' '}
          similarity threshold vs performance CSV for this model
        </div>

        <div>
          <div>
            <SSSwitch
              checked={isGoodDefectEditable}
              value={isGoodDefectEditable}
              onChange={e => setIsGoodDefectEditable(e.target.checked)}
              disabled={disabled}
            />
          </div>

          <div>Configure separate threshold for Good defect</div>
        </div>

        <Show when={isGoodDefectEditable}>
          <div>
            <div>Select Good Defect:</div>

            <WithCondition
              when={isLoading}
              then={<CircularProgress size={12} />}
              or={
                <div className={classes.searchBar}>
                  <SearchBar
                    fullWidth
                    data={confusionModel.defects}
                    value={values.goodDefect}
                    setValue={val =>
                      setValues(d => ({ ...d, goodDefect: [val] }))
                    }
                    multiple={false}
                    variant='outlined'
                    placeholder='Select Good Defect'
                    disabled={disabled}
                  />
                </div>
              }
            />
          </div>

          <div>
            <div>Similarity threshold for Good defect:</div>

            <WithCondition
              when={isLoading}
              then={<CircularProgress size={12} />}
              or={
                <WithCondition
                  when={isEditable}
                  then={
                    <TextField
                      type='number'
                      value={values.goodDefectThreshold}
                      onChange={e => {
                        const { value } = e.target;
                        setValues(d => ({ ...d, goodDefectThreshold: value }));
                      }}
                      min='0'
                      max='100'
                      className={classes.textField}
                      size='small'
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            className={classes.endAdornment}
                            position='end'
                          >
                            %
                          </InputAdornment>
                        )
                      }}
                      disabled={disabled}
                    />
                  }
                  or={
                    <div className={classes.value}>
                      {values.goodDefectThreshold}%
                    </div>
                  }
                />
              }
            />
          </div>
        </Show>
      </div>
    </Paper>
  );
};

export default SimilarityThreshold;
