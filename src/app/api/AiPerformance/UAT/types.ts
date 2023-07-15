export type DistributionTableResponse<T> = PaginatedTableResponseType<T>;

export type FetchDistributionAccuracyData = {
  is_inferenced: boolean;
  ml_model_status__in: 'deployed_in_prod';
  limit: number;
  offset: number;
};

export type DistributionAccuracyData = {};

export type DistributionAccuracyWaferData = {
  use_case_name: string;
  ml_model_name: string;
  use_case_id: number;
  ml_model_id: number;
  total_wafer_count: number;
  auto_classified_wafer_count: number;
  manual_wafer_count: number;
  successful_wafer_count: number;
};
