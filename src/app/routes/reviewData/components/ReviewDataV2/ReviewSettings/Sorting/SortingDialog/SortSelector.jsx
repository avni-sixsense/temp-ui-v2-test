import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles, MenuItem, Select } from '@material-ui/core';
import Show from 'app/hoc/Show';
import { useEffect, useRef, useState } from 'react';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'fixed',
    top: props => `${props.top}px !important`,
    left: props => `${props.left}px  !important`,
    boxShadow: 'none',
    maxHeight: '100%',
    backgroundColor: theme.colors.grey[15],
    '& li': {
      fontSize: '0.875rem',
      color: theme.colors.grey[0],
      backgroundColor: theme.colors.grey[15],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',

      '& svg': {
        color: theme.colors.blue[500]
      }
    },
    '& ul': {
      // overflowY: 'scroll',
      '&::-webkit-scrollbar ': {
        width: 1
      },

      /* Track */
      '&::-webkit-scrollbar-track': {
        borderRadius: 10
      },

      /* Handle */
      '&::-webkit-scrollbar-thumb': {
        background: '#31456A',
        borderRadius: 10
      },

      /* Handle on hover */
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#EEEEEE'
      }
    }
  },
  select: {
    backgroundColor: theme.colors.grey[16],
    fontSize: '0.875rem',
    color: theme.colors.grey[0],
    borderRadius: '4px',
    border: `1px solid ${theme.colors.grey[13]}`,
    paddingLeft: theme.spacing(0.75),
    '& svg': {
      color: theme.colors.grey[7]
    },

    '&::before, &::after': {
      border: `none !important`
    }
  }
}));

const SortSelectorContainer = ({ options, value, onChange }) => {
  const [styles, setStyles] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles(styles);
  const ref = useRef(null);

  useEffect(() => {
    const coordinates = ref.current.getBoundingClientRect();

    setStyles({
      top: coordinates.y,
      left: coordinates.x
    });
  }, []);

  return (
    <Select
      ref={ref}
      value={value}
      onChange={onChange}
      MenuProps={{
        disablePortal: true,
        classes: { paper: classes.paper },
        styles
      }}
      fullWidth
      className={classes.select}
      onOpen={() => setTimeout(() => setIsOpen(true), 200)}
      onClose={() => setIsOpen(false)}
    >
      {options.map(item => (
        <MenuItem disabled={item.disabled} value={item.value} key={item.value}>
          {item.label}
          <Show when={item.value === value && isOpen}>
            <FontAwesomeIcon icon={faCheck} />
          </Show>
        </MenuItem>
      ))}
    </Select>
  );
};

export default SortSelectorContainer;
