import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { usePagination } from '@material-ui/lab/Pagination';
import React from 'react';

const useStyle = makeStyles(theme => ({
  pagination: {
    '& .Mui-selected': {
      background: theme.colors.grey[3],
      color: theme.colors.grey[14],
      borderRadius: '12px'
    },
    '& .MuiPaginationItem-root': {
      color: theme.colors.grey[12]
    }
  },
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    '& li': {
      margin: `0px ${theme.spacing(5)}px`
    }
  },
  btn: {
    color: theme.colors.grey[12],
    background: 'transparent',
    borderWidth: 0,
    fontSize: '0.875rem',
    fontWeight: 600,
    padding: '5px 11px 6px 11px'
  },
  selectedBtn: {
    background: theme.colors.grey[3],
    color: theme.colors.grey[14],
    borderRadius: '16px',
    borderWidth: 0,
    fontSize: '0.875rem',
    fontWeight: 600,
    padding: '5px 11px 6px 11px'
  },
  typeBtn: {
    background: 'transparent',
    color: theme.colors.blue[700],
    borderWidth: 0,
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    padding: '5px 11px 6px 11px',
    '&:disabled': {
      color: theme.colors.blue[200]
    }
  }
}));

const CustomPagination = ({ count, page, handlePagechange }) => {
  const classes = useStyle();
  const { items } = usePagination({
    count,
    page,
    onChange: handlePagechange
  });

  return (
    <Box
      display='flex'
      py={2}
      px={3.75}
      justifyContent='center'
      alignItems='center'
      borderColor='#E0ECFD'
      borderTop={3}
    >
      {/* <Box display="flex">
				<Pagination
					count={count}
					page={page}
					onChange={handlePagechange}
					shape="rounded"
					size="small"
					className={classes.pagination}
				/>
			</Box> */}
      <nav>
        <ul className={classes.ul}>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === 'start-ellipsis' || type === 'end-ellipsis') {
              children = '…';
            } else if (type === 'page') {
              children = (
                <button
                  type='button'
                  className={selected ? classes.selectedBtn : classes.btn}
                  {...item}
                >
                  {page}
                </button>
              );
            } else {
              children = (
                <button className={classes.typeBtn} type='button' {...item}>
                  {type}
                </button>
              );
            }

            return <li key={index}>{children}</li>;
          })}
        </ul>
      </nav>
    </Box>
  );
};

export default CustomPagination;
