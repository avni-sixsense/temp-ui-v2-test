type AnnotationTypes = 'review' | 'manual-classify' | 'audit';

type ManualClassifyImageModes = 'Classified' | 'Unclassified';

type AuditImageModes = 'Audited' | 'Unaudited';

type ReviewActiveImageModes = ManualClassifyImageModes | AuditImageModes;

type ReviewSorting = {
  sortBy: SortingOptions;
  sortDirection: SortingOrder;
};

type ReviewGridMode = 'Canvas View' | 'Grid View';

type ReviewImageTools = 'pan' | 'zoom' | 'zoom-out' | 'select' | 'create-box';

type ReviewRegionTypes = 'box' | 'point';

interface ObjectType {
  [x: string]: string | number | null | ObjectType | Array<ObjectType>;
}

declare module '*.scss';

type PaginatedTableResponseType<T> = {
  count: number;
  next: string;
  previous: string;
  results: Array<T>;
};
