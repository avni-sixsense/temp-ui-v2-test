import AiClassificationContainer from './AiClassification';
import UserClassificationContainer from './UserClassification';

import classes from './FinalLabels.module.scss';

const FinalLables = ({ useCase }) => {
  return (
    <div className={classes.finalLabels}>
      <AiClassificationContainer useCase={useCase} />

      <UserClassificationContainer useCase={useCase} />
    </div>
  );
};

export default FinalLables;
