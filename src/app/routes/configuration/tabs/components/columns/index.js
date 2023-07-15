import {
  faPen,
  faToggleOff,
  faToggleOn,
  faTriangleExclamation
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import CommonButton from 'app/components/ReviewButton';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';

import classes from './columns.module.scss';

export const customColumnSort = (rowA, rowB) => {
  if (rowA > rowB) {
    return 1;
  }
  if (rowB > rowA) {
    return -1;
  }
  return 0;
};

export const systemConfigThreshold = [
  {
    name: 'Usecase',
    selector: 'name',
    sortable: true,
    sortFunction: (rowA, rowB) => customColumnSort(rowA.name, rowB.name)
  },
  {
    name: 'Auto-classification Threshold',
    selector: 'automation_conditions.threshold_percentage',
    cell: row =>
      row?.automation_conditions?.threshold_percentage ||
      row?.automation_conditions?.threshold_percentage === 0
        ? `${row?.automation_conditions?.threshold_percentage}%`
        : 'Not Set',
    sortable: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.threshold, rowB.threshold)
  }
];

export const systemConfigAutoAccuracyThreshold = [
  {
    name: 'Usecase',
    selector: 'name',
    sortable: true,
    sortFunction: (rowA, rowB) => customColumnSort(rowA.name, rowB.name)
  },
  {
    name: 'Auto-classification%',
    selector: 'automation_conditions.threshold_percentage',
    cell: row =>
      row?.automation_conditions?.threshold_percentage ||
      row?.automation_conditions?.threshold_percentage === 0
        ? `${row?.automation_conditions?.threshold_percentage}%`
        : 'Not Set',
    sortable: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(
        rowA?.automation_conditions?.threshold_percentage,
        rowB?.automation_conditions?.threshold_percentage
      )
  },
  {
    name: 'Accuracy',
    selector: 'automation_conditions.accuracy_threshold_percentage',
    cell: row =>
      row?.automation_conditions?.accuracy_threshold_percentage ||
      row?.automation_conditions?.accuracy_threshold_percentage === 0
        ? `${row?.automation_conditions?.accuracy_threshold_percentage}%`
        : 'Not Set',
    sortable: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(
        rowA?.automation_conditions?.accuracy_threshold_percentage,
        rowB?.automation_conditions?.accuracy_threshold_percentage
      )
  }
];

export const userRolesColumns = (onEdit, onDelete, conditionalCellStyles) => {
  return [
    {
      name: 'Name',
      selector: 'display_name',
      sortable: true,
      cell: row => (
        <div className={classes.userNameContainer}>
          <p>{row.display_name}</p>
          <Show when={!row.is_active}>
            <div className={classes.deactivateContainer}>
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <p>Deactivated</p>
            </div>
          </Show>
        </div>
      ),
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.display_name, rowB.display_name),
      minWidth: '300px',
      conditionalCellStyles
    },
    {
      name: '',
      selector: '',
      sortable: false,
      cell: row => {
        return (
          <Box
            width='100%'
            display='grid'
            gridAutoFlow='column'
            gridGap={10}
            justifyContent='flex-start'
          >
            <WithCondition
              when={row.is_active}
              then={
                <>
                  <CommonButton
                    onClick={() => onEdit(row.id)}
                    icon={<FontAwesomeIcon icon={faPen} />}
                    variant='tertiary'
                    text='Edit'
                    size='xs'
                  />

                  <CommonButton
                    onClick={() => onDelete(row)}
                    icon={<FontAwesomeIcon icon={faToggleOn} />}
                    variant='tertiary'
                    text='Deactivate'
                    size='xs'
                  />
                </>
              }
              or={
                <CommonButton
                  onClick={() => onEdit(row.id, true)}
                  icon={<FontAwesomeIcon icon={faToggleOff} />}
                  variant='tertiary'
                  text='Activate'
                  size='xs'
                />
              }
            />
          </Box>
        );
      },
      center: true
    },
    {
      name: 'Role',
      selector: row => (row.is_staff ? 'Admin' : 'Member'),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.is_staff, rowB.is_staff),
      conditionalCellStyles
    },
    {
      name: 'Login Id',
      selector: 'email',
      sortable: true,
      sortFunction: (rowA, rowB) => customColumnSort(rowA.email, rowB.email),
      conditionalCellStyles
    }
  ];
};
