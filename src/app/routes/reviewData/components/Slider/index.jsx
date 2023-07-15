import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core/styles';

const CustomSlider = withStyles(theme => ({
  root: {
    color: theme.colors.blue[600],
    height: 3,
    padding: 0
  },
  disabled: {
    opacity: 0.5
  },
  thumb: {
    height: 10,
    width: 10,
    backgroundColor: '#fff',
    border: '3.5px solid currentColor',
    marginTop: -3,
    marginLeft: -5,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit'
    }
  },
  active: {},
  track: {
    height: 3,
    borderRadius: 4,
    background: theme.colors.grey[14],
    boxShadow: '0px 1px 2px rgba(14, 22, 35, 0.05)',
    opacity: 1
  },
  rail: {
    height: 3,
    borderRadius: 4,
    background: theme.colors.grey[14],
    boxShadow: '0px 1px 2px rgba(14, 22, 35, 0.05)',
    opacity: 1
  }
}))(Slider);

export default ({ disabled, onChange, defaultValue, value, ...rest }) => {
  return (
    <CustomSlider
      value={value}
      disabled={disabled}
      onChange={onChange}
      defaultValue={defaultValue}
      {...rest}
    />
  );
};
