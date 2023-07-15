import { Box, Tooltip } from '@material-ui/core';
import { ClickableTableCell } from 'app/components/VirtualTable/ClickableTableCell';
import {
  NumberFormater,
  formatPercentageValue,
  getAccuracyBackgroundColor,
  getAutoClassificationAccuracyBackgroudColor
} from 'app/utils/helpers';

export const OnDemandWaferColumns = createURL => [
  {
    header: 'Name',
    accessorKey: 'wafer_name',
    cell: ({ row: { original } }) => (
      <Box display='flex' alignItems='center'>
        <Box width='11px' pr='12px'>
          <Box
            style={{
              width: '9px',
              height: '10px',
              backgroundColor: getAccuracyBackgroundColor(
                original.accuracy_percentage
              ),
              marginRight: '6px'
            }}
          />
        </Box>
        <Tooltip title={original.wafer_name}>
          <div>{original.wafer_name}</div>
        </Tooltip>
      </Box>
    )
  },
  {
    header: 'Accuracy%',
    accessorFn: row => formatPercentageValue(row.accuracy_percentage)
  },
  {
    header: 'Total',
    accessorKey: 'total_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          wafer_id__in: original.wafer_id,
          is_inferenced: true
        })}
      />
    )
  },
  {
    header: 'Audited',
    accessorKey: 'audited_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({ wafer_id__in: original.wafer_id, is_audited: true })}
      />
    )
  },
  {
    header: 'Correct',
    accessorKey: 'correct_classified_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({ wafer_id__in: original.wafer_id, is_accurate: true })}
      />
    )
  },
  {
    header: 'Incorrect',
    accessorKey: 'incorrect_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          wafer_id__in: original.wafer_id,
          is_accurate: false
        })}
      />
    )
  }
];

export const UATWaferColumns = createURL => [
  {
    header: 'Name',
    accessorKey: 'wafer_name',
    cell: ({ row: { original } }) => (
      <Box display='flex' alignItems='center'>
        <Box width='11px' pr='12px'>
          <Box
            style={{
              width: '9px',
              height: '10px',
              backgroundColor: getAutoClassificationAccuracyBackgroudColor(
                original.auto_classification_percentage,
                original.accuracy_percentage
              ),
              marginRight: '6px'
            }}
          />
        </Box>
        <Tooltip title={original.wafer_name}>
          <div>{original.wafer_name}</div>
        </Tooltip>
      </Box>
    )
  },
  {
    header: 'Auto%',
    accessorFn: row => formatPercentageValue(row.auto_classification_percentage)
  },
  {
    header: 'Accuracy%',
    accessorFn: row => formatPercentageValue(row.accuracy_percentage)
  },
  {
    header: 'Total',
    accessorKey: 'total_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          wafer_id__in: original.wafer_id,
          is_inferenced: true
        })}
      />
    )
  },
  {
    header: 'Auto',
    accessorKey: 'auto_classified_fileset_count'
  },
  {
    header: 'Manual',
    accessorKey: 'manual_classified_fileset_count'
  },
  {
    header: 'Audited',
    accessorKey: 'audited_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({ wafer_id__in: original.wafer_id, is_audited: true })}
      />
    )
  },
  {
    header: 'Correct',
    accessorKey: 'correct_classified_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({ wafer_id__in: original.wafer_id, is_accurate: true })}
      />
    )
  },
  {
    header: 'Incorrect',
    accessorKey: 'incorrect_fileset_count',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          wafer_id__in: original.wafer_id,
          is_accurate: false
        })}
      />
    )
  }
];
