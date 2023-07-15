import classes from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { goToPreviousRoute } from 'app/utils/navigation';

const Header = ({ name }) => {
  const navigate = useNavigate();
  const { subscriptionId, packId } = useParams();

  const handlePreviousClick = () => {
    goToPreviousRoute(navigate, `/${subscriptionId}/${packId}/library/model`);
  };

  return (
    <div className={classes.headerContainer}>
      <div className={classes.titleContainer}>
        <FontAwesomeIcon icon={faArrowLeft} onClick={handlePreviousClick} />
        Threshold vs performance graph: {name}
      </div>
    </div>
  );
};

export { Header };
