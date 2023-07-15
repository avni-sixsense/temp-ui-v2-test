import PropTypes from 'prop-types';
import React from 'react';
import { FixedSizeList } from 'react-window';

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
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const itemCount = itemData.length;

  const getItemSize = () => {
    return 30;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * 30;
    }
    return itemData.map(getItemSize).reduce((a, b) => a + b, 0);
  };

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          itemData={itemData}
          height={getHeight()}
          width='100%'
          outerElementType={OuterElementType}
          innerElementType='ul'
          itemSize={30}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node
};

export default ListboxComponent;
