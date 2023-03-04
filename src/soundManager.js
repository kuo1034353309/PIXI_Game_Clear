import { Howl } from 'howler';
import { AssetsUrlCdn } from './GlobalData';

export class SoundManager {
    _instance;
    // bufferListObj;
    // ctxList;
    soundList;

    static get Ins() {
        if (!this._instance) {
            window.AudioContext =
                window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
            this._instance = new SoundManager();
            // this._instance.bufferListObj = [];
            // this._instance.ctxList = [];

            this._instance.soundList = [];
        }
        return this._instance;
    }

    playSound(url, loop = false, volumn = 0.5) {
        let sound = this.soundList[url];
        if (!sound) {
            sound = new Howl({
                src: [AssetsUrlCdn + url],
                html5: false,
                loop,
            });
            this.soundList[url] = sound;
        }
        sound.volume(volumn);
        sound.seek(0);
        sound.play();
    }

    pauseAll() {
        this.soundList.forEach(sound => {
            sound.pause();
        });
    }

    // play(data, loop = false, play = true) {
    //   const that = this;
    //   let ctx;
    //   if (that.ctxList[data.url]) {
    //     ctx = that.ctxList[data.url];
    //   } else {
    //     ctx = new AudioContext();
    //     that.ctxList[data.url] = ctx;
    //   }
    //   const startFun = function(arraybuffer) {
    //     ctx.decodeAudioData(
    //       arraybuffer,
    //       function(buffer) {
    //         // 处理成功返回的数据类型为AudioBuffer
    //         // 创建AudioBufferSourceNode对象
    //         that.bufferListObj[data.url] = buffer;
    //         const source = ctx.createBufferSource();
    //         source.buffer = buffer;
    //         source.connect(ctx.destination);
    //         // 指定位置开始播放
    //         source.loop = loop;
    //         play && source.start(0);
    //       },
    //       function(e) {
    //         console.info('处理出错');
    //       },
    //     );
    //   };

    //   if (!window.AudioContext) {
    //     alert('您的浏览器不支持AudioContext');
    //   } else {
    //     // 创建上下文
    //     const buffer = this.bufferListObj[data.url];
    //     if (buffer) {
    //       // 有过
    //       if (buffer === 'isDecoding') {
    //         // 当前音频解析中 就再次播放了
    //         return;
    //       }
    //       const source = ctx.createBufferSource();
    //       source.buffer = buffer;
    //       source.connect(ctx.destination);
    //       // 指定位置开始播放
    //       source.loop = loop;
    //       play && source.start(0);
    //     } else {
    //       that.bufferListObj[data.url] = 'isDecoding';
    //       startFun(data.data);
    //     }
    //   }
    // }
}
