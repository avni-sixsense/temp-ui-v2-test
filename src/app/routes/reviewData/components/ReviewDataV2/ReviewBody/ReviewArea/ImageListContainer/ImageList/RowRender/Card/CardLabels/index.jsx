import { memo } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Show from 'app/hoc/Show';
import TruncateText from 'app/components/TruncateText';

import {
  selectAILabelsByFileSetDefectsId,
  selectGTLabelsByFileSetDefectsId,
  selectUseAiAssistance,
  selectAILabelsConfidenceByFileSetDefectsId
} from 'store/reviewData/selector';

import classes from './CardLabels.module.scss';

const mapFileSetDefectState = id =>
  createStructuredSelector({
    gtLabels: selectGTLabelsByFileSetDefectsId(id),
    aiLabels: selectAILabelsByFileSetDefectsId(id),
    confidence: selectAILabelsConfidenceByFileSetDefectsId(id),
    useAiAssitance: selectUseAiAssistance
  });

const CardLabels = ({ fileSetId }) => {
  const { gtLabels, aiLabels, confidence, useAiAssitance } = useSelector(
    mapFileSetDefectState(fileSetId)
  );

  const isGtLabels = gtLabels.length > 0;
  const isAiLabels = !isGtLabels && aiLabels.length > 0 && useAiAssitance;

  const labels = isGtLabels
    ? [gtLabels.split(', ')[0], gtLabels.split(', ').length - 1]
    : isAiLabels
    ? [aiLabels.split(', ')[0], confidence]
    : [];

  return (
    <Show when={labels.length}>
      <TruncateText
        classNames={{
          root: clsx({ [classes.aiLabels]: isAiLabels }),
          subLabel: clsx(classes.subLabel, {
            [classes.subLabelAiConfidence]: isAiLabels
          })
        }}
        key={labels[0]}
        label={labels[0]}
        subLabel={labels[1] > 0 ? labels[1] : null}
      />
    </Show>
  );
};

export default memo(CardLabels);
