import { useDispatch, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectOtherDefects } from 'store/reviewData/selector';
import { setOtherDefects } from 'store/reviewData/actions';
import {
  selectCreateDefectDialogDefaultName,
  selectIsCreateDefectDialogOpen
} from 'store/createDefectDialog/selector';
import { closeCreateDefectDialog } from 'store/createDefectDialog/actions';

import CreateDefectDialog from 'app/components/CreateDefectDialog';

const mapSidebarBackdropState = createStructuredSelector({
  otherDefects: selectOtherDefects,
  isCreateDefectDialogOpen: selectIsCreateDefectDialogOpen,
  createDefectDialogDefaultName: selectCreateDefectDialogDefaultName
});

const SidebarBackdrop = ({ useCase }) => {
  const {
    otherDefects,
    isCreateDefectDialogOpen,
    createDefectDialogDefaultName
  } = useSelector(mapSidebarBackdropState);

  const dispatch = useDispatch();

  const handleCreateDefectSuccess = data => {
    if (data.use_cases.some(d => d.id === useCase.id)) {
      dispatch(setOtherDefects([...otherDefects, data]));
    }
  };

  return (
    <CreateDefectDialog
      open={isCreateDefectDialogOpen}
      onClose={() => dispatch(closeCreateDefectDialog())}
      onSuccess={handleCreateDefectSuccess}
      defaultUseCase={useCase}
      defaultDefectName={createDefectDialogDefaultName}
    />
  );
};

export default SidebarBackdrop;
