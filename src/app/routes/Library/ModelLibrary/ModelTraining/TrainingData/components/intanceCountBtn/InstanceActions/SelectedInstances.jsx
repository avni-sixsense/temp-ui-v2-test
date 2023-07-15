import Tooltip from '@material-ui/core/Tooltip';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectActiveImg,
  selectSelectAll,
  selectTrainingFilesetCount
} from 'store/modelTraining/selector';
import classes from './InstanceActions.module.scss';

const mapSelectedInstanceToState = createStructuredSelector({
  selectAll: selectSelectAll,
  count: selectTrainingFilesetCount,
  activeImg: selectActiveImg
});

const SelectedInstances = () => {
  const { selectAll, count, activeImg } = useSelector(
    mapSelectedInstanceToState
  );

  return (
    <Tooltip title='No. of instance is equal to no. of example of image for a particular defect. If image has only one defect, then no. of instance will be equal to no. of image.'>
      <div>
        <span className={classes.insetenceContainer}>
          {selectAll ? count : activeImg.length}
        </span>
        <span className={classes.insetenceText}>Instances Selected</span>
      </div>
    </Tooltip>
  );
};

export default SelectedInstances;
