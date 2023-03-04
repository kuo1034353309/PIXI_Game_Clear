import * as PIXI from 'pixi.js';
import { MyButton } from './MyButton';

export class CommonUI extends PIXI.Container {
  resources;

  constructor(options) {
    super();
    this.resources = options.resources || {};
    this.init();
  }

  init() { }

  release() {
    this.removeChildren();
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
