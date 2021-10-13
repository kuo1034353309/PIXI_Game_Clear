class mainUI{
    gameConfig;

    app;
    stage;
    loader =  new PIXI.Loader();
    resources; 
    matterEngine;
    matterRender;
    matterRunner;
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
        //加载资源资源
        this.loadAllRes(this.createMain.bind(this));
       
    }

    loadAllRes(callback){
        this.loader.add("pngList" , "./assets/pngList.json");
        this.loader.add("bgmusic","./assets/bgmusic.mp3" , {loadType:PIXI.LoaderResource.LOAD_TYPE.XHR, xhrType: 'arraybuffer'});
        this.loader.add("bombMu","./assets/bombMu.mp3" , {loadType:PIXI.LoaderResource.LOAD_TYPE.XHR, xhrType: 'arraybuffer'});
        this.loader.load(callback);

    }

    createMain(loader,resources){
        //屏幕适配
        let pos = this.resizeWindow();
        var app = this.app = new PIXI.Application({
            width:document.body.clientWidth,
            height:document.body.clientHeight,
            transparent:false,
            resolution:1,
        }); //接收一个16进制的值，用于背景的颜色
        
        document.body.appendChild(app.view);
        app.view.style.position = "absolute";
        app.view.style.left = 0 + "px";
        app.view.style.top = 0 + "px";

        app.view.style.transform = `matrix(${pos.scaleX}, 0, 0, ${pos.scaleY}, 0, 0);`
        this.resources = resources;
        var bg = new PIXI.Sprite(resources.pngList.textures["bg.png"])//resources.bg.texture);
        this.stage = new PIXI.Container();
        app.stage.addChild(this.stage);

        // PIXI.Ticker.shared.maxFps = 60;
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
        // 创建物理世界
        this.createWorld();
        //创建掉落物体

        this.nextItem = this.createItem();
        //创建活动图标
        this.craeteActIcon();
        //创建危险提示
        this.craeteErrorLine();
        // game over 提示
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
      
        return {scaleX:scale , scaleY:scale}; // 缩放比
    }

    createItem(){
        // if(this.itemList && this.itemList[0]){//test
        //     (this.itemList[0].body.y = this.craetePosition.y);
        //     var item = this.itemList[0];
        //     this.itemList = [];
        //     return item;
        // }
        

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
        var run = this.matterRunner = Matter.Runner.create({fps:30 ,isFixed: false ,deltaSampleSize:1 })
        this.matterRender = Render.create({
            // element: document.body,
            engine: engine,
        });
        this.matterEngine.world.gravity.y =1;
        var ground = this.backGround = Bodies.rectangle(200,1430,1200,500 , {isStatic:true,friction:1});
        var ground1 = this.leftGround = Bodies.rectangle(0,500,10,2000 , {isStatic:true});
        var ground2 = this.rightGround = Bodies.rectangle(750,500,10,2000 , {isStatic:true});
        Matter.Body.set(ground , "friction" , 1);
        World.add(engine.world,[ground,ground1,ground2]);
        Matter.Runner.run(run,engine)
        // Engine.run(engine); // todo

        //碰撞回调
        Matter.Events.on(engine, 'collisionStart', (event) => {
            var pairs = event.pairs;
            // if(this.nextItem){
            //     this.itemList.push(this.nextItem)
            // }
            for(let i = 0; i < pairs.length; ++i){
                let pair = pairs[i];
                var boxA = this.itemList.find(item => {
                    if(item.body){
                        return item.body.id == pair.bodyA.id;
                    }
                })
                var boxB = this.itemList.find(item => {
                    if(item.body){
                        return item.body.id == pair.bodyB.id;
                    }
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
        this.playBgMusic();//手动触发
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
        this.mouseX = evt && evt.currentTarget && evt.currentTarget.toLocal(evt.data.global).x;
        if(!this.nextItem){
            return;
        }
        this.mouseDownStates = false;
        if(this.nextItem){//元素开启刚体
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
        if(this.curMaxLevel < boxB.type){
            this.curMaxLevel = boxB.type;
        }
        let index = this.itemList.indexOf(boxA);
        this.itemList.splice(index, 1);
        boxA.release();
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
            var y = item.displayObj.y - (item.displayObj.height>>1);
            if( y<=ShowSafeLineY && item["hasFall"] === true){
                result =  true; // 显示提示线
            }
            if( y<=SafeLineY && item["hasFall"] === true){
                if(!item.isOverRedLine){
                    item.isOverRedLine = true;
                    item.isOverTimeStamp = Date.now();
                }else{
                    var time = Date.now();
                    if(time - item.isOverTimeStamp >= EndStatesTime){
                        this.isGameEnd =  true; // 游戏结束
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
        this.removeStageListener();
        this.matterRunner && (this.matterRunner.enabled = false);
    }

    resumeTicker(){
        this.addStageListener();
        this.matterRunner && (this.matterRunner.enabled = true);
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

        //创建掉落物体

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

window["mainUi"] = new mainUI();