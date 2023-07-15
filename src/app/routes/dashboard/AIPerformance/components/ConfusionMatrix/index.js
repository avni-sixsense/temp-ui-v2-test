import React, { useEffect, useState } from 'react';

import ConfusionMatrix from './confusionMatrix';

const ConfusionMatrixContainer = ({ mlModelId, modelSelection }) => {
  const [numberOfColumns, setNumberOfColumns] = useState(0);
  const [compSize, setCompSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setCompSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setNumberOfColumns(
      Math.floor(Math.max(compSize.width - 54 - 350 - 100, 0) / 39)
    );
  }, [compSize]);

  return (
    <ConfusionMatrix
      columnCount={numberOfColumns}
      mlModelId={mlModelId}
      modelSelection={modelSelection}
    />
  );
};

export default ConfusionMatrixContainer;
