import { Tooltip } from '@material-ui/core';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import QuestionMark from 'assests/images/icons/questionMark';
import Dialog from '@material-ui/core/Dialog';
import CommonButton from 'app/components/ReviewButton';
import { makeStyles } from '@material-ui/core/styles';
import { FilterAsync } from 'app/components/FiltersV2';
import { useParams } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import { useState } from 'react';
import api from 'app/api';
import Show from 'app/hoc/Show';

const useStyles = makeStyles(theme => ({
  root: {
    width: 900,
    borderRadius: '4px',
    color: theme.colors.grey[20]
  },
  header: {
    padding: '12px 12px 8px 12px',
    fontSize: 14,
    fontWeight: 600,
    borderBottom: `1px solid ${theme.colors.grey[4]}`
  },
  body: {
    padding: '8px 12px 8px 12px',
    fontSize: 14
  },
  filterOne: {
    color: '#3E5680',
    borderBottom: '1px solid #E8F2FE',
    padding: '0px 0px 16px 0px'
  },
  filterTwo: {
    color: '#3E5680',
    margin: '12px 0px 16px 0px'
  },
  checkboxContainer: {
    marginBottom: 8
  },
  footer: {
    padding: 12,
    fontSize: 14,
    display: 'flex',
    background: '#F0F7FF'
  },
  buttonRight: {
    marginLeft: 12
  },
  dark: {
    fontWeight: 600
  },
  svg: {
    marginLeft: 6
  }
}));

const DailogBox = ({
  toggleDialogueBox,
  isChecked,
  toggleIsChecked,
  inDistributionFilters,
  setInDistributionFilters,
  outDistributionFilters,
  setOutDistributionFilters,
  inDistributionPrimaryFilters,
  outDistributionPrimaryFilters
}) => {
  const classes = useStyles();

  const { modelId } = useParams();

  const [inDistributionLocal, setInDistributionLocal] = useState(
    inDistributionFilters
  );
  const [outDistributionLocal, setOutDistributionLocal] = useState(
    outDistributionFilters
  );

  const [isCheckedLocal, setIsCheckedLocal] = useState(isChecked);

  const toggleIsCheckedLocal = () =>
    setIsCheckedLocal(isCheckedLocal => !isCheckedLocal);

  const onSubmiHandler = async () => {
    toggleIsChecked(isCheckedLocal);

    const params = {
      similarity_vs_perf_filters: {
        indistribution_filters: inDistributionLocal,
        outdistribution_filters: isCheckedLocal ? outDistributionLocal : {}
      }
    };

    api.saveFiltersJSON({ modelId, params });

    setInDistributionFilters(inDistributionLocal);
    setOutDistributionFilters(outDistributionLocal);

    toggleDialogueBox();
  };

  const filterConfig = [
    {
      text: 'In distribution data',
      filters: (
        <FilterAsync
          primaryFilters={inDistributionPrimaryFilters}
          data={inDistributionLocal}
          setData={setInDistributionLocal}
        />
      ),
      checkboxContainer: null,
      className: classes.filterOne,
      tooltipLabel:
        'Images with defect labels (ground truth) on which the model was trained '
    },
    {
      text: 'Out distribution data',
      filters: isCheckedLocal ? (
        <FilterAsync
          primaryFilters={outDistributionPrimaryFilters}
          data={outDistributionLocal}
          setData={setOutDistributionLocal}
        />
      ) : null,
      checkboxContainer: (
        <CustomizedCheckbox
          checked={isCheckedLocal}
          onChange={toggleIsCheckedLocal}
          label='Plot graph on out of distribution data'
          lightTheme
        />
      ),
      className: classes.filterTwo,
      tooltipLabel:
        'Images with defect labels (ground truth) other than the training ones'
    }
  ];

  return (
    <Dialog maxWidth='xl' open disableEnforceFocus>
      <Box className={classes.root}>
        <Box className={classes.header}>Change filters</Box>

        <Box className={classes.body}>
          <Box>
            {filterConfig.map(
              (
                { text, filters, checkboxContainer, className, tooltipLabel },
                i
              ) => {
                return (
                  <Box key={i} className={className}>
                    {checkboxContainer && (
                      <Box className={classes.checkboxContainer}>
                        <CustomizedCheckbox
                          checked={isCheckedLocal}
                          onChange={toggleIsCheckedLocal}
                          label='Plot graph on out of distribution data'
                          lightTheme
                        />
                      </Box>
                    )}
                    <Show when={filters}>
                      <Box>
                        {text}
                        <Tooltip title={tooltipLabel}>
                          <span className={classes.svg}>
                            <QuestionMark
                              width='10'
                              height='12'
                              color='#3E5680'
                            />
                          </span>
                        </Tooltip>
                      </Box>
                    </Show>
                    <Box>{filters}</Box>
                  </Box>
                );
              }
            )}
          </Box>
        </Box>

        <Box className={classes.footer}>
          <CommonButton
            onClick={onSubmiHandler}
            text='Apply filters & generate graph'
          />
          <CommonButton
            variant='tertiary'
            wrapperClass={classes.buttonRight}
            onClick={toggleDialogueBox}
            text='No, Cancel'
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export { DailogBox };
