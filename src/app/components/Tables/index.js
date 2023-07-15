import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import React, { useEffect, useRef, useState } from 'react';

import LoadingOverlay from './LoadingOverlay';
import useStyles from './styles';
import TableHeader from './TableHeader';
import EnhancedTableRow from './TableRow';

const CustomTable = ({
  columns = [],
  data = [],
  isLoading,
  expandableRows = false,
  rowsExpanded = false,
  onSelect,
  subRowComponent,
  treeData = false,
  expandRowComponent,
  selector = 'id',
  rowStyleProps = {},
  checkboxProps = {}
}) => {
  const classes = useStyles({ rowStyleProps });
  const [selected, setSelected] = useState([]);
  const selectRef = useRef(null);

  useEffect(() => {
    if (data.length) {
      setSelected([]);
    }
  }, [data]);

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = data.map(n => n[selector]);
      setSelected(newSelecteds);
      onSelect(data);
      return;
    }
    setSelected([]);
    onSelect([]);
  };

  const handleClick = row => {
    const selectedIndex = selected.indexOf(row[selector]);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row[selector]);
    } else {
      newSelected = selected.filter(id => id !== row[selector]);
    }
    if (treeData && !row.parent) {
      const subRows = data
        .filter(item => item.parent === row.id)
        .map(item => item[selector]);
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(newSelected, subRows);
        newSelected = [...new Set(newSelected)];
      } else {
        newSelected = newSelected.filter(id => !subRows.includes(id));
      }
    }

    setSelected(newSelected);
    selectRef.current = newSelected;
    const rows = newSelected.map(key => {
      return data.find(item => item[selector] === key);
    });
    onSelect(rows);
  };

  const isSelected = row => selected.indexOf(row[selector]) !== -1;

  const getSubRows = row => data.filter(item => item.parent === row.id);

  return (
    <LoadingOverlay isLoading={isLoading}>
      <Table>
        <TableHeader
          columns={columns}
          expnandableRows={expandableRows}
          onSelectAllClick={handleSelectAllClick}
          allSelected={selected.length === data.length && data.length > 0}
          indeterminate={selected.length > 0 && selected.length < data.length}
          treeData={treeData}
        />
        <TableBody className={classes.tableBody}>
          {data.map(row => {
            const isItemSelected = isSelected(row);
            if (treeData && row.parent) {
              return null;
            }
            const subRows = treeData ? getSubRows(row) : [];
            return (
              <EnhancedTableRow
                key={row.id}
                row={row}
                columns={columns}
                selected={selected}
                handleSelect={handleClick}
                allSelected={selected.length === data.length && data.length > 0}
                isItemSelected={isItemSelected}
                subRowComponent={subRowComponent}
                subRows={subRows}
                treeData={treeData}
                rowsExpanded={rowsExpanded}
                expandableRows={expandableRows}
                expandRowComponent={expandRowComponent}
                selector={selector}
                checkboxProps={checkboxProps}
              />
            );
          })}
        </TableBody>
      </Table>
    </LoadingOverlay>
  );
};

export default CustomTable;
