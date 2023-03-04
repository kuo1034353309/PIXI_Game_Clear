import * as PIXI from 'pixi.js';
import { MyButton } from './MyButton';
import { EventMamager } from './EventMamager';
import {
  EventType,
  getStageSizeHeight,
  getTopMuHeight,
  getTopMuY,
  StatusBarHeight,
  StageMaxHeight,
  StageMinHeight,
  CurStageHeight,
} from './GlobalData';
import { TweenMax } from 'gsap';
import { Timer } from './Timer';

export class UIBegin extends PIXI.Container {
  resources;
  options;
  bg;
  backBtn;
  helpBtn;
  enterBtn;
  enterText;
  reviewInfoBtn;
  enterBtnCallBack;
  reviewInfoCallBack;

  scoreBtn;
  scoreText;
  scoreTips;
  mineRewardsBtn;

  basketNumText;
  scoreNumText;
  phaseNumText;
  timeNumText;

  scoreBtnCallBack;
  mineRewardsCallBack;

  intervalIndex;
  intervalIndex1;
  tweenItem;
  tweenItem1;
  tweenItem2;
  tweenItem3;
  _distanceY = 0;

  constructor(options) {
    super();
    this.options = options;
    this.resources = options.resources || {};
    this.enterBtnCallBack = options.enterBtnCallBack;
    this.leaveBtnCallBack = options.leaveBtnCallBack;
    this.reviewInfoCallBack = options.reviewInfoCallBack;
    this.scoreBtnCallBack = options.scoreBtnCallBack;
    this.mineRewardsCallBack = options.mineRewardsCallBack;
    this.init();

    // let a = new PIXI.Sprite();
    // a.texture = this.resources.mask.texture;
    // this.addChild(a);
    // a.width = 750;
    // a.height = StatusBarHeight;
    // a.y = getStageSizeHeight();
  }

  init() {
    this.createBg();
    this.createContainer1();
    this.createEnterBtn();
    this.createReviewInfoBtn();
    this.createInfo();

    EventMamager.Ins.addEvent(EventType.gameInfoChange, this.refreshUI, this);
    EventMamager.Ins.addEvent(EventType.ticker, this.ticker, this);

    // const bg = new PIXI.Sprite( this.resources.mask.texture)//this.resources.test.texture); // resources.bg.texture);
    // this.addChild(bg);
    // bg.width = 750
    // bg.height = 1624
    // bg.alpha = 0.8;
    // const bg1 = new Spine(this.resources.hecheng.spineData);
    // bg1.update(0);
    // bg1.state.setAnimation(0, 'hecheng', true);
    // bg1.x = 375;
    // bg1.y = 760;
    // this.addChild(bg1);
    // // bg1.addListener();

    // const bg2 = new Spine(this.resources.basketball.spineData);
    // bg2.state.setAnimation(0, 'basketball', true);

    // bg2.x = 375;
    // bg2.y = 760;
    // this.addChild(bg2);
  }
  ticker() {
    if (this.timeNumText) {
      this.timeNumText.text = this.timeToStr(this.getTimeNum());
    }
  }

  createContainer1() {
    const x = 250;
    const y = getTopMuHeight(135, getStageSizeHeight() * 0.7, 40);
    this._distanceY = y - 135;
    let perD = (StageMaxHeight - CurStageHeight) / (StageMaxHeight - StageMinHeight);
    perD = Math.max(perD, 0);
    perD = Math.min(perD, 1);
    const logo = new PIXI.Sprite(this.resources['logo'].texture); // this.resources.test.texture); // resources.bg.texture);
    logo.anchor.set(0.5, 0);
    logo.x = 375;
    logo.y = y + 50;

    const logoAni = new PIXI.Sprite(this.resources.beginUI.textures['icon.png']); // this.resources.test.texture); // resources.bg.texture);
    logoAni.x = 150;
    logoAni.y += 345;
    logoAni.height = 70;
    const aniFun = () => {
      this.logoTween = TweenMax.to(logoAni, 0.4, {
        x: 510,
        onComplete: () => {
          logoAni.visible = false;
          logoAni.x = 150;
          this.logoTimeOut = setTimeout(() => {
            logoAni.visible = true;
            aniFun();
          }, 2000);
        },
      });
    };
    aniFun();

    const bg3 = new PIXI.Sprite(this.resources['beginbg3'].texture); // this.resources.test.texture); // resources.bg.texture);
    bg3.anchor.set(0.5, 0.5);
    bg3.scale.set(1 - 0.1 * perD, 0.9 - 0.1 * perD);
    bg3.x = 375 - 20;
    bg3.width = 610;
    bg3.height = 638;
    bg3.y = logo.y + 600 - 100 * perD;

    this.addChild(bg3);
    this.addChild(logo);
    this.addChild(logoAni);
    this.scoreBtn = new MyButton();
    this.scoreBtn.texture = this.resources.beginUI.textures['score.png'];
    this.addChild(this.scoreBtn);
    this.scoreBtn.clickCallBack = this.scoreBtnCallBack;
    this.scoreBtn.clickAni = false;
    this.scoreBtn.x = x;
    this.scoreBtn.y = y;

    this.scoreText = new PIXI.Text(`${20}`, {
      fontFamily: 'Arial',
      fontSize: 30,
      fill: 0x707070,
      align: 'left',
      fontWeight: 'bold',
    });
    this.addChild(this.scoreText);
    this.scoreText.x = x - 40;
    this.scoreText.y = y - 15;

    const exchange = new PIXI.Sprite(this.resources.beginUI.textures['exchange.png']);
    exchange.x = x + 50;
    exchange.y = y - 20;
    this.addChild(exchange);

    this.mineRewardsBtn = new MyButton();
    this.mineRewardsBtn.texture = this.resources.beginUI.textures['reward.png'];
    this.addChild(this.mineRewardsBtn);
    this.mineRewardsBtn.clickCallBack = this.mineRewardsCallBack;
    this.mineRewardsBtn.x = 600;
    this.mineRewardsBtn.y = y;

    const backBtn = new MyButton();
    backBtn.texture = this.resources.beginUI.textures['return.png'];
    this.addChild(backBtn);
    backBtn.clickCallBack = this.leaveBtnCallBack; // this.gameConfig.getItemCallBack;
    backBtn.x = 50;
    backBtn.y = y;

    const helpBtn = new MyButton();
    helpBtn.texture = this.resources.beginUI.textures['help.png'];
    this.addChild(helpBtn);
    helpBtn.clickCallBack = this.enterBtnCallBack; // this.gameConfig.getItemCallBack;
    helpBtn.x = 695;
    helpBtn.y = y;
  }

  createBg() {
    const bg = new PIXI.Sprite(this.resources['beginBg'].texture); // this.resources.test.texture); // resources.bg.texture);
    this.addChild(bg);
  }
  createEnterBtn() {
    const container = new PIXI.Container();
    container.x = 0;
    container.y = 1280 - getStageSizeHeight() * 0.8;
    this.addChild(container);

    const enterBtn = new MyButton();
    container.addChild(enterBtn);
    enterBtn.clickCallBack = this.enterBtnCallBack; // this.gameConfig.getItemCallBack;
    enterBtn.x = 375;
    const { gameStatus, newGameChanceTaskAllDone, gameChanceLeft } = {};
    let btnTex = this.resources['enterBtn'].texture;
    let noTimes = false;
    if (Number(gameChanceLeft) <= 0 && newGameChanceTaskAllDone === 'true') {
      noTimes = true;
      btnTex = this.resources.beginUI.textures['grayBtn.png'];
    }
    enterBtn.texture = btnTex;
    enterBtn.interactive = !noTimes;

    const tex =
      gameStatus === '1'
        ? this.resources.beginUI.textures['jixubisai.png']
        : this.resources.beginUI.textures['enterGame.png'];
    const enterText = new PIXI.Sprite(tex); // this.resources.test.texture); // resources.bg.texture);
    enterText.anchor.set(0.5);
    container.addChild(enterText);
    enterText.x = enterBtn.x;
    enterText.y = enterBtn.y - 15;

    this.timeNumText = new PIXI.Text('XX小时XX分XX秒后结束', {
      fontFamily: 'Arial',
      fontSize: 25,
      fill: 0xffffff,
      align: 'center',
    });
    this.timeNumText.anchor.set(0.5);
    this.timeNumText.x = enterText.x;
    this.timeNumText.y = enterText.y + 52;
    container.addChild(this.timeNumText);

    enterBtn.relevancyList = [enterText, this.timeNumText];

    if (!noTimes) {
      const figue = new PIXI.Sprite(this.resources.beginUI.textures['figue.png']); // this.resources.test.texture); // resources.bg.texture);
      figue.anchor.set(0.5);
      figue.scale.set(0.8);
      figue.x = enterBtn.x - 300;
      figue.y = enterBtn.y + 80;

      const figue1 = new PIXI.Sprite(this.resources.beginUI.textures['figue1.png']); // this.resources.test.texture); // resources.bg.texture);
      container.addChild(figue1);
      figue1.anchor.set(0.5);
      figue1.x = enterBtn.x - 170;
      figue1.y = enterBtn.y + 10;

      const figue2 = new PIXI.Sprite(this.resources.beginUI.textures['figue2.png']); // this.resources.test.texture); // resources.bg.texture);
      container.addChild(figue2);
      figue2.anchor.set(0.5);
      figue2.x = enterBtn.x - 170;
      figue2.y = enterBtn.y + 10;
      container.addChild(figue);

      const resetData = () => {
        figue2.alpha = 1;
        figue2.scale.set(1, 1);
        figue.x = enterBtn.x - 300;
        figue.y = enterBtn.y + 80;
      };
      const figueAni = () => {
        resetData();
        this.tweenItem1 = TweenMax.to(figue, 0.5, {
          x: figue1.x - figue.width * 0.5 + 10,
          y: figue1.y + figue.height * 0.5 - 15,
          onComplete: () => {
            this.tweenItem2 = TweenMax.to(figue2.scale, 0.5, {
              x: 2,
              y: 2,
              onComplete: () => {
                this.tweenItem3 = TweenMax.to(figue2, 0.5, {
                  alpha: 0,
                  onComplete: () => {
                    resetData();
                  },
                });
              },
            });
          },
        });
      };
      this.intervalIndex1 = setInterval(() => {
        figueAni();
      }, 3000);
      figueAni();
    }
  }

  createReviewInfoBtn() {
    const reviewInfo = new PIXI.Text();
    reviewInfo.text = '查看积分记录>';
    reviewInfo.width = 200;
    reviewInfo.height = 50;
    this.addChild(reviewInfo);
    // enterBtn.clickCallBack = this.enterBtnCallBack//this.gameConfig.getItemCallBack;
    reviewInfo.x = 350;
    reviewInfo.y = 1400;

    reviewInfo.interactive = true;
    reviewInfo.on('mousedown', this.onClickMouseDown, this);
    reviewInfo.on('touchstart', this.onClickMouseDown, this);
  }

  createInfo() {
    const containInfo = new PIXI.Container();
    this.addChild(containInfo);
    containInfo.y = 1390 - getStageSizeHeight();

    const bg = new PIXI.Sprite(this.resources['beginbg1'].texture);
    containInfo.addChild(bg);

    const bg1 = new PIXI.Sprite(this.resources['beginbg2'].texture);
    bg1.y = bg.y + bg.height - 20;
    containInfo.addChild(bg1);

    this.phaseNumText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 40,
      fill: 0xffffff,
      align: 'center',
    });
    this.phaseNumText.x = 45;
    this.phaseNumText.y = 15;
    containInfo.addChild(this.phaseNumText);

    const textDes = new PIXI.Text('赛事信息', {
      fontFamily: 'Arial',
      fontSize: 25,
      fill: 0xffbe83,
      align: 'center',
    });
    textDes.x = 60;
    textDes.y = 70;
    containInfo.addChild(textDes);

    const text2 = new PIXI.Text('本期最高单局合成', {
      fontFamily: 'Arial',
      fontSize: 25,
      fill: 0x707070,
      align: 'left',
    });
    text2.x = 240;
    text2.y = 35;
    containInfo.addChild(text2);

    this.basketNumText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 30,
      fill: 0xff8115,
      align: 'center',
    });
    this.basketNumText.x = text2.x + 65;
    this.basketNumText.y = text2.y + 40;
    containInfo.addChild(this.basketNumText);

    const text4 = new PIXI.Text('本期预计可赚', {
      fontFamily: 'Arial',
      fontSize: 25,
      fill: 0x707070,
      align: 'left',
    });
    text4.x = 540;
    text4.y = 35;
    containInfo.addChild(text4);

    this.scoreNumText = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 30,
      fill: 0xff8115,
      align: 'center',
    });
    this.scoreNumText.x = text4.x + 30;
    this.scoreNumText.y = text4.y + 40;
    containInfo.addChild(this.scoreNumText);

    const text6 = new PIXI.Text('(每10分钟刷新一次)', {
      fontFamily: 'Arial',
      fontSize: 23,
      fill: 0x707070,
      align: 'left',
    });
    text6.x = this.scoreNumText.x - 50;
    text6.y = this.scoreNumText.y + 45;
    containInfo.addChild(text6);

    const text7 = new PIXI.Text('查看积分记录>', {
      fontFamily: 'Arial',
      fontSize: 26,
      fill: 0xffffff,
      align: 'center',
    });
    text7.x = 300;
    text7.y = bg1.y + 10;
    containInfo.addChild(text7);

    this.refreshUI();
  }

  refreshUI() {
    const gameInfo = {};
    this.basketNumText.text = `${gameInfo.bestResultOfPeriod}篮球`;
    this.scoreNumText.text = `${gameInfo.expectPointsOfPeriod}积分`;
    this.phaseNumText.text = `${this.getPhaseByDate()}期`;
    this.timeNumText.text = this.timeToStr(this.getTimeNum());
  }

  getPhaseByDate() {
    const gameInfo = {};
    const data = gameInfo.gameStartTimeOfPeriod;
    const time = new Date(data);
    let result = '';
    const month = time.getMonth() + 1;
    const day = time.getDate();
    result = `${month < 10 ? `0${month}` : month}${day < 10 ? `0${day}` : day}`;
    return result;
  }

  getTimeNum() {
    // XX小时XX分XX秒
    const gameInfo = {};
    const endTime = new Date(gameInfo.gameExpireTimeOfPeriod).getTime();
    const { serverTime } = Timer.Ins;
    const time = Math.floor((endTime - serverTime) / 1000);
    return time;
  }

  timeToStr(time) {
    if (time <= 0) {
      return '已结束';
    }
    let hours = Math.floor(time / 3600);
    hours = hours < 10 ? `0${hours}` : hours;

    let minutes = Math.floor((time % 3600) / 60);
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    const now_time = `${hours}小时${minutes}分${seconds}秒后结束`;
    return now_time;
  }

  onClickMouseDown(evt) {
    if (this.reviewInfoCallBack) {
      this.reviewInfoCallBack();
    }
  }

  release() {
    this.removeChildren();
    if (this.parent) {
      this.parent.removeChild(this);
    }
    if (this.intervalIndex >= 0) {
      clearInterval(this.intervalIndex);
    }
    if (this.intervalIndex1 >= 0) {
      clearInterval(this.intervalIndex1);
    }
    if (this.tweenItem) {
      this.tweenItem.kill();
      this.tweenItem = undefined;
    }
    if (this.tweenItem1) {
      this.tweenItem1.kill();
      this.tweenItem1 = undefined;
    }
    if (this.tweenItem2) {
      this.tweenItem2.kill();
      this.tweenItem2 = undefined;
    }
    if (this.tweenItem3) {
      this.tweenItem3.kill();
      this.tweenItem3 = undefined;
    }
    if (this.logoTween) {
      this.logoTween.kill();
      this.logoTween = undefined;
    }
    if (this.logoTimeOut >= 0) {
      clearTimeout(this.logoTimeOut);
    }
  }
}
