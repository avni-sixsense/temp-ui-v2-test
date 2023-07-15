import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Label from 'app/components/Label';
import InputChipSelect from 'app/components/InputChipSelect';

import {
  selectCommonFileSetDefectId,
  selectOtherDefects
} from 'store/reviewData/selector';

import classes from './BulkReplace.module.scss';
import { useEffect, useState } from 'react';
import ReplaceConfirmationModal from './ReplaceConfirmationModal';
import { handleUserClassificationChange } from 'store/reviewData/actions';
import { useParams } from 'react-router-dom';
import store from 'store';

const mapReviewState = createStructuredSelector({
  otherDefects: selectOtherDefects,
  commonFileSetDefectId: selectCommonFileSetDefectId
});

const BulkReplaceContainer = ({ useCase }) => {
  const [value, setValue] = useState([]);
  const [newValue, setNewValue] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { annotationType } = useParams();

  const { otherDefects, commonFileSetDefectId } = useSelector(mapReviewState);

  useEffect(() => {
    if (commonFileSetDefectId && otherDefects.length) {
      setValue(otherDefects.filter(item => item.id === commonFileSetDefectId));
    } else if (otherDefects.length) {
      setValue([]);
    }
  }, [commonFileSetDefectId, otherDefects]);

  const handleToggleModal = () => {
    setIsModalOpen(false);
    setNewValue({});
  };

  const handleDefectSubmit = defect => {
    handleUserClassificationChange(defect, annotationType);
    handleToggleModal();
  };

  const handleDefectChange = defect => {
    if (!Object.keys(defect).length) return;

    const { activeImg, selectAll } = store.getState().review;

    if (activeImg.length > 30 || selectAll) {
      setNewValue(defect);
      setIsModalOpen(true);
    } else {
      handleDefectSubmit(defect);
      setNewValue({});
    }
  };

  return (
    <div className={classes.bulkReplaceContainer}>
      <Label label='Add Label' fontWeight={600} />

      <InputChipSelect
        multiSelect={useCase?.classification_type === 'MULTI_LABEL'}
        value={value}
        onChange={defect => handleDefectChange(defect)}
        data={otherDefects || []}
        removableChip={false}
      />

      <Label
        label='Existing labels on images will be overwritten'
        variant='secondary'
        className={classes.info}
      />

      <ReplaceConfirmationModal
        defect={newValue}
        isModalOpen={isModalOpen}
        handleToggleModal={handleToggleModal}
        handleSubmit={handleDefectSubmit}
      />
    </div>
  );
};

export default BulkReplaceContainer;
