import * as PIXI from 'pixi.js';
import { MyButton } from './MyButton';

export class AlertLeave extends PIXI.Container {
  constructor(options) {
    super();
    this.resources = options.resources || {};
    this.containerWidth = options.width || 750;
    this.containerHeight = options.height || 1624;
    this.leaveCallBack = options.leaveCallBack;
    this.init();
  }

  init() {
    const maskBg = new PIXI.Sprite(this.resources.mask.texture);
    maskBg.interactive = true;
    maskBg.width = this.containerWidth;
    maskBg.height = this.containerHeight;
    maskBg.alpha = 0.8;
    this.addChild(maskBg);

    const bg = new PIXI.NineSlicePlane(this.resources.alertUI.textures['endGameBg.png'], 40, 40, 50, 200);

    bg.x = 75;
    bg.y = 505;
    bg.height = 560;
    this.addChild(bg);

    const closeBtn = new MyButton();
    closeBtn.texture = this.resources.alertUI.textures['close.png'];
    this.addChild(closeBtn);
    closeBtn.clickCallBack = this.release.bind(this);
    closeBtn.x = bg.x + 300;
    closeBtn.y = bg.y + bg.height * 0.5 + 355;

    const restartBtn = new MyButton();
    restartBtn.texture = this.resources.alertUI.textures['endBtn2.png'];
    this.addChild(restartBtn);
    restartBtn.clickCallBack = () => {
      this.leaveCallBack && this.leaveCallBack();
      this.release();
    };
    restartBtn.x = 235;
    restartBtn.y = 975;

    const scoreText = new PIXI.Text(`残忍离开`, {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: 0xd56d10,
      align: 'left',
      fontWeight: 'bold',
    });
    this.addChild(scoreText);
    scoreText.anchor.set(0.5);
    scoreText.x = restartBtn.x;
    scoreText.y = restartBtn.y - 4;

    restartBtn.relevancyList = [scoreText];

    const btn1 = new MyButton();
    btn1.texture = this.resources.alertUI.textures['endBtn1.png'];
    this.addChild(btn1);
    btn1.clickCallBack = this.release.bind(this);
    btn1.x = 515;
    btn1.y = 975;

    const text1 = new PIXI.Text(`再玩一会`, {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: 0xffffff,
      align: 'left',
      fontWeight: 'bold',
    });
    this.addChild(text1);
    text1.anchor.set(0.5);
    text1.x = btn1.x;
    text1.y = btn1.y - 4;
    btn1.relevancyList = [text1];

    const text2 = new PIXI.Text(`确认要退出吗`, { fontFamily: 'Arial', fontSize: 32, fill: 0xffffff, align: 'left' });
    this.addChild(text2);
    text2.anchor.set(0.5);
    text2.x = bg.x + 300;
    text2.y = bg.y + 35;

    const bg2 = new PIXI.Sprite(this.resources.alertUI.textures['bg3.png']);
    bg2.anchor.set(0.5, 0.5);
    this.addChild(bg2);
    bg2.x = 375;
    bg2.y = bg.y + 200;

    const text3 = new PIXI.Text(`从淘金币任务中可以再次回到游戏哦！`, {
      fontFamily: 'Arial',
      fontSize: 28,
      fill: 0x2e3342,
      align: 'center',
      fontWeight: 'bold',
    });
    this.addChild(text3);
    text3.anchor.set(0.5);
    text3.x = bg2.x;
    text3.y = bg2.y + 130;
  }
  release() {
    this.removeChildren();
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
