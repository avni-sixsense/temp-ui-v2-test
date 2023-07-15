/* eslint-disable */

import { moveRegion } from '../ImageCanvas/region-tools.js';
import { setIn, updateIn } from 'seamless-immutable';
import moment from 'moment';
import { Matrix } from 'transformation-matrix-js';
import isEqual from 'lodash/isEqual';
import { moveFocusToParent } from 'app/utils/reviewData.js';

const getRandomId = () => Math.random().toString().split('.')[1];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomColor = () => {
  const h = getRandomInt(0, 360);
  const s = 100;
  const l = 50;
  return `hsl(${h},${s}%,${l}%)`;
};

const typesToSaveWithHistory = {
  BEGIN_BOX_TRANSFORM: 'Transform/Move Box',
  BEGIN_CIRCLE_TRANSFORM: 'Transform/Move Circle',
  BEGIN_MOVE_POINT: 'Move Point',
  DELETE_REGION: 'Delete Region'
};

const cancelAllEvents = (state, currentImageIndex) => {
  moveFocusToParent();
  const { mode } = state;

  if (mode) {
    switch (mode.mode) {
      case 'DRAW_POLYGON': {
        const { regionId } = mode;
        return modifyRegion(regionId, null);
      }
      case 'MOVE_POLYGON_POINT':
      case 'RESIZE_BOX':
      case 'RESIZE_CIRCLE':
      case 'MOVE_REGION': {
        return setIn(state, ['mode'], null);
      }
    }
  }

  // Close any open boxes
  const regions = state.images[currentImageIndex].regions;

  return setIn(
    state,
    ['images', currentImageIndex, 'regions'],
    regions.map(r => ({
      ...r,
      editingLabels: false,
      highlighted: false,
      highlight: false
    }))
  );
};

export default (state, action) => {
  // if (action.type !== 'MOUSE_MOVE') {
  //   console.log('state', state);
  //   console.log('action', action);
  // }

  if (!action.type.includes('MOUSE')) {
    state = setIn(state, ['lastAction'], action);
  }
  let currentImageIndex = state.images.findIndex(
    img => img.src === state.selectedImage
  );
  if (currentImageIndex === -1) currentImageIndex = null;

  const getRegionIndex = region => {
    const regionId = typeof region === 'string' ? region : region.id;
    if (currentImageIndex === null) return null;

    const regionIndex = (
      state.images[currentImageIndex].regions || []
    ).findIndex(r => r.id === regionId);

    return regionIndex === -1 ? null : regionIndex;
  };

  const getRegion = regionId => {
    const regionIndex = getRegionIndex(regionId);

    if (regionIndex === null) return [null, null];

    const region = state.images[currentImageIndex].regions[regionIndex];

    return [region, regionIndex];
  };

  const modifyRegion = (regionId, obj) => {
    const [region, regionIndex] = getRegion(regionId);

    if (!region) return state;

    const { type, w, h } = region;

    state = setIn(state, ['showTags'], true);

    if (obj !== null && type === 'box' && w !== 0 && h !== 0) {
      return setIn(
        state,
        ['images', currentImageIndex, 'regions', regionIndex],
        {
          ...state.images[currentImageIndex].regions[regionIndex],
          ...obj
        }
      );
    } else {
      // delete region
      const regions = state.images[currentImageIndex].regions;

      moveFocusToParent();

      return setIn(
        state,
        ['images', currentImageIndex, 'regions'],
        (regions || []).filter(r => r.id !== region.id)
      );
    }
  };

  const unselectRegions = state => {
    if (currentImageIndex === null) return state;

    return setIn(
      state,
      ['images', currentImageIndex, 'regions'],
      (state.images[currentImageIndex].regions || []).map(r => ({
        ...r,
        highlighted: false
      }))
    );
  };

  const saveToHistory = (state, name) =>
    updateIn(state, ['history'], h =>
      [
        {
          time: moment().toDate(),
          state,
          name
        }
      ].concat((h || []).slice(0, 9))
    );

  if (Object.keys(typesToSaveWithHistory).includes(action.type)) {
    state = saveToHistory(
      state,
      typesToSaveWithHistory[action.type] || action.type
    );
  }

  const closeEditors = state => {
    if (currentImageIndex === null) return state;
    return setIn(
      state,
      ['images', currentImageIndex, 'regions'],
      (state.images[currentImageIndex].regions || []).map(r => ({
        ...r,
        editingLabels: false
      }))
    );
  };

  const setNewImage = newImage => {
    return setIn(state, ['selectedImage'], newImage);
  };

  switch (action.type) {
    case '@@INIT': {
      return state;
    }
    case 'SET_DELETED_REGIONS': {
      return setIn(state, ['deletedRegions'], []);
    }
    case 'SELECT_IMAGE': {
      return setNewImage(action.image.src);
    }
    case 'IMAGE_LOADED': {
      return setIn(state, ['images', currentImageIndex, 'pixelSize'], {
        w: action.image.width,
        h: action.image.height
      });
    }
    case 'CHANGE_REGION': {
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      const oldRegion = state.images[currentImageIndex].regions[regionIndex];
      if (oldRegion.cls !== action.region.cls) {
        state = saveToHistory(state, 'Change Region Classification');
      }
      if (!isEqual(oldRegion.tags, action.region.tags)) {
        state = saveToHistory(state, 'Change Region Tags');
      }
      return setIn(
        state,
        ['images', currentImageIndex, 'regions', regionIndex],
        {
          ...action.region,
          is_updated: true
        }
      );
    }
    case 'RESTORE_HISTORY': {
      if (state.history.length > 0) {
        return state.history[0].state;
      }
      return state;
    }
    case 'CHANGE_IMAGES': {
      // This is used when the parent component wants to modify the images hash
      return setIn(state, ['images'], action.images);
    }
    // case 'SET_ANNOTATION': {
    // 	// This is used when the parent component wants to modify the images hash
    // 	return setIn(state, ['isAnnotation'], action.isAnnotation)
    // }
    case 'CHANGE_REGION_TAGS': {
      return setIn(state, ['regionTagList'], action.regionTagList);
    }
    case 'CHANGE_IMAGE': {
      if (currentImageIndex === null) return state;
      const { delta } = action;
      for (const key of Object.keys(delta)) {
        if (key === 'cls') saveToHistory(state, 'Change Image Class');
        if (key === 'tags') saveToHistory(state, 'Change Image Tags');
        state = setIn(state, ['images', currentImageIndex, key], delta[key]);
      }
      return state;
    }
    case 'SELECT_REGION': {
      const { region } = action;
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      if (region.is_ai_region) return state;
      const regions = [...(state.images[currentImageIndex].regions || [])].map(
        r => ({
          ...r,
          highlighted: r.id === region.id,
          editingLabels: r.id === region.id
        })
      );
      return setIn(state, ['images', currentImageIndex, 'regions'], regions);
    }
    case 'BEGIN_MOVE_POINT': {
      state = closeEditors(state);
      return setIn(state, ['mode'], {
        mode: 'MOVE_REGION',
        regionId: action.point.id
      });
    }
    case 'BEGIN_CIRCLE_TRANSFORM': {
      const { circle, directions } = action;
      state = closeEditors(state);
      if (directions === 'MOVE_REGION') {
        return setIn(state, ['mode'], {
          mode: 'MOVE_REGION',
          regionId: circle.id
        });
      } else {
        return setIn(state, ['mode'], {
          mode: 'RESIZE_CIRCLE',
          regionId: circle.id,
          original: { x: circle.x, y: circle.y, xr: circle.xr, yr: circle.yr }
        });
      }
    }
    case 'BEGIN_BOX_TRANSFORM': {
      const { box, directions } = action;
      state = closeEditors(state);
      if (directions[0] === 0 && directions[1] === 0) {
        return setIn(state, ['mode'], {
          mode: 'MOVE_REGION',
          regionId: box.id
        });
      } else {
        return setIn(state, ['mode'], {
          mode: 'RESIZE_BOX',
          regionId: box.id,
          freedom: directions,
          original: { x: box.x, y: box.y, w: box.w, h: box.h }
        });
      }
    }
    case 'BEGIN_MOVE_POLYGON_POINT': {
      const { polygon, pointIndex } = action;
      state = closeEditors(state);
      if (
        state.mode &&
        state.mode.mode === 'DRAW_POLYGON' &&
        pointIndex === 0
      ) {
        return setIn(
          modifyRegion(polygon, {
            points: polygon.points.slice(0, -1),
            open: false
          }),
          ['mode'],
          null
        );
      } else {
        state = saveToHistory(state, 'Move Polygon Point');
      }
      return setIn(state, ['mode'], {
        mode: 'MOVE_POLYGON_POINT',
        regionId: polygon.id,
        pointIndex
      });
    }
    case 'ADD_POLYGON_POINT': {
      const { polygon, point, pointIndex } = action;
      const regionIndex = getRegionIndex(polygon);
      if (regionIndex === null) return state;
      const points = [...polygon.points];
      points.splice(pointIndex, 0, point);
      return setIn(
        state,
        ['images', currentImageIndex, 'regions', regionIndex],
        { ...polygon, points }
      );
    }
    case 'MOUSE_MOVE': {
      const { x, y } = action;
      if (!state.mode) return state;
      if (currentImageIndex === null) return state;
      switch (state.mode.mode) {
        case 'MOVE_POLYGON_POINT': {
          const { pointIndex, regionId } = state.mode;
          const regionIndex = getRegionIndex(regionId);
          if (regionIndex === null) return state;
          return setIn(
            state,
            [
              'images',
              currentImageIndex,
              'regions',
              regionIndex,
              'points',
              pointIndex
            ],
            [x, y]
          );
        }
        case 'MOVE_REGION': {
          const { regionId } = state.mode;
          const regionIndex = getRegionIndex(regionId);
          if (regionIndex === null) return state;
          return setIn(
            state,
            ['images', currentImageIndex, 'regions', regionIndex],
            moveRegion(
              state.images[currentImageIndex].regions[regionIndex],
              x,
              y
            )
          );
        }
        case 'RESIZE_BOX': {
          const {
            regionId,
            freedom: [xFree, yFree],
            original: { x: ox, y: oy, w: ow, h: oh }
          } = state.mode;
          const regionIndex = getRegionIndex(regionId);
          if (regionIndex === null) return state;
          const box = state.images[currentImageIndex].regions[regionIndex];
          const dx =
            xFree === 0 ? ox : xFree === -1 ? Math.min(ox + ow, x) : ox;
          const dw =
            xFree === 0
              ? ow
              : xFree === -1
              ? ow + (ox - dx)
              : Math.max(0, ow + (x - ox - ow));
          const dy =
            yFree === 0 ? oy : yFree === -1 ? Math.min(oy + oh, y) : oy;
          const dh =
            yFree === 0
              ? oh
              : yFree === -1
              ? oh + (oy - dy)
              : Math.max(0, oh + (y - oy - oh));

          // determine if we should switch the freedom
          if (dw <= 0.001) {
            state = setIn(state, ['mode', 'freedom'], [xFree * -1, yFree]);
          }
          if (dh <= 0.001) {
            state = setIn(state, ['mode', 'freedom'], [xFree, yFree * -1]);
          }

          state = setIn(state, ['showTags'], false);
          return setIn(
            state,
            ['images', currentImageIndex, 'regions', regionIndex],
            {
              ...box,
              is_updated: true,
              x: dx,
              w: dw,
              y: dy,
              h: dh
            }
          );
        }
        case 'RESIZE_CIRCLE': {
          const { regionId } = state.mode;
          const [region, regionIndex] = getRegion(regionId);
          if (!region) return setIn(state, ['mode'], null);
          return setIn(
            state,
            ['images', currentImageIndex, 'regions', regionIndex],
            {
              ...region,
              xr: action.x,
              yr: action.y
            }
          );
        }
        case 'DRAW_POLYGON': {
          const { regionId } = state.mode;
          const [region, regionIndex] = getRegion(regionId);
          if (!region) return setIn(state, ['mode'], null);
          return setIn(
            state,
            [
              'images',
              currentImageIndex,
              'regions',
              regionIndex,
              'points',
              region.points.length - 1
            ],
            [x, y]
          );
        }
      }
      return state;
    }
    case 'MOUSE_DOWN': {
      const { x, y } = action;

      let newRegion;

      if (currentImageIndex !== null) {
        const region = state.images[currentImageIndex].regions;

        if (state.allowedArea) {
          const aa = state.allowedArea;
          if (x < aa.x || x > aa.x + aa.w || y < aa.y || y > aa.y + aa.h) {
            return state;
          }
        }

        switch (state.selectedTool) {
          case 'create-point': {
            state = saveToHistory(state, 'Create Point');
            newRegion = {
              type: 'point',
              x,
              y,
              highlighted: true,
              editingLabels: true,
              color: '#2563EB',
              id: getRandomId()
            };
            break;
          }

          case 'create-box': {
            state = saveToHistory(state, 'Create Box');
            newRegion = {
              type: 'box',
              x: x,
              y: x,
              w: 0,
              h: 0,
              highlighted: true,
              editingLabels: false,
              color: '#2563EB',
              id: getRandomId(),
              is_new: true,
              is_updated: true,
              is_deleted: false
            };
            state = unselectRegions(state);
            state = setIn(state, ['mode'], {
              mode: 'RESIZE_BOX',
              editLabelEditorAfter: true,
              regionId: newRegion.id,
              freedom: [1, 1],
              original: { x, y, w: newRegion.w, h: newRegion.h }
            });
            break;
          }

          case 'create-polygon': {
            if (state.mode && state.mode.mode === 'DRAW_POLYGON') break;
            state = saveToHistory(state, 'Create Polygon');
            newRegion = {
              type: 'polygon',
              points: [
                [x, y],
                [x, y]
              ],
              open: true,
              highlighted: true,
              color: '#2563EB',
              id: getRandomId()
            };
            state = setIn(state, ['mode'], {
              mode: 'DRAW_POLYGON',
              regionId: newRegion.id
            });
            break;
          }

          case 'create-circle': {
            state = saveToHistory(state, 'Create Circle');
            newRegion = {
              type: 'circle',
              x: x,
              y: y,
              xr: 0.00000000001,
              yr: 0.00000000001,
              highlighted: true,
              editingLabels: false,
              color: '#2563EB',
              id: getRandomId()
            };
            state = unselectRegions(state);
            state = setIn(state, ['mode'], {
              mode: 'RESIZE_CIRCLE',
              editLabelEditorAfter: true,
              regionId: newRegion.id,
              original: { x: x, y: y, xr: newRegion.xr, yr: newRegion.yr }
            });
            break;
          }

          case 'select':
            return cancelAllEvents(state, currentImageIndex);
        }
      }

      if (newRegion) {
        state = unselectRegions(state);
      }

      if (state.mode) {
        switch (state.mode.mode) {
          case 'DRAW_POLYGON': {
            const [polygon, regionIndex] = getRegion(state.mode.regionId);
            if (!polygon) break;
            state = setIn(
              state,
              ['images', currentImageIndex, 'regions', regionIndex],
              {
                ...polygon,
                points: polygon.points.concat([[x, y]])
              }
            );
          }
        }
      }

      const regions = [...(state.images[currentImageIndex].regions || [])]
        .map(r => ({
          ...r,
          editingLabels: false
        }))
        .concat(newRegion ? [newRegion] : []);

      return setIn(state, ['images', currentImageIndex, 'regions'], regions);
    }
    case 'MOUSE_UP': {
      if (!state.mode) return state;

      switch (state.mode.mode) {
        case 'RESIZE_BOX': {
          if (state.mode.editLabelEditorAfter) {
            return {
              ...modifyRegion(state.mode.regionId, {
                editingLabels: true
              }),
              mode: null
            };
          } else {
            state = setIn(state, ['showTags'], true);
            return setIn(state, ['mode'], null);
          }
        }
        case 'RESIZE_CIRCLE': {
          if (state.mode.editLabelEditorAfter) {
            return {
              ...modifyRegion(state.mode.regionId, { editingLabels: true }),
              mode: null
            };
          }
        }
        case 'MOVE_REGION':
        case 'MOVE_POLYGON_POINT': {
          return { ...state, mode: null };
        }
      }

      return state;
    }
    case 'CHANGE_REGION': {
      const { region } = action;
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      return setIn(
        state,
        ['images', currentImageIndex, 'regions', regionIndex],
        region
      );
    }
    case 'OPEN_REGION_EDITOR': {
      const { region } = action;
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      const newRegions = setIn(
        state.images[currentImageIndex].regions.map(r => ({
          ...r,
          highlighted: false,
          editingLabels: false
        })),
        [regionIndex],
        {
          ...(state.images[currentImageIndex].regions || [])[regionIndex],
          highlighted: true,
          editingLabels: true
        }
      );
      return setIn(state, ['images', currentImageIndex, 'regions'], newRegions);
    }
    case 'CLOSE_REGION_EDITOR': {
      moveFocusToParent();
      const { region } = action;
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      return setIn(
        state,
        ['images', currentImageIndex, 'regions', regionIndex],
        {
          ...(state.images[currentImageIndex].regions || [])[regionIndex],
          editingLabels: false,
          highlighted: false
        }
      );
    }
    case 'DELETE_REGION': {
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      const currentRegion =
        state.images[currentImageIndex].regions[regionIndex];
      let temp = state;
      if (!currentRegion.is_new) {
        // temp = {
        // 	...state,
        // 	deletedRegions: [...state.deletedRegions, { ...currentRegion, is_deleted: true }],
        // }
        const tempImages = state.images.map(image => {
          if (image.src === state.selectedImage) {
            const tempRegion = image.regions.filter(
              region => region !== currentRegion
            );
            return { ...image, regions: tempRegion };
          } else {
            return image;
          }
        });
        temp = {
          ...state,
          images: tempImages
        };
      }
      return setIn(
        temp,
        ['images', currentImageIndex, 'regions'],
        (temp.images[currentImageIndex].regions || []).filter(
          r => r.id !== action.region.id
        )
      );
    }
    case 'ZOOM_HISTORY': {
      const { region, direction } = action;
      if (direction == 'ADD_NEW') {
        return updateIn(state, ['zoomHistory'], zh =>
          [region].concat((zh || []).slice())
        );
      } else {
        return updateIn(state, ['zoomHistory'], function (zh) {
          let newRegion = (zh || []).slice();
          newRegion = newRegion.asMutable({ deep: true });
          newRegion.splice(region, 1);
          return newRegion;
        });
      }
    }
    case 'RESET_ZOOM_HISTORY': {
      return setIn(state, ['zoomHistory'], []);
    }
    case 'HEADER_BUTTON_CLICKED': {
      const buttonName = action.buttonName.toLowerCase();
      switch (buttonName) {
        case 'prev': {
          if (currentImageIndex === null) return state;
          if (currentImageIndex === 0) return state;
          return setNewImage(state.images[currentImageIndex - 1].src);
        }
        case 'next': {
          if (currentImageIndex === null) return state;
          if (currentImageIndex === state.images.length - 1) return state;
          return setNewImage(state.images[currentImageIndex + 1].src);
        }
        case 'settings': {
          return setIn(state, ['settingsOpen'], !state.settingsOpen);
        }
        case 'help': {
          return state;
        }
        case 'fullscreen': {
          return setIn(state, ['fullScreen'], true);
        }
        case 'exit fullscreen':
        case 'window': {
          return setIn(state, ['fullScreen'], false);
        }
        case 'hotkeys': {
          return state;
        }
        case 'exit':
        case 'done': {
          return state;
        }
      }
      return state;
      // return setIn(state, [""]
    }
    case 'SELECT_TOOL': {
      state = setIn(state, ['mode'], null);
      if (action.selectedTool === 'show-tags') {
        return setIn(state, ['showTags'], !state.showTags);
      }
      return setIn(state, ['selectedTool'], action.selectedTool);
    }
    case 'CHANGE_CURRENT_MAT': {
      return setIn(state, ['currentMat'], action.currentMat);
    }
    case 'CANCEL': {
      return cancelAllEvents(state, currentImageIndex);
    }
  }
  return state;
};
