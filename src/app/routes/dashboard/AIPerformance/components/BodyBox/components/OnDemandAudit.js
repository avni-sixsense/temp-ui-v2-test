import { Box } from '@material-ui/core';

import ChartCard from '../../ChartData';
import UsecaseAccuracyDistribution from '../Charts/UsecaseAccuracyDistributaion';
import UsecaseSelector from './usecaseSelector';
import { ModelSelectorContainer } from './ModelSelectorContainer';

function OnDemandAudit() {
  return (
    <>
      <Box mb={2}>
        <ChartCard
          isLoading={false}
          title='Usecase Accuracy distribution'
          chartComp={<UsecaseAccuracyDistribution />}
        />
      </Box>
      <UsecaseSelector />
      <ModelSelectorContainer />
    </>
  );
}

export default OnDemandAudit;
