import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Label from 'app/components/Label';
import CommonButton from 'app/components/ReviewButton';
import Show from 'app/hoc/Show';
import WithCondition from 'app/hoc/WithCondition';
import { useEffect } from 'react';
import { INFERENCE_STATUS } from 'store/reviewData/constants';
import classes from './InferenceVisibilityActions.module.scss';

const InferenceVisibilityActions = ({
  status,
  handleVisibility,
  row,
  visibility,
  startInferenceClick,
  showInferenceButton
}) => {
  useEffect(() => {
    if (!row.visible) {
      handleVisibility(row.id);
    }
  }, []);

  return (
    <div className={classes.root}>
      <Show when={showInferenceButton}>
        <CommonButton
          variant='secondary'
          size='sm'
          onClick={startInferenceClick}
          text='Inference'
        />
      </Show>

      <Show when={!showInferenceButton && status}>
        <Label
          label={INFERENCE_STATUS[status] || ''}
          size='xSmall'
          variant='secondary'
        />
      </Show>

      <Show
        when={
          !showInferenceButton &&
          visibility &&
          INFERENCE_STATUS[status] === INFERENCE_STATUS.FINISHED
        }
      >
        <CommonButton
          variant='secondary'
          size='small'
          onClick={() => handleVisibility(row.id)}
          wrapperClass={classes.icon}
          icon={
            <WithCondition
              when={row.visible}
              then={<FontAwesomeIcon icon={faEye} />}
              or={<FontAwesomeIcon icon={faEyeSlash} />}
            />
          }
        />
      </Show>
    </div>
  );
};

export default InferenceVisibilityActions;
