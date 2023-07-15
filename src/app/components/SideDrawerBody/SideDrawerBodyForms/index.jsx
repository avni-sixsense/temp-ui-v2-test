import TextField from '@material-ui/core/TextField';
import SSButton from 'app/components/SSButton';
import SSRadioGroup from 'app/components/SSRadioGroup';
import Show from 'app/hoc/Show';
import ModelSelect from 'app/routes/reviewData/components/ModelSelect';
import React from 'react';

import classes from './SideDrawerBodyForms.module.scss';
import { CircularProgress } from '@material-ui/core';

function renderFormField({ type, label, isLoading = false, ...props }) {
  if (isLoading) {
    return <CircularProgress />;
  }

  if (type === 'select') {
    return (
      <ModelSelect
        {...props}
        width={320}
        styles={{ button: classes.select, placeholder: classes.placeholder }}
      />
    );
  }

  if (type === 'radio') {
    return <SSRadioGroup {...props} />;
  }

  return (
    <TextField
      {...props}
      variant='outlined'
      classes={{ root: classes.input }}
      size='small'
    />
  );
}

const SideDrawerBodyForms = ({ fields, actionBtns = [] }) => {
  return (
    <div className={classes.formContainer}>
      <div className={classes.form}>
        {fields.map(field => (
          <Show key={field.id} when={field.show ?? true}>
            <div type={field.type}>
              <Show when={field.type !== 'radio'}>
                <label htmlFor={field.id}>{field.label}</label>
              </Show>

              {renderFormField(field)}
            </div>
          </Show>
        ))}
      </div>
      <div>
        {actionBtns.map(({ name, ...rest }) => (
          <SSButton {...rest}>{name}</SSButton>
        ))}
      </div>
    </div>
  );
};

export default SideDrawerBodyForms;
