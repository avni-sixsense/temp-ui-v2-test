import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import CommonButton from 'app/components/ReviewButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import classes from './BulkReplace.module.scss';
import { getSelectedImageCount } from 'store/reviewData/actions';

const ReplaceConfirmationModal = ({
  isModalOpen = true,
  handleToggleModal,
  defect = {},
  handleSubmit
}) => {
  return (
    <Modal
      className={classes.modal}
      open={isModalOpen}
      onClose={handleToggleModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={isModalOpen}>
        <Paper className={classes.paper}>
          <div className={classes.headerContainer}>
            <Typography className={classes.header}>
              {`Add label on ${getSelectedImageCount()} images`}
            </Typography>

            <IconButton
              className={classes.closeIcon}
              onClick={handleToggleModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>

          <div className={classes.modalBody}>
            <Typography className={classes.modalText}>
              {`${defect.organization_defect_code}-${
                defect.name
              } will get added to ${getSelectedImageCount()} images. `}
            </Typography>
            <div className={classes.modalActionBtns}>
              <CommonButton
                text='Yes, add'
                onClick={() => handleSubmit(defect)}
                size='sm'
              />
              <CommonButton
                text='No, cancel'
                onClick={handleToggleModal}
                size='sm'
                variant='secondary'
              />
            </div>
          </div>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default ReplaceConfirmationModal;
