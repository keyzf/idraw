import { ViewRectVertexes } from './view';

export type ElementSizeControllerType = 'left' | 'right' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface ElementSizeControllerItem {
  type: ElementSizeControllerType;
  vertexes: ViewRectVertexes;
}

export interface ElementSizeController {
  elementWrapper: ViewRectVertexes;
  top: ElementSizeControllerItem;
  bottom: ElementSizeControllerItem;
  left: ElementSizeControllerItem;
  right: ElementSizeControllerItem;
  topLeft: ElementSizeControllerItem;
  topRight: ElementSizeControllerItem;
  bottomLeft: ElementSizeControllerItem;
  bottomRight: ElementSizeControllerItem;
}
