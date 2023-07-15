import { faExclamationTriangle } from '@fortawesome/pro-light-svg-icons';
import { faCheck, faTag, faWebcam } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CommonButton from 'app/components/ReviewButton';
import ReviewTags from 'app/components/ReviewTags';
import TruncateText from 'app/components/TruncateText';
import {
  NumberFormater,
  timeZone,
  formatPercentageValue
} from 'app/utils/helpers';
import GenerateFileAnimation from './GenerateFileAnimation';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import styles from './Columns.module.scss';

import { AUDIT, CLASSIFY } from 'store/aiPerformance/constants';
import { ClickableTableCell } from 'app/components/VirtualTable/ClickableTableCell';

const statusDict = {
  auto_classified: 'Auto Classified',
  manual_classification_pending: 'Pending Manual',
  manually_classified: 'Manually Classified',
  error: 'Failed to classify',
  pending: 'Pending'
};

export const customColumnSort = (rowA, rowB) => {
  if (rowA > rowB) {
    return 1;
  }
  if (rowB > rowA) {
    return -1;
  }
  return 0;
};

export const columns = [
  {
    name: 'Usecase name',
    selector: row => row.use_case_name,
    sortable: true
  },
  {
    name: 'Auto-classification',
    selector: row => `${row.auto_classified_percentage}%`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(
        rowA.auto_classified_percentage,
        rowB.auto_classified_percentage
      )
  },
  {
    name: 'Accuracy',
    selector: row => `${row.accuracy_percentage}%`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.accuracy_percentage, rowB.accuracy_percentage)
  },
  {
    name: 'Auto-classification Drop due to Usecase',
    selector: row => `${row.auto_classification_drop}%`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(
        rowA.auto_classification_drop,
        rowB.auto_classification_drop
      )
  },
  {
    name: 'Accuracy drop due to Usecase',
    selector: row => `${row.accuracy_drop}%`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.accuracy_drop, rowB.accuracy_drop)
  }
];

export const usecaseDistributionWaferColumns = modalPerformanceURLHandler => {
  return [
    {
      header: 'Model',
      accessorKey: 'ml_model_name',
      cell: ({ row: { original: row } }) => (
        <Tooltip title={row.ml_model_name}>
          <Link
            to={modalPerformanceURLHandler({
              ml_model_id__in: row.ml_model_id
            })}
          >
            {row.ml_model_name}
          </Link>
        </Tooltip>
      )
    },
    {
      header: 'Usecase',
      accessorKey: 'use_case_name',
      cell: ({ row: { original: row } }) => {
        return (
          <Tooltip title={row.use_case_name}>
            <Typography>{row.use_case_name}</Typography>
          </Tooltip>
        );
      }
    },
    {
      header: 'Similarity Threshold%',
      accessorFn: row =>
        formatPercentageValue(row.similarity_threshold_percentage)
    },
    {
      header: 'Successful%',
      accessorFn: row =>
        formatPercentageValue(
          (row.successful_wafer_count / row.total_wafer_count) * 100
        )
    },
    {
      header: 'Auto%',
      accessorFn: row =>
        formatPercentageValue(
          (row.auto_classified_wafer_count / row.total_wafer_count) * 100
        )
    },
    {
      header: 'Total',
      accessorKey: 'total_wafer_count',
      cell: info => NumberFormater(info.getValue())
    },
    {
      header: 'Auto',
      accessorKey: 'auto_classified_wafer_count',
      cell: info => NumberFormater(info.getValue())
    },
    {
      header: 'Manual',
      accessorKey: 'manual_wafer_count',
      cell: info => NumberFormater(info.getValue())
    },
    {
      header: 'Successful',
      accessorKey: 'successful_wafer_count',
      cell: info => NumberFormater(info.getValue())
    }
  ];
};

export const usecaseDistributionFileColumns = (
  createURL,
  classes,
  modalPerformanceURLHandler
) => {
  return [
    {
      header: 'Model',
      accessorKey: 'ml_model_name',
      cell: ({ row: { original: row } }) => (
        <Box display='flex' alignItems='center'>
          <Tooltip title={row.ml_model_name}>
            <Link
              to={modalPerformanceURLHandler({
                ml_model_id__in: row.ml_model_id
              })}
            >
              {row.ml_model_name}
            </Link>
          </Tooltip>
        </Box>
      )
    },
    {
      header: 'Usecase',
      accessorKey: 'use_case_name',
      cell: ({ row: { original: row } }) => {
        return (
          <Tooltip title={row.use_case_name}>
            <Typography>{row.use_case_name}</Typography>
          </Tooltip>
        );
      }
    },
    {
      header: 'Similarity Threshold%',
      accessorFn: row => {
        return formatPercentageValue(row.similarity_threshold_percentage);
      }
    },
    {
      header: 'Auto%',
      accessorFn: row =>
        formatPercentageValue(
          (row.auto_classified_fileset_count / row.total_images) * 100
        )
    },
    {
      header: 'Accuracy%',
      accessorFn: row =>
        formatPercentageValue(
          (row.accurate_fileset_count / row.auto_classified_fileset_count) * 100
        )
    },
    {
      header: 'Total',
      accessorKey: 'total_images',
      cell: ({ row: { original: row } }) => (
        <Link
          className={classes.clickableCell}
          to={createURL({
            is_inferenced: true,
            ml_model_id__in: row.ml_model_id
          })}
        >
          {NumberFormater(row.total_images)}
        </Link>
      )
    },
    {
      header: 'Auto',
      accessorKey: 'auto_classified_fileset_count',
      cell: ({ row: { original: row } }) => (
        <Link
          className={classes.clickableCell}
          to={createURL({
            is_confident_defect: true,
            ml_model_id__in: row.ml_model_id
          })}
        >
          {NumberFormater(row.auto_classified_fileset_count)}
        </Link>
      )
    },
    {
      header: 'Manual',
      accessorKey: 'manual_fileset_count',
      cell: ({ row: { original: row } }) => (
        <Link
          className={classes.clickableCell}
          to={createURL({
            is_confident_defect: false,
            ml_model_id__in: row.ml_model_id
          })}
        >
          {NumberFormater(row.manual_fileset_count)}
        </Link>
      )
    },
    {
      header: 'Audited',
      accessorKey: 'audited_fileset_count',
      cell: ({ row: { original: row } }) => (
        <Link
          className={classes.clickableCell}
          to={createURL({
            is_audited: true,
            ml_model_id__in: row.ml_model_id
          })}
        >
          {NumberFormater(row.audited_fileset_count)}
        </Link>
      )
    },
    {
      header: 'Correct',
      accessorKey: 'accurate_fileset_count',
      cell: ({ row: { original: row } }) => (
        <Link
          className={classes.clickableCell}
          to={createURL({
            is_accurate: true,
            ml_model_id__in: row.ml_model_id
          })}
        >
          {NumberFormater(row.accurate_fileset_count)}
        </Link>
      )
    },
    {
      header: 'Incorrect',
      accessorFn: row => row.audited_fileset_count - row.accurate_fileset_count,
      cell: ({ row: { original: row } }) => (
        <Link
          className={classes.clickableCell}
          to={createURL({
            is_accurate: false,
            ml_model_id__in: row.ml_model_id
          })}
        >
          {NumberFormater(
            row.audited_fileset_count - row.accurate_fileset_count
          )}
        </Link>
      )
    }
  ];
};

export const lotColumns = [
  {
    name: 'Name',
    selector: row => {
      if (row.auto_percentage >= 90 && row.accuracy >= 90) {
        return (
          <Box display='flex' alignItems='center'>
            <Box
              style={{
                width: '9px',
                height: '10px',
                backgroundColor: '#37AB87',
                marginRight: '6px'
              }}
            />
            {row.name}
          </Box>
        );
      }
      if (row.auto_percentage >= 90 && row.accuracy < 90) {
        return (
          <Box display='flex' alignItems='center'>
            <Box
              style={{
                width: '9px',
                height: '10px',
                backgroundColor: '#FDE68A',
                marginRight: '6px'
              }}
            />
            {row.name}
          </Box>
        );
      }
      if (row.auto_percentage < 90 && row.accuracy >= 90) {
        return (
          <Box display='flex' alignItems='center'>
            <Box
              style={{
                width: '9px',
                height: '10px',
                backgroundColor: 'rgba(217, 119, 6, 0.6)',
                marginRight: '6px'
              }}
            />
            {row.name}
          </Box>
        );
      }
      if (row.auto_percentage < 90 && row.accuracy < 90) {
        return (
          <Box display='flex' alignItems='center'>
            <Box
              style={{
                width: '9px',
                height: '10px',
                backgroundColor: '#FB7185',
                marginRight: '6px'
              }}
            />
            {row.name}
          </Box>
        );
      }
      return '';
    },
    sortable: true
  },
  {
    name: 'Total',
    selector: row => NumberFormater(row.total),
    sortable: true,
    center: true
  },
  {
    name: 'Auto',
    selector: row => `${row.auto !== 0 && !row.auto ? 'N/A' : row.auto}`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) => customColumnSort(rowA.auto, rowB.auto)
  },
  {
    name: 'Manual',
    selector: row => `${row.manual !== 0 && !row.manual ? 'N/A' : row.manual}`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) => customColumnSort(rowA.manual, rowB.manual)
  },
  {
    name: 'Auto%',
    selector: row =>
      `${
        row.auto_percentage !== 0 && !row.auto_percentage
          ? 'N/A'
          : `${row.auto_percentage}%`
      }`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.auto_percentage, rowB.auto_percentage)
  },
  {
    name: 'Incorrect',
    selector: row =>
      `${row.incorrect !== 0 && !row.incorrect ? 'N/A' : row.incorrect}`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.incorrect, rowB.incorrect)
  },
  {
    name: 'Correct',
    selector: row =>
      `${row.correct !== 0 && !row.correct ? 'N/A' : row.correct}`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) => customColumnSort(rowA.correct, rowB.correct)
  },
  {
    name: 'Accuracy%',
    selector: row =>
      `${row.accuracy !== 0 && !row.accuracy ? 'N/A' : `${row.accuracy}%`}`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) => customColumnSort(rowA.accuracy, rowB.accuracy)
  }
];

export const defectColumns = [
  {
    name: 'Defect name',
    selector: row => row.gt_defect.name,
    sortable: true
  },
  {
    name: 'Total',
    selector: row => NumberFormater(row.total),
    sortable: true,
    center: true
  },
  {
    name: 'Auto-classification%',
    selector: row =>
      `${
        row.auto_classified_percentage !== 0 && !row.auto_classified_percentage
          ? 'N/A'
          : `${row.auto_classified_percentage}%`
      }`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(
        rowA.auto_classified_percentage,
        rowB.auto_classified_percentage
      )
  },
  {
    name: 'Correctly classified%',
    selector: row =>
      `${
        row.accuracy_percentage !== 0 && !row.accuracy_percentage
          ? 'N/A'
          : `${row.accuracy_percentage}%`
      }`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.accuracy_percentage, rowB.accuracy_percentage)
  },
  {
    name: 'Missed',
    selector: row =>
      `${
        row.missed_percentage !== 0 && !row.missed_percentage
          ? 'N/A'
          : `${row.missed_percentage}%`
      }`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.missed_percentage, rowB.missed_percentage)
  },
  {
    name: 'Extras',
    selector: row =>
      `${
        row.extra_percentage !== 0 && !row.extra_percentage
          ? 'N/A'
          : `${row.extra_percentage}%`
      }`,
    sortable: true,
    center: true,
    sortFunction: (rowA, rowB) =>
      customColumnSort(rowA.extra_percentage, rowB.extra_percentage)
  }
];

export const misClassificationColumns = ({
  createURL,
  setDialogBoxConfig = () => null,
  misclassificationImagesRowIds
}) => {
  return [
    {
      header: 'AI PREDICTION',
      accessorFn: row =>
        row.ai_defect_id === -1
          ? 'No Inference'
          : `${row.ai_defect.organization_defect_code} - ${row.ai_defect.name}`,
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.ai_defect.name, rowB.ai_defect.name)
    },
    {
      header: 'Label',
      accessorFn: row =>
        row.gt_defect_id === -1
          ? 'No GT'
          : `${row.gt_defect.organization_defect_code} - ${row.gt_defect.name}`,
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.gt_defect.name, rowB.gt_defect.name)
    },
    {
      header: 'Misclassification %',
      accessorKey: 'misclassification_percent',
      cell: ({ row: { original: row } }) => (
        <ClickableTableCell
          value={formatPercentageValue(row.misclassification_percent)}
          link={createURL(row.ai_defect_id, row.gt_defect_id)}
        />
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(
          rowA.misclassification_percent,
          rowB.misclassification_percent
        )
    },
    {
      header: 'Misclassification Count',
      accessorKey: 'misclassification_count',
      cell: ({ row: { original: row } }) => (
        <ClickableTableCell
          value={NumberFormater(row.misclassification_count)}
          link={createURL(row.ai_defect_id, row.gt_defect_id)}
        />
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.ai_defect_id, rowB.ai_defect_id),
      center: true
    },
    {
      header: 'Similar Training Images',
      cell: ({
        row: {
          original: {
            gt_defect,
            ai_defect,
            ai_defect_id,
            gt_defect_id,
            model_organization_defect_code,
            gt_organization_defect_code
          }
        }
      }) => {
        const id = `${ai_defect_id}${gt_defect_id}`;

        return misclassificationImagesRowIds[id] ? (
          <GenerateFileAnimation />
        ) : (
          <CommonButton
            wrapperClass={styles.buttonWrapper}
            text='Generate'
            onClick={() => {
              setDialogBoxConfig({
                gtDefectName: gt_defect.name,
                modalDefectName: ai_defect.name,
                id,
                modalDefectId: ai_defect_id,
                gtDefectId: gt_defect_id,
                modelOrganizationDefectCode: model_organization_defect_code,
                gtOrganizationDefectCode: gt_organization_defect_code
              });
            }}
          />
        );
      }
    }
  ];
};

export const distributionAccuracyColumn = (createURL, classes) => {
  return [
    {
      name: 'Name',
      selector: row => {
        if (row.accuracy_percentage === null) {
          return (
            <Box width='100%' display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: 'rgba(251, 113, 133, 0.4)',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        if (row.accuracy_percentage >= 90) {
          return (
            <Box width='100%' display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#6FCF97',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        if (row.accuracy_percentage >= 80) {
          return (
            <Box width='100%' display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FDE68A',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        if (row.accuracy_percentage < 80) {
          return (
            <Box width='100%' display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FB7185',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        return '';
      },
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(
          rowA.organization_wafer_id,
          rowB.organization_wafer_id
        ),
      wrap: true
    },
    {
      name: 'Total Images',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            wafer_id__in: row.wafer_id,
            is_latest_inferenced_model: true
          })}
        >
          {NumberFormater(row.total)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) => customColumnSort(rowA.total, rowB.total),
      center: true
      // width: '100px',
    },
    {
      name: 'Audited Images',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ wafer_id__in: row.wafer_id, is_audited: true })}
        >
          {NumberFormater(row.audited)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.audited, rowB.audited),
      center: true
      // width: '100px',
    },
    {
      name: 'Incorrect',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ wafer_id__in: row.wafer_id, is_accurate: false })}
        >
          {NumberFormater(row.inaccurate)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.inaccurate, rowB.inaccurate),
      center: true
      // width: '100px',
    },
    {
      name: 'Correct',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ wafer_id__in: row.wafer_id, is_accurate: true })}
        >
          {NumberFormater(row.accurate)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.accurate, rowB.accurate),
      center: true
      // width: '100px',
    },
    {
      name: 'Accuracy%',
      selector: row =>
        `${
          row.accuracy_percentage !== 0 && !row.accuracy_percentage
            ? 'N/A'
            : `${row.accuracy_percentage}%`
        }`,
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.accuracy_percentage, rowB.accuracy_percentage)
      // width: '100px',
    }
    // {
    // 	name: 'Audit date',
    // 	selector: (row) => `${row.correct !== 0 && !row.correct ? 'N/A' : row.correct}`,
    // 	sortable: true,
    // 	center: true,
    // 	sortFunction: (rowA, rowB) => customColumnSort(rowA.correct, rowB.correct),
    // },
  ];
};

export const distributionAutoClassificationAccuracyFolderColumn = (
  createURL,
  classes
) => {
  return [
    {
      name: 'Name',
      selector: row => {
        if (row.accuracy_percentage === null) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: 'rgba(251, 113, 133, 0.4)',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.upload_session_name}</Box>
            </Box>
          );
        }
        if (
          row.auto_classified_percentage >= 93 &&
          row.accuracy_percentage >= 90
        ) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#6FCF97',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.upload_session_name}</Box>
            </Box>
          );
        }
        if (
          row.auto_classified_percentage >= 93 &&
          row.accuracy_percentage < 90
        ) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FDE68A',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.upload_session_name}</Box>
            </Box>
          );
        }
        if (
          row.auto_classified_percentage < 93 &&
          row.accuracy_percentage >= 90
        ) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: 'rgba(217, 119, 6, 0.6)',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.upload_session_name}</Box>
            </Box>
          );
        }
        if (
          row.auto_classified_percentage < 93 &&
          row.accuracy_percentage < 90
        ) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FB7185',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.upload_session_name}</Box>
            </Box>
          );
        }
        return '';
      },
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.upload_session_name, rowB.upload_session_name),
      wrap: true
    },
    {
      name: 'Auto %',
      selector: row => (
        <Box
        // onClick={() => onClick({ upload_session_id__in: row.upload_session_id, is_confident_defect: true })}
        // style={{ cursor: 'pointer' }}
        >{`${
          row.auto_classified_percentage !== 0 &&
          !row.auto_classified_percentage
            ? 'N/A'
            : `${row.auto_classified_percentage}%`
        }`}</Box>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(
          rowA.auto_classified_percentage,
          rowB.auto_classified_percentage
        ),
      width: '90px'
    },
    {
      name: 'Accuracy%',
      selector: row => (
        <Box
        // onClick={() => onClick({ upload_session_id__in: row.upload_session_id, is_accurate: true })}
        // style={{ cursor: 'pointer' }}
        >{`${
          row.accuracy_percentage !== 0 && !row.accuracy_percentage
            ? 'N/A'
            : `${row.accuracy_percentage}%`
        }`}</Box>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.accuracy_percentage, rowB.accuracy_percentage),
      width: '90px'
    },
    {
      name: 'Total',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ upload_session_id__in: row.upload_session_id })}
        >
          {NumberFormater(row.total)}
        </Link>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) => customColumnSort(rowA.total, rowB.total)
    },
    {
      name: 'Auto',
      selector: row => (
        <Box
        // onClick={() => onClick({ upload_session_id__in: row.upload_session_id, is_confident_defect: true })}
        // style={{ cursor: 'pointer' }}
        >
          {NumberFormater(row.auto_classified)}
        </Box>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.auto_classified, rowB.auto_classified),
      center: true,
      width: '90px'
    },
    {
      name: 'Manual',
      selector: row => (
        <Box
        // onClick={() =>
        // 	onClick({ upload_session_id__in: row.upload_session_id, is_confident_defect: false })
        // }
        // style={{ cursor: 'pointer' }}
        >
          {NumberFormater(row.manual)}
        </Box>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) => customColumnSort(rowA.manual, rowB.manual),
      center: true,
      width: '90px'
    },
    {
      name: 'Audited',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            upload_session_id__in: row.upload_session_id,
            is_audited: true
          })}
        >
          {NumberFormater(row.audited)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.audited, rowB.audited),
      center: true,
      width: '90px'
    },
    {
      name: 'Incorrect',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            upload_session_id__in: row.upload_session_id,
            is_accurate: false
          })}
        >
          {NumberFormater(row.inaccurate)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.inaccurate, rowB.inaccurate),
      center: true,
      width: '90px'
    },
    {
      name: 'Correct',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            upload_session_id__in: row.upload_session_id,
            is_accurate: true
          })}
        >
          {NumberFormater(row.accurate)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.accurate, rowB.accurate),
      center: true,
      width: '90px'
    }
  ];
};

export const distributionAutoClassificationAccuracyWaferColumn = (
  createURL,
  classes
) => {
  return [
    {
      name: 'Name',
      selector: row => {
        if (row.accuracy_percentage === 90) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: 'rgba(251, 113, 133, 0.4)',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        if (
          row.auto_classified_percentage >= 93 &&
          row.accuracy_percentage >= 90
        ) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#6FCF97',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        if (
          row.auto_classified_percentage >= 93 &&
          row.accuracy_percentage < 90
        ) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FDE68A',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        if (
          row.auto_classified_percentage < 93 &&
          row.accuracy_percentage >= 90
        ) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: 'rgba(217, 119, 6, 0.6)',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        if (
          row.auto_classified_percentage < 93 &&
          row.accuracy_percentage < 90
        ) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FB7185',
                  marginRight: '6px'
                }}
              />
              <Box width='100%'>{row.organization_wafer_id}</Box>
            </Box>
          );
        }
        return '';
      },
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(
          rowA.organization_wafer_id,
          rowB.organization_wafer_id
        ),
      wrap: true
    },
    {
      name: 'Auto %',
      selector: row => (
        <Box
        // onClick={() => onClick({ wafer_id__in: row.wafer_id, is_confident_defect: true })}
        // style={{ cursor: 'pointer' }}
        >{`${
          row.auto_classified_percentage !== 0 &&
          !row.auto_classified_percentage
            ? 'N/A'
            : `${row.auto_classified_percentage}%`
        }`}</Box>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(
          rowA.auto_classified_percentage,
          rowB.auto_classified_percentage
        ),
      width: '90px'
    },
    {
      name: 'Accuracy%',
      selector: row => (
        <Box
        // onClick={() => onClick({ wafer_id__in: row.wafer_id, is_accurate: true })}
        // style={{ cursor: 'pointer' }}
        >{`${
          row.accuracy_percentage !== 0 && !row.accuracy_percentage
            ? 'N/A'
            : `${row.accuracy_percentage}%`
        }`}</Box>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.accuracy_percentage, rowB.accuracy_percentage),
      width: '90px'
    },
    {
      name: 'Total',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ wafer_id__in: row.wafer_id })}
        >
          {NumberFormater(row.total)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) => customColumnSort(rowA.total, rowB.total),
      center: true,
      width: '90px'
    },
    {
      name: 'Auto',
      selector: row => (
        <Box
        // onClick={() => onClick({ wafer_id__in: row.wafer_id, is_confident_defect: true })}
        // style={{ cursor: 'pointer' }}
        >
          {NumberFormater(row.auto_classified)}
        </Box>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.auto_classified, rowB.auto_classified),
      center: true,
      width: '90px'
    },
    {
      name: 'Manual',
      selector: row => (
        <Box
        // onClick={() => onClick({ wafer_id__in: row.wafer_id, is_confident_defect: false })}
        // style={{ cursor: 'pointer' }}
        >
          {NumberFormater(row.manual)}
        </Box>
      ),
      sortable: true,
      center: true,
      width: '90px'
    },
    {
      name: 'Audited',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ wafer_id__in: row.wafer_id, is_audited: true })}
        >
          {NumberFormater(row.audited)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.audited, rowB.audited),
      center: true,
      width: '90px'
    },
    {
      name: 'Correct',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ wafer_id__in: row.wafer_id, is_accurate: true })}
        >
          {NumberFormater(row.accurate)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.accurate, rowB.accurate),
      center: true,
      width: '90px'
    },
    {
      name: 'Incorrect',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ wafer_id__in: row.wafer_id, is_accurate: false })}
        >
          {NumberFormater(row.inaccurate)}
        </Link>
      ),
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.inaccurate, rowB.inaccurate),
      center: true,
      width: '90px'
    }
  ];
};

export const distributionAccuracyDefectColumn = (createURL, classes) => {
  return [
    {
      name: 'Name',
      selector: row => {
        if (row.recall_percentage === null) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: 'rgba(251, 113, 133, 0.4)',
                  marginRight: '6px'
                }}
              />
              <Box width='80%'>{`${row.gt_defect.name} (${row.gt_organization_defect_code})`}</Box>
            </Box>
          );
        }
        if (row.recall_percentage >= 90) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#6FCF97',
                  marginRight: '6px'
                }}
              />
              <Box width='80%'>{`${row.gt_defect.name} (${row.gt_organization_defect_code})`}</Box>
            </Box>
          );
        }
        if (row.recall_percentage >= 80) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FDE68A',
                  marginRight: '6px'
                }}
              />
              <Box width='80%'>{`${row.gt_defect.name} (${row.gt_organization_defect_code})`}</Box>
            </Box>
          );
        }
        if (row.recall_percentage < 80) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FB7185',
                  marginRight: '6px'
                }}
              />
              <Box width='80%'>{`${row.gt_defect.name} (${row.gt_organization_defect_code})`}</Box>
            </Box>
          );
        }
        return '';
      },
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.gt_defect.name, rowB.gt_defect.name),
      grow: 3
    },
    {
      name: 'Auto%',
      selector: row =>
        row.auto_classified_percentage || row.auto_classified_percentage === 0
          ? `${row.auto_classified_percentage}%`
          : 'N/A',
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(
          rowA.auto_classified_percentage,
          rowB.auto_classified_percentage
        )
    },
    {
      name: 'Recall%',
      selector: row =>
        row.recall_percentage || row.recall_percentage === 0
          ? `${row.recall_percentage}%`
          : 'N/A',
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.recall_percentage, rowB.recall_percentage)
    },
    {
      name: 'Precision%',
      selector: row =>
        row.precision_percentage || row.precision_percentage === 0
          ? `${row.precision_percentage}%`
          : 'N/A',
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.precision_percentage, rowB.precision_percentage)
    },

    {
      name: 'Total Images',
      selector: row => (
        <Link
          className={classes}
          to={createURL({ ground_truth_label__in: row.gt_defect_id })}
        >
          {row.total}
        </Link>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) => customColumnSort(rowA.total, rowB.total)
    },
    {
      name: 'Auto',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            ground_truth_label__in: row.gt_defect_id,
            is_confident_defect: true
          })}
        >
          {NumberFormater(row.auto_classified)}
        </Link>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.auto_classified, rowB.auto_classified)
    },

    {
      name: 'Manual',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            ground_truth_label__in: row.gt_defect_id,
            is_confident_defect: false
          })}
        >
          {NumberFormater(row.total - row.auto_classified)}
        </Link>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(
          rowA.total - rowA.auto_classified,
          rowB.total - rowB.auto_classified
        )
    },
    {
      name: 'Correct',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            ground_truth_label__in: row.gt_defect_id,
            is_accurate: true
          })}
        >
          {NumberFormater(row.accurate)}
        </Link>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.accurate, rowB.accurate)
    },
    {
      name: 'Missed',
      selector: row => NumberFormater(row.missed),
      sortable: true,
      center: true
    },
    {
      name: 'Extra',
      selector: row => NumberFormater(row.extra),
      sortable: true,
      center: true
    }
  ];
};

export const distributionAccuracyDefectOnDemandColumn = (
  createURL,
  classes
) => {
  return [
    {
      name: 'Name',
      selector: row => {
        if (row.recall_percentage === null) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: 'rgba(251, 113, 133, 0.4)',
                  marginRight: '6px'
                }}
              />
              <Box width='80%'>{`${row.gt_defect.name} (${row.gt_organization_defect_code})`}</Box>
            </Box>
          );
        }
        if (row.recall_percentage >= 90) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#6FCF97',
                  marginRight: '6px'
                }}
              />
              <Box width='80%'>{`${row.gt_defect.name} (${row.gt_organization_defect_code})`}</Box>
            </Box>
          );
        }
        if (row.recall_percentage >= 80) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                width='14px'
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FDE68A',
                  marginRight: '6px'
                }}
              />
              <Box width='80%'>{`${row.gt_defect.name} (${row.gt_organization_defect_code})`}</Box>
            </Box>
          );
        }
        if (row.recall_percentage < 80) {
          return (
            <Box display='flex' alignItems='center'>
              <Box
                style={{
                  width: '9px',
                  height: '10px',
                  backgroundColor: '#FB7185',
                  marginRight: '6px'
                }}
              />
              <Box width='80%'>{`${row.gt_defect.name} (${row.gt_organization_defect_code})`}</Box>
            </Box>
          );
        }
        return '';
      },
      sortable: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.gt_defect.name, rowB.gt_defect.name),
      grow: 3
    },
    {
      name: 'Recall%',
      selector: row =>
        row.recall_percentage || row.recall_percentage === 0
          ? `${row.recall_percentage}%`
          : 'N/A',
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.recall_percentage, rowB.recall_percentage)
    },
    {
      name: 'Precision%',
      selector: row =>
        row.precision_percentage || row.precision_percentage === 0
          ? `${row.precision_percentage}%`
          : 'N/A',
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.precision_percentage, rowB.precision_percentage)
    },

    {
      name: 'Total Images',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            ground_truth_label__in: row.gt_defect_id,
            is_latest_inferenced_model: true
          })}
        >
          {NumberFormater(row.total)}
        </Link>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) => customColumnSort(rowA.total, rowB.total)
    },
    {
      name: 'Correct',
      selector: row => (
        <Link
          className={classes}
          to={createURL({
            ground_truth_label__in: row.gt_defect_id,
            is_accurate: true
          })}
        >
          {row.accurate}
        </Link>
      ),
      sortable: true,
      center: true,
      sortFunction: (rowA, rowB) =>
        customColumnSort(rowA.accurate, rowB.accurate)
    },
    {
      name: 'Missed',
      selector: row => row.missed,
      sortable: true,
      center: true
    },
    {
      name: 'Extra',
      selector: row => row.extra,
      sortable: true,
      center: true
    }
  ];
};

export const classifyWafer = (
  classes,
  onClick,
  metaColumns = [],
  sortFunction
) => {
  return [
    {
      name: 'wafer Id',
      url_key: 'organization_wafer_id',
      style: { paddingLeft: '8px' },
      selector: row => {
        const [tag1, ...rest] = row?.tags || [];

        return (
          <Box display='flex' alignItems='center'>
            <Box maxWidth={160} bgcolor='#fff'>
              <TruncateText
                label={row.organization_wafer_id}
                key={row?.tags.length}
              />
            </Box>

            <Box display='flex' alignItems='center' sx={{ gap: '4px' }} ml={1}>
              {tag1?.tag_name && (
                <ReviewTags
                  wrapperClass='mr-2'
                  icon={<FontAwesomeIcon icon={faTag} />}
                  label={tag1.tag_name}
                  variant='lightgrey'
                  // removable
                />
              )}

              {/* {tag2?.tag_name && (
                <ReviewTags
                  wrapperClass='mr-2'
                  icon={<FontAwesomeIcon icon={faTag} />}
                  label={tag2.tag_name}
                  variant='lightgrey'
                  // removable
                />
              )} */}

              {/* {rest?.length === 1 && (
                <ReviewTags
                  wrapperClass='mr-2'
                  icon={<FontAwesomeIcon icon={faTag} />}
                  label={rest[0]?.tag_name}
                  variant='lightgrey'
                  // removable
                />
              )} */}

              {rest.length > 0 ? (
                <Tooltip title={rest.map(x => x.tag_name).join(',')}>
                  <Box>
                    <ReviewTags
                      wrapperClass='mr-2'
                      icon={<FontAwesomeIcon icon={faTag} />}
                      label={`+${rest.length}`}
                      variant='lightgrey'
                      showTooltip={false}
                      // removable
                    />
                  </Box>
                </Tooltip>
              ) : null}
            </Box>
          </Box>
        );
      },
      sortable: true,
      width: '300px',
      sortFunction
    },
    ...metaColumns.primaryColumns.map(d => ({
      ...d,
      width: d.name === 'Slot ID' ? '120px' : '200px'
    })),
    {
      name: 'Usecase',
      url_key: 'use_case__name',
      selector: row => row.use_case_name,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Wafer Status',
      url_key: 'status',
      selector: row => {
        return (
          <Box
            width={190}
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            pr={0}
          >
            {row.status === 'error' ? (
              <Box>
                <FontAwesomeIcon
                  className={classes.failedIcon}
                  icon={faExclamationTriangle}
                />
                {statusDict[row.status]}
              </Box>
            ) : (
              <Box>{statusDict[row.status]}</Box>
            )}
            <Box className={`hiddenDiv ${classes.hiddenDiv}`} width='47%'>
              {!!row.status &&
                row.status !== 'pending' &&
                row.status !== 'error' && (
                  <CommonButton
                    onClick={() => onClick(CLASSIFY, [row])}
                    wrapperClass={classes.manualClassBtn}
                    icon={<FontAwesomeIcon icon={faWebcam} />}
                    toolTip
                    toolTipMsg='Manual Reclass'
                  />
                )}
              {row.status === 'auto_classified' && (
                <CommonButton
                  onClick={() => onClick(AUDIT, [row])}
                  wrapperClass={classes.auditBtn}
                  icon={<FontAwesomeIcon icon={faCheck} />}
                  toolTip
                  toolTipMsg='Audit wafer'
                />
              )}
            </Box>
            {/* {((mode === CLASSIFY && row.status === 'manual_classification_pending') ||
							(mode === AUDIT &&
								(row.status === 'auto_classified' ||
									row.status === 'manually_classified'))) && (
							<Box onClick={() => onClick(row.id)} ml={1.5} className={classes.btnContainer}>
								<Typography className={classes.btn}>
									{mode === CLASSIFY ? 'Classify' : 'Audit'}
								</Typography>
							</Box>
						)} */}
          </Box>
        );
      },
      sortable: true,
      style: {
        '&:hover': {
          '& .hiddenDiv': {
            display: 'flex !important',
            justifyContent: 'space-around',
            alignItems: 'center'
          }
        }
      },
      width: '220px'
    },
    {
      name: 'Classified by',
      url_key: 'classified_by',
      selector: row => row.classified_by || '-',
      sortable: true,
      width: '150px'
    },
    {
      name: 'Total Images',
      url_key: 'total',
      selector: row => NumberFormater(row?.total),
      sortable: false,
      width: '120px'
    },
    {
      name: 'Auto',
      url_key: 'auto_classified',
      selector: row => NumberFormater(row.auto_classified),
      sortable: false,
      width: '120px'
    },
    {
      name: 'Manual',
      url_key: 'manually_classified',
      selector: row => NumberFormater(row.manually_classified),
      sortable: false,
      width: '120px'
    },
    ...metaColumns.secondaryColumns.map(d => ({
      ...d,
      width: d.name === 'Slot ID' ? '120px' : '200px'
    })),
    {
      name: 'Created at',
      url_key: 'created_ts',
      selector: row =>
        dayjs(row.created_ts).tz(timeZone).format('hh:mm A, DD MMM YYYY'),
      sortable: true,
      width: '170px'
    }
  ];
};
