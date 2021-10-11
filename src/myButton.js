class myButton extends PIXI.Sprite{
    // 简单按钮 一张图片  点击缩小 松开还原
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