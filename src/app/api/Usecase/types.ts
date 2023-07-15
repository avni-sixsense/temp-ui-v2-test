export type UsecaseFetch = {
  search?: string;
  model_status__in?: MlModelStatus;
} & FetchPaginatedList;

export type UsecaseFetchAll = FetchAllRecords & LocationParams;

export type createUseCaseType = {
  classification_type?: ClassificationType;
  defects?: Array<number>;
  name: string;
  subscription: Subscription;
  type: UsecaseType;
};

export type updateUseCaseType = {
  id: number;
  data: {
    defects?: Array<number>;
    name?: string;
  };
};

export type Defect = {
  id: number;
  name: string;
  description: string;
  organization_defect_code: string | number;
  code: string | number;
  subscription: Subscription;
  created_ts: string;
  created_by: number;
  hot_key: string;
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  display_name: string;
  created_by: string | null;
  sub_organizations: Array<any>;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
};

export type Usecase = {
  id: number;
  name: string;
  type: UsecaseType;
  ml_model: any;
  defects: Array<Defect>;
  subscription: Subscription;
  created_ts: string;
  created_by: User;
  file_set_count: number;
  defect_count: number;
  classification_type: ClassificationType;
};

export type UsecaseResponse<K> =
  | CursorPaginationResponse<K>
  | PaginationResponse<K>;
