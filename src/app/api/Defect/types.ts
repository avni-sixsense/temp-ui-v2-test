export type GetUsecaseDefects = {
  use_case_id__in: number[];
  get_all_records?: boolean;
} & LocationParams;

export type DefectResponse<K> =
  | CursorPaginationResponse<K>
  | PaginationResponse<K>;
