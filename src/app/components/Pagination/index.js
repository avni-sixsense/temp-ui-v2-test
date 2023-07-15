import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState } from 'react';

const useStyle = makeStyles(theme => ({
  pagination: {
    '& .MuiPaginationItem-page.Mui-selected': {
      background: '#02435D',
      color: '#ffffff'
    },
    '& .MuiPaginationItem-root': {
      color: '#02435D'
    }
  },
  icon: {
    color: '#000D12',
    width: '1rem',
    height: '1rem',
    marginLeft: 8
  },
  input: {
    width: '32px',
    height: '23px',
    border: '1px solid #E0E0E0',
    borderRadius: '4px',
    boxShadow: 'inset 0px 1px 2px rgba(102, 113, 123, 0.21)',
    fontWeight: 500,
    fontSize: '12px',
    textAlign: 'center',
    margin: theme.spacing(0, 1),
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0
    }
  }
}));

const CustomPagination = ({
  count,
  page,
  handlePagechange,
  showPerPage = true,
  rowsPerPage,
  handleRowsPerPage,
  pageSizeOptions = [5, 10, 15, 20, 25, 30]
}) => {
  const classes = useStyle();

  const [value, setValue] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = e => {
    setValue(e.target.value);
  };

  const handleMenuOptionChange = option => {
    handleRowsPerPage(option);
    handleClose();
  };

  const handleGoClick = () => {
    const newPage = parseInt(value, 10);
    if (newPage > 0 && newPage <= count && newPage !== page) {
      setValue('');
      handlePagechange('', newPage);
    }
  };

  return (
    <Box
      display='flex'
      py={2}
      px={3.75}
      justifyContent={showPerPage ? 'space-between' : 'flex-end'}
      alignItems='center'
      borderColor='rgba(230, 230, 230, 0.5)'
      borderTop={2}
    >
      {showPerPage && (
        <Box display='flex' alignItems='center'>
          <Typography variant='body2'>{rowsPerPage} Rows Per Page</Typography>
          <ExpandMoreIcon
            id='pagination_btn_rows_per_page'
            className={`${classes.icon} ss_pointer`}
            onClick={handleClick}
          />
          <Menu
            id='pageSizeMenu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {pageSizeOptions.map(option => (
              <MenuItem
                id={`pagination_btn_option_${option}`}
                onClick={() => handleMenuOptionChange(option)}
                key={option}
              >
                <Typography variant='body2'>{option}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}
      <Box display='flex'>
        <Pagination
          count={count}
          page={page}
          onChange={handlePagechange}
          shape='rounded'
          size='small'
          className={classes.pagination}
        />
        <Box display='flex' ml={4.75} alignItems='center'>
          <Typography variant='subtitle1'>Go to Page</Typography>
          <input
            id='pagination_input'
            type='number'
            className={classes.input}
            value={value}
            onChange={handleInputChange}
          />
          <Typography
            id='pagination_btn_GO'
            variant='body1'
            className='ss_pointer'
            onClick={handleGoClick}
          >
            Go
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomPagination;
