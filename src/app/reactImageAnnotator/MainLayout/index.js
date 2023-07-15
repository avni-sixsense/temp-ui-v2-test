// @flow

import React, { useEffect } from 'react';
import ImageCanvas from '../ImageCanvas';
import useKey from 'use-key-hook';
import { useSettings } from '../SettingsProvider';
import { Matrix } from 'transformation-matrix-js';
import { useDispatch } from 'react-redux';
import { updateGTDetections } from 'store/reviewData/actions';
import { createRegionPayload } from 'app/utils/reviewData';

const MainLayout = ({ state, dispatch }) => {
  const settings = useSettings();

  const reduxDispatch = useDispatch();

  const action =
    (type, ...params) =>
    (...args: any) =>
      params.length > 0
        ? dispatch(
            ({
              type,
              ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {})
            }: any)
          )
        : dispatch({ type, ...args[0] });

  const currentImage = state.images.find(
    img => img.src === state.selectedImage
  );

  useKey(() => dispatch({ type: 'CANCEL' }), {
    detectKeys: [27]
  });

  if (state.changeMat === undefined) {
    state.changeMat = mat => {
      dispatch({
        type: 'CHANGE_CURRENT_MAT',
        currentMat: mat
      });
    };
  }

  useEffect(() => {
    state.onImagesChange(state.images);
  }, [JSON.stringify(state.images)]);

  useEffect(() => {
    const currentRegions =
      currentImage && currentImage.regions ? currentImage.regions : [];
    const deletedRegions = state.deletedRegions ? state.deletedRegions : [];
    const isAllBox = currentRegions.every(item => item.type === 'box');

    if (
      currentRegions.length > 1 &&
      // !currentRegions[currentRegions.length - 2]?.tags?.length &&
      isAllBox
    ) {
      const deletableRegion = [];
      const regionList = [];
      currentRegions.forEach((x, index) => {
        if (
          // index === currentRegions.length - 2 ||
          x.width === 0 &&
          x.height === 0
        ) {
          deletableRegion.push(x);
        } else {
          regionList.push(x);
        }
      });
      state.setCurrentRegions([...regionList, ...deletedRegions]);
      if (deletableRegion.length) {
        action('DELETE_REGION', 'region')(deletableRegion[0]);
      }
    } else {
      state.setCurrentRegions([...currentRegions, ...deletedRegions]);
    }
  }, [currentImage]);

  const handleDeleteRegion = deletableRegion => {
    if (!(deletableRegion.tags || []).length) {
      action('DELETE_REGION', 'region')(deletableRegion);
      return;
    }
    const tempRegions = state.images[0].regions.filter(
      x => x !== deletableRegion && !x.is_ai_region
    );
    const userDetectionRegions = [];
    tempRegions.forEach(region =>
      userDetectionRegions.push(createRegionPayload(region))
    );

    reduxDispatch(updateGTDetections(userDetectionRegions));
  };

  const handleRegionCheckClick = region => {
    state.handleCheckClick(region, currentImage);
  };

  const handleRegionSave = region => {
    const { id, src, name, regions } = currentImage;
    const tempObj = {};
    tempObj.id = id;
    tempObj.src = src;
    tempObj.name = name;
    tempObj.regions = regions.filter(x => x.id !== region.id);
    state.handleCheckClick(region, tempObj);
  };
  // console.log({ currentImage })

  return (
    // <div className={classnames(classes.container, state.fullScreen && 'Fullscreen')}>
    // 	<div className={classes.workspace}>
    // 		<div className={classes.iconToolsContainer}>
    // 			<IconTools
    // 				enabledTools={state.enabledTools}
    // 				showTags={state.showTags}
    // 				selectedTool={state.selectedTool}
    // 				onClickTool={action('SELECT_TOOL', 'selectedTool')}
    // 			/>
    // 		</div>
    <div style={{ width: '100%', height: '100%', maxHeight: '60vh' }}>
      <ImageCanvas
        {...settings}
        key={state.selectedImage}
        showTags={state.showTags}
        allowedArea={state.allowedArea}
        regionClsList={state.regionClsList}
        regionTagList={state.regionTagList}
        regions={currentImage ? currentImage.regions || [] : []}
        realSize={currentImage ? currentImage.realSize : undefined}
        imageSrc={state.selectedImage}
        pointDistancePrecision={state.pointDistancePrecision}
        createWithPrimary={state.selectedTool.includes('create')}
        dragWithPrimary={state.selectedTool === 'pan'}
        zoomWithPrimary={state.selectedTool === 'zoom'}
        zoomOutWithPrimary={state.selectedTool === 'zoom-out'}
        showPointDistances={state.showPointDistances}
        zoomHistory={state.zoomHistory}
        changeZoomHistory={action('ZOOM_HISTORY', 'region', 'direction')}
        resetZoomHistory={action('RESET_ZOOM_HISTORY')}
        onMouseMove={action('MOUSE_MOVE')}
        onMouseDown={action('MOUSE_DOWN')}
        onMouseUp={action('MOUSE_UP')}
        onChangeRegion={action('CHANGE_REGION', 'region')}
        onBeginRegionEdit={action('OPEN_REGION_EDITOR', 'region')}
        onCloseRegionEdit={action('CLOSE_REGION_EDITOR', 'region')}
        onDeleteRegion={handleDeleteRegion}
        onBeginCircleTransform={action(
          'BEGIN_CIRCLE_TRANSFORM',
          'circle',
          'directions'
        )}
        onBeginBoxTransform={action('BEGIN_BOX_TRANSFORM', 'box', 'directions')}
        onBeginMovePolygonPoint={action(
          'BEGIN_MOVE_POLYGON_POINT',
          'polygon',
          'pointIndex'
        )}
        onAddPolygonPoint={action(
          'ADD_POLYGON_POINT',
          'polygon',
          'point',
          'pointIndex'
        )}
        onSelectRegion={action('SELECT_REGION', 'region')}
        onBeginMovePoint={action('BEGIN_MOVE_POINT', 'point')}
        onImageLoaded={action('IMAGE_LOADED', 'image')}
        mat={Matrix.from(state.currentMat)}
        changeMat={state.changeMat}
        onIhIwChange={state.onIhIwChange}
        setImageLoaded={state.setImageLoaded}
        handleScaleChange={state.handleScaleChange}
        rollOverZoom={state.rollOverZoom}
        handleCheckClick={handleRegionCheckClick}
        handleRegionSave={handleRegionSave}
        onCancelRegionSelect={action('CANCEL')}
      />
    </div>
    // 		<div className={classes.sidebarContainer}>
    // 			<Sidebar
    // 				debug={window.localStorage.$ANNOTATE_DEBUG_MODE && state}
    // 				taskDescription={state.taskDescription}
    // 				images={state.images}
    // 				regions={currentImage ? currentImage.regions || [] : []}
    // 				history={state.history}
    // 				currentImage={currentImage}
    // 				labelImages={state.labelImages}
    // 				imageClsList={state.imageClsList}
    // 				imageTagList={state.imageTagList}
    // 				onChangeImage={action('CHANGE_IMAGE', 'delta')}
    // 				onSelectRegion={action('SELECT_REGION', 'region')}
    // 				onDeleteRegion={action('DELETE_REGION', 'region')}
    // 				onSelectImage={action('SELECT_IMAGE', 'image')}
    // 				onChangeRegion={action('CHANGE_REGION', 'region')}
    // 				onRestoreHistory={action('RESTORE_HISTORY')}
    // 			/>
    // 		</div>
    // 	</div>
    // </div>
  );
};

export default MainLayout;
