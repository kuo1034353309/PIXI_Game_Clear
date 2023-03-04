import * as PIXI from 'pixi.js';
import {
  StageWidth,
  GuildStatesEnum,
  DebugMatter,
  CreateBodyDisTime,
  ItemType,
  SendGameSnapshotDis,
  SafeLineY,
  UnderGroundY,
  globalItemData,
  ShowSafeLineY,
  MaxItemLevel,
  EndStatesTime,
  toGlobal,
  toLocal,
  EventType,
  DeviceLevel,
  DeviceLevelEnum,
  Debug,
  setNextType,
  NextType,
  getStageSizeHeight,
  getTopMuHeight,
  StatusBarHeight,
  getTopMuY,
} from './GlobalData.js';
import * as Matter from 'matter-js';
import { ItemBody } from './ItemBody';
import { MyButton } from './MyButton';
import { SoundManager } from './SoundManager';
import TweenMax from 'gsap';
// import { Guide } from './Guide.js';
import Toast from "./Toast"
import { EventMamager } from './EventMamager';
// import { curGame } from './testMtop.js';

export class UIGameCore extends PIXI.Container {

  resources;
  itemList = []; // 所有计算物理碰撞的itembody
  mouseX = StageWidth >> 1;
  curMaxLevel = 4;
  isBgMusicPlaying = false;
  timeOutIdx = -1;
  isGameEnd = false;
  _shakeTweenIng = false; // 震动中 不判定失败

  _compNum = 0;

  _distanceY = 0; // Y轴偏移值
  _safeY = SafeLineY;

  isMofaBangUse = false;

  canCreateItem = true;
  constructor(options) {
    super();
    this.options = options;
    this.resources = options.resources || {};
    this.EndCallBack = options.EndCallBack;
    this.ItemIcon1CallBack = options.ItemIcon1CallBack;
    this.ItemIcon2CallBack = options.ItemIcon2CallBack;
    this.leaveBtnCallBack = options.leaveBtnCallBack;
    this.scoreBtnCallBack = options.scoreBtnCallBack;
    this.mineRewardsCallBack = options.mineRewardsCallBack;
    this.ruleBtnCallBack = options.ruleBtnCallBack;

    this.collisionStartBackFun = this.collisionStartBack.bind(this);
    this.afterUpdateFun = this.afterUpdate.bind(this);
    this.addListener();
    this.init();
  }

  init() {
    const { resources } = this;
    this.bg = new PIXI.Sprite(resources.gamebg.texture); // resources.bg.texture);
    this.addChild(this.bg);

    // 上部分UI
    this.createTopUI();
    this._safeY += this._distanceY;
    this.craetePosition = { x: 375, y: this._safeY + 20 };

    this.bg1 = new PIXI.Sprite(resources.gamebg1.texture); // resources.bg.texture);
    this.addChild(this.bg1);
    this.bg1.y = this.bg.height - this.bg1.height;

    // 创建互动
    this.createActive();
    // 创建危险提示
    this.craeteErrorLine();
    this.bgTouch = new PIXI.Sprite(resources.gamebg.texture); // resources.bg.texture);
    this.bgTouch.alpha = 0;
    this.bgTouch.y = this.errorLine.y;
    this.bgTouch.height = this.bg1.y - this.errorLine.y + 80;
    this.addChild(this.bgTouch);

    this.itemBodyLayer = new PIXI.Container();
    this.addChild(this.itemBodyLayer);
    this.itemBodySpineLayer = new PIXI.Container();
    this.addChild(this.itemBodySpineLayer);

    // 创建物理世界
    this.createWorld();
    this.resume();
    // 引导合成
    this.beginGame();
  }
  // 继续
  resume() {
    if (!this.isGameEnd) {
      // 游戏没结束
      this.itemList.forEach(item => {
        // 再回来给反应时间
        item.isOverRedLine = false;
        item.isOverTimeStamp = NaN;
      });
      this.addMouseListener();
      this.matterRunner && (this.matterRunner.enabled = true);
    }
  }

  addMouseListener() {
    let that;
    if (this.bgTouch) {
      that = this.bgTouch;
      this.bgTouch.interactive = true;
    }
    if (that) {
      that.on('mousedown', this.onClickMouseDown, this);
      that.on('touchstart', this.onClickMouseDown, this);
      that.on('touchmove', this.onClickMouseMove, this);
      that.on('tap', this.onClickMousetap, this);
      that.on('click', this.onClickMousetap, this);

      that.on('mouseup', this.onClickMouseUp, this);
      that.on('mouseupoutside', this.onClickMouseUp, this);
      that.on('touchend', this.onClickMouseUp, this);
      that.on('touchendoutside', this.onClickMouseUp, this);
    }
  }

  onClickMouseDown(evt) {
    evt.stopPropagation();
    if (evt.currentTarget !== evt.target) {
      return;
    }
    this.mouseX = evt.currentTarget && evt.currentTarget.toLocal(evt.data.global).x;
    if (!this.nextItem) {
      return;
    }
    this.mouseDownStates = true;
  }

  onClickMouseUp(evt) {
    evt.stopPropagation();
    if (evt.currentTarget !== evt.target) {
      return;
    }
    this.mouseX = evt && evt.currentTarget && evt.currentTarget.toLocal(evt.data.global).x;
    if (!this.nextItem) {
      return;
    }
    this.ballFall();
  }
  ballFall() {
    this.mouseDownStates = false;
    if (this.nextItem) {
      // 元素开启刚体
      this.nextItem.hasFall = false;
      // this.nextItem.addClickCallBack(this.destroyByItem.bind(this));//test
      this.itemList.push(this.nextItem);

      const data = globalItemData[this.nextItem.type];
      let x = Math.max(this.mouseX, data.radius);
      x = Math.min(x, StageWidth - data.radius);
      const itemData = globalItemData[this.nextItem.type];
      this.nextItem.setPos(x, this.craetePosition.y + itemData.radius);
      this.nextItem.hideAdvanceLine();
      this.nextItem.openStatic();

      const forceMagnitude = 0.03 * this.nextItem.body.mass;
      Matter.Body.applyForce(this.nextItem.body, this.nextItem.body.position, {
        x: 0,
        y: forceMagnitude,
      });
    }
    this.nextItem = null;
    this.nextCreateStampTime = Date.now() + CreateBodyDisTime;
  }

  onClickMouseMove(evt) {
    evt.stopPropagation();
    if (evt.currentTarget !== evt.target) {
      return;
    }
    this.mouseX = evt.currentTarget.toLocal(evt.data.global).x;
  }

  onClickMousetap() {
  }

  removeMouseListener() {
    let that;
    if (this.bgTouch) {
      that = this.bgTouch;
      this.bgTouch.interactive = false;
    }
    if (that) {
      that.off('mousedown', this.onClickMouseDown, this);
      that.off('touchstart', this.onClickMouseDown, this);
      that.off('touchmove', this.onClickMouseMove, this);
      that.off('tap', this.onClickMousetap, this);
      that.off('click', this.onClickMousetap, this);

      that.off('mouseup', this.onClickMouseUp, this);
      that.off('mouseupoutside', this.onClickMouseUp, this);
      that.off('touchend', this.onClickMouseUp, this);
      that.off('touchendoutside', this.onClickMouseUp, this);
    }
  }
  createItem(x = this.craetePosition.x, y = this.craetePosition.y, isStatic = true, type) {
    const item = new ItemBody({
      matterEngine: this.matterEngine,
      resources: this.resources,
      spineCon: this.itemBodySpineLayer,
      app: this.options.app,
      type,
      x,
      y,
      isStatic,
    });
    this.itemBodyLayer.addChild(item);

    return item;
  }


  beginGame() {
    this.nextItem = this.createDefaultItem();
  }

  createWorld() {
    const { Engine } = Matter;
    const { Render } = Matter;
    const { World } = Matter;
    const { Bodies } = Matter;
    this.matterEngine = Engine.create({
      enableSleeping: true,
    });
    this.matterEngine.timing.timeScale = 1;
    const fps = 60;
    this.matterRunner = Matter.Runner.create({ fps, isFixed: true }); // , deltaSampleSize: 1
    this.matterEngine.gravity.y = 1;
    let level = this.getDeviceLevel();
    this.matterEngine.positionIterations = level;
    this.matterEngine.velocityIterations = 8;
    this.backGround = Bodies.rectangle(350, UnderGroundY + (1000 >> 1), 1200, 1000, {
      isStatic: true,
    });
    this.leftGround = Bodies.rectangle(-250, 500, 500, 3000, { isStatic: true });
    this.rightGround = Bodies.rectangle(1000, 500, 500, 3000, { isStatic: true });
    this.topGround = Bodies.rectangle(350, -3000, 1200, 2000, { isStatic: true });
    this.topGround1 = Bodies.rectangle(350, -3000, 1200, 2000, { isStatic: true });
    World.add(this.matterEngine.world, [
      this.backGround,
      this.leftGround,
      this.rightGround,
      this.topGround,
      this.topGround1,
    ]);
    Matter.Runner.run(this.matterRunner, this.matterEngine);
    if (DebugMatter && !this.matterRender) {
      this.matterRender = Render.create({
        element: this.options.app.view.parentNode,
        engine: this.matterEngine,
        background: '#fafafa',
        showSleeping: true,
        showAngleIndicator: true,
      });
      this.matterRender.canvas.width = 750;
      this.matterRender.canvas.height = 1334;
      Render.run(this.matterRender); // 运行渲染器
    }
    // 碰撞回调
    Matter.Events.on(this.matterEngine, 'collisionStart', this.collisionStartBackFun);

    Matter.Events.on(this.matterEngine, 'afterUpdate', this.afterUpdateFun);

  }
  awakeBody() {
    if (this.body && this.body.isSleeping) {
      // this.body.isSleeping = false;
      Matter.Body.set(this.body, 'isSleeping', false);
    }
  }
  checkError() {
    let result = false;
    this.itemList.forEach(item => {
      let y = item.bodyY;
      if (item.displayObj) {
        y = item.displayObj.y - (item.displayObj.height >> 1);
        if (y <= ShowSafeLineY && item.hasFall === true && !this.shakeTweenIng) {
          result = true; // 显示提示线
        }
      }

      if (y <= this._safeY && item.hasFall === true && !this.shakeTweenIng) {
        if (!item.isOverRedLine) {
          item.isOverRedLine = true;
          item.isOverTimeStamp = Date.now();
        } else {
          const time = Date.now();
          if (time - item.isOverTimeStamp >= EndStatesTime) {
            this.isGameEnd = true; // 游戏结束
          }
        }
      } else {
        item.isOverRedLine = false;
        item.isOverTimeStamp = NaN;
      }
    });
    if (result) {
      this.showErrorLine();
    } else {
      this.hideErrorLine();
    }
  }

  oldTime = NaN;
  showErrorLine() {
    if (isNaN(this.oldTime)) {
      this.oldTime = Date.now();
    }
  }

  hideErrorLine() {
    this.oldTime = NaN;
    // this.errorLine.visible = false;
  }
  errorCallBack(item) {
    // 物理引擎bug 有概率穿透 做容错处理  物理引擎通病
    // this.itemList.splice(this.itemList.indexOf(item), 1);
    // item.release();
    const data = globalItemData[item.type];
    let x = item.bodyX;
    let y = item.bodyY; // UnderGroundY - data.radius;
    if (item.bodyX < -data.radius) {
      x = data.radius;
    } else if (item.bodyX > StageWidth - data.radius) {
      x = StageWidth - data.radius;
    }
    if (y > UnderGroundY - data.radius) {
      y = UnderGroundY - data.radius;
    }
    item.setPos(x, y);
    console.error('穿透的球回去了', x, y);
  }

  afterUpdate(event) {
    if (this.shakeTweenIng === true) {
      if (this.shakeCheck()) {
        this.shakeTweenIng = false;
        if (this.shakeTweenIngTimeOut >= 0) {
          clearTimeout(this.shakeTweenIngTimeOut);
          this.shakeTweenIngTimeOut = -1;
        }
      }
    }
    this.update();
  }
  update() {
    if (this.isGameEnd) {
      this.showEnd();
      this.pause();
      return;
    }
    this.itemList.forEach(item => {
      item.update(this.errorCallBack.bind(this));
    });

    this.checkError();
    const time = Date.now();
    if (this.nextItem) {
      const data = globalItemData[this.nextItem.type];
      let x = Math.max(this.mouseX, data.radius);
      x = Math.min(x, StageWidth - data.radius);
      const itemData = globalItemData[this.nextItem.type];
      this.nextItem.setPos(x, this.craetePosition.y + itemData.radius);
    }

    if (!isNaN(this.nextCreateStampTime) && time >= this.nextCreateStampTime && this.canCreateItem) {
      this.nextCreateStampTime = NaN;
      if (!this.nextItem) {
        this.mouseX = 375;
        this.nextItem = this.createDefaultItem();
      }
    }
  }
  createDefaultItem() {
    let type = NextType;
    if (isNaN(NextType)) {
      type = this.ballType();
    }

    let { y } = this.craetePosition;
    const itemData = globalItemData[type];
    y += itemData.radius;
    const item = this.createItem(this.craetePosition.x, y, true, type);
    item.showAdvanceLine();

    return item;
  }

  ballType() {
    let list = [{ value: 25 }, { value: 45 }, { value: 68 }, { value: 90 }, { value: 100 }];
    if (this.gameconfig && this.gameconfig.data && this.gameconfig.data.ballProb) {
      list = this.gameconfig.data.ballProb;
      list.sort((a, b) => {
        return Number(a.value) - Number(b.value);
      });
    }
    if (list.length > 0) {
      const max = Number(list[list.length - 1].value);
      const ran = Math.floor(Math.random() * max);
      for (let i = 0; i < list.length; i++) {
        if (ran <= Number(list[i].value)) {
          return i;
        }
      }
    }

    return Math.floor(Math.random() * 5);
  }


  showEnd() {

  }

  pause() {

  }


  shakeCheck() {
    // 是否全部落地
    let result = true;
    this.itemList.forEach(item => {
      if (item && item.body) {
        if (
          !(
            item.body.velocity.y <= 10 &&
            item.body.velocity.y >= 0 &&
            item.body.positionPrev.y <= item.body.position.y &&
            item.fallGround === true
          )
        ) {
          // 有一个在动
          result = false;
        }
      }
    });
    return result;
  }

  getDeviceLevel() {
    let level = 15;
    if (DeviceLevel === DeviceLevelEnum.HIGH_END) {
      level = 18;
    } else if (DeviceLevel === DeviceLevelEnum.MEDIUM || DeviceLevel === DeviceLevelEnum.UNAVAILABLE) {
      level = 15;
    } else if (DeviceLevel === DeviceLevelEnum.LOW_END) {
      level = 15;
    }
    return level;
  }
  craeteErrorLine() {
    this.errorLine = new PIXI.Sprite(this.resources.gameUI.textures['errorLIne.png']);
    this.addChild(this.errorLine);
    this.errorLine.y = this._safeY;
    this.errorLine.visible = true;
  }
  createActive() {
    this.containerBottom = new PIXI.Container();
    const activeContain = this.containerBottom;
    this.addChild(activeContain);
    const activeContainBotton = new PIXI.Container();
    this.addChild(activeContainBotton);
    activeContain.y = 1350 - getStageSizeHeight() * 0.4;
    activeContainBotton.y = 1350 - getStageSizeHeight() * 0.55;
    const { gameStatus, newGameChanceTaskAllDone, gameChanceLeft } = {};
    const that = this;
    this.labelInfoBg = new PIXI.Sprite(this.resources.gameUI.textures['descBg.png']); // resources.bg.texture);
    activeContainBotton.addChild(this.labelInfoBg);
    this.labelInfoBg.anchor.set(0.5);
    this.labelInfoBg.x = 375;
    this.labelInfoBg.y = 155;

    this.labelNumDesc = new PIXI.Text('本局合成篮球:  ', {
      fontFamily: 'Arial',
      fontSize: 28,
      fill: 0xff8115,
      align: 'left',
    });
    activeContainBotton.addChild(this.labelNumDesc);
    this.labelNumDesc.x = 98;
    this.labelNumDesc.y = 132;

    this.labelNum = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 28,
      fill: 0xffffff,
      align: 'left',
    });
    activeContainBotton.addChild(this.labelNum);
    this.labelNum.x = this.labelNumDesc.x + this.labelNumDesc.width;
    this.labelNum.y = this.labelNumDesc.y;

    this.labelMaxDesc = new PIXI.Text('本赛季最高纪录:  ', {
      fontFamily: 'Arial',
      fontSize: 28,
      fill: 0xff8115,
      align: 'left',
    });
    activeContainBotton.addChild(this.labelMaxDesc);
    this.labelMaxDesc.x = 430;
    this.labelMaxDesc.y = 132;

    this.labelMax = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 28,
      fill: 0xffffff,
      align: 'left',
    });
    activeContainBotton.addChild(this.labelMax);
    this.labelMax.x = this.labelMaxDesc.x + this.labelMaxDesc.width;
    this.labelMax.y = this.labelMaxDesc.y;

    this.itemIcon1 = new MyButton();
    this.itemIcon1.texture = this.resources.gameUI.textures['item1.png'];
    activeContain.addChild(this.itemIcon1);
    this.itemIcon1.clickCallBack = this.clickItemIcon1.bind(this);

    this.itemIcon1.x = 110;

    this.itemIcon2 = new MyButton();
    this.itemIcon2.texture = this.resources.gameUI.textures['item2.png'];
    activeContain.addChild(this.itemIcon2);
    this.itemIcon2.clickCallBack = this.clickItemIcon2.bind(this);
    this.itemIcon2.x = 635;

    this.textBg1 = new PIXI.Sprite(this.resources.gameUI.textures['textBg.png']); // resources.bg.texture);
    activeContain.addChild(this.textBg1);
    this.textBg1.anchor.set(0.5);
    this.textBg1.x = this.itemIcon1.x;
    this.textBg1.y = this.itemIcon1.y + 35;

    this.textBg2 = new PIXI.Sprite(this.resources.gameUI.textures['textBg.png']); // resources.bg.texture);
    activeContain.addChild(this.textBg2);
    this.textBg2.anchor.set(0.5);
    this.textBg2.x = this.itemIcon2.x;
    this.textBg2.y = this.itemIcon2.y + 35;

    this.numberIcon = new PIXI.Sprite(this.resources.gameUI.textures['bg4.png']); // resources.bg.texture);
    activeContain.addChild(this.numberIcon);
    this.numberIcon.anchor.set(0.5);
    this.numberIcon.x = 375;
    this.numberIcon.y = -5;

    this.numberIconBg = new PIXI.Sprite(this.resources.gameUI.textures['bg3.png']); // resources.bg.texture);
    activeContain.addChild(this.numberIconBg);
    this.numberIconBg.anchor.set(0.5);
    this.numberIconBg.x = this.numberIcon.x + 70;
    this.numberIconBg.y = this.numberIcon.y + 40;

    this.itemIcon1Add = new PIXI.Sprite(this.resources.gameUI.textures['add.png']); // resources.bg.texture);
    activeContain.addChild(this.itemIcon1Add);
    this.itemIcon1Add.anchor.set(0.5);
    this.itemIcon1Add.x = this.itemIcon1.x + 70;
    this.itemIcon1Add.y = this.itemIcon1.y + 40;

    this.itemIcon2Add = new PIXI.Sprite(this.resources.gameUI.textures['add.png']); // resources.bg.texture);
    activeContain.addChild(this.itemIcon2Add);
    this.itemIcon2Add.anchor.set(0.5);
    this.itemIcon2Add.x = this.itemIcon2.x + 70;
    this.itemIcon2Add.y = this.itemIcon2.y + 40;

    this.itemIcon1Text = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 26,
      fill: 0xffffff,
      align: 'center',
    });
    this.itemIcon1Text.anchor.set(0.5);
    this.itemIcon1Text.x = this.textBg1.x;
    this.itemIcon1Text.y = this.textBg1.y;
    activeContain.addChild(this.itemIcon1Text);

    this.itemIcon2Text = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 28,
      fill: 0xffffff,
      align: 'center',
    });
    this.itemIcon2Text.anchor.set(0.5);
    this.itemIcon2Text.x = this.textBg2.x;
    this.itemIcon2Text.y = this.textBg2.y;
    activeContain.addChild(this.itemIcon2Text);

    this.itemNumText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 28,
      fill: 0xffffff,
      align: 'center',
    });
    this.itemNumText.anchor.set(0.5);
    this.itemNumText.x = this.numberIconBg.x;
    this.itemNumText.y = this.numberIconBg.y;
    activeContain.addChild(this.itemNumText);

    this.refreshUI();
  }

  refreshUI() {
    this.refreshItemIcon();
  }
  // 刷新道具icon
  refreshItemIcon() {
    const item1 = { num: 999 }
    this.itemIcon1Text.text = this.isMofaBangUse ? '使用中' : `x${item1.num}`;
    const boo1 = item1.num <= 0;
    this.itemIcon1Add.visible = boo1;
    this.textBg1.visible = !boo1;
    this.itemIcon1Text.visible = !boo1;

    this.refreshItemIcon2Text();

    const num = 999;
    this.itemNumText.text = num;

    const { bestResultOfPeriod } = {};
    this.labelMax.text = Math.max(Number(bestResultOfPeriod), num);

    this.labelNum.text = num;
  }

  refreshItemIcon2Text() {
    const item2 = { num: 999 }
    const boo2 = item2.num <= 0 && this.shakeTweenIng === false;
    this.itemIcon2Text.text = this.shakeTweenIng ? '使用中' : `x${item2.num}`;
    this.itemIcon2Add.visible = boo2;
    this.textBg2.visible = !boo2;
    this.itemIcon2Text.visible = !boo2;
  }

  clickItemIcon1() {
    sendActivityLog('CLK', { spm_cd: 'game.Left-prop' });
    const itemId = { num: 999 }
    if (itemId.num <= 0) {
      this.ItemIcon1CallBack();
      return;
    }

    if (this.isMofaBangUse) {
      this.isMofaBangUse = false;
      this.itemList.forEach(item1 => {
        item1.hideMofaAni();
        item1.addClickCallBack(undefined, false); // test
      });
      this.itemIcon1Text.text = `x${itemId.num}`;
      return;
    }
    if (this.itemList.length <= 0) {
      Toast.show(ErrorMessage.NoBall, 2000);
      return;
    }

    if (itemId.num > 0) {
      this.isMofaBangUse = true;
      this.itemIcon1Text.text = '使用中';
      const num = Math.floor(Math.random() * this.itemList.length);
      this.itemList[num].showMofaAni();
      this.itemList.forEach(item => {
        item.addClickCallBack(this.destroyByItem.bind(this)); // test
      });
    }
  }

  clickItemIcon2() {
    sendActivityLog('CLK', { spm_cd: 'game.Right-prop' });
    if (this.shakeTweenIng === true) {
      return;
    }

    if (this.ItemIcon2CallBack) {
      // hide  魔法棒
      this.isMofaBangUse = false;
      this.itemList.forEach(item1 => {
        item1.hideMofaAni();
        item1.addClickCallBack(undefined, false); // test
      });
      this.refreshItemIcon();

      this.ItemIcon2CallBack(this.shakeAllItem.bind(this));
    }
  }

  createTopUI() {
    this.containerTop = new PIXI.Container();
    const topContainer = this.containerTop;
    this.addChild(topContainer);
    topContainer.y = getTopMuHeight(135, getStageSizeHeight() * 0.7, 40);
    this._distanceY = topContainer.y - 135;
    this.scoreBtn = new MyButton();
    this.scoreBtn.texture = this.resources.gameUI.textures['bg2.png'];
    topContainer.addChild(this.scoreBtn);
    this.scoreBtn.clickCallBack = () => {
      this.scoreBtnCallBack();
    };
    this.scoreBtn.clickAni = false;
    this.scoreBtn.x = 230;
    this.scoreBtn.y = 5;

    this.scoreTextDesc = new PIXI.Text(`积分：`, { fontFamily: 'Arial', fontSize: 28, fill: 0x0, align: 'left' });
    topContainer.addChild(this.scoreTextDesc);
    this.scoreTextDesc.x = this.scoreBtn.x - 120;
    this.scoreTextDesc.y = this.scoreBtn.y - 18;

    this.scoreText = new PIXI.Text(``, { fontFamily: 'Arial', fontSize: 28, fill: 0x0, align: 'center' });
    topContainer.addChild(this.scoreText);
    this.scoreText.anchor.set(0.5, 0);
    this.scoreText.x = this.scoreBtn.x;
    this.scoreText.y = this.scoreBtn.y - 18;
    this.refreshScore();

    this.mineRewardsBtn = new MyButton();
    this.mineRewardsBtn.texture = this.resources.gameUI.textures['bg6.png'];
    topContainer.addChild(this.mineRewardsBtn);
    this.mineRewardsBtn.clickCallBack = () => {
      this.mineRewardsCallBack();
    };
    this.mineRewardsBtn.clickAni = false;
    this.mineRewardsBtn.x = 510;
    this.mineRewardsBtn.y = this.scoreBtn.y;

    this.rewardText = new PIXI.Text(`查看我的奖品`, { fontFamily: 'Arial', fontSize: 28, fill: 0x0, align: 'left' });
    topContainer.addChild(this.rewardText);
    this.rewardText.x = this.mineRewardsBtn.x - 100;
    this.rewardText.y = this.mineRewardsBtn.y - 18;

    const backBtn = new MyButton();
    this.backBtn = backBtn;
    backBtn.texture = this.resources.gameUI.textures['return.png'];
    topContainer.addChild(backBtn);
    backBtn.clickCallBack = () => {
      // this.sendGameSnapshotData(HttpRequest.Ins.guideStates); //退出发送一次日志
      this.leaveBtnCallBack(); // this.gameConfig.getItemCallBack;
    };
    backBtn.x = 50;
    backBtn.y = 0; // + getStageSizeHeight() * 0.35;
    backBtn.y = backBtn.y > this.scoreBtn.y ? this.scoreBtn.y : backBtn.y;

    const helpBtn = new MyButton();
    this.helpBtn = helpBtn;
    helpBtn.texture = this.resources.gameUI.textures['help.png'];
    topContainer.addChild(helpBtn);
    helpBtn.clickCallBack = () => {
      this.ruleBtnCallBack();
    }; // this.gameConfig.getItemCallBack;
    helpBtn.x = 695;
    helpBtn.y = 0; // + getStageSizeHeight() * 0.35;
    helpBtn.y = helpBtn.y > this.scoreBtn.y ? this.scoreBtn.y : helpBtn.y;
  }


  collisionStartBack(event) {
    const { pairs } = event;
    for (let i = 0; i < pairs.length; ++i) {
      const pair = pairs[i];

      const boxA = this.findItem(pair.bodyA.id);
      const boxB = this.findItem(pair.bodyB.id);
      //
      if (boxA && boxB && boxA.type === boxB.type) {
        this.collisionStart(boxA, boxB);
      }

      if (
        pair.bodyA.id !== this.leftGround.id &&
        pair.bodyB.id !== this.rightGround.id &&
        pair.bodyA.id !== this.rightGround.id &&
        pair.bodyB.id !== this.leftGround.id &&
        pair.bodyA.id !== this.topGround.id &&
        pair.bodyB.id !== this.topGround.id &&
        pair.bodyA.id !== this.topGround1.id &&
        pair.bodyB.id !== this.topGround1.id
      ) {
        boxA && (boxA.hasFall = true);
        boxB && (boxB.hasFall = true); // 球初始化下落
        boxA && (boxA.fallGround = true);
        boxB && (boxB.fallGround = true); // 抖动下落
      }
    }

    this.itemList.forEach(item => {
      item.awakeBody();
    });
  }

  collisionStart(boxA, boxB) {
    if (boxA.comping === true || boxB.comping === true) {
      return;
    }
    let A = boxA.bodyY > boxB.bodyY ? boxA : boxB; // 合成规则  上的合到下  小的合到大
    let B = boxA.bodyY > boxB.bodyY ? boxB : boxA;
    if (boxA.body.radius < boxB.body.radius) {
      A = boxB;
      B = boxA;
    } else if (boxA.body.radius > boxB.body.radius) {
      A = boxA;
      B = boxB;
    }
    A.comping = true;
    B.comping = true;
    if (B.type < globalItemData.length) {
      // 满足合并条件
      this.compNum += 1;
      A.removeBody();
      B.toNext({ x: A.bodyX, y: A.bodyY }, item => {
        A.comping = false;
        B.comping = false;
        if (this.curMaxLevel < B.type) {
          this.curMaxLevel = B.type;
        }
        this.curMaxLevel = Math.min(this.curMaxLevel, MaxItemLevel);
        const index = this.itemList.indexOf(A);
        this.itemList.splice(index, 1);
        A.release(false);
        A = undefined;
        this.itemToNextCallBack(item);
      });
    }
  }
  isGrantNewUserGameProps = false; // 获取道具中  避免重复领取道具
  itemToNextCallBack(item) {
    if (item.type >= globalItemData.length - 1) {
      // 最高等级了都
      //
      // 飞到
      this.itemList.splice(this.itemList.indexOf(item), 1);
      item.release();
      // 引导合成
      this.guideBasketBallAni(item);
    }
  }
  findItem(id) {
    let result;
    this.itemList.forEach(item => {
      if (item.body && item.body.id === id) {
        result = item;
      }
    });
    return result;
  }
  guideBasketBallAni(item) {
    const bg1 = new Spine(this.resources.hecheng.spineData);
    bg1.state.setAnimation(0, 'hecheng', false);
    bg1.x = 375;
    bg1.y = 760;
    this.addChild(bg1);

    this.guideBallAniTimeout = setTimeout(() => {
      bg1.destroy();
      const bg2 = new Spine(this.resources.basketball.spineData);
      bg2.state.setAnimation(0, 'basketball', false);
      bg2.x = 375;
      bg2.y = 760;
      this.addChild(bg2);
      this.guideBallAniTimeout1 = setTimeout(() => {
        this.tweenBasket(bg2, bg2, item);
      }, 500);
    }, 500);
  }
  tweenBasket(item, display, bodyItem) {
    const { numberIcon } = this;
    const that = this;
    const pos = toGlobal(0, 0, numberIcon);
    const posLocal = toLocal(pos.x, pos.y, this);
    const time = 1;
    const itemTween = TweenMax.to(display, time, {
      x: posLocal.x,
      y: posLocal.y,
      onComplete: () => {
        that.tweenList.splice(that.tweenList.indexOf(itemTween), 1);
        itemTween.kill();
        item.parent && item.parent.removeChild(item);
        item.destroy && item.destroy();
      },
    });
  }
  refreshScore() {
    this.scoreText.text = `999`;
  }

  addListener() {
    EventMamager.Ins.addEvent(EventType.itemChange, this.refreshItemIcon, this);
    EventMamager.Ins.addEvent(EventType.reLive, this.resurgence, this);
    EventMamager.Ins.addEvent(EventType.resultOfThisGame, this.refreshItemIcon, this);
    EventMamager.Ins.addEvent(EventType.guideStepChange, this.guideStepChange, this);
    EventMamager.Ins.addEvent(EventType.ticker, this.tickerUI, this); // ui的ticker   暂时和物理引擎分开（pixi和matter底层时间机制的冲突会导致物理碰撞部分精确度变差）
  }
  removeListener() {
    EventMamager.Ins.removeEvent(EventType.itemChange, this.refreshItemIcon, this);
    EventMamager.Ins.removeEvent(EventType.reLive, this.resurgence, this);
    EventMamager.Ins.removeEvent(EventType.resultOfThisGame, this.refreshItemIcon, this);
    EventMamager.Ins.removeEvent(EventType.guideStepChange, this.guideStepChange, this);
    EventMamager.Ins.removeEvent(EventType.ticker, this.tickerUI, this); // ui的ticker   暂时和物理引擎分开（pixi和matter底层时间机制的冲突会导致物理碰撞部分精确度变差）
  }


}
