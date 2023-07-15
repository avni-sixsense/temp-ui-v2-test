import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import { selectUseCaseDict } from 'store/helpers/selector';

import api from 'app/api';

import { TextField } from '@material-ui/core';

import WithCondition from 'app/hoc/WithCondition';

import ModelSelect from 'app/routes/reviewData/components/ModelSelect';
import CommonButton from 'app/components/ReviewButton';
import CommonBackdrop from 'app/components/CommonBackdrop';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUpRightFromSquare,
  faClose
} from '@fortawesome/pro-solid-svg-icons';

import classes from './CreateDefect.module.scss';

const mapCreateDefectDialogState = createStructuredSelector({
  useCaseDict: selectUseCaseDict
});

const getInitialState = (defaultDefectName = '', defaultUseCase) => ({
  use_cases: defaultUseCase ? [defaultUseCase] : [],
  name: defaultDefectName,
  organization_defect_code: '',
  description: ''
});

const CreateDefect = ({
  btnText = 'Create Defect',
  onClose,
  onSuccess,
  defaultUseCase,
  defaultDefectName
}) => {
  const { subscriptionId, packId } = useParams();

  const { useCaseDict } = useSelector(mapCreateDefectDialogState);

  const useCases = useMemo(() => Object.values(useCaseDict), [useCaseDict]);

  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState(
    getInitialState(defaultDefectName, defaultUseCase)
  );

  const INPUT_FIELDS = [
    {
      label: 'Defect Name',
      required: true,
      gridIdentifier: 'a',
      multiline: false,
      type: 'text',
      name: 'name'
    },
    {
      label: 'Defect Code',
      required: true,
      gridIdentifier: 'b',
      multiline: false,
      type: 'text',
      name: 'organization_defect_code'
    },
    {
      label: 'Defect Definition',
      required: false,
      gridIdentifier: 'c',
      multiline: true,
      type: 'text',
      name: 'description'
    },
    {
      label: 'Use Case',
      required: false,
      gridIdentifier: 'd',
      multiline: false,
      type: 'select',
      name: 'use_cases'
    }
  ];

  const handleNavigation = () => {
    onClose();
    window.open(`/${subscriptionId}/${packId}/library/defect`, '_blank');
  };

  const handleChange = e => {
    const { value, name } = e.target;
    setValues(d => ({ ...d, [name]: value }));
  };

  const handleUseCaseChange = values => {
    setValues(d => ({ ...d, use_cases: values }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const payload = {
      ...values,
      use_cases: values.use_cases.map(d => d.id),
      subscription: subscriptionId,
      reference_file_ids: []
    };

    try {
      const res = await api.createEditDefect(payload);
      toast.success('Defect successfully created!');
      onClose();
      onSuccess?.(res.data);
    } catch (err) {
      toast.error('Something went wront. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={classes.header}>
        <div>Create Defect</div>
        <FontAwesomeIcon
          icon={faClose}
          className={classes.icon}
          onClick={onClose}
        />
      </div>

      <div className={classes.formContainer}>
        {INPUT_FIELDS.map(d => {
          return (
            <div
              style={{ gridArea: d.gridIdentifier }}
              className={classes.inputContainer}
            >
              <div>
                {d.label}{' '}
                {d.required && <span className={classes.required}>*</span>}
              </div>

              <WithCondition
                when={d.type === 'text'}
                then={
                  <TextField
                    fullWidth
                    multiline={d.multiline}
                    minRows={d.multiline ? 3 : 1}
                    value={values[d.name]}
                    onChange={handleChange}
                    variant='outlined'
                    classes={{ root: classes.textField }}
                    size='small'
                    name={d.name}
                  />
                }
                or={
                  <ModelSelect
                    styles={{
                      button: classes.useCaseContainer,
                      menu: classes.useCaseMenu,
                      inputBase: clsx(
                        classes.textField,
                        classes.modelTextField
                      ),
                      autoComplete: classes.optionsContainer
                    }}
                    models={useCases}
                    width={420}
                    height={46}
                    multiSelect
                    onChange={handleUseCaseChange}
                    defaultValue={values.use_cases}
                  />
                }
              />
            </div>
          );
        })}

        <div
          style={{ gridArea: 'e' }}
          className={classes.info}
          onClick={handleNavigation}
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />{' '}
          <span>Visit Defect Library</span> for adding variations and images
        </div>
      </div>

      <div className={classes.actionContainer}>
        <CommonButton
          text={btnText}
          wrapperClass={classes.btn}
          disabled={
            !values.name.length || !values.organization_defect_code.length
          }
          onClick={handleSubmit}
        />
      </div>

      <CommonBackdrop open={isLoading} />
    </>
  );
};

export default CreateDefect;
