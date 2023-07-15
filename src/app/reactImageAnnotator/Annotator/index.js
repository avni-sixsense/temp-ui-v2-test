// @flow

import React, { useEffect, useReducer } from 'react';
import { Matrix } from 'transformation-matrix-js';

import MainLayout from '../MainLayout';
import SettingsProvider from '../SettingsProvider';
import reducer from './reducer';

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, 0, 0);

export default ({
  images,
  onImagesChange = () => {},
  allowedArea,
  selectedImage = images.length > 0 ? images[0].src : undefined,
  showPointDistances,
  pointDistancePrecision,
  selectedTool = 'select',
  showTags = true,
  enabledTools = [
    'select',
    'create-point',
    'create-box',
    'create-polygon',
    'create-circle'
  ],
  regionTagList = [],
  regionClsList = [],
  imageTagList = [],
  imageClsList = [],
  taskDescription,
  currentMat = getDefaultMat(),
  changeMat,
  onIhIwChange = () => {},
  onExit,
  setImageLoaded = () => {},
  handleScaleChange = () => {},
  setCurrentRegions,
  rollOverZoom = false,
  resetDeleted = false,
  // handleSaveRegion = () => {},
  handleCheckClick = () => {}
  // isAnnotation,
}) => {
  const [state, dispatchToReducer] = useReducer(reducer, {
    showTags,
    allowedArea,
    selectedImage,
    showPointDistances,
    pointDistancePrecision,
    selectedTool,
    mode: null,
    taskDescription,
    images,
    onImagesChange,
    labelImages: imageClsList.length > 0 || imageTagList.length > 0,
    regionClsList,
    regionTagList,
    imageClsList,
    imageTagList,
    currentMat,
    changeMat,
    onIhIwChange,
    enabledTools,
    history: [],
    deletedRegions: [],
    setImageLoaded,
    handleScaleChange,
    setCurrentRegions,
    rollOverZoom,
    // handleSaveRegion,
    handleCheckClick
    // isAnnotation,
  });
  useEffect(() => {
    dispatchToReducer({ type: 'SELECT_TOOL', selectedTool });
  }, [selectedTool]);

  // useEffect(() => {
  // 	dispatchToReducer({ type: 'SET_ANNOTATION', isAnnotation })
  // }, [isAnnotation])

  useEffect(() => {
    if (showTags !== state.showTags && state.mode?.mode !== 'RESIZE_BOX') {
      dispatchToReducer({ type: 'SELECT_TOOL', selectedTool: 'show-tags' });
    }
  }, [showTags, state.showTags]);

  useEffect(() => {
    dispatchToReducer({ type: 'CHANGE_IMAGES', images });
  }, [images]);

  useEffect(() => {
    if (resetDeleted) {
      dispatchToReducer({ type: 'SET_DELETED_REGIONS' });
    }
  }, [resetDeleted]);

  useEffect(() => {
    dispatchToReducer({ type: 'CHANGE_REGION_TAGS', regionTagList });
  }, [regionTagList]);
  // Bottom line is Removed from dependency
  // JSON.stringify(regionTagList)

  useEffect(() => {
    dispatchToReducer({ type: 'SELECT_IMAGE', image: { src: selectedImage } });
  }, [selectedImage]);

  useEffect(() => {
    dispatchToReducer({ type: 'CHANGE_CURRENT_MAT', currentMat });
  }, [currentMat]);
  // Bottom line is Removed from dependency
  // JSON.stringify(currentMat)

  const dispatch = action => {
    if (
      action.type === 'HEADER_BUTTON_CLICKED' &&
      (action.buttonName === 'Exit' ||
        action.buttonName === 'Done' ||
        action.buttonName === 'Save' ||
        action.buttonName === 'Complete')
    ) {
      onExit({ ...state, history: undefined });
    } else {
      dispatchToReducer(action);
    }
  };

  return (
    <SettingsProvider>
      <MainLayout debug state={state} dispatch={dispatch} />
    </SettingsProvider>
  );
};
