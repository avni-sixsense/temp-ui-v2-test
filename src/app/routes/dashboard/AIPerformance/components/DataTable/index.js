// import Pagination from 'app/components/ReviewPagination'
import EmptyState from 'app/components/EmptyState';
import CustomPagination from 'app/components/Pagination';
import CustomizedCheckbox from 'app/components/ReviewCheckbox';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
// import DataCard from '../ChartData'

const CustomTable = ({
  data,
  columns,
  selectableRows,
  handleChange,
  clearSelectedRows,
  page,
  rowsPerPage,
  handlePagechange,
  handleRowsPerPage,
  total,
  pagination = false,
  scrollableHeight = 0,
  onSort,
  defaultSortAsc = false
}) => {
  // const [page, setPage] = useState(1)
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // if (data) {
    // 	setPage(1)
    // 	setTableData(data.slice(0, 10))
    // }
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const customStyles = {
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderBottom: '2px solid #E0ECFD'
        },
        fontSize: '0.75rem',
        fontWeight: 500,
        color: '#000000'
      }
    },
    headRow: {
      style: {
        borderRadius: '0px',
        backgroundColor: '#E0ECFD',
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
        color: '#000000',
        textAlign: 'center'
        // whiteSpace: 'nowrap',
      }
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
        fontSize: '0.75rem',
        fontWeight: `500 !important`,
        color: '#000000',
        '& a': {
          color: '#000000'
        }
      }
    }
  };

  // const handlePageChange = (event, page) => {
  // 	setPage(page)
  // 	setTableData(data.slice((page - 1) * 10, page * 10))
  // }

  if (tableData.length === 0) {
    return <EmptyState isTable />;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={tableData}
        noHeader
        customStyles={customStyles}
        dense
        fixedHeader
        fixedHeaderScrollHeight={`${scrollableHeight}px`}
        selectableRows={selectableRows}
        onSelectedRowsChange={handleChange}
        clearSelectedRows={clearSelectedRows}
        selectableRowsComponent={React.forwardRef((event, ref) => (
          <CustomizedCheckbox {...event} ref={ref} whiteTheme />
        ))}
        onSort={onSort}
        defaultSortAsc={defaultSortAsc}
      />
      {/* <Pagination
				page={page}
				rowsPerPage={10}
				handlePagechange={handlePageChange}
				count={Math.ceil(total / 10)}
			/> */}
      {pagination && (
        <CustomPagination
          page={page}
          rowsPerPage={rowsPerPage}
          handlePagechange={handlePagechange}
          handleRowsPerPage={handleRowsPerPage}
          count={Math.ceil(total / rowsPerPage)}
          pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        />
      )}
    </>
  );
};

export default CustomTable;
