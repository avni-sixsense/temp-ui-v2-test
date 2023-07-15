import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import React from 'react';

import SSButton from '../SSButton';
import classes from './SideDrawerFooter.module.scss';

const SideDrawerFooter = ({ text, actionBtns, disabled = false }) => {
  return (
    <div className={classes.footer}>
      {text && (
        <div className={classes.infoContainer}>
          <div className={classes.info}>
            <InfoOutlinedIcon className={classes.icon} />
            <div>{text}</div>
          </div>
        </div>
      )}

      <div className={classes.actionBtns}>
        {actionBtns.map((actionBtn, idx) => (
          <SSButton
            className={classes.actionBtn}
            key={idx}
            disabled={disabled}
            onClick={actionBtn.onClick}
          >
            {actionBtn.text}
          </SSButton>
        ))}
      </div>
    </div>
  );
};

export default SideDrawerFooter;
