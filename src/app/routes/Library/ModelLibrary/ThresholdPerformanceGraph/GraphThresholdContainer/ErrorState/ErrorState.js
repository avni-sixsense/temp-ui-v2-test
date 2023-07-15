import classes from './ErrorState.module.scss';
import { faRedo } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommonButton from 'app/components/ReviewButton';

const ErrorView = ({ refetch }) => (
  <div className={classes.errorStateContainer}>
    <div className={classes.innerContainer}>
      <div>Graph didn’t load due to some unexpected error</div>
      <div className={classes.buttonContainer}>
        <CommonButton
          text='Regenerate graph'
          onClick={refetch}
          size='sm'
          variant='primary'
          icon={<FontAwesomeIcon icon={faRedo} />}
        />
      </div>
    </div>
  </div>
);

export { ErrorView };
