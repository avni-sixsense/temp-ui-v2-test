import EmptyState from 'app/components/EmptyState';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const CustomTable = ({
  data,
  columns,
  selectableRows,
  onchange,
  maxHeight
}) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const customStyles = {
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottom: '2px solid #F0F7FF'
        },
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#030407'
      }
    },
    headRow: {
      style: {
        borderRadius: '0px',
        backgroundColor: '#F0F7FF',
        textTransform: 'uppercase',
        paddingTop: '7px',
        paddingBottom: '7px'
      }
    },
    headCells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: '#3E5680',
        textAlign: 'center'
        // whiteSpace: 'nowrap',
      }
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
        fontSize: '0.875rem',
        fontWeight: `500 !important`,
        color: '#030407'
      }
    }
  };

  if (tableData.length === 0) {
    return <EmptyState isTable />;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        noHeader
        fixedHeader
        fixedHeaderScrollHeight={maxHeight}
        customStyles={customStyles}
        selectableRows={selectableRows}
        onSelectedRowsChange={onchange}
      />
    </>
  );
};

export default CustomTable;
