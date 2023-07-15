import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import dayjs from 'dayjs';

import { CircularProgress } from '@material-ui/core';

import Show from 'app/hoc/Show';

import { selectActiveFileSet } from 'store/reviewData/selector';

import { snakeCaseToWords } from 'app/utils';
import { timeZone } from 'app/utils/helpers';

import classes from './Information.module.scss';

const mapReviewState = createStructuredSelector({
  fileSet: selectActiveFileSet
});

function getFileSetInfo(fileSet, useCases, wafers) {
  return [
    { label: 'Name', value: fileSet.files?.[0]?.name },
    ...Object.entries(fileSet.meta_info).map(([key, value]) => ({
      label: snakeCaseToWords(key),
      value
    })),
    { label: 'Folder', value: fileSet.upload_session_name },
    { label: 'Usecase', value: useCases[fileSet.use_case]?.name },
    { label: 'Wafer Id', value: wafers[fileSet.wafer]?.organization_wafer_id },
    {
      label: 'Created',
      value: dayjs(fileSet.created_ts)
        .tz(timeZone)
        .format('hh:mm A, DD MMM YYYY')
    },
    {
      label: 'Last Modified',
      value: dayjs(fileSet.updated_ts)
        .tz(timeZone)
        .format('hh:mm A, DD MMM YYYY')
    }
  ];
}

export const Information = () => {
  const { fileSet } = useSelector(mapReviewState);
  const { usecases, wafers } = useSelector(({ helpers }) => helpers);

  if (!Object.keys(fileSet).length) return <CircularProgress size={30} />;

  return getFileSetInfo(fileSet, usecases, wafers).map(({ label, value }) => (
    <Show when={!!value} key={label}>
      <div className={classes.information}>
        <span className={classes.label}>{label}</span>
        <span>{value}</span>
      </div>
    </Show>
  ));
};
