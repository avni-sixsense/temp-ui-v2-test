import classes from './LoadingState.module.scss';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingState = () => (
  <div className={classes.loadingStateContainer}>
    <div className={classes.innerContainer}>
      <div className={classes.progressContainer}>
        <CircularProgress />
      </div>
      <div>Generating graph</div>
    </div>
  </div>
);

export { LoadingState };
