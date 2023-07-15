import { forwardRef, useLayoutEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeGrid as Grid } from 'react-window';
import { createStructuredSelector } from 'reselect';
import InfiniteScroll from 'react-window-infinite-loader';

import Show from 'app/hoc/Show';
import RowRender from './RowRender';

import { loadImageList, setContainerLayout } from 'app/utils/modelTraining';

import {
  selectActiveTrainingMode,
  selectFileSetCount,
  selectFetchingFileSets,
  selectFileSetData
} from 'store/modelTraining/selector';

import classes from './ImageList.module.scss';

const mapTrainingState = createStructuredSelector({
  data: selectFileSetData,
  fetchingTrainingData: selectFetchingFileSets,
  fileSetCount: selectFileSetCount,
  activeTrainingMode: selectActiveTrainingMode
});

const ImageList = forwardRef(({ containerMeta, gridRef }, ref) => {
  const { data, fetchingTrainingData, fileSetCount, activeTrainingMode } =
    useSelector(mapTrainingState);

  const lastCursorCallRef = useRef('');
  const lastContainerMetaUpdateRef = useRef({
    fileSetCount: null,
    activeTrainingMode: null
  });

  useLayoutEffect(() => {
    if (
      !fetchingTrainingData &&
      (fileSetCount !== lastContainerMetaUpdateRef.current.fileSetCount ||
        activeTrainingMode !==
          lastContainerMetaUpdateRef.current.activeTrainingMode)
    ) {
      lastContainerMetaUpdateRef.current = {
        fileSetCount,
        activeTrainingMode
      };
      lastCursorCallRef.current = '';

      setContainerLayout(ref, fileSetCount);
    }
  }, [fileSetCount, activeTrainingMode, fetchingTrainingData]);

  const isItemLoaded = index => {
    return !!data[index] && !!document.getElementById(`thumbnail-img-${index}`);
  };

  return (
    <div ref={ref} id='scrollableDiv' className={classes.scrollableDiv}>
      <Show when={containerMeta && Object.keys(containerMeta).length}>
        <InfiniteScroll
          isItemLoaded={isItemLoaded}
          itemCount={fileSetCount}
          loadMoreItems={() => loadImageList(ref, lastCursorCallRef)}
        >
          {({ onItemsRendered }) => (
            <>
              <Grid
                className='Grid'
                columnCount={containerMeta.colCount}
                columnWidth={containerMeta.cardWidth}
                rowCount={Math.ceil(data.length / containerMeta.colCount)}
                rowHeight={containerMeta.cardHeight}
                width={containerMeta.totalWidth}
                height={containerMeta.containerHeight}
                onItemsRendered={gridProps => {
                  onItemsRendered({
                    overscanStartIndex: gridProps.overscanRowStartIndex,
                    overscanStopIndex: gridProps.overscanRowStopIndex,
                    visibleStartIndex: gridProps.visibleRowStartIndex,
                    visibleStopIndex: gridProps.visibleRowStopIndex
                  });
                }}
                ref={gridRef}
              >
                {e =>
                  RowRender({
                    ...e,
                    colCount: containerMeta.colCount,
                    compSize: {
                      width: containerMeta.totalWidth,
                      height: containerMeta.containerHeight
                    }
                  })
                }
              </Grid>

              <Show when={fetchingTrainingData && data.length > 0}>
                <div style={{ textAlign: 'center' }}>
                  <h5>Loading...</h5>
                </div>
              </Show>
            </>
          )}
        </InfiniteScroll>
      </Show>
    </div>
  );
});

export default ImageList;
