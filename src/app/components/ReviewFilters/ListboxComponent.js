import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { VariableSizeList as List } from 'react-window';
import InfiniteScroll from 'react-window-infinite-loader';

import useStyles from './styles';

function renderRow(props) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const classes = useStyles();
  const {
    children,
    loadFileSets,
    total,
    isItemLoaded,
    isLoading,
    styles = {},
    ...other
  } = props;
  const itemData = React.Children.toArray(children);
  const itemCount = itemData.length;

  const getItemSize = index => {
    return 30;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * 30;
    }
    return itemData.map(getItemSize).reduce((a, b) => a + b, 0);
  };

  return (
    <div ref={ref} className={classes.scroll}>
      <OuterElementContext.Provider value={other}>
        <InfiniteScroll
          isItemLoaded={isItemLoaded}
          itemCount={total}
          threshold={7}
          // loadMoreItems={!shouldLoadMoreFiles ? () => {} : loadFileSets}
          loadMoreItems={loadFileSets}
        >
          {({ ref, onItemsRendered }) => (
            <List
              itemData={itemData}
              height={getHeight()}
              width='100%'
              outerElementType={OuterElementType}
              innerElementType='ul'
              itemSize={getItemSize}
              overscanCount={5}
              itemCount={itemCount}
              onItemsRendered={onItemsRendered}
              ref={ref}
            >
              {renderRow}
            </List>
          )}
        </InfiniteScroll>

        {isLoading && (
          <p className={clsx(classes.loadingText, styles.loading)}>
            Loading ...
          </p>
        )}
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node
};

export default ListboxComponent;
