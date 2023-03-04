import * as PIXI from 'pixi.js';
import { Timer } from './Timer.js';
import {
    StageWidth,
    DebugMatter,
    StageMinHeight,
    GuildStatesEnum,
    StageHeight,
    EventType,
    SkipType,
    AlertType,
    HrefUrl,
    ItemType,
    Debug,
    StageMaxHeight,
    setCurStageHeight,
    getInnerWidth,
    getInnerHeight,
    setMuHeight,
} from './GlobalData.js';
import { LoadingUI } from "./LoadingUI.js";
import { EventMamager } from "./EventMamager.js";
import { CommonUI } from './CommonUI';
import { UIGameCore } from './UIGameCore.js';
import { AlertLeave } from './AlertLeave';
import { UIBegin } from './UIBegin.js';
import { SoundManager } from "./SoundManager"
import { Test } from './Test'
class mainUI {
    gameConfig;
    canvas;
    app;
    stage;
    loader = new PIXI.Loader();
    resources;
    loadingUI;
    constructor() {

    }

    init(gameConfig, canvas) {
        canvas.width = `${window.innerWidth}px`;//设计尺寸 // style.width默认优先实际尺寸
        canvas.height = `${window.innerHeight}px`;
        canvas.style.width = `${getInnerWidth()}px`;
        canvas.style.height = `${getInnerHeight()}px`;
        this.canvas = canvas;
        this.gameConfig = gameConfig;
        const timeInit = Timer.Ins; // 初始化时间模块
        this.createApp();
        this.initPreload();
        let a = new Test();
    }
    initPreload() {
        // 加载资源资源
        this.processS = "./assets/"
        const str = this.processS; // process.env.PUBLIC_URL
        this.loader.add('loading', `${str}/loading.png`).load(() => {
            this.loadingUI = new LoadingUI({ resources: this.loader.resources });
            this.uiLayer.addChild(this.loadingUI);
            this.loadAllRes(() => {
                if (this.loadingUI) {
                    this.loadingUI.release();
                }
                this.createInitUI();
            });
        });
    }

    loadAllRes(callback) {
        const str = this.processS; // process.env.PUBLIC_URL
        this.loader
            .add('mask', `${str}mask.png`)
            .add('beginAni', `${str}beginAni.png`)
            .add('beginBg', `${str}beginBg.png`)
            .add('beginbg1', `${str}beginbg1.png`)
            .add('beginbg2', `${str}beginbg2.png`)
            .add('beginbg3', `${str}beginbg3.png`)
            .add('alertBg', `${str}alertBg.png`)
            .add('endGameBg', `${str}endGameBg.png`)
            .add('bg3', `${str}bg3.png`)
            .add('bg4', `${str}bg4.png`)
            .add('enterBtn', `${str}enterBtn.png`)
            .add('grayBtn', `${str}grayBtn.png`)
            .add('logo', `${str}logo.png`)
            .add('common', `${str}common.json`)
            .add('beginUI', `${str}beginUI.json`)
            .add('alertUI', `${str}alertUI.json`)
            .add('gameUI', `${str}gameUI.json`)
            .add('gamebg', `${str}gamebg.png`)
            .add('gamebg1', `${str}gamebg1.png`)
            .add('endGameBg1', `${str}endGameBg1.png`)
            .add('daojudonghua', `${str}daojudonghua.json`)
            .add('hecheng', `${str}hecheng.json`)
            .add('basketball', `${str}basketball.json`)
            .add('caidai', `${str}caidai.json`)
            .add('hechengpiqiu', `${str}hechengpiqiu.json`)
            .add('bg1', `${str}bg1.png`)
            .add('bg2', `${str}bg2.png`);
        this.loader.onProgress.add(data => {
            EventMamager.Ins.dispatchEvent(EventType.loadProgress, data.progress);
        });
        SoundManager.Ins.playSound('bombMu.mp3', false, 0);
        SoundManager.Ins.playSound('basketBall.mp3', false, 0);
        this.loader.load(callback);
    }

    createInitUI() {
        const optionsCommon = {
            resources: this.resources,
            scoreBtnCallBack: () => {
                SkipModule.Ins.skipTo(SkipType.urlSkip, HrefUrl.exchange);
            },
            mineRewardsCallBack: () => {
                SkipModule.Ins.skipTo(SkipType.urlSkip, HrefUrl.myReward);
            },
        };

        this.commonUI = new CommonUI(optionsCommon);
        this.commonLayer.addChild(this.commonUI);

        this.addListen();

        this.begin();

        const gameInfo = {}//HttpRequest.Ins.userInfoData;
        if (gameInfo && gameInfo.acquirePointsOfLastPeriod && Number(gameInfo.acquirePointsOfLastPeriod) > 0) {
            this.showScoreAlert('type1', gameInfo.acquirePointsOfLastPeriod);
        }
    }

    addListen() {
        PIXI.Ticker.shared.add(del => {
            EventMamager.Ins.dispatchEvent(EventType.ticker, del);
        });
        EventMamager.Ins.addEvent(EventType.debugTest, this.appearRequest, this)

        document.addEventListener('visibilitychange', this.appearRequest.bind(this), false);

        window.addEventListener('moduleAppear', appear => {
            console.log('.................  moduleAppear', appear);
        });
        // todo...
    }

    appearRequest(data) {
        if (document.hidden) {
            console.log('.................  document.hidden');
            SoundManager.Ins.playSound('basketBall.mp3', false, 0);
            PIXI.Ticker.shared.stop();
            this.gameUI && this.gameUI.pause();;
        } else {
            console.log('.................  document.show');
            // 去查数据
            SoundManager.Ins.pauseAll();

            PIXI.Ticker.shared.start();
            this.gameUI && this.gameUI.resume();
        }
    }
    createApp() {
        const { resources } = this.loader;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const scale = 1;
        setCurStageHeight((h / w) * StageWidth);
        this.app = new PIXI.Application({
            view: this.canvas,
            width: StageWidth * scale,
            height: StageHeight * scale,
            resolution: 1,
            backgroundColor: 0xfbb555,
        }); // 接收一个16进制的值，用于背景的颜色
        if (DebugMatter) {
            this.canvas.style.opacity = 0.3;
        }

        this.app.view.style.position = 'absolute';
        this.resources = resources;
        this.stage = this.app.stage;
        this.stage.x = (StageWidth * scale - StageWidth) >> 1;
        this.stage.y = (StageHeight * scale - StageMaxHeight) >> 1;

        this.stage.interactive = true;
        this.mouseDownStates = false;

        this.createLayer();
    }
    createLayer() {
        this.uiLayer = new PIXI.Container();
        this.stage.addChild(this.uiLayer);

        this.beginUILayer = new PIXI.Container();
        this.stage.addChild(this.beginUILayer);

        this.commonLayer = new PIXI.Container();
        this.stage.addChild(this.commonLayer);

        this.alertLayer = new PIXI.Container();
        this.stage.addChild(this.alertLayer);
    }

    begin() {
        const optionsBegin = {
            resources: this.resources,
            enterBtnCallBack: this.enterGameBefore.bind(this),
            reviewInfoCallBack: () => {
                console.error('查看积分记录');
            },
            leaveBtnCallBack: this.openLeave.bind(this),
        };
        if (!this.beginUI) {
            this.beginUI = new UIBegin(optionsBegin);
            this.beginUILayer.addChild(this.beginUI);
        }
        this.beginUI.visible = true;
    }

    enterGameBefore() {
        const authBack = () => {
            this.createGameCore();
        };

        authBack();
    }
    openLeave() {
        if (this.leaveAlert) {
            this.leaveAlert.release();
        }
        this.leaveAlert = new AlertLeave({ resources: this.resources, leaveCallBack: undefined });
        this.alertLayer.addChild(this.leaveAlert);
    }
    createGameCore() {

        // this.alertLayer.addChild(Guide.Ins);
        if (this.beginUI) {
            this.beginUI.visible = false;
        }
        const { gameItemOneTaskActivityId, gameItemTwoTaskActivityId } = {}
        const optionsGame = {
            resources: this.resources,
            app: this.app,
            EndCallBack: () => {
                this.gameEnd();
            },
            gameConfig: this.gameConfig,

            mineRewardsCallBack: () => {
                this.toExchange();
            },
            scoreBtnCallBack: () => {
                SkipModule.Ins.skipTo(SkipType.urlSkip, this.gameConfig.data.themeConfig.exchangeUrl);
            },
            ruleBtnCallBack: () => {
                SkipModule.Ins.skipTo(SkipType.urlSkip, this.gameConfig.data.themeConfig.ruleUrl);
            },
            leaveBtnCallBack: () => {
                HttpRequest.Ins.getUserInfoData(this.begin.bind(this), this.begin.bind(this));
            },
            ItemIcon1CallBack: () => {
                SkipModule.Ins.skipTo(SkipType.alertSkip, gameItemOneTaskActivityId);
            },
            ItemIcon2CallBack: callback => {
                const itemId = HttpRequest.Ins.getItemByType(ItemType.zhenping);
                if (itemId.num > 0) {
                    this.showAlertBall(() => {
                        HttpRequest.Ins.useGameProps(itemId.ids[0], () => {
                            callback && callback();
                        });
                    });
                } else {
                    SkipModule.Ins.skipTo(SkipType.alertSkip, gameItemTwoTaskActivityId);
                }
            },
        };
        this.gameUI = new UIGameCore(optionsGame);
        this.uiLayer.addChild(this.gameUI);
    }


}

window["mainUi"] = new mainUI();