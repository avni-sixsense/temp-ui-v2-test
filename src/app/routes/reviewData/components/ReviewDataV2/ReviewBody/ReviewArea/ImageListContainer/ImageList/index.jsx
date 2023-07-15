import { forwardRef, useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FixedSizeGrid as Grid, FixedSizeList as List } from 'react-window';
import InfiniteScroll from 'react-window-infinite-loader';
import { createStructuredSelector } from 'reselect';

import { loadImageList, setContainerLayout } from 'app/utils/reviewData';

import Show from 'app/hoc/Show';

import RowRender from './RowRender';

import {
  selectReviewData,
  selectFetchingReviewData,
  selectActiveImageModeCount,
  selectFileSetCount,
  selectActiveImageMode
} from 'store/reviewData/selector';
import { AUDIT, MANUAL_CLASSIFY } from 'store/reviewData/constants';

import classes from './ImageList.module.scss';

const mapReviewState = createStructuredSelector({
  data: selectReviewData,
  fetchingReviewData: selectFetchingReviewData,
  activeImageModeCount: selectActiveImageModeCount,
  fileSetCount: selectFileSetCount,
  activeImageMode: selectActiveImageMode
});

const ImageList = forwardRef(
  ({ containerMeta, gridRef, listRef, activeGridMode }, ref) => {
    const { annotationType } = useParams();

    const {
      data,
      fetchingReviewData,
      activeImageModeCount,
      fileSetCount,
      activeImageMode
    } = useSelector(mapReviewState);

    const lastCursorCallRef = useRef('');
    const lastContainerMetaUpdateRef = useRef({
      itemCount: null,
      activeGridMode: null,
      activeImageMode: null
    });

    const itemCount =
      annotationType === MANUAL_CLASSIFY || annotationType === AUDIT
        ? activeImageModeCount
        : fileSetCount;

    useLayoutEffect(() => {
      if (
        !fetchingReviewData &&
        (itemCount !== lastContainerMetaUpdateRef.current.itemCount ||
          activeGridMode !==
            lastContainerMetaUpdateRef.current.activeGridMode ||
          activeImageMode !==
            lastContainerMetaUpdateRef.current.activeImageMode)
      ) {
        lastContainerMetaUpdateRef.current = {
          itemCount,
          activeGridMode,
          activeImageMode
        };
        lastCursorCallRef.current = '';

        setContainerLayout(ref, itemCount);
      }
    }, [itemCount, activeGridMode, activeImageMode, fetchingReviewData]);

    const isItemLoaded = index => {
      return (
        !!data[index] && !!document.getElementById(`thumbnail-img-${index}`)
      );
    };

    return (
      <div ref={ref} id='scrollableDiv' className={classes.scrollableDiv}>
        <Show when={containerMeta && Object.keys(containerMeta).length}>
          <InfiniteScroll
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={() =>
              loadImageList(ref, lastCursorCallRef, annotationType)
            }
          >
            {({ onItemsRendered }) => (
              <>
                {activeGridMode === 'Grid View' ? (
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
                ) : (
                  <List
                    className='List'
                    height={containerMeta.containerHeight}
                    itemCount={data.length}
                    itemSize={containerMeta.cardHeight}
                    onItemsRendered={onItemsRendered}
                    ref={listRef}
                    width={containerMeta.totalWidth}
                  >
                    {e =>
                      RowRender({
                        ...e,
                        compSize: {
                          width: containerMeta.totalWidth,
                          height: containerMeta.containerHeight
                        }
                      })
                    }
                  </List>
                )}

                <Show when={fetchingReviewData && data.length > 0}>
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
  }
);

export default ImageList;
