import { getUseCases } from 'app/api/Usecase';
import {
  SET_ACTIVE_USECASE_COUNT,
  SET_CONFUSION_MODEL,
  SET_CONFUSION_USE_CASE,
  SET_DRAWER_STATE,
  SET_DRAWER_STATUS,
  SET_DRAWER_USECASE,
  SET_MODE,
  SET_UNIT,
  SET_MISSCLASSIFICATION_IMAGES_ROW_IDS,
  SET_DEFECT_DISTRIBUTION_INDIVIDUAL_LOADING,
  SET_DEFECT_DISTRIBUTION_DATA,
  DEFECT_DISTRIBUTION_CONSTANTS,
  RESET_DEFECT_DISTRIBUTION_DATA
} from './constants';
import orderBy from 'lodash/orderBy';

export function setDrawerState(payload) {
  return { type: SET_DRAWER_STATE, payload };
}

export function setDrawerStatus(payload) {
  return { type: SET_DRAWER_STATUS, payload };
}

export function setMode(payload) {
  return { type: SET_MODE, payload };
}

export function setUnit(payload) {
  return { type: SET_UNIT, payload };
}

export function setConfusionUsecase(payload) {
  return { type: SET_CONFUSION_USE_CASE, payload };
}

export function setConfusionModel(payload) {
  return { type: SET_CONFUSION_MODEL, payload };
}

export function setDrawerUsecase(payload) {
  return { type: SET_DRAWER_USECASE, payload };
}

export function setActiveUsecaseCount() {
  return dispatch => {
    getUseCases({
      model_status__in: 'deployed_in_prod',
      limit: 1,
      allowedKeys: []
    }).then(_ => {
      const payload = _.count || null;
      dispatch({ type: SET_ACTIVE_USECASE_COUNT, payload });
    });
  };
}

export function setMisclassificationImagesRowIds(payload) {
  return { type: SET_MISSCLASSIFICATION_IMAGES_ROW_IDS, payload };
}

export function setDefectDistributionIndividualLoading(payload) {
  return { type: SET_DEFECT_DISTRIBUTION_INDIVIDUAL_LOADING, payload };
}

export function resetDefectDistributionData() {
  return { type: RESET_DEFECT_DISTRIBUTION_DATA };
}

const get2dMatrix = confusionMatrix => {
  const default_row = {
    count: 0,
    automated_count: 0,
    audited_fileset_count: 0
  };
  const defects = getDefectList(confusionMatrix);

  const defectsMap = defects.reduce(
    (prev, curr, index) => ({
      ...prev,
      [curr]: index
    }),
    {}
  );
  const result = defects.map(() => Array(defects.length).fill(default_row));
  confusionMatrix.forEach(row => {
    result[defectsMap[row['ai_defect']]][defectsMap[row['gt_defect']]] = row;
  });
  return result;
};

const getDefectList = confusionMatrix => {
  const defects = [];
  confusionMatrix.forEach(row => {
    defects.push(row['gt_defect']);
    defects.push(row['ai_defect']);
  });
  return [...new Set(defects)];
};

export function setDefectBasedDistribution(payload) {
  const { confusion_matrix, defects } = payload;
  const confusion_matrix_2d = get2dMatrix(confusion_matrix);
  const defectsList = getDefectList(confusion_matrix);

  const result = confusion_matrix_2d.map((_, index) => {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let total_fileset_count = 0;
    let automated_fileset_count = 0;
    let audited_fileset_count = 0;
    let total_gt_defects = 0;
    let total_model_defects = 0;

    confusion_matrix_2d.map((_, ai_index) => {
      if (ai_index === index) {
        tp += confusion_matrix_2d[index][ai_index]['count'];
      } else {
        fp += confusion_matrix_2d[index][ai_index]['count'];
      }

      total_gt_defects += confusion_matrix_2d[index][ai_index]['count'];
    });

    confusion_matrix_2d.map((_, ai_index) => {
      if (ai_index !== index) {
        fn += confusion_matrix_2d[ai_index][index]['count'];
      }
      total_model_defects += confusion_matrix_2d[ai_index][index]['count'];
      total_fileset_count += confusion_matrix_2d[ai_index][index]['count'];
      automated_fileset_count +=
        confusion_matrix_2d[ai_index][index]['automated_count'];
      audited_fileset_count +=
        confusion_matrix_2d[ai_index][index]['audited_fileset_count'];
    });

    return {
      name: defects[defectsList[index]]?.name || '',
      defect_id: defectsList[index],
      total: total_fileset_count,
      auto: automated_fileset_count,
      audited: audited_fileset_count,
      correct: tp,
      missed: fn,
      extra: fp,
      recall_percentage: total_gt_defects
        ? Math.round((tp * 100) / total_gt_defects)
        : null,
      precision_percentage: total_model_defects
        ? Math.round((tp * 100) / total_model_defects)
        : null
    };
  });

  return {
    type: SET_DEFECT_DISTRIBUTION_DATA,
    payload: {
      type: DEFECT_DISTRIBUTION_CONSTANTS.DEFECT_BASED_DISTRIBUTION,
      data: result.filter(item => item.defect_id !== -1)
    }
  };
}

const generateMatrixFromRawData = rawData => {
  const matrix = {};
  const aiLabelIds = [];
  rawData.forEach(item => {
    if (!matrix[item['gt_defect']]) {
      matrix[item['gt_defect']] = { ai_defects: {} };
    }
    matrix[item['gt_defect']]['ai_defects'][item['ai_defect']] = {
      count: item['count']
    };
    aiLabelIds.push(item['ai_defect']);
  });

  return matrix;
};

const generateMatrixMetaFromMatrix = (matrix, defects) => {
  const matrixMeta = {};
  const DEFAULT_META_VALUE = {
    recall: 0,
    precision: 0,
    model_count: 0,
    gt_count: 0
  };
  Object.keys(matrix).forEach(item => {
    if (!matrixMeta[item]) {
      matrixMeta[item] = { ...DEFAULT_META_VALUE };
    }
    matrixMeta[item].gt_count = Object.values(matrix[item].ai_defects).reduce(
      (prev, curr) => prev + curr.count,
      0
    );
    matrixMeta[item].recall = matrix[item].ai_defects[item]?.count
      ? ((matrix[item].ai_defects[item]?.count || 0) * 100) /
        matrixMeta[item].gt_count
      : 'N/A';

    const totalAiLabeledImages = Object.keys(matrix).reduce((prev, curr) => {
      return prev + (matrix[curr].ai_defects[item]?.count || 0);
    }, 0);

    matrixMeta[item].model_count = totalAiLabeledImages;

    matrixMeta[item].precision = matrix[item].ai_defects[item]?.count
      ? (matrix[item].ai_defects[item].count * 100) / totalAiLabeledImages
      : 'N/A';
  });

  defects.forEach(item => {
    if (!matrixMeta[item.id]) {
      matrixMeta[item.id] = { ...DEFAULT_META_VALUE };
    }
  });

  return matrixMeta;
};

const getConfusionMatrix = (rawData, defects) => {
  const matrix = generateMatrixFromRawData(rawData);
  const matrixMeta = generateMatrixMetaFromMatrix(matrix, defects);

  return { matrix, matrixMeta };
};

export const sortNormalizedDefect = (order, defects) => {
  return orderBy(
    defects.map(gtDefect => {
      return {
        ...gtDefect,
        ai_defects: orderBy(
          gtDefect.ai_defects,
          item => item.defect.organization_defect_code,
          [order, 'asc']
        )
      };
    }),
    item => item.defect.organization_defect_code,
    [order, 'asc']
  );
};

export const sortDefectsForMatrix = (order, defects) => {
  return {
    inDistribution: sortNormalizedDefect(
      order,
      defects.filter(item => item.defect.is_trained_defect)
    ),
    outOfDistribution: sortNormalizedDefect(
      order,
      defects.filter(item => !item.defect.is_trained_defect)
    )
  };
};

export function setConfusionMatrics(payload) {
  const { confusion_matrix, defects } = payload;

  if (!confusion_matrix.length)
    return {
      type: SET_DEFECT_DISTRIBUTION_DATA,
      payload: {
        type: DEFECT_DISTRIBUTION_CONSTANTS.CONFUSION_MATRICS,
        data: { matrix: [], matrixMeta: {} }
      }
    };

  const inDistributionDefect = Object.values(defects).filter(
    item => item.is_trained_defect
  );
  const { matrix: formatedMatrix, matrixMeta } = getConfusionMatrix(
    confusion_matrix,
    Object.values(defects)
  );

  const result = [];
  Object.values(defects).forEach(defect => {
    let ai = {};
    if (formatedMatrix[defect.id]) {
      ai = { ...formatedMatrix[defect.id], ai_defects: [], defect };
      const originalPredictions = formatedMatrix[defect.id].ai_defects;
      inDistributionDefect.forEach(predicted => {
        if (!originalPredictions[predicted.id]) {
          ai.ai_defects.push({
            defect: predicted,
            count: 0,
            file_set_ids: []
          });
        } else {
          ai.ai_defects.push({
            defect: predicted,
            ...originalPredictions[predicted.id]
          });
        }
      });
    } else {
      ai = {
        ...ai,
        defect,
        gt_count: 0,
        ai_defects: inDistributionDefect.map(defect => ({
          defect,
          count: 0,
          file_set_ids: []
        }))
      };
    }
    result.push(ai);
  });

  return {
    type: SET_DEFECT_DISTRIBUTION_DATA,
    payload: {
      type: DEFECT_DISTRIBUTION_CONSTANTS.CONFUSION_MATRICS,
      data: { matrix: result, matrixMeta }
    }
  };
}

export function setMisclassificationPairs(payload) {
  const { confusion_matrix, defects } = payload;

  const totalMisclassificationCount = confusion_matrix.reduce((prev, curr) => {
    if (curr.gt_defect !== curr.ai_defect) {
      return prev + curr.count;
    }
    return prev;
  }, 0);

  const result = confusion_matrix.reduce((prev, curr) => {
    if (
      curr.gt_defect !== curr.ai_defect &&
      curr.gt_defect !== -1 &&
      curr.ai_defect !== -1
    ) {
      return [
        ...prev,
        {
          ai_defect_id: curr['ai_defect'],
          gt_defect_id: curr['gt_defect'],
          ai_defect: defects[curr['ai_defect']] || {},
          gt_defect: defects[curr['gt_defect']] || {},
          misclassification_count: curr['count'],
          misclassification_percent:
            (100 * curr['count']) / totalMisclassificationCount
        }
      ];
    }
    return prev;
  }, []);

  return {
    type: SET_DEFECT_DISTRIBUTION_DATA,
    payload: {
      type: DEFECT_DISTRIBUTION_CONSTANTS.MISCLASSIFICATION_PAIR,
      data: result
    }
  };
}
