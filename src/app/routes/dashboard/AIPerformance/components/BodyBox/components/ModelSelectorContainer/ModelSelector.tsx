import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import classes from './ModelSelector.module.scss';

type ModelSelectorProps<T> = {
  options: T[];
  onChange: (param: T | null) => void;
  value: T | null | undefined;
  getOptionLabel?: (param: T) => string;
};

export const ModelSelector = <T extends object>({
  options,
  onChange,
  value,
  getOptionLabel
}: ModelSelectorProps<T>) => {
  return (
    <Autocomplete
      fullWidth
      classes={{
        option: classes.options,
        inputRoot: classes.inputRoot,
        clearIndicator: classes.clearIndicator,
        root: classes.root,
        popper: classes.popper
      }}
      options={options}
      size='small'
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel}
      style={{ maxWidth: 524 }}
      renderInput={params => <TextField {...params} variant='outlined' />}
    />
  );
};
