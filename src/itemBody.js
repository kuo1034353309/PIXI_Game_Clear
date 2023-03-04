import { Debug, globalItemData, getIsLow, getBallTexture } from './GlobalData';
import * as Matter from 'matter-js';
import * as PIXI from 'pixi.js';
import { TweenMax, Cubic, Back } from 'gsap';
import { SoundManager } from './SoundManager';
// import * as PixiParticles from 'pixi-particles';
import { Spine } from 'pixi-spine';
import { Timer } from './Timer.js';

export class ItemBody extends PIXI.Container {

    constructor(options) {
        super();
        this.options = options;
        this.app = options.app;
        this.isOverRedLine = false;
        this.isOverRedLine = NaN;
        this.oldShowOverStamp = NaN;
        this.tokenClient = Number(999);
        this.spineCon = options.spineCon;
        this.type = options.type;
        this.tokenId = this.getToken();
        this.sleepCallBackBind = this.sleepCallBack.bind(this);
        this.init(options);
    }
    init(options) {
        this.itemData = globalItemData[this.type];
        this.fallGround = false;
        this.resources = options.resources;
        this.bodyX = options.x;
        this.bodyY = options.y;
        if (!this.displayObj) {
            this.displayObj = new PIXI.Sprite();
            this.addChild(this.displayObj);
        }
        this.displayObj.texture = getBallTexture(this.resources, this.type);
        this.displayObj.x = this.bodyX;
        this.displayObj.y = this.bodyY;
        this.displayObj.anchor.set(0.5);
        this.displayObj.width = this.itemData.radius * 2;
        this.displayObj.height = this.itemData.radius * 2;
        this.displayObj.scale.set(1, 1);
        if (this.clickDisplayCallBack) {
            this.addClickCallBack(this.clickDisplayCallBack);
        }
        if (!options.isStatic) {
            // 开启物理
            this.openStatic(options);
        }

        if (!this.graphicsCon) {
            this.graphicsCon = new PIXI.Container();
            this.addChild(this.graphicsCon);
        }
        this.graphicsCon.x = this.bodyX;
        this.graphicsCon.y = this.bodyY + this.itemData.radius;

        if (!this.advanceGraphics) {
            this.advanceGraphics = new PIXI.Graphics();
            this.addChild(this.advanceGraphics);
        }
        this.advanceGraphics.beginFill(0xe66829);
        this.advanceGraphics.drawCircle(0, 30, 5);
        this.advanceGraphics.drawCircle(0, 60, 5);
        this.advanceGraphics.drawCircle(0, 90, 5);
        this.advanceGraphics.drawCircle(0, 120, 5);
        this.advanceGraphics.drawCircle(0, 150, 5);
        this.advanceGraphics.drawCircle(0, 180, 5);
        this.advanceGraphics.endFill();
        this.graphicsCon.addChild(this.advanceGraphics);

        this.hideAdvanceLine();

        if (Debug) {
            ItemBody.staticId++;
            this.sId = ItemBody.staticId;
            this.scoreText = new PIXI.Text(this.sId, { fontFamily: 'Arial', fontSize: 32, fill: 0xff0000, align: 'left' });
            this.addChild(this.scoreText);
            this.scoreText.anchor.set(0.5);
            this.scoreText.x = this.bodyX;
            this.scoreText.y = this.bodyY;
        }
    }
    getToken() {
        this.tokenTimeStamp = Timer.Ins.serverTime;
        const timestr = this.tokenTimeStamp.toString();
        const num = Number(timestr.substring(5, timestr.length));
        const str =
            Math.abs(num ^ this.type).toString(16) + this.tokenClient.toString(16) + this.tokenTimeStamp.toString(16);
        return str;
    }

    setPos(x, y) {
        this.bodyX = x;
        this.bodyY = y;
        if (this.body) {
            Matter.Body.set(this.body, 'position', { x, y });
        }
        if (this.displayObj) {
            this.displayObj.x = x;
        }
        if (this.graphicsCon) {
            this.graphicsCon.x = x;
        }
    }
    openStatic() {
        this.createBody(this.options);
        if (this.body) {
            Matter.Body.set(this.body, 'isStatic', false);
        }
    }
    createBody(options, scale = 1) {
        if (!this.body) {
            const { Bodies } = Matter;
            const { World } = Matter;
            this.body = Bodies.circle(
                this.bodyX,
                this.bodyY,
                this.itemData.radius * scale,
                {
                    friction: 0.1 /** 设置球的摩擦力 */,
                    frictionStatic: 0.5,
                    frictionAir: 0, // 0.0001,
                    // frictionAir:0.01,
                    timeScale: 1,
                    slop: 0,
                    isStatic: options.isStatic,
                    sleepThreshold: 20,
                    // slop:0.001,
                    // density: 0.001,
                    restitution: 0.2,
                    mass: 0.001 * this.itemData.radius * this.itemData.radius, // 物
                    area: this.itemData.radius * this.itemData.radius,
                },
                this.getRadiusPoint(),
            );
            World.add(options.matterEngine.world, this.body);
        }
    }
    getRadiusPoint() {
        const boo = Math.random() < 0.2;
        const num = boo ? 0 : 7;
        return Math.floor(this.itemData.radius / 20) * 20 - num;
    }
    update(errorBack) {
        this.updateDisplayPos(errorBack);
        this.updateEndStates();
    }
    updateDisplayPos(errorBack) {
        const displayObject = this.displayObj;
        const { body } = this;
        if (!displayObject || !body || (body && body.isSleeping === true)) {
            return;
        }
        this.bodyX = body.position.x;
        this.bodyY = body.position.y;

        if (Math.abs(displayObject.x - this.bodyX) >= 0.001 || Math.abs(displayObject.y - this.bodyY) >= 0.001) {
            if (Math.abs(displayObject.x - this.bodyX) >= 0.1 || Math.abs(displayObject.y - this.bodyY) >= 0.1) {
                // 省的会自传
                if (body.angularSpeed >= 0.001) {
                    displayObject.rotation += body.angle - body.anglePrev;
                }
            }
            displayObject.x = this.bodyX;
            displayObject.y = this.bodyY;
        }

        if (displayObject.x <= 0 || displayObject.x >= 800 || displayObject.y >= 1500) {
            console.error(' 球出屏幕了  穿透bug ', displayObject.x, displayObject.y, this.tokenId);
            errorBack && errorBack(this);
        }
        if (this.scoreText) {
            this.scoreText.x = this.bodyX;
            this.scoreText.y = this.bodyY;
        }
        if (this.mofaContainer) {
            this.mofaContainer.x = this.bodyX;
            this.mofaContainer.y = this.bodyY;
        }
    }
    toNext(postion, callBack) {
        this.type++;
        this.tokenId = this.getToken(); // 修改type  重新计算token
        if (this.type >= globalItemData.length - 1) {
            if (callBack) {
                callBack(this);
            }
            return;
        }
        this._opt = {
            x: postion.x,
            y: postion.y,
            matterEngine: this.options.matterEngine,
            resources: this.resources,
            type: this.type,
            isStatic: true,
        };
        if (this.tweenItem) {
            this.tweenItem.kill();
            this.tweenItem = undefined;
        }
        if (this.tweenItem3) {
            this.tweenItem3.kill();
            this.tweenItem3 = undefined;
        }

        this.removeBody();

        this.tweenItem = TweenMax.to(this.displayObj.position, 0.08, {
            x: postion.x,
            y: postion.y,
            onComplete: () => {
                this.release(true, false);
                this.init(this._opt);
                if (callBack) {
                    callBack(this);
                }
                // this.createScaleBody();
                if (this.type < globalItemData.length - 1) {
                    this.itemScale = 0.01;
                    this.tweenItem3 = TweenMax.to(this, 0.2, {
                        itemScale: 1,
                        ease: Back.easeOut,
                        onComplete: () => {
                            if (this.displayObj) {
                                this.displayObj.scale.set(1, 1);
                            }
                            this.createScaleBody();
                        },
                    });
                }
            },
        });
    }
    showBomb() {
        if (getIsLow()) {
            this.showBombParticle();
        } else {
            this.showbombSpine();
        }
    }

    showBombParticle() {
        const x = this.displayObj ? this.displayObj.x : this.bodyX;
        const y = this.displayObj ? this.displayObj.y : this.bodyY;
        this.particle = new PixiParticles.Emitter(
            this.spineCon,
            // The collection of particle images to s
            [getBallTexture(this.resources, this.type)],
            {
                alpha: {
                    list: [
                        {
                            value: 1,
                            time: 0,
                        },
                        {
                            value: 0.7,
                            time: 1,
                        },
                    ],
                    isStepped: false,
                },
                scale: {
                    list: [
                        {
                            value: 0.1,
                            time: 0,
                        },
                        {
                            value: 0.3,
                            time: 1,
                        },
                    ],
                    isStepped: false,
                },
                color: {
                    list: [
                        {
                            value: '#ffffff', // this.itemData.color,//"fb1010",
                            time: 0,
                        },
                        {
                            value: '#acbdc4',
                            time: 1,
                        },
                    ],
                    isStepped: false,
                },
                speed: {
                    list: [
                        {
                            value: this.displayObj.width * 2.5, // 200,
                            time: 0,
                        },
                        {
                            value: this.displayObj.width >> 1, // 100
                            time: 1,
                        },
                    ],
                    isStepped: false,
                },
                startRotation: {
                    min: 0,
                    max: 360,
                },
                rotationSpeed: {
                    min: 0,
                    max: 0,
                },
                lifetime: {
                    min: 0.5,
                    max: 0.5,
                },
                frequency: 0.008,
                spawnChance: 1,
                particlesPerWave: 1,
                emitterLifetime: 0.31,
                maxParticles: 200, // 300,
                pos: {
                    x,
                    y,
                },
                addAtBack: false,
                spawnType: 'circle',
                spawnCircle: {
                    x: 0,
                    y: 0,
                    r: 10,
                },
            },
        );
        let { particle } = this;
        this.timeOutIdx = setTimeout(() => {
            particle.destroy();
            particle = undefined;
        }, 500);

        let elapsed = Date.now();
        const update = function () {
            requestAnimationFrame(update);

            const now = Date.now();
            particle && particle.update((now - elapsed) * 0.001);
            elapsed = now;
        };
        particle.emit = true;
        update();
    }

    removeDisplay() {
        if (this.displayObj) {
            if (this.displayObj.parent) {
                this.displayObj.parent.removeChild(this.displayObj);
            }
            this.displayObj.interactive = false;
            this.displayObj.off('mouseup', this.onClickMouseUp, this);
            this.displayObj.off('touchend', this.onClickMouseUp, this);
            this.displayObj.destroy();
            this.displayObj = null;
        }
    }
    removeAdvanceLine() {
        if (this.graphicsCon) {
            if (this.graphicsCon.parent) {
                this.graphicsCon.parent.removeChild(this.graphicsCon);
            }
            this.graphicsCon.removeChildren();
            this.graphicsCon.destroy();
            this.graphicsCon = null;
        }
    }

    removeScoreText() {
        if (this.scoreText) {
            if (this.scoreText.parent) {
                this.scoreText.parent.removeChild(this.scoreText);
            }
            this.scoreText.destroy();
        }
    }
    showbombSpine() {
        const x = this.displayObj ? this.displayObj.x : this.bodyX;
        const y = this.displayObj ? this.displayObj.y : this.bodyY;
        if (!this.hechengpiqiu) {
            this.hechengpiqiu = new Spine(this.resources.hechengpiqiu.spineData); // hechengpiqiu // animation
        }
        if (!this.hechengpiqiu.parent) {
            this.spineCon && this.spineCon.addChild(this.hechengpiqiu);
        }
        this.hechengpiqiu.state.setAnimation(0, 'animation', false);
        this.hechengpiqiu.x = x;
        this.hechengpiqiu.y = y;
        this.hechengpiqiu.state.timeScale = 1.5;
        this.showBombTimeOutIdx = setTimeout(() => {
            if (this.hechengpiqiu) {
                this.hechengpiqiu.parent && this.hechengpiqiu.parent.removeChild(this.hechengpiqiu);
                this.hechengpiqiu.destroy();
                this.hechengpiqiu = undefined;
            }
            clearTimeout(this.showBombTimeOutIdx);
        }, 1000);
    }
    createScaleBody(scale = 1) {
        this.removeBody();
        this.createBody(this._opt, scale);
        this.openStatic();
    }
    awakeBody() {
        if (this.body && this.body.isSleeping) {
            // this.body.isSleeping = false;
            Matter.Body.set(this.body, 'isSleeping', false);
        }
    }
    removeBody() {
        if (this.body) {
            const { Events } = Matter;
            // Events.off(this.body, 'sleepStart sleepEnd', this.sleepCallBackBind);
            Matter.World.remove(this.options.matterEngine.world, this.body, true);
            this.body = null;
        }
    }
    release(showBomb = true, removeFromStage = true) {
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
        if (this.timeOutIdx > 0) {
            clearTimeout(this.timeOutIdx);
            this.timeOutIdx = -1;
        }
        if (this.particle) {
            this.particle.destroy();
            this.particle = undefined;
        }
        if (showBomb) {
            if (this.type < globalItemData.length - 1) {
                // this.addWindVane();
                SoundManager.Ins.playSound('bombMu.mp3', false);
                // if (!getIsLow()) {
                this.showBomb();
                // }
            } else {
                SoundManager.Ins.playSound('basketBall.mp3', false);
            }
        }

        this.removeBody();
        this.removeDisplay();
        this.removeAdvanceLine();
        this.removeScoreText();
        this.sleepCallBackBind = undefined;
        this.clickDisplayCallBack = undefined;
        if (this.mofaContainer) {
            if (this.mofaContainer.parent) {
                this.mofaContainer.parent.removeChild(this.mofaContainer);
            }
        }
        if (this.parent && removeFromStage) {
            this.parent.removeChild(this);
            super.destroy();
        }
    }


    updateEndStates() {
        if (this.isOverRedLine) {
            if (isNaN(this.oldShowOverStamp)) {
                this.oldShowOverStamp = this.isOverTimeStamp;
            }
            const time = Date.now();
            if (this.displayObj && time - this.oldShowOverStamp >= 100) {
                this.oldShowOverStamp = time;
                if (this.displayObj.tint !== 0xff0000) {
                    this.displayObj.tint = 0xff0000;
                } else {
                    this.displayObj.tint = 0xffffff;
                }
            }
        } else if (this.displayObj && this.displayObj.tint !== 0xffffff) {
            this.displayObj.tint = 0xffffff;
        }
    }

    showAdvanceLine() {
        this.graphicsCon && (this.graphicsCon.visible = true);
    }

    hideAdvanceLine() {
        this.graphicsCon && (this.graphicsCon.visible = false);
    }
    sleepCallBack(event) {
        console.log('.', event);

        if (this.body && this.body.isSleeping) {
        }
    }

}