import { useParams } from 'react-router-dom';

import { Box } from '@material-ui/core';

import ChartCard from '../../ChartData';
import AutoClassificationDistribution from '../Charts/AutoClassificationDistribution';
import WaferAutoClassificationDistribution from '../Charts/WaferAutoClassificationDistribution';
import AutoClassificationTable from '../Tables/Autoclassification';
import WaferAutoClassificationTable from '../Tables/WaferAutoClassification/index';

function Monitoring() {
  // const { unit } = useSelector(({ aiPerformance }) => aiPerformance);
  const { unit } = useParams();

  return (
    <>
      {unit === 'file' && (
        <>
          <Box mb={2}>
            <ChartCard
              isLoading={false}
              title='Auto-classification Trend'
              chartComp={<AutoClassificationDistribution />}
            />
          </Box>

          <Box mb={2}>
            <AutoClassificationTable />
          </Box>
        </>
      )}

      {unit === 'wafer' && (
        <>
          <Box mb={2}>
            <ChartCard
              isLoading={false}
              title='Auto-classification Trend'
              chartComp={<WaferAutoClassificationDistribution />}
            />
          </Box>

          <Box mb={2}>
            <WaferAutoClassificationTable />
          </Box>
        </>
      )}
    </>
  );
}

export default Monitoring;
