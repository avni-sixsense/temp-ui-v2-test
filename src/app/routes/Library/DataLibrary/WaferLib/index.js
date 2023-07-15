import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import api from 'app/api';
import { AnimatedDiv } from 'app/components/Animated';
import { FilterUrl } from 'app/components/FiltersV2';
import { FILTER_IDS } from 'app/constants/filters';
import { goToPreviousRoute } from 'app/utils/navigation';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectIsFilterLoading } from 'store/filter/selector';

import { classifyWafer } from './columns';
import CustomTable from './components/Table';

const { DATE, WAFER } = FILTER_IDS;

const useStyles = makeStyles(theme => ({
  container: {
    width: 'auto'
  },
  header: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: theme.colors.grey[19]
  },
  headerbackIcon: {
    fontSize: '1rem',
    fontWeight: 700,
    color: theme.colors.grey[12]
  },
  headerContainer: {
    backgroundColor: theme.colors.grey[0]
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 400,
    color: theme.colors.grey[12]
  },
  value: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.colors.grey[12]
  },
  backIcon: {
    cursor: 'pointer'
  },
  btnContainer: {
    cursor: 'pointer'
  },
  btn: {
    fontWeight: 700,
    color: theme.colors.blue[600]
  },
  tableContainer: {
    overflow: 'hidden',
    height: 'calc(100vh - 270px)',
    '& [class*="MuiTableContainer-root"]': {
      overflow: 'auto',
      maxHeight: 'calc(100vh - 350px)',
      '&::-webkit-scrollbar': {
        width: '8px'
      },
      '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 0px white',
        borderRadius: '5px'
      },

      '&::-webkit-scrollbar-thumb': {
        backgroundColor: ' #dfdcdc',
        borderRadius: '10px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#cecece'
      }
    }
  }
}));

const WaferLib = () => {
  const classes = useStyles();

  const navigate = useNavigate();
  const location = useLocation();

  const isFilterLoading = useSelector(selectIsFilterLoading);

  const handleDrawerClose = () => {
    goToPreviousRoute(
      navigate,
      `${location.pathname.replace('/wafers', '')}?${location.search}`
    );
  };

  const { isLoading, data } = useQuery(
    ['waferLibData', location.search],
    context => api.getWaferLibData(...context.queryKey),
    { enabled: !isFilterLoading }
  );

  const primaryFilters = useMemo(() => [DATE, WAFER], []);

  return (
    <Paper className={classes.container}>
      <Box
        px={2.25}
        py={1.625}
        className={classes.headerContainer}
        display='flex'
        flexDirection='column'
      >
        <Box mb={2.5} display='flex' alignItems='center'>
          <Box
            mr={1.25}
            onClick={handleDrawerClose}
            className={classes.backIcon}
          >
            <FontAwesomeIcon
              className={classes.headerbackIcon}
              icon={faArrowLeft}
            />
          </Box>

          <Box>
            <Typography className={classes.header}>Wafer map</Typography>
          </Box>
        </Box>

        <Box mb={1.5} display='flex'>
          <FilterUrl primaryFilters={primaryFilters} />
        </Box>

        {/* <Box><TableActions /></Box> */}
      </Box>

      <AnimatedDiv
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 100 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Box pb={1}>
          <Box mb={1.5} px={2.25} className={classes.tableContainer}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <CustomTable
                columns={classifyWafer(classes)}
                data={data?.results || []}
                isLoading={false}
                total={data?.count || 0}
              />
            )}
          </Box>
        </Box>
      </AnimatedDiv>
    </Paper>
  );
};

export default WaferLib;
