import Show from 'app/hoc/Show';

import classes from './FilterList.module.scss';

export const FilterList = ({
  filterList,
  setFilterList,
  theme,
  filterBox: FilterBox,
  ...props
}) => {
  return (
    <Show when={filterList.length > 0}>
      <div className={classes.filterList}>
        {filterList.map((d, idx) => {
          return (
            <FilterBox
              key={d.id}
              {...d}
              setFilterList={setFilterList}
              uniqueId={filterList.length + idx}
              theme={theme}
              {...props}
            />
          );
        })}
      </div>
    </Show>
  );
};
