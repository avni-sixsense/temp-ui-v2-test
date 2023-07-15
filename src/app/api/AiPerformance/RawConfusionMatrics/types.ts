export type RawConfusionMatricsParams = {
  mlModelId: number;
} & LocationParams;

export type RawConfusionMatricsData = {
  gt_defect: number;
  ai_defect: number;
  total_count: number;
  automated_count: number;
  audited_fileset_count: number;
};

export type RawConfusionMatricsResponse = {
  confusion_matrix: Array<RawConfusionMatricsData>;
  defects: {
    [x: number]: {
      defect_name: string;
      is_trained_defect: boolean;
      organization_defect_code: string | number | null;
    };
  };
};

export type DistributionTableResponse<T> = PaginatedTableResponseType<T>;

export type FolderLevelDistributionAccuracyData = {
  folder_id: number;
  folder_name: string;
  total_fileset_count: number;
  auto_classified_fileset_count: number;
  manual_classified_fileset_count: number;
  audited_fileset_count: number;
  correct_classified_fileset_count: number;
  incorrect_fileset_count: number;
  auto_classification_percentage: number;
  accuracy_percentage: number;
};

export type WaferLevelDistributionAccuracyData = {
  wafer_id: number;
  wafer_name: string;
  total_fileset_count: number;
  auto_classified_fileset_count: number;
  manual_classified_fileset_count: number;
  audited_fileset_count: number;
  correct_classified_fileset_count: number;
  incorrect_fileset_count: number;
  auto_classification_percentage: number;
  accuracy_percentage: number;
};

export type FetchFolderLevelDistributionAccuracyData = {
  mlModelId: number;
  limit: number;
  offset: number;
};

export type FetchDistributionAccuracyCohort = {
  mlModelId: number;
} & (
  | {
      accuracy_cohorts: '0,80,90,100';
    }
  | {
      auto_classification_cohorts: '0,93,100';
    }
  | {
      accuracy_cohorts: '0,90,100';
      auto_classification_cohorts: '0,93,100';
    }
);

export type WaferCohortResponse = {
  cohort_name: string;
  count: number;
};

export type folderCohortResponse = {
  cohort_name: string;
  count: number;
};
