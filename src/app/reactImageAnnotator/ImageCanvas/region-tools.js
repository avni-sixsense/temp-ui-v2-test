/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
// @flow

export type BaseRegion = {
  id: string | number,
  cls?: string,
  locked?: boolean,
  visible?: boolean,
  color: string,
  editingLabels?: boolean,
  highlighted?: boolean,
  tags?: Array<string>
};

export type Point = {|
  ...$Exact<BaseRegion>,
  type: 'point',
  x: number,
  y: number
|};

export type PixelRegion =
  | {|
      ...$Exact<BaseRegion>,
      type: 'pixel',
      sx: number,
      sy: number,
      w: number,
      h: number,
      src: string
    |}
  | {|
      ...$Exact<BaseRegion>,
      type: 'pixel',
      points: Array<[number, number]>
    |};
export type Box = {|
  ...$Exact<BaseRegion>,
  type: 'box',
  x: number,
  y: number,
  w: number,
  h: number
|};
export type Polygon = {|
  ...$Exact<BaseRegion>,
  type: 'polygon',
  open?: boolean,
  points: Array<[number, number]>
|};
export type Circle = {|
  ...$Exact<BaseRegion>,
  type: 'circle',
  // radius: number,
  // x and y indicate the coordinates of the centre of the circle
  x: number,
  y: number,
  // xr and yr indicate the x and y coordinates of the current mouse pointer while dragging.
  xr: number,
  yr: number
|};

export type Region = Point | PixelRegion | Box | Polygon;

export const getEnclosingBox = (region: Region, iw: number, ih: number) => {
  switch (region.type) {
    case 'polygon': {
      const box = {
        x: Math.min(...region.points.map(([x, y]) => x)),
        y: Math.min(...region.points.map(([x, y]) => y)),
        w: 0,
        h: 0
      };
      box.w = Math.max(...region.points.map(([x, y]) => x)) - box.x;
      box.h = Math.max(...region.points.map(([x, y]) => y)) - box.y;
      return box;
    }
    case 'box': {
      return { x: region.x, y: region.y, w: region.w, h: region.h };
    }
    case 'point': {
      return { x: region.x, y: region.y, w: 0, h: 0 };
    }
    case 'pixel': {
      if (
        region.sx !== undefined &&
        region.sy !== undefined &&
        region.w &&
        region.h
      ) {
        return { x: region.sx, y: region.sy, w: region.w, h: region.h };
      }
      if (region.points) {
        const box = {
          x: Math.min(...region.points.map(([x, y]) => x)),
          y: Math.min(...region.points.map(([x, y]) => y)),
          w: 0,
          h: 0
        };
        box.w = Math.max(...region.points.map(([x, y]) => x)) - box.x;
        box.h = Math.max(...region.points.map(([x, y]) => y)) - box.y;
        return box;
      }
    }
    case 'circle': {
      const radius = Math.sqrt(
        Math.pow((region.xr - region.x) * iw, 2) +
          Math.pow((region.yr - region.y) * ih, 2)
      );
      const box = {
        x: (region.x * iw - radius) / iw,
        y: (region.y * ih - radius) / ih,
        w: 0,
        h: 0
      };
      box.w = (region.x * iw + radius) / iw - box.x;
      box.h = (region.y * ih + radius) / ih - box.y;
      return box;
    }
  }
  throw new Error('unknown region');
};

export const moveRegion = (region: Region, x: number, y: number) => {
  switch (region.type) {
    case 'point': {
      return { ...region, x, y };
    }
    case 'box': {
      return {
        ...region,
        is_updated: true,
        x: x - region.w / 2,
        y: y - region.h / 2
      };
    }
    case 'circle': {
      return {
        ...region,
        x,
        y,
        xr: region.xr + x - region.x,
        yr: region.yr + y - region.y
      };
    }
  }
  return region;
};
