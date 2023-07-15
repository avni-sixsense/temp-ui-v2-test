export type FetchModelDeploymentHistory = {
  file_set_filters?: string;
  use_case_id: number;
} & LocationParams;

export type ModelDeploymentHistoryResponse = {
  ml_model_id: number;
  ml_model_name: string;
  deployment_id: number | null;
  starts_at: string | null;
  ends_at: string | null;
  auto_classification_percentage: number;
};

export type UnitType = {
  unit: 'image' | 'wafer';
};
