import { memo } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Show from 'app/hoc/Show';
import TruncateText from 'app/components/TruncateText';

import { selectGTLabelsByFileSetDefectsId } from 'store/modelTraining/selector';

import classes from './CardLabels.module.scss';

const mapFileSetDefectState = id =>
  createStructuredSelector({
    gtLabels: selectGTLabelsByFileSetDefectsId(id)
  });

const CardLabels = ({ fileSetId }) => {
  const { gtLabels } = useSelector(mapFileSetDefectState(fileSetId));

  if (!gtLabels.length) return null;

  return (
    <Show when={gtLabels.length}>
      <TruncateText
        classNames={{
          root: classes.label
          // subLabel: clsx(classes.subLabel, {
          // [classes.subLabelAiConfidence]: isAiLabels
          // })
        }}
        key={gtLabels[0]}
        label={gtLabels[0]}
        subLabel={gtLabels[1] > 0 ? gtLabels[1] : null}
      />

      <Show when={gtLabels.length > 1}>
        <TruncateText
          classNames={{ root: classes.label }}
          key={gtLabels[1]}
          label={`+${gtLabels.length - 1}`}
          tooltipText={gtLabels.slice(1, gtLabels.length).join(', ')}
        />
      </Show>
    </Show>
  );
};

export default memo(CardLabels);
