import { useMemo } from 'react';
import { DefectLevel } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/DefectLevel';
import { DistributionAccuracyCard } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracyCard';
import MisclassificationTable from '../BodyBox/Tables/Misclassification';
import ConfusionMatrixContainer from '../ConfusionMatrix';
import { OnDemandDefectDataColumns } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/DefectLevel/columns';
import { OnDemandWaferColumns } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/WaferLevel/columns';
import { OnDemandWaferLevel } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/WaferLevel/OnDemandWaferLevel';

const SIMILAR_TRAINING_IMAGES = 'Similar Training Images';

export const OnDemandDefectDistribution = ({
  mlModelId
}: {
  mlModelId: number;
}) => {
  const filterColumns = ({ name }: { name: string }) =>
    name !== SIMILAR_TRAINING_IMAGES;

  const DROPDOWN_CONSTANT = useMemo(
    () => [
      {
        label: 'Wafer',
        value: 'wafer',
        comp: (
          <OnDemandWaferLevel
            mlModelId={mlModelId}
            columns={OnDemandWaferColumns}
            modelSelection='live'
            cohortDistribution={{ accuracy_cohorts: '0,80,90,100' }}
          />
        )
      },
      {
        label: 'Defect',
        value: 'defect',
        comp: (
          <DefectLevel
            mlModelId={mlModelId}
            columns={OnDemandDefectDataColumns}
            modelSelection='live'
          />
        )
      }
    ],
    [mlModelId]
  );

  return (
    <>
      <DistributionAccuracyCard
        header='Distribution of Accuracy on'
        data={DROPDOWN_CONSTANT}
      />

      <ConfusionMatrixContainer mlModelId={mlModelId} modelSelection='live' />
      <MisclassificationTable
        mlModelId={mlModelId}
        columnFilter={filterColumns}
        modelSelection='live'
      />
    </>
  );
};
