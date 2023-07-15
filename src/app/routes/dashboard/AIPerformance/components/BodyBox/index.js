import Box from '@material-ui/core/Box';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setActiveUsecaseCount } from 'store/aiPerformance/actions';
import { AI_PERFORMANCE_ROUTES } from 'store/aiPerformance/constants';

import DataCardContainer from './components/dataCardContainer';
import Monitoring from './components/Monitoring';
import OnDemandAudit from './components/OnDemandAudit';
import Uat from './components/Uat';

const { MONITORING, ON_DEMAND_AUDIT, UAT } = AI_PERFORMANCE_ROUTES;

const AIPerformanceBody = () => {
  const dispatch = useDispatch();
  // const { mode } = useSelector(({ aiPerformance }) => aiPerformance);

  const { mode } = useParams();

  useEffect(() => {
    dispatch(setActiveUsecaseCount());
  }, []);

  return (
    <Box>
      <DataCardContainer />
      {mode === MONITORING.path && <Monitoring />}
      {mode === ON_DEMAND_AUDIT.path && <OnDemandAudit />}
      {mode === UAT.path && <Uat />}
    </Box>
  );
};

export default AIPerformanceBody;
