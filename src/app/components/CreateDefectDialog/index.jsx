import { Dialog } from '@material-ui/core';

import CreateDefect from './CreateDefect';

import classes from './CreateDefectDialog.module.scss';

const CreateDefectDialog = ({
  open,
  btnText = 'Create Defect',
  onClose,
  onSuccess,
  defaultUseCase,
  defaultDefectName
}) => {
  return (
    <Dialog
      classes={{ paper: classes.container }}
      open={open}
      onKeyDown={e => e.stopPropagation()}
    >
      {open && (
        <CreateDefect
          btnText={btnText}
          onClose={onClose}
          onSuccess={onSuccess}
          defaultUseCase={defaultUseCase}
          defaultDefectName={defaultDefectName}
        />
      )}
    </Dialog>
  );
};

export default CreateDefectDialog;
