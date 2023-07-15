import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classes from './SimilarityThresholdSection.module.scss';
import QuestionMark from 'assests/images/icons/questionMark';
import CommonButton from 'app/components/ReviewButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import { calcluatePercent } from 'app/utils/helpers';
import { Tooltip } from '@material-ui/core';

export default function SimilarityThresholdSection() {
  const navigate = useNavigate();
  const { subscriptionId, packId, modelId } = useParams();
  const similarityThresholdValue = useSelector(
    ({ aiPerformance }) => aiPerformance.confusionModel.confidence_threshold
  );

  const navigateHandler = () => {
    if (modelId) {
      navigate(
        `/${subscriptionId}/${packId}/library/model/similarity-threshold/${modelId}`
      );
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.textSection}>
        <div className={classes.headerContainer}>
          <span className={classes.header}>Similarity Threshold</span>
          <Tooltip title='A threshold set at the model level to determine what images should be automated and what should be considered for manual classification.'>
            <div>
              <QuestionMark width='14' height='16' color='#000' />
            </div>
          </Tooltip>
          <span className={classes.percentage}>
            {calcluatePercent(similarityThresholdValue)}
          </span>
        </div>
        <div className={classes.description}>
          Automation and accuracy of model is calculated on the basis of the
          similarity threshold. Change similarity threshold to obtain a desired
          performance of the model.
        </div>
      </div>

      <div className={classes.buttonContainer}>
        <CommonButton
          onClick={navigateHandler}
          icon={<FontAwesomeIcon icon={faEye} />}
          wrapperClass={classes.actionBtn}
          variant='tertiary'
          text='View threshold vs performance graph'
          size='xs'
        />
      </div>
    </div>
  );
}
