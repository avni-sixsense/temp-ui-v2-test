// import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
// import BookmarkedParent from 'assests/images/icons/bookmarkedLarge.svg'
// import BookmarkBorderParent from 'assests/images/icons/BookmarkLarge.svg'
import React from 'react';

import CustomizedCheckbox from '../Checkbox';
import useStyles from './styles';

const TableHeader = ({
  columns,
  onSelectAllClick,
  allSelected,
  indeterminate,
  treeData
}) => {
  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        <TableCell
          align='center'
          className={`${classes.firstCell} ${classes.headCell}`}
          padding='checkbox'
          style={{ width: '1%', paddingTop: 0 }}
        >
          <CustomizedCheckbox
            style={{ paddingTop: 0 }}
            checked={allSelected}
            indeterminate={indeterminate}
            color='primary'
            onChange={onSelectAllClick}
          />
        </TableCell>
        {/* <TableCell align="center" padding="checkbox" width="1%" className={classes.headCell}>
					<IconButton onClick={() => onBookmarkAllClick(true)}>
						<img src={BookmarkBorderParent} alt="" />
					</IconButton>
				</TableCell> */}
        {treeData && (
          <TableCell
            align='center'
            padding='checkbox'
            width='1%'
            className={classes.headCell}
          />
        )}
        {columns.map(column => {
          if (column.visible !== false) {
            return (
              <TableCell
                width={column.width ? column.width : 'auto'}
                key={column.id}
                className={classes.headCell}
                style={column.style ? column.style : {}}
              >
                {column.headCell ? (
                  column.headCell()
                ) : (
                  <Typography variant='body1'>{column.name}</Typography>
                )}
              </TableCell>
            );
          }
          return null;
        })}
      </TableRow>
    </TableHead>
  );
};

export default TableHeader;
