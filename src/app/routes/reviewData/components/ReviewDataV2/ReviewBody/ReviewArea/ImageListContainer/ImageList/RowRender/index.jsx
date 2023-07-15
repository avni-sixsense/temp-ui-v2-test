import { calcCardIndex } from 'app/utils/reviewData';

import Card from './Card';

const RowRender = ({ index, columnIndex, rowIndex, style, colCount }) => {
  return (
    <Card
      style={style}
      index={index ?? calcCardIndex(rowIndex, columnIndex, colCount)}
      rowIndex={rowIndex}
      columnIndex={columnIndex}
    />
  );
};

export default RowRender;
