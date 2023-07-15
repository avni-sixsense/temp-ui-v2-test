import React from 'react';

import Show from 'app/hoc/Show';
import DropZone from 'app/components/DropZone';

import classes from './SideDrawerDropZone.module.scss';

const SideDrawerDropZone = ({ show, acceptedFileTypes, ...props }) => {
  return (
    <Show when={show}>
      <div className={classes.dropZoneContainer}>
        <DropZone acceptedFileTypes={acceptedFileTypes} {...props} />
      </div>

      <span className={classes.fileFormatSupported}>
        *File format supported:{' '}
        {acceptedFileTypes.map(x => x.split('/')[1].toUpperCase()).join('/')}
      </span>
    </Show>
  );
};

export default SideDrawerDropZone;
