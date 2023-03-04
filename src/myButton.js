import * as PIXI from 'pixi.js';

export class MyButton extends PIXI.Container {
    // 简单按钮 一张图片  点击缩小 松开还原
    clickCallBack;
    btn;
    _clickAni = true;
    _relevancyList;
    constructor() {
        super();
        this.interactive = true;

        this.btn = new PIXI.Sprite();
        this.addChild(this.btn);
        this.btn.anchor.set(0.5);

        this.on('mousedown', this.onClickMouseDown, this);
        this.on('touchstart', this.onClickMouseDown, this);

        this.on('tap', this.onClickTap, this);
        this.on('click', this.onClickTap, this);

        this.on('mouseup', this.onClickMouseUp, this);
        this.on('touchend', this.onClickMouseUp, this);

        this.on('mouseupoutside', this.onOutSide, this);
        this.on('touchendoutside', this.onOutSide, this);

        this.on('touchcancel', this.onCancle, this);
    }

    set texture(value) {
        this.btn.texture = value;
    }
    set clickAni(value) {
        this._clickAni = value;
    }

    set relevancyList(value) {
        this._relevancyList = value;
    }

    onClickMouseDown(evt) {
        if (evt.currentTarget === this) {
            this.setScale(0.95);
            evt.stopPropagation();
        }
    }
    onClickMouseUp(evt) {
        if (evt.currentTarget === this) {
            this.btn.scale.set(1, 1);
        }
    }

    onClickTap() {
        if (this.clickCallBack) {
            this.clickCallBack();
        }
    }

    setScale(scale) {
        if (this._clickAni) {
            this.btn.scale.set(scale, scale);
            if (this._relevancyList) {
                for (let i = 0; i < this._relevancyList.length; i++) {
                    if (this._relevancyList[i].scale) {
                        this._relevancyList[i].scale.set(scale, scale);
                    }
                }
            }
        }
    }

    onOutSide(evt) {
        if (evt.currentTarget === this) {
            this.setScale(1);
            evt.stopPropagation();
            console.error('..........');
        }
    }

    onCancle(evt) {
        if (evt.currentTarget === this) {
            this.setScale(1);
            evt.stopPropagation();
        }
    }

    release() {
        this.off('mousedown', this.onClickMouseDown, this);
        this.off('touchstart', this.onClickMouseDown, this);

        this.off('tap', this.onClickTap, this);
        this.off('click', this.onClickTap, this);

        this.off('mouseup', this.onClickMouseUp, this);
        this.off('mouseupoutside', this.onClickMouseUp, this);
        this.off('touchend', this.onClickMouseUp, this);
        this.off('touchendoutside', this.onClickMouseUp, this);
        this.off('touchcancel', this.onCancle, this);

        this.clickCallBack = undefined;
        this.relevancyList = [];
    }
}
