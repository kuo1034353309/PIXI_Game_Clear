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
            friction:1, /**设置球的摩擦力*/
            frictionStatic:1,
            // restitution:0.05,
            density: 0.001//0.001 + 0.001 * this.type * this.type//物
        });
        this.body.radius =  this.itemData.radius
        World.add(options.matterEngine.world,[boxA]);
        sprite.anchor.set(0.5);
        Matter.Body.set(this.body, "timeScale", 1);
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
        
        this.removeBody();
        this.tweenItem = TweenMax.to(this.displayObj.position, 0.08, {
           x:(x + postion.x)>>1,
           y:(y + postion.y)>>1,
            onComplete:  () =>{
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
     * 移除body
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