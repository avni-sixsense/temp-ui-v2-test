import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, IconButton, Paper, Typography } from '@material-ui/core';
import CommonButton from 'app/components/ReviewButton';
import classes from './WaferAvailableDialog.module.scss';

const WaferAvailableDialog = ({
  header,
  info,
  buttonGroup = [],
  handleClose,
  open
}) => {
  return (
    <Dialog open={open}>
      <Paper className={classes.paper}>
        <div className={classes.header}>
          <Typography>{header}</Typography>
          <IconButton className={classes.closeIcon} onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </div>
        <div className={classes.info}>{info}</div>
        <div className={classes.buttonGrp}>
          {buttonGroup.map((item, key) => (
            <CommonButton
              text={item.text}
              variant={item.variant}
              onClick={item.onClick}
              key={key}
            />
          ))}
        </div>
      </Paper>
    </Dialog>
  );
};

export default WaferAvailableDialog;
