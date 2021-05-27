import { TypeData, TypePoint, TypeHelperWrapperDotPosition, TypeConfig, TypeConfigStrict } from '@idraw/types';
import Board from '@idraw/board';
import Renderer from './lib/renderer';
import { Element } from './lib/element';
import { Helper } from './lib/helper';
import { mergeConfig } from './lib/config';

type Options = {
  width: number;
  height: number;
  devicePixelRatio: number;
}

enum Mode {
  NULL = 'null',
  SELECT_ELEMENT = 'select-element',
  SELECT_ELEMENT_WRAPPER_DOT = 'select-element-wrapper-dot',
  PAINTING = 'painting',
}

class Core {

  private _board: Board;
  private _data: TypeData;
  private _opts: Options;
  private _config: TypeConfigStrict;
  private _renderer: Renderer;
  private _element: Element;
  private _helper: Helper;
  private _hasInited: boolean = false; 
  private _mode: Mode = Mode.NULL;

  private _selectedUUID: string | null = null;
  private _prevPoint: TypePoint | null = null;
  private _selectedDotPosition: TypeHelperWrapperDotPosition | null = null;

  constructor(mount: HTMLDivElement, opts: Options, config: TypeConfig) {
    this._data = { elements: [] };
    this._opts = opts;
    this._config = mergeConfig(config);
    this._board = new Board(mount, this._opts);
    this._renderer = new Renderer(this._board); 
    this._element = new Element(this._board.getContext());
    this._helper = new Helper(this._board.getContext(), this._config);
    this._initEvent();
    this._hasInited = true;
  }

  draw() {
    this._helper.updateConfig(this._data, {
      selectedUUID: this._selectedUUID,
      devicePixelRatio: this._opts.devicePixelRatio,
      scale: this._board.getTransform().scale // TODO
    });
    this._renderer.render(this._data, this._helper.getConfig());
  }

  // TODO
  selectElement(index: number) {
    // TODO
    console.log('index');
  }

  scale(ratio: number) {
    this._board.scale(ratio);
  }

  scrollX(x: number) {
    this._board.scrollX(x);
  }

  scrollY(y: number) {
    this._board.scrollY(y);
  }

  getData(): TypeData {
    return JSON.parse(JSON.stringify(this._data));
  }

  setData(data: TypeData) {
    return this._data = this._element.initData(data);
  }

  private _initEvent() {
    if (this._hasInited === true) {
      return;
    }
    this._board.on('point', this._handlePoint.bind(this));
    this._board.on('moveStart', this._handleMoveStart.bind(this));
    this._board.on('move', this._handleMove.bind(this));
    this._board.on('moveEnd', this._handleMoveEnd.bind(this));
  }

  private _handlePoint(point: TypePoint) {
    const [uuid, position] = this._helper.isPointInElementWrapperDot(point);
    if (uuid && position && uuid === this._selectedUUID) {
      this._mode = Mode.SELECT_ELEMENT_WRAPPER_DOT;
      this._selectedDotPosition = position;
    } else {
      const [index, uuid] = this._element.isPointInElement(point, this._data);
      if (index >= 0) {
        this._mode = Mode.SELECT_ELEMENT;
        this._selectedUUID = uuid;
        this.draw();
      }
    }
  }

  private _handleMoveStart(point: TypePoint) {
    this._prevPoint = point;
  }

  private _handleMove(point: TypePoint) {
    if (this._mode === Mode.SELECT_ELEMENT) {
      if (this._selectedUUID) {
        this._dragElement(this._selectedUUID, point, this._prevPoint);
      }
      this.draw();
    } else if (this._mode === Mode.SELECT_ELEMENT_WRAPPER_DOT) {
      this._transfromElement(point, this._prevPoint);
    }
    this._prevPoint = point;
  }

  private _handleMoveEnd(point: TypePoint) {
    this._selectedUUID = null;
    this._prevPoint = null;
  }

  private _dragElement(uuid: string, point: TypePoint, prevPoint: TypePoint|null) {
    if (!prevPoint) {
      return;
    }
    this._element.dragElement(this._data, uuid, point, prevPoint, this._board.getContext().getTransform().scale);
    this.draw();
    prevPoint = point;
  }

  private _transfromElement(point: TypePoint, prevPoint: TypePoint|null) {
    const uuid = this._selectedUUID;
    const position = this._selectedDotPosition;
    console.log(uuid, position);
  }
}

export default Core;