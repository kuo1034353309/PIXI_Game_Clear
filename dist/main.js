(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/globalData.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "globalItemData": () => (/* binding */ globalItemData),
/* harmony export */   "StageWidth": () => (/* binding */ StageWidth),
/* harmony export */   "StageHeight": () => (/* binding */ StageHeight),
/* harmony export */   "StageMinHeight": () => (/* binding */ StageMinHeight),
/* harmony export */   "StageMaxScale": () => (/* binding */ StageMaxScale),
/* harmony export */   "StageMinScale": () => (/* binding */ StageMinScale),
/* harmony export */   "SafeLineY": () => (/* binding */ SafeLineY),
/* harmony export */   "ShowSafeLineY": () => (/* binding */ ShowSafeLineY),
/* harmony export */   "EndStatesTime": () => (/* binding */ EndStatesTime)
/* harmony export */ });
const globalItemData = [
    {
        name:"icon1",
        radius:50>>1,
        color:"e37b0d"
    },
    {
       name:"icon2",
       radius:111>>1,
       color:"efef11"
   },
   {
       name:"icon3",
       radius:141>>1,
       color:"cea2eb"
   }
   ,
   {
       name:"icon4",
       radius:160>>1,
       color:"26d826"
   }
   ,
   {
       name:"icon5",
       radius:169>>1,
       color:"c5a5a5"
   }
   ,
   {
       name:"icon6",
       radius:198>>1,
       color:"e01717"
   }
   ,
   {
       name:"icon7",
       radius:240>>1,
       color:"dc13dc"
   }
   ,
   {
       name:"icon8",
       radius:271>>1,
       color:"1ae01a"
   },
   {
       name:"icon9",
       radius:305>>1,
       color:"e7971e"
   },
   {
       name:"icon10",
       radius:460>>1,
       color:"ffff00"
   }
];

const StageWidth = 750;
const StageHeight = 1624;
const StageMinHeight = 1334;
const StageMaxScale = 750/StageMinHeight;
const StageMinScale = 750/StageHeight;

const SafeLineY = 300//800//300;
const ShowSafeLineY = 500//1000//500;
const EndStatesTime = 2000; //?????????body??????????????????????????????gg
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************!*\
  !*** ./src/soundManager.js ***!
  \*****************************/
class soundManager{

    _instance;
    bufferListObj ;
    static get Ins(){
        if(!this._instance){
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
            this._instance = new soundManager();
            this._instance.bufferListObj = [];
        }
        return this._instance;
    }

    play(data ,loop = false){
        var that =this;
        var ctx = new AudioContext();
        var startFun = function (arraybuffer){
            ctx.decodeAudioData(arraybuffer, function (buffer) {
                //????????????????????????????????????AudioBuffer
                //??????AudioBufferSourceNode??????
                that.bufferListObj[data.url] = buffer;
                var source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                //????????????????????????
                source.loop = loop;
                source.start(0);
      
            }, function (e) {
                console.info('????????????');
            });
        }

        if (!window.AudioContext) {
            alert('????????????????????????AudioContext');
        } else {
            //???????????????
            if(this.bufferListObj[data.url]){// ??????
                var source = ctx.createBufferSource();
                source.buffer = this.bufferListObj[data.url];
                source.connect(ctx.destination);
                //????????????????????????
                source.loop = loop;
                source.start(0);
            }else{
                startFun(data.data);
            }

            // if(typeof(data) === "string"){
            //     //??????Ajax??????????????????   
            //     var request = new XMLHttpRequest();
            //     request.open('GET', data, true);
            //     request.responseType = 'arraybuffer';//???????????????????????????
            //     //????????????
            //     request.onload = function () {
            //         var arraybuffer = request.response;
            //         startFun(arraybuffer);
            //     }
                
            //     request.send();
            // }else{
            //     startFun(data);
            // }                 
        }

    }
}

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************!*\
  !*** ./src/myButton.js ***!
  \*************************/
class myButton extends PIXI.Sprite{
    // ???????????? ????????????  ???????????? ????????????
    clickCallBack;
    constructor(){
        super();
        this.interactive = true;
        this.anchor.set(0.5);
        this.on("mousedown" ,this.onClickMouseDown , this);
        this.on("touchstart" ,this.onClickMouseDown , this);
        this.on("touchmove" ,this.onClickMouseDown , this);

        this.on("mouseup" ,this.onClickMouseUp , this); 
        this.on("mouseupoutside" ,this.onClickMouseUp , this);
        this.on("touchend" ,this.onClickMouseUp , this); 
        this.on("touchendoutside" ,this.onClickMouseUp , this); 
    }

    onClickMouseDown(evt){ 
        if(evt.target === this){
            this.scale.set(0.9,0.9);
            evt.stopPropagation();
        }

    }
    onClickMouseUp(evt){
        if(evt.target === this){
            this.scale.set(1,1)
            if(this.clickCallBack){
                this.clickCallBack();
            }
            evt.stopPropagation();
        }
  
    }
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************!*\
  !*** ./src/itemBody.js ***!
  \*************************/
class itemBody{

    displayObj;//
    body;
    options;
    resources;
    type;
    itemData;
    isOverRedLine;
    isOverTimeStamp;
    oldShowOverStamp;
    tweenItem;
    constructor(options){
        this.options = options;
        this.type = options.type;
        this.isOverRedLine = false;
        this.isOverRedLine = NaN;
        this.oldShowOverStamp = NaN;
        this.init(options);
    }

    init(options){
        this.itemData = globalItemData[this.type];
        this.resources = options.resources;
        var sprite =this.displayObj = new PIXI.Sprite(this.resources.pngList.textures[this.itemData.name+".png"]);
        options.parent.addChild(sprite);
        sprite.x= options.x;
        sprite.y = options.y;
        sprite.width = sprite.height = this.itemData.radius*2;
        var Bodies = Matter.Bodies;
        var World  = Matter.World;
        var boxA = this.body = Bodies.circle(options.x, options.y, this.itemData.radius, {
            friction:1, /**?????????????????????*/
            frictionStatic:1,
            timeScale:1.8,
            // restitution:0.05,
            density: 0.001//0.001 + 0.001 * this.type * this.type//???
        });
        this.body.radius =  this.itemData.radius
        World.add(options.matterEngine.world,[boxA]);
        sprite.anchor.set(0.5);
        Matter.Body.set(this.body, "isStatic", options.isStatic);
        Matter.Body.set(this.body, "torque",false);
    }

    setPos(x,y){
        if(this.body && this.displayObj){
            Matter.Body.set(this.body, "position",   {x: x, y: y});
            this.displayObj.x = x;
        }
 
    }

    openStatic(){
        if(this.body){
            Matter.Body.set(this.body, "isStatic", false);
        }
        
    }


    update(){
        this.updateDisplayPos();
        this.updateEndStates();
    }
    updateDisplayPos(){
        const displayObject = this.displayObj;
        const body = this.body;
        if(!displayObject || !body){
            return;
        }
        displayObject.x = body.position.x;
        displayObject.y = body.position.y;
        displayObject.rotation =  body.angle;
        displayObject.scaleX = body.render.sprite.xScale
        displayObject.scaleY = body.render.sprite.yScale;
        displayObject.anchor.set(body.render.sprite.xOffset , body.render.sprite.yOffset);
        displayObject.width = displayObject.height = this.itemData.radius*2;
    }

    updateEndStates(){
        if(this.isOverRedLine){
            if(isNaN(this.oldShowOverStamp)){
                this.oldShowOverStamp = this.isOverTimeStamp;
            }
            var time = Date.now();
            if(this.displayObj && time - this.oldShowOverStamp>=100){
                this.oldShowOverStamp = time;
                if(this.displayObj.tint  !== 0xff0000){
                    this.displayObj.tint  = 0xff0000;
                }else{
                    this.displayObj.tint  = 0xffffff;
                }
            }
        }else{
            if( this.displayObj &&  this.displayObj.tint!== 0xffffff){
                this.displayObj.tint  = 0xffffff;
            }
        }
    }

    toNext(postion){
        
        // this.type ++;
        // let x = this.body.position.x;
        // let y = this.body.position.y;
        // this.removeBody();
        // this.removeDisplay();

        // var opt = {
        //     x: (x + postion.x)>>1,
        //     y: (y + postion.y)>>1,
        //     matterEngine:this.options.matterEngine , 
        //     resources:this.resources ,
        //     parent :this.options.parent , 
        //     type:this.type,
        //     isStatic:false
        // };
        // this.init(opt);

        this.type ++;
        let x = this.body.position.x;
        let y = this.body.position.y;
        
        
        this.tweenItem = TweenMax.to(this.displayObj.position, 0.08, {
           x:(x + postion.x)>>1,
           y:(y + postion.y)>>1,
            onComplete:  () =>{
                this.removeBody();
                this.removeDisplay();
                var opt = {
                    x: (x + postion.x)>>1,
                    y: (y + postion.y)>>1,
                    matterEngine:this.options.matterEngine , 
                    resources:this.resources ,
                    parent :this.options.parent , 
                    type:this.type,
                    isStatic:false
                };
                this.init(opt);
            }
          }
          );


    }

      /**
     * ??????body
     */
    removeBody(){
        if(this.body){
            Matter.World.remove(this.options.matterEngine.world, this.body, true);
            this.body  = null;
        }
    }

    removeDisplay(){
        if(this.displayObj){
            if(this.displayObj.parent){ 
                this.displayObj.parent.removeChild(this.displayObj);
            }
            this.displayObj.destroy();
            this.displayObj = null;
        }
    }
    showBomb(){
        soundManager.Ins.play(this.resources.bombMu ,false);
        let x = this.displayObj.x;
        let y = this.displayObj.y;
        var emitter = this.particle = new PIXI.particles.Emitter(
            this.options.parent,

            // The collection of particle images to s
            [this.resources.pngList.textures[this.itemData.name+".png"]],
            {
                alpha: {
                    list: [
                        {
                            value: 0.8,
                            time: 0
                        },
                        {
                            value: 0.1,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                scale: {
                    list: [
                        {
                            value: 0.5,
                            time: 0
                        },
                        {
                            value: 0.1,
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                color: {
                    list: [
                        {
                            value: this.itemData.color,//"fb1010",
                            time: 0
                        },
                        {
                            value: "f5b830",
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                speed: {
                    list: [
                        {
                            value: this.itemData.radius*5,//200,
                            time: 0
                        },
                        {
                            value: this.itemData.radius,//100
                            time: 1
                        }
                    ],
                    isStepped: false
                },
                startRotation: {
                    min: 0,
                    max: 360
                },
                rotationSpeed: {
                    min: 0,
                    max: 0
                },
                lifetime: {
                    min: 0.5,
                    max: 0.5
                },
                frequency: 0.008,
                spawnChance: 1,
                particlesPerWave: 1,
                emitterLifetime: 0.31,
                maxParticles: this.itemData.radius*10,//300,
                pos: {
                    x: x,
                    y: y
                },
                addAtBack: false,
                spawnType: "circle",
                spawnCircle: {
                    x: 0,
                    y: 0,
                    r: 10
                }
            }
        )
        setTimeout(() => {
            emitter.destroy();
            emitter = undefined;
        }, 500);

        var elapsed = Date.now();
        var update = function(){
            requestAnimationFrame(update);

            var now = Date.now();
            emitter && emitter.update((now - elapsed) * 0.001);
            elapsed = now;
        };
        emitter.emit = true;
        update();
    }
    
 
    release(){
        if(this.tweenItem){
            TweenMax.killTweensOf(this.tweenItem);
            this.tweenItem = undefined;
        }
       
        this.showBomb();
        this.removeBody();
        this.removeDisplay();
    }

}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************!*\
  !*** ./src/mainUI.js ***!
  \***********************/
class mainUI{
    gameConfig;

    app;
    stage;
    loader =  new PIXI.Loader();
    resources; 
    matterEngine;
    matterRender;
    itemList;
    mouseDownStates;
    nextItem;
    mouseX;
    craetePosition;
    curMaxLevel;
    isBgMusicPlaying;
    errorLine;
    isGaming;
    endLabel;
    timeOutIdx;
    backGround;
    leftGround;
    rightGround;
    itemBodyLayer;

    constructor(){
        
    }

    init(gameConfig) {
        this.gameConfig = gameConfig;
        this.isBgMusicPlaying =false;
        this.isGameEnd = false;
        this.timeOutIdx = -1;
        this.itemList = [];
        this.craetePosition = {x:350,y:200};
        this.curMaxLevel = 0;
        //??????????????????
        this.loadAllRes(this.createMain.bind(this));
       
    }

    loadAllRes(callback){
        this.loader.add("pngList" , "./assets/pngList.json");
        this.loader.add("bgmusic","./assets/bgmusic.mp3" , {loadType:PIXI.LoaderResource.LOAD_TYPE.XHR, xhrType: 'arraybuffer'});
        this.loader.add("bombMu","./assets/bombMu.mp3" , {loadType:PIXI.LoaderResource.LOAD_TYPE.XHR, xhrType: 'arraybuffer'});
        this.loader.load(callback);

    }

    createMain(loader,resources){
        //????????????
        let pos = this.resizeWindow();
        var app = this.app = new PIXI.Application({
            width:document.body.clientWidth,
            height:document.body.clientHeight,
            transparent:false,
            resolution:1,
            fps:60
        }); //????????????16????????????????????????????????????
        
        document.body.appendChild(app.view);
        app.view.style.position = "absolute";
        app.view.style.left = 0 + "px";
        app.view.style.top = 0 + "px";

        app.view.style.transform = `matrix(${pos.scaleX}, 0, 0, ${pos.scaleY}, 0, 0);`
        this.resources = resources;
        var bg = new PIXI.Sprite(resources.pngList.textures["bg.png"])//resources.bg.texture);
        this.stage = new PIXI.Container();
        app.stage.addChild(this.stage);

        PIXI.Ticker.shared.maxFps = 60;
        this.resumeTicker();

        this.stage.width = StageWidth;
        this.stage.height = StageHeight;
        this.stage.scale = {x:pos.scaleX,y:pos.scaleY};
        this.stage.x = (document.body.clientWidth-StageWidth*pos.scaleX)>>1;
        this.stage.y = (document.body.clientHeight-StageHeight*pos.scaleY)>>1
        this.stage.addChild(bg);
        this.stage.interactive = true;
        this.mouseDownStates = false;
        this.stage.on("mousedown" ,this.onClickMouseDown , this);
        this.stage.on("touchstart" ,this.onClickMouseDown , this);

        this.stage.on("mouseup" ,this.onClickMouseUp , this); 
        this.stage.on("mouseupoutside" ,this.onClickMouseUp , this);
        this.stage.on("touchend" ,this.onClickMouseUp , this); 
        this.stage.on("touchendoutside" ,this.onClickMouseUp , this); 
        this.stage.on("mousemove" ,this.onClickMouseMove , this);
        this.stage.on("touchmove" ,this.onClickMouseMove , this);
        this.itemBodyLayer = new PIXI.Container();
        this.stage.addChild( this.itemBodyLayer);
        // ??????????????????
        this.createWorld();
        //??????????????????

        this.nextItem = this.createItem();
        //??????????????????
        this.craeteActIcon();
        //??????????????????
        this.craeteErrorLine();
        // game over ??????
        this.createEndLabel();
    }

    resizeWindow(){
        console.log(" ....................");
        let windowW = document.body.clientWidth;
        let windowH = document.body.clientHeight;
        let scaleX = windowW/StageWidth;
        let scaleY =  windowH/StageMinHeight;
        let scale = Math.min(scaleX ,scaleY);

        let s = windowW / windowH;
        if(s >= StageMaxScale){
            s=StageMaxScale;
        }else if(s <= StageMinScale){
            s=StageMinScale;
        }else{//
        };
      
        return {scaleX:scale , scaleY:scale}; // ?????????
    }

    createItem(){
        var item = new itemBody({
            matterEngine:this.matterEngine , 
            resources:this.resources ,
            parent :this.itemBodyLayer , 
            type: Math.floor(Math.random()*this.curMaxLevel),
            x:this.craetePosition.x,
            y:this.craetePosition.y,
            isStatic:true});

        if(this.curMaxLevel < item.type){
            this.curMaxLevel = item.type;
        }
        return item;
    }

    craeteActIcon(){
        var btn1 = new myButton();
        btn1.texture = this.resources.pngList.textures["getItem.png"];
        this.stage.addChild(btn1);
        btn1.clickCallBack = this.reStart.bind(this)//this.gameConfig.getItemCallBack;
        btn1.x= 680;
        btn1.y = 420;

        var btn2 = new myButton();
        btn2.texture =  this.resources.pngList.textures["newReward.png"];
        this.stage.addChild(btn2);
        btn2.clickCallBack =  this.release.bind(this);//this.gameConfig.firstRewardCallBack;
        btn2.x= 680;
        btn2.y = 300;

        var btn3 = new myButton();
        btn3.texture = this.resources.pngList.textures["paihang.png"];
        this.stage.addChild(btn3);
        btn3.clickCallBack = this.pauseTicker.bind(this);//this.gameConfig.rankCallBack;
        btn3.x= 100;
        btn3.y = 300;

        var btn4 = new myButton();
        btn4.texture = this.resources.pngList.textures["guafen.png"];
        this.stage.addChild(btn4);
        btn4.clickCallBack = this.resumeTicker.bind(this);//this.gameConfig.guafenCallBack;
        btn4.x= 100;
        btn4.y = 420;
    }

    createWorld(){
        const Engine = Matter.Engine, 
        Render = Matter.Render,
        World  = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.body;
        const engine = this.matterEngine = Engine.create();
        this.matterRender = Matter.Runner.create();
        var ground = this.backGround = Bodies.rectangle(200,1430,1200,500 , {isStatic:true,friction:1});
        var ground1 = this.leftGround = Bodies.rectangle(0,500,10,2000 , {isStatic:true});
        var ground2 = this.rightGround = Bodies.rectangle(750,500,10,2000 , {isStatic:true});
        Matter.Body.set(ground , "friction" , 1);
        World.add(engine.world,[ground,ground1,ground2]);
        // Engine.run(engine); // todo

        //????????????
        Matter.Events.on(engine, 'collisionStart', (event) => {
            var pairs = event.pairs;
            // if(this.nextItem){
            //     this.itemList.push(this.nextItem)
            // }
            for(let i = 0; i < pairs.length; ++i){
                let pair = pairs[i];
                var boxA = this.itemList.find(item => {
                    return item.body.id == pair.bodyA.id;
                })
                var boxB = this.itemList.find(item => {
                    return item.body.id == pair.bodyB.id;
                })

                //
                if(boxA && boxB && boxA.type === boxB.type){
                    this.collisionStart(boxA,boxB);
                }


                if(pair.bodyA.id !== this.leftGround.id && pair.bodyB.id !== this.rightGround.id 
                    && pair.bodyA.id !== this.rightGround.id && pair.bodyB.id !== this.leftGround.id){
                        boxA && (boxA["hasFall"] = true);
                        boxB && (boxB["hasFall"] = true);
                }
    
            }
            
        })

        // Matter.Events.on(engine, 'collisionEnd', (event) => {
        //     var pairs = event.pairs;
        //     for(let i = 0; i < pairs.length; ++i){
        //         let pair = pairs[i];
        //         var boxA = this.itemList.find(item => {
        //             return item.body.id == pair.bodyA.id;
        //         })
        //         var boxB = this.itemList.find(item => {
        //             return item.body.id == pair.bodyB.id;
        //         })
          
        //         if(boxA && boxB && boxA.type === boxB.type){
        //             this.collisionStart(boxA,boxB);
        //         }

        //         if(pair.bodyA.id !== this.leftGround.id && pair.bodyB.id !== this.rightGround.id 
        //             && pair.bodyA.id !== this.rightGround.id && pair.bodyB.id !== this.leftGround.id){
        //                 boxA && (boxA["hasFall"] = true);
        //                 boxB && (boxB["hasFall"] = true);
        //         }
        
        //     }
        // })


        Matter.Events.on(engine, 'afterUpdate', (event) => {
            this.update();
        });
  
    }

    createEndLabel(){
        this.endLabel =  new PIXI.Text('GAME  OVER',{fontFamily : 'Arial', fontSize: 40, fill : 0xff0000, align : 'center'});
        this.stage.addChild(this.endLabel);
        this.endLabel.visible = false;
        this.endLabel.anchor.set(0.5);
        this.endLabel.width = 200;
        this.endLabel.x = 350;
        this.endLabel.y = 500;
    }

    onClickMouseDown(evt){ 
        this.playBgMusic();//????????????
        this.mouseX = evt.currentTarget && evt.currentTarget.toLocal(evt.data.global).x;
        if(!this.nextItem){
            return;
        }
        this.mouseDownStates = true;
        
    }
    
    playBgMusic(){
        !this.isBgMusicPlaying && soundManager.Ins.play(this.resources.bgmusic , true);
        this.isBgMusicPlaying = true;
    }

    onClickMouseUp(evt){
        this.mouseX = evt.currentTarget && evt.currentTarget.toLocal(evt.data.global).x;
        if(!this.nextItem){
            return;
        }
        this.mouseDownStates = false;
        if(this.nextItem){//??????????????????
            this.nextItem["hasFall"] = false;
            this.itemList.push(this.nextItem);

            let data = globalItemData[this.nextItem.type];
            let x = Math.max(this.mouseX,data.radius);
            x = Math.min(x , StageWidth-data.radius);
            this.nextItem.setPos(x , this.craetePosition.y);

            this.nextItem.openStatic();
        }
        this.nextItem = null;
        this.timeOutIdx = setTimeout(() => {
            if(!this.nextItem){
                this.nextItem = this.createItem();
            }
            
        }, 800);
    }

    onClickMouseMove(evt){
        this.mouseX = (evt.currentTarget && evt.currentTarget.toLocal(evt.data.global).x);
        
    }
    collisionStart(boxA,boxB){
        // boxA.toNext(boxB.body.position);
        // if(this.curMaxLevel < boxA.type){
        //     this.curMaxLevel = boxA.type;
        // }
        // let index = this.itemList.indexOf(boxB);
        // this.itemList.splice(index, 1);
        // boxB.release();

        boxB.toNext(boxA.body.position);
        if(this.curMaxLevel < boxA.type){
            this.curMaxLevel = boxA.type;
        }
        let index = this.itemList.indexOf(boxA);
        this.itemList.splice(index, 1);
        boxA.release();
    }
    ticktime;
    ticker(delat){
        this.ticktime += PIXI.Ticker.shared.deltaMS;
        Matter.Runner.tick(this.matterRender, this.matterEngine,this.ticktime);
    }

    update(){
        if(this.isGameEnd){
            this.showEnd();
            this.pauseTicker();
            return;
        }
        this.itemList.forEach(item => {
            item.update();
        });
        this.checkError();
        var time = Date.now();
        if(!isNaN(this.oldTime) && time- this.oldTime > 200){
            this.oldTime = time;
            this.errorLine.visible = !this.errorLine.visible;
        }
        if(this.mouseDownStates && this.nextItem){
            let data = globalItemData[this.nextItem.type];
            let x = Math.max(this.mouseX,data.radius);
            x = Math.min(x , StageWidth-data.radius);
            this.nextItem.setPos(x , this.craetePosition.y);
        }
    }

    craeteErrorLine(){
        var line = this.errorLine = new PIXI.Graphics();
        line.lineStyle(10,0xff0000);
        line.moveTo(0,SafeLineY);
        line.lineTo(StageWidth,SafeLineY);
        this.stage.addChild(line);
        line.visible = false;

        // var line1 = new PIXI.Graphics();
        // line1.lineStyle(10,0xff00);
        // line1.moveTo(0,ShowSafeLineY);
        // line1.lineTo(StageWidth,ShowSafeLineY);
        // this.stage.addChild(line1);
    }

    oldTime = NaN;
    showErrorLine(){
       !this.boo &&  (this.oldTime = Date.now());
    }

    hideErrorLine(){
        this.oldTime = NaN;
        this.errorLine.visible = false;
    }
    boo = false;
    checkError(){
        let result = false;
        this.itemList.forEach(item =>{
            if(item.body.position.y - item.body.radius <=ShowSafeLineY && item["hasFall"] === true){
                result =  true; // ???????????????
            }
            if(item.body.position.y - item.body.radius <=SafeLineY && item["hasFall"] === true){
                if(!item.isOverRedLine){
                    item.isOverRedLine = true;
                    item.isOverTimeStamp = Date.now();
                }else{
                    var time = Date.now();
                    if(time - item.isOverTimeStamp >= EndStatesTime){
                        this.isGameEnd =  true; // ????????????
                    }
                }
            }else{
                item.isOverRedLine = false;
                item.isOverTimeStamp = NaN;
            }
        });
        if(result){
            this.showErrorLine(); 
            this.boo = true;
        }else{
            this.boo = false;
            this.hideErrorLine();
        }
    }

    showEnd(){
        this.endLabel.visible = true;
        if(this.timeOutIdx !== -1){
            clearTimeout(this.timeOutIdx);
        }

        this.removeStageListener();
    }

    pauseTicker(){
        PIXI.Ticker.shared.remove(this.ticker, this);
    }

    resumeTicker(){
        this.ticktime = 0;
        PIXI.Ticker.shared.add(this.ticker, this);
    }

    reStart(){

        this.itemList.forEach(item =>{
            item.release();
        });
        this.itemList = [];
        if(this.nextItem){
            this.nextItem.release();
        }
        this.nextItem = null;
        this.curMaxLevel = 0;
        this.endLabel.visible = false;

        this.isGameEnd = false;
        this.addStageListener();
        this.resumeTicker();

        //??????????????????

        this.nextItem = this.createItem();
    }

    addStageListener(){
        if(this.stage){
            this.stage.on("mousedown" ,this.onClickMouseDown , this);
            this.stage.on("touchstart" ,this.onClickMouseDown , this);
            this.stage.on("touchmove" ,this.onClickMouseDown , this);
    
            this.stage.on("mouseup" ,this.onClickMouseUp , this); 
            this.stage.on("mouseupoutside" ,this.onClickMouseUp , this);
            this.stage.on("touchend" ,this.onClickMouseUp , this); 
            this.stage.on("touchendoutside" ,this.onClickMouseUp , this); 
            this.stage.on("mousemove" ,this.onClickMouseMove , this);
        }
    }

    removeStageListener(){
        if(this.stage){
            this.stage.off("mousedown" ,this.onClickMouseDown , this);
            this.stage.off("touchstart" ,this.onClickMouseDown , this);
            this.stage.off("touchmove" ,this.onClickMouseDown , this);
    
            this.stage.off("mouseup" ,this.onClickMouseUp , this); 
            this.stage.off("mouseupoutside" ,this.onClickMouseUp , this);
            this.stage.off("touchend" ,this.onClickMouseUp , this); 
            this.stage.off("touchendoutside" ,this.onClickMouseUp , this); 
            this.stage.off("mousemove" ,this.onClickMouseMove , this);
        }
    }

    release(){
        //todo
        this.removeStageListener();
        if(this.loader){
            this.loader.destroy();
            this.loader = undefined;
        }
        this.resources = undefined;

        Matter.Engine.clear(this.matterEngine);
        Matter.World.clear(this.matterEngine.world, false);
        this.itemList.forEach(item => {
            item.release();
        });
        this.itemList.length = 0;
            
        if(this.app && this.app.view){
            document.body.removeChild(this.app.view);
        }
        this.app = undefined;
    }

}


window["aaaaaaaaaaaaaaaaaaaaa"] = "ssss";
window["mainUi"] = new mainUI();
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=main.js.map