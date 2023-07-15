import { Dialog, Paper, Typography } from '@material-ui/core';
import CommonButton from 'app/components/ReviewButton';
import HotkeyItem from './HotkeyItem';

import classes from './HotkeysConfig.module.scss';

const HotkeysConfig = ({ open, handleClose, selected = [] }) => {
  return (
    <Dialog open={open} classes={{ paper: classes.dialog }}>
      <Paper className={classes.paper}>
        <div className={classes.header}>
          <div className={classes.titleContainer}>
            <Typography>Configure Hotkeys</Typography>
          </div>

          <Typography>Hotkeys can be used in to label images.</Typography>
        </div>

        <div className={classes.itemContiner}>
          {selected.map(item => (
            <HotkeyItem key={item.id} defectId={item.id} />
          ))}
        </div>

        <div className={classes.actionBtns}>
          <CommonButton text='Close' variant='tertiary' onClick={handleClose} />
        </div>
      </Paper>
    </Dialog>
  );
};

export default HotkeysConfig;
