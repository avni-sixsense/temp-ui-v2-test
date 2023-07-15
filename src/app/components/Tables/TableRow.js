import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
// import BookmarkedParent from 'assests/images/icons/bookmarkedLarge.svg'
// import BookmarkBorderParent from 'assests/images/icons/BookmarkLarge.svg'
import React, { useState } from 'react';

import CustomizedCheckbox from '../Checkbox';
import useStyles from './styles';

const EnhancedTableRow = ({
  row,
  columns,
  isItemSelected,
  handleSelect,
  selected,
  subRowComponent,
  subRows,
  treeData,
  expandableRows,
  expandRowComponent,
  rowsExpanded,
  allSelected,
  selector,
  checkboxProps
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleRowToggle = () => {
    setOpen(prevState => !prevState);
  };

  const isSelected = row => selected.indexOf(row[selector]) !== -1;

  const checkIntermediate = () => {
    const ids = subRows.map(item => item[selector]);
    const childSelecteds = ids.filter(id => selected.includes(id));
    return (
      subRows.length > 0 &&
      childSelecteds.length < subRows.length &&
      childSelecteds.length > 0
    );
  };

  return (
    <>
      <TableRow>
        <TableCell
          align='center'
          className={`${classes.firstCell}`}
          width='1%'
          style={{ ...checkboxProps }}
          padding='checkbox'
        >
          <CustomizedCheckbox
            checked={isItemSelected || allSelected}
            indeterminate={checkIntermediate()}
            onChange={() => {
              handleSelect(row);
            }}
            color='primary'
          />
        </TableCell>
        {/* <TableCell align="center" padding="checkbox" width="1%">
					<IconButton>
						<img src={BookmarkBorderParent} alt="" />
					</IconButton>
				</TableCell> */}
        {treeData && (
          <TableCell align='center' padding='checkbox' width='1%'>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={handleRowToggle}
            >
              {open ? (
                <KeyboardArrowDownIcon color='primary' />
              ) : (
                <KeyboardArrowRightIcon color='primary' />
              )}
            </IconButton>
          </TableCell>
        )}
        {columns.map(column => {
          if (column.visible !== undefined && !column.visible) {
            return null;
          }
          return (
            <TableCell
              key={column.id}
              className={column.classes ? `${classes[column.classes]}` : ``}
              style={column.style}
            >
              {column.cell ? (
                column.cell(row, column, classes)
              ) : (
                <Typography variant={column.variant || 'subtitle1'}>
                  {row[column.id]}
                </Typography>
              )}
            </TableCell>
          );
        })}
      </TableRow>
      {expandableRows && rowsExpanded && expandRowComponent(row, classes)}
      {treeData &&
        open &&
        subRows.map(subRow => {
          const isSubItemSelected = isSelected(subRow);
          return subRowComponent(
            subRow,
            classes,
            handleSelect,
            isSubItemSelected
          );
        })}
    </>
  );
};

export default EnhancedTableRow;
