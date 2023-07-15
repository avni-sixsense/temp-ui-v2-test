type ClassificationType = 'SINGLE_LABEL' | 'MULTI_LABEL';

type UsecaseType = 'CLASSIFICATION' | 'CLASSIFICATION_AND_DETECTION';

type Subscription = number | string;

type MlModelStatus =
  | 'draft'
  | 'training'
  | 'ready_for_deployment'
  | 'training_failed'
  | 'deployed_in_prod'
  | 'deleted'
  | 'user_terminated'
  | 'retired';

type FetchById = {
  id: number;
};

type FetchAllRecords = {
  get_all_records?: boolean;
  subscription_id: Subscription;
};

interface PaginationParams extends FetchAllRecords {
  limit: number;
  id__in?: Array<number>;
}

interface FetchCursorPaginationList extends PaginationParams {
  cursor?: boolean;
}

interface FetchOffsetPaginationList extends PaginationParams {
  offset?: number;
}

type FetchPaginatedList = FetchOffsetPaginationList | FetchCursorPaginationList;

type CursorPaginationResponse<T> = {
  count?: number;
  next: string;
  previous: string;
  results: Array<T>;
};

type PaginationResponse<T> = {
  count: number;
  next: string;
  previous: string;
  results: Array<T>;
};

type LocationParams = {
  allowedKeys: string[];
};

type SortingOptions =
  | 'ai_output'
  | 'files__gt_classifications__defects__name'
  | 'created_ts'
  | 'defect_similarity';

type SortingOrder = 'descending' | 'accending';
