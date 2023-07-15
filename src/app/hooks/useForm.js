import { useReducer } from 'react';

// eslint-disable-next-line no-shadow
const useForm = fields => {
  // eslint-disable-next-line consistent-return
  let initialState = {
    errors: {},
    dirtyFields: {},
    isDirty: false,
    allDirty: false
  };
  if (Array.isArray(fields)) {
    fields.forEach(field => {
      initialState[field.field] = '';
      initialState.dirtyFields[field.field] = false;
    });
  } else {
    initialState = {
      ...initialState,
      ...fields
    };
  }
  // eslint-disable-next-line consistent-return
  const reducer = (state, action) => {
    const d = { ...state.dirtyFields, [action.field]: !!action.value };
    switch (action.type) {
      case 'form':
        return {
          ...state,
          [action.field]: action.value,
          dirtyFields: d,
          isDirty: true,
          allDirty: Object.entries(d).reduce(
            (acc, [key, value]) => acc && value,
            true
          ),
          errors: {
            ...state.errors,
            [action.field]: ''
          }
        };
      case 'init':
        return {
          ...state,
          [action.field]: action.value,
          dirtyFields: { ...state.dirtyFields, [action.field]: false },
          allDirty: false,
          isDirty: false
        };
      case 'errors': {
        return {
          ...state,
          [action.field]: action.value
        };
      }
      case 'reset':
        return initialState;
      default:
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const isFormValid = () => {
    const errors = {};
    Object.keys(state.dirtyFields).forEach(field => {
      if (!state[field]) {
        errors[field] = 'This field is required';
      }
    });
    if (Object.keys(errors).length === 0) {
      return true;
    }
    dispatch({
      type: 'errors',
      field: 'errors',
      value: errors
    });
    return false;
  };
  return { state, dispatch, isFormValid };
};

export default useForm;
