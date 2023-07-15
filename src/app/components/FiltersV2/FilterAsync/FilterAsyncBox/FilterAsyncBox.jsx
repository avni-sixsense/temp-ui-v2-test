import { FilterBox } from '../../FilterBox';

import { FilterAsyncLabel } from '../FilterAsyncLabel';
import { FilterAsyncDate } from '../FilterAsyncDate';
import { FilterAsyncSelect } from '../FilterAsyncSelect';

export const FilterAsyncBox = ({ setData, ...props }) => {
  function onClearFilterById(id) {
    setData(d => {
      delete d[id];
      return { ...d };
    });
  }

  return (
    <FilterBox
      {...props}
      optionsByIds={[]}
      onClearFilterById={onClearFilterById}
      onFilterValueChange={payload => {
        const { id, url_key, selectedOptions } = payload;

        const isSelectedOptions =
          (Array.isArray(selectedOptions)
            ? selectedOptions.length
            : Object.keys(selectedOptions).length) > 0;

        if (isSelectedOptions) {
          setData(d => ({
            ...d,
            [id]: { url_key, selectedOptions }
          }));
        } else {
          return onClearFilterById(id);
        }
      }}
      filterLabel={FilterAsyncLabel}
      filterDate={FilterAsyncDate}
      filterSelect={FilterAsyncSelect}
    />
  );
};
