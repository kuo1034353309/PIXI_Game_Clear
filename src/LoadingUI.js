import * as PIXI from 'pixi.js';
import { EventMamager } from './EventMamager';
import { EventType } from './GlobalData';

export class LoadingUI extends PIXI.Container {
  constructor(options) {
    super();
    this.options = options;
    this.resources = options.resources || {};
    EventMamager.Ins.addEvent(EventType.loadProgress, this.refreshUI, this);
    this.init();
  }

  init() {
    this.loading = new PIXI.Sprite(this.resources.loading.texture); // this.resources.test.texture); // resources.bg.texture);
    this.loading.anchor.set(0.5, 0.5);
    this.addChild(this.loading);
    this.loading.x = 375;
    this.loading.y = 600;

    const bg1 = new PIXI.Graphics();
    bg1.beginFill(0xd3a77c);
    bg1.drawRoundedRect(225, this.loading.y + 70, 300, 12, 5); // 去掉_radius最小15限制，部分设备可能出现问题
    this.addChild(bg1);
    bg1.endFill();

    this.bg2 = new PIXI.Graphics();
    this.bg2.beginFill(0xfc8034);

    this.bg2.drawRoundedRect(225, this.loading.y + 70, 0, 12, 5); // 去掉_radius最小15限制，部分设备可能出现问题
    this.addChild(this.bg2);
    this.bg2.endFill();
    this.bg2.scale.set(0);

    const text1 = new PIXI.Text('加载中 · · ·', {
      fontFamily: 'Arial',
      fontSize: 34,
      fill: 0x0,
      align: 'center',
    });
    text1.anchor.set(0.5);
    text1.x = 385;
    text1.y = this.loading.y + 150;
    this.addChild(text1);
  }

  refreshUI(data) {
    if (this.bg2 && this.bg2.parent) {
      this.bg2.parent.removeChild(this.bg2).destroy();
    }
    this.bg2 = new PIXI.Graphics();
    this.bg2.beginFill(0xfc8034);
    this.bg2.drawRoundedRect(225, this.loading.y + 70, (300 * data) / 100, 12, 5); // 去掉_radius最小15限制，部分设备可能出现问题
    this.addChild(this.bg2);
    this.bg2.endFill();
  }

  release() {
    EventMamager.Ins.removeEvent(EventType.loadProgress, this.refreshUI, this);
    this.removeChildren();
  }
}
