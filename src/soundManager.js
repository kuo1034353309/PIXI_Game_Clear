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
                //处理成功返回的数据类型为AudioBuffer
                //创建AudioBufferSourceNode对象
                that.bufferListObj[data.url] = buffer;
                var source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                //指定位置开始播放
                source.loop = loop;
                source.start(0);
      
            }, function (e) {
                console.info('处理出错');
            });
        }

        if (!window.AudioContext) {
            alert('您的浏览器不支持AudioContext');
        } else {
            //创建上下文
            if(this.bufferListObj[data.url]){// 有过
                var source = ctx.createBufferSource();
                source.buffer = this.bufferListObj[data.url];
                source.connect(ctx.destination);
                //指定位置开始播放
                source.loop = loop;
                source.start(0);
            }else{
                startFun(data.data);
            }

            // if(typeof(data) === "string"){
            //     //使用Ajax获取音频文件   
            //     var request = new XMLHttpRequest();
            //     request.open('GET', data, true);
            //     request.responseType = 'arraybuffer';//配置数据的返回类型
            //     //加载完成
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
