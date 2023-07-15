import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputChipSelect from 'app/components/InputChipSelect';
import CommonButton from 'app/components/ReviewButton';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import CustomizedRadio from 'app/components/ReviewRadio';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openCreateDefectDialog } from 'store/createDefectDialog/actions';

const useStyles = makeStyles(theme => ({
  buttons: {
    marginRight: theme.spacing(1.25)
  },
  title: {
    fontWeight: 600,
    fontSize: '0.75rem',
    color: theme.colors.grey[0],
    marginBottom: theme.spacing(0.75)
  },
  formControl: {
    marginLeft: 0
  },
  inputText: {
    backgroundColor: theme.colors.grey[16],
    border: `0.2px solid ${theme.colors.grey[13]}`,
    boxShadow: theme.colors.shadow.sm,
    borderRadius: '4px',
    '& input': {
      color: theme.colors.grey[0],
      '&::placeholder': {
        color: '#31456A',
        opacity: 1
      },
      '&:-ms-input-placeholder': {
        color: '#31456A'
      },
      '&::-ms-input-placeholder': {
        color: '#31456A'
      }
    }
  }
}));

const ActionButtonPopper = ({
  type,
  radioGroup,
  checkboxGroup,
  data,
  onSubmit,
  handlePopperClose,
  inlineRadio = true,
  selected = [],
  submitBtnText,
  shortcutKey = '',
  multiSelect = false,
  isAIModelSelect = false
}) => {
  const classes = useStyles();

  const [value, setValue] = useState(radioGroup?.buttons?.[0] || '');
  const [checkboxValue, setCheckboxValue] = useState([]);
  const [inputChipValue, setInputChipValue] = useState([]);
  const [queryFlterChip, setQueryFilterChip] = useState([]);
  const [oldInputChipValue, setOldInputChipValue] = useState([]);
  const [newInputChipValue, setNewInputChipValue] = useState([]);

  const dispatch = useDispatch();

  const filterData = [
    {
      name: 'has any of...',
      value: 'has any of',
      multiSelect: true
    },
    {
      name: 'has all of...',
      value: 'has all of',
      multiSelect: true
    },
    {
      name: 'is exactly...',
      value: 'is exactly',
      multiSelect: false
    },
    {
      name: 'has none of...',
      value: 'has none of',
      multiSelect: true
    }
  ];

  useEffect(() => {
    if (inputChipValue.length === 0 && selected.length > 0) {
      setInputChipValue(selected);
    }
  }, [selected]);

  const handleChange = event => {
    if (
      (event.target.value.includes('all') ||
        event.target.value.includes('All')) &&
      (inputChipValue.length || queryFlterChip.length)
    ) {
      setQueryFilterChip([]);
      setInputChipValue([]);
    }
    setValue(event.target.value);
    radioGroup.onChange(event.target.value);
  };

  const handleInputChipChange = value => {
    if (queryFlterChip.length) {
      setQueryFilterChip([]);
    }
    if (Array.isArray(value)) {
      setInputChipValue(value);
    } else {
      setInputChipValue(Object.keys(value).length ? [value] : []);
    }
  };

  const handleQueryFileterChip = value => {
    if (Array.isArray(value)) {
      setQueryFilterChip(value);
    } else {
      setQueryFilterChip([value]);
    }
  };

  const handleOldInputChipChange = value => {
    if (Array.isArray(value)) {
      setOldInputChipValue(value);
    } else {
      setOldInputChipValue(Object.keys(value).length ? [value] : []);
    }
  };

  const handleNewInputChipChange = value => {
    if (Array.isArray(value)) {
      setNewInputChipValue(value);
    } else {
      setNewInputChipValue(Object.keys(value).length ? [value] : []);
    }
  };

  const handleCheckboxChange = (event, label) => {
    if (event.target.checked) {
      setCheckboxValue([...checkboxValue.filter(x => x !== label), label]);
    } else {
      setCheckboxValue(checkboxValue.filter(x => x !== label));
    }
  };

  const handleSubmit = () => {
    const temp = {};
    temp.type = type;
    if (type === 'ADD') {
      temp.value = inputChipValue;
      if (Object.keys(radioGroup).length) {
        temp.radioValue = value;
      }
      if (Object.keys(checkboxGroup).length) {
        temp.checkboxValue = checkboxValue;
      }
      onSubmit(temp);
    } else if (type === 'EDIT') {
      temp.oldValue = oldInputChipValue;
      temp.newValue = newInputChipValue;
      onSubmit(temp);
    } else if (type === 'DELETE') {
      if (Object.keys(radioGroup).length) {
        temp.radioValue = value;
        if (value.includes('all') || value.includes('All')) {
          onSubmit(temp);
        } else if (value.includes('where') || value.includes('Where')) {
          temp.query = queryFlterChip.value;
          temp.value = inputChipValue;
          onSubmit(temp);
        } else {
          temp.value = inputChipValue;
          onSubmit(temp);
        }
      } else {
        temp.value = inputChipValue;
        onSubmit(temp);
      }
    } else if (type === 'NOSELECT' || type === 'MARK_AS_GT') {
      onSubmit({ type });
    } else {
      onSubmit({ message: 'Please send valid type. (ADD, EDIT, DELETE)' });
    }
    handlePopperClose();
  };

  const creatableFunc = value => {
    dispatch(openCreateDefectDialog({ name: value }));
  };

  return (
    <Box>
      <Box pb={0.25}>
        {type === 'ADD' && (
          <>
            <Box>
              <Typography className={classes.title}>
                {isAIModelSelect ? 'Select Model' : 'Select Label'}
              </Typography>

              <InputChipSelect
                limitTags={4}
                multiSelect={multiSelect}
                data={data}
                value={inputChipValue}
                onChange={handleInputChipChange}
                shouldFocus
                creatable
                creatableText='+ Create New Label'
                creatableFunc={creatableFunc}
                clearInputOnCreatable
              />
            </Box>

            {Object.keys(radioGroup || {}).length ? (
              <Box pt={1.25}>
                <FormControl component='fieldset'>
                  <RadioGroup value={value} onChange={handleChange}>
                    <Box display='flex'>
                      {radioGroup.buttons.map((x, index) => (
                        <FormControlLabel
                          key={index}
                          className={classes.formControl}
                          value={x}
                          control={<CustomizedRadio label={x} />}
                        />
                      ))}
                    </Box>
                  </RadioGroup>
                </FormControl>
              </Box>
            ) : null}

            {Object.keys(checkboxGroup || {}).length ? (
              <Box pt={1.25}>
                {checkboxGroup.labels.map((label, index) => (
                  <CustomizedCheckbox
                    key={index}
                    checked={checkboxValue.includes(label)}
                    onChange={e => handleCheckboxChange(e, label)}
                    label={label}
                  />
                ))}
              </Box>
            ) : null}
          </>
        )}

        {type === 'EDIT' && (
          <>
            <Box mb={2.5}>
              <Typography className={classes.title}>Original Label</Typography>

              <InputChipSelect
                limitTags={4}
                multiSelect={multiSelect}
                data={data}
                value={oldInputChipValue}
                onChange={handleOldInputChipChange}
                shouldFocus
              />
            </Box>

            <Box mb={2.5}>
              <Typography className={classes.title}>New Label</Typography>

              <InputChipSelect
                limitTags={4}
                multiSelect={multiSelect}
                data={data}
                value={newInputChipValue}
                onChange={handleNewInputChipChange}
              />
            </Box>
          </>
        )}

        {type === 'DELETE' && (
          <>
            {Object.keys(radioGroup || {}).length > 0 && (
              <>
                {inlineRadio ? (
                  <Box>
                    <FormControl component='fieldset'>
                      <RadioGroup value={value} onChange={handleChange}>
                        <Box display='flex'>
                          {radioGroup.buttons.map(x => (
                            <FormControlLabel
                              className={classes.formControl}
                              value={x}
                              control={<CustomizedRadio label={x} />}
                            />
                          ))}
                        </Box>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                ) : (
                  <Box>
                    <FormControl component='fieldset'>
                      <RadioGroup value={value} onChange={handleChange}>
                        <Box display='flex' flexDirection='column'>
                          {radioGroup.buttons.map(x => {
                            if (!(x.includes('where') || x.includes('Where'))) {
                              return (
                                <FormControlLabel
                                  className={classes.formControl}
                                  value={x}
                                  control={<CustomizedRadio label={x} />}
                                />
                              );
                            }

                            return (
                              <Box display='flex' alignItems='center'>
                                <FormControlLabel
                                  className={classes.formControl}
                                  value={x}
                                  control={<CustomizedRadio label={x} />}
                                />

                                <Box ml={1}>
                                  <InputChipSelect
                                    limitTags={4}
                                    multiSelect={multiSelect}
                                    placeholder='is exactly'
                                    data={filterData}
                                    value={inputChipValue}
                                    onChange={handleInputChipChange}
                                    width='6.25rem'
                                    shouldFocus
                                  />
                                </Box>

                                <Box ml={1}>
                                  <InputChipSelect
                                    limitTags={4}
                                    placeholder='select label'
                                    data={data}
                                    value={queryFlterChip}
                                    onChange={handleQueryFileterChip}
                                    width='6.25rem'
                                    multiSelect={
                                      inputChipValue?.[0]?.multiSelect
                                    }
                                  />
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </RadioGroup>
                    </FormControl>
                  </Box>
                )}
              </>
            )}

            {((!(value.includes('all') || value.includes('All')) &&
              !(value.includes('where') || value.includes('Where'))) ||
              Object.keys(radioGroup || {}).length === 0) && (
              <Box pb={1.25} pt={1.25}>
                <Typography className={classes.title}>Select Label</Typography>

                <InputChipSelect
                  limitTags={4}
                  data={data}
                  value={inputChipValue}
                  onChange={handleInputChipChange}
                  multiSelect={multiSelect}
                  shouldFocus
                />
              </Box>
            )}
          </>
        )}
      </Box>

      <Box pt={1.25} display='flex' alignItems='center'>
        <CommonButton
          wrapperClass={classes.buttons}
          text={submitBtnText}
          shortcutKey={shortcutKey}
          onClick={handleSubmit}
          disabled={
            (type === 'ADD' && inputChipValue.length === 0) ||
            (type === 'EDIT' &&
              (newInputChipValue.length === 0 || oldInputChipValue === 0)) ||
            (type === 'DELETE' &&
              !(value.includes('all') || value.includes('All')) &&
              ((inlineRadio && inputChipValue.length === 0) ||
                (!inlineRadio &&
                  (inputChipValue.length === 0 ||
                    queryFlterChip.length === 0))))
          }
          variant={type === 'DELETE' ? 'negative' : 'primary'}
        />

        <CommonButton
          wrapperClass={classes.buttons}
          text='Cancel'
          onClick={handlePopperClose}
          disabled={false}
          variant='secondary'
        />
      </Box>
    </Box>
  );
};

export default ActionButtonPopper;
