// import Pagination from 'app/components/ReviewPagination'
import React from 'react';
import DataTable from 'react-data-table-component';
// import DataCard from '../ChartData'

const CustomTable = ({
  data,
  columns,
  total,
  selectableRows,
  onSelectedRowsChange
}) => {
  // const [page, setPage] = useState(1)
  // const [tableData, setTableData] = useState([])

  // useEffect(() => {
  // 	if (data) {
  // 		setPage(1)
  // 		setTableData(data.slice(0, 10))
  // 	}
  // }, [data])

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
        paddingLeft: '19px',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: '#000000',
        textAlign: 'center'
        // whiteSpace: 'nowrap',
      }
    },
    cells: {
      style: {
        paddingLeft: '19px',
        fontSize: '0.75rem',
        fontWeight: `500 !important`,
        color: '#000000'
      }
    }
  };

  // const handlePageChange = (event, page) => {
  // 	setPage(page)
  // 	setTableData(data.slice((page - 1) * 10, page * 10))
  // }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        noHeader
        customStyles={customStyles}
        dense
        selectableRows={selectableRows}
        onSelectedRowsChange={onSelectedRowsChange}
      />
      {/* <Pagination
				page={page}
				rowsPerPage={10}
				handlePagechange={handlePageChange}
				count={Math.ceil(total / 10)}
			/> */}
    </>
  );
};

export default CustomTable;
