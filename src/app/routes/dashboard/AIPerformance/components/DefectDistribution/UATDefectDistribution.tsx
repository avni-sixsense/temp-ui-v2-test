import { DefectLevel } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/DefectLevel';
import { UATDefectDataColumns } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/DefectLevel/columns';
import { FolderLevel } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/FolderLevel';
import { UATWaferLevel } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/WaferLevel/UATWaferLevel';
import { UATWaferColumns } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracy/WaferLevel/columns';
import { DistributionAccuracyCard } from '../BodyBox/Charts/DistributionAccuracyContainer/DistributionAccuracyCard';
import MisclassificationTable from '../BodyBox/Tables/Misclassification';
import ConfusionMatrixContainer from '../ConfusionMatrix';

export const UATDefectDistribution = ({ mlModelId }: { mlModelId: number }) => {
  const DROPDOWN_CONSTANT = [
    {
      label: 'Wafer',
      value: 'wafer',
      comp: (
        <UATWaferLevel
          mlModelId={mlModelId}
          columns={UATWaferColumns}
          modelSelection='latest'
          cohortDistribution={{
            accuracy_cohorts: '0,90,100',
            auto_classification_cohorts: '0,93,100'
          }}
        />
      )
    },
    {
      label: 'Defect',
      value: 'defect',
      comp: (
        <DefectLevel
          mlModelId={mlModelId}
          columns={UATDefectDataColumns}
          modelSelection='latest'
        />
      )
    },
    {
      label: 'Folder',
      value: 'folder',
      comp: <FolderLevel mlModelId={mlModelId} />
    }
  ];

  return (
    <>
      <DistributionAccuracyCard
        header='See auto-classification & accuracy breakdown by'
        data={DROPDOWN_CONSTANT}
      />

      <ConfusionMatrixContainer mlModelId={mlModelId} modelSelection='latest' />
      <MisclassificationTable mlModelId={mlModelId} modelSelection='latest' />
    </>
  );
};
