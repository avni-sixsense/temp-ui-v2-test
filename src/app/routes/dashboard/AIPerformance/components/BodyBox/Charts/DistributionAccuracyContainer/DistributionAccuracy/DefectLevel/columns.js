import { Box, Tooltip } from '@material-ui/core';
import { ClickableTableCell } from 'app/components/VirtualTable/ClickableTableCell';
import {
  NumberFormater,
  formatPercentageValue,
  getAccuracyBackgroundColor
} from 'app/utils/helpers';

export const OnDemandDefectDataColumns = createURL => [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row: { original } }) => (
      <Box display='flex' alignItems='center'>
        <Box width='11px' pr='12px'>
          <Box
            style={{
              width: '9px',
              height: '10px',
              backgroundColor: getAccuracyBackgroundColor(
                original.recall_percentage
              ),
              marginRight: '6px'
            }}
          />
        </Box>
        <Tooltip title={original.name}>
          <div>{original.name}</div>
        </Tooltip>
      </Box>
    )
  },
  {
    header: 'Recall%',
    accessorFn: row => formatPercentageValue(row.recall_percentage)
  },
  {
    header: 'Precision%',
    accessorFn: row => formatPercentageValue(row.precision_percentage)
  },
  {
    header: 'Total Image',
    accessorKey: 'total',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          ground_truth_label__in: original.defect_id,
          is_inferenced: true
        })}
      />
    )
  },
  {
    header: 'Correct',
    accessorKey: 'correct',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          ground_truth_label__in: original.defect_id,
          is_accurate: true
        })}
      />
    )
  },
  {
    header: 'Missed',
    accessorKey: 'missed',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          ground_truth_label__in: original.defect_id,
          is_missed_defect: true
        })}
      />
    )
  },
  {
    header: 'Extra',
    accessorKey: 'extra',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          ai_predicted_label__in: original.defect_id,
          is_accurate: false
        })}
      />
    )
  }
];

export const UATDefectDataColumns = createURL => [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row: { original } }) => (
      <Box display='flex' alignItems='center'>
        <Box width='11px' pr='12px'>
          <Box
            style={{
              width: '9px',
              height: '10px',
              backgroundColor: getAccuracyBackgroundColor(
                original.recall_percentage
              ),
              marginRight: '6px'
            }}
          />
        </Box>
        <Tooltip title={original.name}>
          <div>{original.name}</div>
        </Tooltip>
      </Box>
    )
  },
  //   {
  //     header: 'Auto%',
  //     accessorKey: 'recall_percentage'
  //   },
  {
    header: 'Recall%',
    accessorFn: row => formatPercentageValue(row.recall_percentage)
  },
  {
    header: 'Precision%',
    accessorFn: row => formatPercentageValue(row.precision_percentage)
  },
  {
    header: 'Total Image',
    accessorKey: 'total',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          ground_truth_label__in: original.defect_id,
          is_inferenced: true
        })}
      />
    )
  },
  //   {
  //     header: 'Auto',
  //     accessorKey: 'auto'
  //   },
  //   {
  //     header: 'Manual',
  //     accessorKey: 'manual'
  //   },
  {
    header: 'Correct',
    accessorKey: 'correct',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          ground_truth_label__in: original.defect_id,
          is_accurate: true
        })}
      />
    )
  },
  {
    header: 'Missed',
    accessorKey: 'missed',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          ground_truth_label__in: original.defect_id,
          is_missed_defect: true
        })}
      />
    )
  },
  {
    header: 'Extra',
    accessorKey: 'extra',
    cell: ({ getValue, row: { original } }) => (
      <ClickableTableCell
        value={NumberFormater(getValue())}
        link={createURL({
          ai_predicted_label__in: original.defect_id,
          is_accurate: false
        })}
      />
    )
  }
];
